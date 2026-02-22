import React, { useState, useCallback } from "react";
import { AuthProvider } from "../context/AuthContext";
import { loadState, saveState } from "../utils/storage";
import { rollPrize } from "../utils/dropLogic";
import { cases as allCases, getCaseById } from "../config/cases";
import { t } from "../config/i18n";
import "./AdminDashboard.css";

export function AdminDashboard({ users, onClose, lang, currentUserId, onStateUpdated }) {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [balanceEdit, setBalanceEdit] = useState("");
  const [accEdit, setAccEdit] = useState({ credits: "", bonds: "", freexp: "", tickets: "" });
  const [simResult, setSimResult] = useState(null);
  const [simRunning, setSimRunning] = useState(false);

  const userList = users || AuthProvider.getUsers();
  const selectedUser = userList.find((u) => u.id === selectedUserId);

  const handleSaveBalance = useCallback(() => {
    if (!selectedUserId) return;
    const b = parseInt(balanceEdit, 10);
    if (isNaN(b) || b < 0) return;
    const state = loadState(selectedUserId) || { balance: 1000, cases: {}, inventory: [] };
    state.balance = b;
    saveState(state, selectedUserId);
    setBalanceEdit("");
    if (String(selectedUserId) === String(currentUserId) && onStateUpdated) onStateUpdated(state);
  }, [selectedUserId, balanceEdit, currentUserId, onStateUpdated]);

  const handleSaveAccumulated = useCallback(() => {
    if (!selectedUserId) return;
    const state = loadState(selectedUserId) || { balance: 1000, cases: {}, inventory: [], accumulatedResources: {} };
    const prev = state.accumulatedResources ?? { credits: 0, bonds: 0, freexp: 0, tickets: 0 };
    const parseVal = (s, fallback) => {
      if (s === "" || s == null) return fallback ?? 0;
      const cleaned = String(s).replace(/\s/g, "");
      if (!cleaned) return fallback ?? 0;
      if (/^[\d+\-]+$/.test(cleaned) && /[\d]/.test(cleaned)) {
        const parts = cleaned.split(/([+-])/).filter(Boolean);
        let sum = 0;
        let sign = 1;
        for (const p of parts) {
          if (p === "+") sign = 1;
          else if (p === "-") sign = -1;
          else {
            const n = parseInt(p, 10);
            if (!isNaN(n)) sum += sign * n;
          }
        }
        const n = Math.round(sum);
        return isNaN(n) ? (fallback ?? 0) : Math.max(0, n);
      }
      const n = parseInt(cleaned, 10);
      return isNaN(n) ? (fallback ?? 0) : Math.max(0, n);
    };
    state.accumulatedResources = {
      credits: parseVal(accEdit.credits, prev.credits),
      bonds: parseVal(accEdit.bonds, prev.bonds),
      freexp: parseVal(accEdit.freexp, prev.freexp),
      tickets: parseVal(accEdit.tickets, prev.tickets),
    };
    saveState(state, selectedUserId);
    setAccEdit({ credits: "", bonds: "", freexp: "", tickets: "" });
    if (String(selectedUserId) === String(currentUserId) && onStateUpdated) onStateUpdated(state);
  }, [selectedUserId, accEdit, currentUserId, onStateUpdated]);

  const runSimulation = useCallback(async (caseId, count = 1000) => {
    setSimRunning(true);
    setSimResult(null);
    const caseData = getCaseById(caseId) || allCases[0];
    const pool = caseData?.prizes || [];

    const prizeCounts = {};
    pool.forEach((p) => (prizeCounts[p.id] = { ...p, count: 0 }));
    let guaranteedDrops = 0;
    let casesUntilGuaranteed = 30;

    for (let i = 0; i < count; i++) {
      const result = rollPrize(casesUntilGuaranteed, pool);
      if (result.prize?.id && prizeCounts[result.prize.id])
        prizeCounts[result.prize.id].count++;

      if (result.isGuaranteed) {
        guaranteedDrops++;
        casesUntilGuaranteed = 30;
      } else if (result.prize?.isGuaranteed) {
        casesUntilGuaranteed = 30;
      } else {
        casesUntilGuaranteed = Math.max(0, casesUntilGuaranteed - 1);
      }
    }

    setSimResult({
      caseId,
      caseName: caseData?.nameKey,
      total: count,
      guaranteedDrops,
      items: Object.values(prizeCounts),
    });
    setSimRunning(false);
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__header">
        <h3>Админ-панель</h3>
        <button className="btn btn--ghost btn--sm" onClick={onClose}>
          Закрыть
        </button>
      </div>

      <section className="admin-dashboard__section">
        <h4>Игроки</h4>
        <div className="admin-dashboard__players">
          {userList.map((u) => (
            <div
              key={u.id}
              className={`admin-dashboard__player ${
                selectedUserId === u.id ? "admin-dashboard__player--selected" : ""
              }`}
              onClick={() => {
                setSelectedUserId(u.id);
                const state = loadState(u.id);
                setBalanceEdit(state?.balance?.toString() ?? "1000");
                const acc = state?.accumulatedResources ?? {};
                setAccEdit({
                  credits: String(acc.credits ?? 0),
                  bonds: String(acc.bonds ?? 0),
                  freexp: String(acc.freexp ?? 0),
                  tickets: String(acc.tickets ?? 0),
                });
              }}
            >
              <span>{u.login}</span>
              <span className="admin-dashboard__role">{u.role}</span>
              {loadState(u.id) && (
                <span>Баланс: {loadState(u.id).balance ?? 0}</span>
              )}
            </div>
          ))}
        </div>

        {selectedUser && (
          <>
            <div className="admin-dashboard__balance-edit">
              <h5>Изменить баланс: {selectedUser.login}</h5>
              <input
                type="number"
                value={balanceEdit}
                onChange={(e) => setBalanceEdit(e.target.value)}
                min={0}
                className="admin-dashboard__input"
              />
              <button className="btn btn--secondary" onClick={handleSaveBalance}>
                Сохранить
              </button>
            </div>
            <div className="admin-dashboard__balance-edit admin-dashboard__accumulated-edit">
              <h5>Накопленные призы (кредиты, боны, свободный опыт, билеты натиска)</h5>
              <p className="admin-dashboard__hint">При выдаче призов игроку — уменьшите значения. Можно ввести выражение: 4000000-2500000 → 1500000</p>
              <div className="admin-dashboard__acc-grid">
                <label>
                  <span>Кредиты</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={accEdit.credits}
                    onChange={(e) => setAccEdit((a) => ({ ...a, credits: e.target.value }))}
                    placeholder="4000000-2500000"
                    className="admin-dashboard__input"
                  />
                </label>
                <label>
                  <span>Боны</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={accEdit.bonds}
                    onChange={(e) => setAccEdit((a) => ({ ...a, bonds: e.target.value }))}
                    placeholder="100-50"
                    className="admin-dashboard__input"
                  />
                </label>
                <label>
                  <span>Свободный опыт</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={accEdit.freexp}
                    onChange={(e) => setAccEdit((a) => ({ ...a, freexp: e.target.value }))}
                    placeholder="50000-10000"
                    className="admin-dashboard__input"
                  />
                </label>
                <label>
                  <span>Билеты натиска</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={accEdit.tickets}
                    onChange={(e) => setAccEdit((a) => ({ ...a, tickets: e.target.value }))}
                    placeholder="20-5"
                    className="admin-dashboard__input"
                  />
                </label>
              </div>
              <button className="btn btn--secondary" onClick={handleSaveAccumulated}>
                Сохранить накопленные
              </button>
            </div>
          </>
        )}
      </section>

      <section className="admin-dashboard__section">
        <h4>Симуляция по кейсам</h4>
        <div className="admin-dashboard__sim-cases">
          {allCases.map((c) => (
            <button
              key={c.id}
              className="btn btn--ghost"
              onClick={() => runSimulation(c.id)}
              disabled={simRunning}
            >
              {c.nameKey} (1000)
            </button>
          ))}
        </div>
        {simResult && (
          <div className="admin-dashboard__sim-result">
            <p>
              Кейс: {simResult.caseName}, гарантов: {simResult.guaranteedDrops} из{" "}
              {simResult.total}
            </p>
            <table className="admin-dashboard__table">
              <thead>
                <tr>
                  <th>Приз</th>
                  <th>Выпало</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {simResult.items.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.count}</td>
                    <td>{((p.count / simResult.total) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
