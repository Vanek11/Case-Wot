import React, { useState, useCallback } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { loadState, saveState, clearState, appendAdminLogEntry, loadAdminLog } from "../utils/storage";
import { rollPrize } from "../utils/dropLogic";
import { cases as allCases, getCaseById } from "../config/cases";
import { t } from "../config/i18n";
import { ConfirmModal } from "./ConfirmModal";
import "./AdminDashboard.css";

export function AdminDashboard({ users, onClose, lang, currentUserId, onStateUpdated }) {
  const { user: currentUser } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [balanceEdit, setBalanceEdit] = useState("");
  const [accEdit, setAccEdit] = useState({ credits: "", bonds: "", freexp: "", tickets: "" });
  const [simResult, setSimResult] = useState(null);
  const [simRunning, setSimRunning] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false });
  const [adminLog, setAdminLog] = useState(() => loadAdminLog());
  const [playerPanelExpanded, setPlayerPanelExpanded] = useState(false);

  const userList = users || AuthProvider.getUsers();
  const selectedUser = userList.find((u) => u.id === selectedUserId);
  const canDeleteProfile = selectedUser && userList.length > 1;

  const logEntry = useCallback((action, targetUserId, targetLogin, details) => {
    appendAdminLogEntry({
      adminId: currentUser?.id,
      adminLogin: currentUser?.login ?? "admin",
      targetUserId,
      targetLogin: targetLogin ?? "",
      action,
      details,
    });
    setAdminLog(loadAdminLog());
  }, [currentUser?.id, currentUser?.login]);

  const formatNum = (n) => (Number(n) ?? 0).toLocaleString("ru-RU");

  const formatLogDetails = (details, action, langKey) => {
    if (!details || typeof details !== "string") return details || "";
    const s = details.trim();
    if (action === "accumulated" && s.startsWith("{") && s.includes("credits")) {
      try {
        const o = JSON.parse(s);
        const labels = { credits: t("credits", langKey), bonds: t("bonds", langKey), freexp: t("freexp", langKey), tickets: t("tickets", langKey) };
        const parts = ["credits", "bonds", "freexp", "tickets"]
          .map((k) => `${labels[k]}: ${formatNum(o[k] ?? 0)}`);
        return parts.length ? parts.join("; ") : details;
      } catch {
        return details;
      }
    }
    return details;
  };

  const renderLogDetails = (details, action, langKey) => {
    const text = formatLogDetails(details, action, langKey);
    if (!text || !text.includes(" → ")) return text;
    const wasLabel = t("log_was", langKey);
    const nowLabel = t("log_now", langKey);
    const parts = text.split("; ").filter(Boolean);
    return (
      <div className="admin-dashboard__log-was-now">
        {parts.map((part, idx) => {
          const m = part.match(/^(.+?):\s*([\d\s]+)\s*→\s*(.+)$/);
          if (!m) return <div key={idx}>{part}</div>;
          const [, label, wasVal, nowVal] = m;
          return (
            <div key={idx} className="admin-dashboard__log-was-now-row">
              <span className="admin-dashboard__log-label">{label}:</span>{" "}
              <span className="admin-dashboard__log-was">{wasLabel} {wasVal.trim()}</span>
              <span className="admin-dashboard__log-arrow"> → </span>
              <span className="admin-dashboard__log-now">{nowLabel} {nowVal.trim()}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const doSaveBalance = useCallback(() => {
    if (!selectedUserId || !selectedUser) return;
    const b = parseInt(balanceEdit, 10);
    if (isNaN(b) || b < 0) return;
    const state = loadState(selectedUserId) || { balance: 1000, cases: {}, inventory: [] };
    const oldBalance = state.balance ?? 0;
    state.balance = b;
    saveState(state, selectedUserId);
    const details = `${lang === "ru" ? "Баланс" : "Balance"}: ${formatNum(oldBalance)} → ${formatNum(b)}`;
    logEntry("balance", selectedUserId, selectedUser.login, details);
    setBalanceEdit("");
    if (String(selectedUserId) === String(currentUserId) && onStateUpdated) onStateUpdated(state);
  }, [selectedUserId, selectedUser, balanceEdit, currentUserId, onStateUpdated, logEntry, lang]);

  const doSaveAccumulated = useCallback(() => {
    if (!selectedUserId || !selectedUser) return;
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
    const next = {
      credits: parseVal(accEdit.credits, prev.credits),
      bonds: parseVal(accEdit.bonds, prev.bonds),
      freexp: parseVal(accEdit.freexp, prev.freexp),
      tickets: parseVal(accEdit.tickets, prev.tickets),
    };
    state.accumulatedResources = next;
    saveState(state, selectedUserId);
    const labels = { credits: t("credits", lang), bonds: t("bonds", lang), freexp: t("freexp", lang), tickets: t("tickets", lang) };
    const parts = ["credits", "bonds", "freexp", "tickets"]
      .filter((k) => (prev[k] ?? 0) !== (next[k] ?? 0))
      .map((k) => `${labels[k]}: ${formatNum(prev[k])} → ${formatNum(next[k])}`);
    const details = parts.length ? parts.join("; ") : (lang === "ru" ? "Без изменений" : "No changes");
    logEntry("accumulated", selectedUserId, selectedUser.login, details);
    setAccEdit({ credits: "", bonds: "", freexp: "", tickets: "" });
    if (String(selectedUserId) === String(currentUserId) && onStateUpdated) onStateUpdated(state);
  }, [selectedUserId, selectedUser, accEdit, currentUserId, onStateUpdated, logEntry, lang]);

  const handleSaveBalance = useCallback(() => {
    if (!selectedUserId || !selectedUser) return;
    const b = parseInt(balanceEdit, 10);
    if (isNaN(b) || b < 0) return;
    setConfirmModal({
      open: true,
      title: "Подтверждение",
      message: t("confirm_save_balance", lang).replace("{login}", selectedUser.login).replace("{value}", String(b)),
      confirmLabel: "Сохранить",
      cancelLabel: "Отмена",
      variant: "primary",
      onConfirm: () => { doSaveBalance(); setConfirmModal({ open: false }); },
      onCancel: () => setConfirmModal({ open: false }),
    });
  }, [selectedUserId, selectedUser, balanceEdit, lang, doSaveBalance]);

  const handleSaveAccumulated = useCallback(() => {
    if (!selectedUserId || !selectedUser) return;
    setConfirmModal({
      open: true,
      title: "Подтверждение",
      message: t("confirm_save_accumulated", lang).replace("{login}", selectedUser.login),
      confirmLabel: "Сохранить",
      cancelLabel: "Отмена",
      variant: "primary",
      onConfirm: () => { doSaveAccumulated(); setConfirmModal({ open: false }); },
      onCancel: () => setConfirmModal({ open: false }),
    });
  }, [selectedUserId, selectedUser, lang, doSaveAccumulated]);

  const handleDeleteProfileClick = useCallback(() => {
    if (!selectedUser || !canDeleteProfile) return;
    setConfirmModal({
      open: true,
      title: t("delete_profile", lang),
      message: t("confirm_delete_profile", lang).replace("{login}", selectedUser.login),
      confirmLabel: "Удалить",
      cancelLabel: "Отмена",
      variant: "danger",
      onConfirm: () => {
        setConfirmModal({
          open: true,
          title: t("delete_profile", lang),
          message: t("confirm_delete_profile_final", lang),
          confirmLabel: "Да, удалить",
          cancelLabel: "Отмена",
          variant: "danger",
          onConfirm: () => {
            const targetLogin = selectedUser.login;
            const targetId = selectedUserId;
            clearState(targetId);
            AuthProvider.removeUser(targetId);
            logEntry("delete_profile", targetId, targetLogin, lang === "ru" ? "Профиль удалён" : "Profile deleted");
            setSelectedUserId(null);
            setPlayerPanelExpanded(false);
            setBalanceEdit("");
            setAccEdit({ credits: "", bonds: "", freexp: "", tickets: "" });
            setConfirmModal({ open: false });
          },
          onCancel: () => setConfirmModal({ open: false }),
        });
      },
      onCancel: () => setConfirmModal({ open: false }),
    });
  }, [selectedUser, selectedUserId, canDeleteProfile, lang, logEntry]);

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
        <div className="admin-dashboard__players admin-dashboard__players--scroll">
          {userList.map((u) => {
            const isSelected = selectedUserId === u.id;
            const isExpanded = isSelected && playerPanelExpanded;
            return (
              <div key={u.id} className="admin-dashboard__player-block">
                <div
                  className={`admin-dashboard__player ${isSelected ? "admin-dashboard__player--selected" : ""} ${isExpanded ? "admin-dashboard__player--expanded" : ""}`}
                  onClick={() => {
                    if (isSelected) {
                      setPlayerPanelExpanded(!playerPanelExpanded);
                    } else {
                      setSelectedUserId(u.id);
                      setPlayerPanelExpanded(true);
                      const state = loadState(u.id);
                      setBalanceEdit(state?.balance?.toString() ?? "1000");
                      const acc = state?.accumulatedResources ?? {};
                      setAccEdit({
                        credits: String(acc.credits ?? 0),
                        bonds: String(acc.bonds ?? 0),
                        freexp: String(acc.freexp ?? 0),
                        tickets: String(acc.tickets ?? 0),
                      });
                    }
                  }}
                >
                  <span className="admin-dashboard__player-chevron" aria-hidden>
                    {isExpanded ? "▼" : "▶"}
                  </span>
                  <span>{u.login}</span>
                  <span className="admin-dashboard__role">{u.role}</span>
                  {loadState(u.id) && (
                    <span>Баланс: {formatNum(loadState(u.id).balance ?? 0)}</span>
                  )}
                </div>
                {isExpanded && selectedUser && (() => {
                  const currentState = loadState(selectedUserId);
                  const acc = currentState?.accumulatedResources ?? {};
                  return (
                    <div className="admin-dashboard__player-panel" onClick={(e) => e.stopPropagation()}>
                      <div className="admin-dashboard__current-values">
                        <h5>{t("current_values", lang)} ({selectedUser.login})</h5>
                        <div className="admin-dashboard__current-grid">
                          <span>{lang === "ru" ? "Баланс" : "Balance"}: {formatNum(currentState?.balance ?? 0)}</span>
                          <span>{t("credits", lang)}: {formatNum(acc.credits)}</span>
                          <span>{t("bonds", lang)}: {formatNum(acc.bonds)}</span>
                          <span>{t("freexp", lang)}: {formatNum(acc.freexp)}</span>
                          <span>{t("tickets", lang)}: {formatNum(acc.tickets)}</span>
                        </div>
                      </div>
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
                      {canDeleteProfile && (
                        <div className="admin-dashboard__delete-wrap">
                          <button type="button" className="btn btn--danger" onClick={handleDeleteProfileClick}>
                            {t("delete_profile", lang)}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </section>

      <section className="admin-dashboard__section">
        <h4>{t("admin_log", lang)}</h4>
        <div className="admin-dashboard__log">
          {adminLog.length === 0 ? (
            <p className="admin-dashboard__log-empty">{t("admin_log_empty", lang)}</p>
          ) : (
            <div className="admin-dashboard__log-list">
              {adminLog.slice(0, 50).map((entry, i) => (
                <div key={i} className="admin-dashboard__log-entry">
                  <div className="admin-dashboard__log-meta">
                    <span className="admin-dashboard__log-time">
                      {new Date(entry.timestamp).toLocaleString("ru-RU")}
                    </span>
                    <span className="admin-dashboard__log-who">{entry.adminLogin}</span>
                    <span className="admin-dashboard__log-action">
                      {entry.action === "balance"
                        ? t("admin_log_action_balance", lang)
                        : entry.action === "accumulated"
                          ? t("admin_log_action_accumulated", lang)
                          : t("admin_log_action_delete", lang)}
                    </span>
                    <span className="admin-dashboard__log-target">{entry.targetLogin || entry.targetUserId}</span>
                  </div>
                  {entry.details && (
                    <div className="admin-dashboard__log-details">
                      {renderLogDetails(entry.details, entry.action, lang)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
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

      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        cancelLabel={confirmModal.cancelLabel}
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
      />
    </div>
  );
}
