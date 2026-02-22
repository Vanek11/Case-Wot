import React, { useState, useCallback } from "react";
import { rollPrize } from "../utils/dropLogic";
import { prizes } from "../config/prizes";
import "./AdminPanel.css";

export function AdminPanel({ onClose }) {
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState(null);

  const runSimulation = useCallback(async (count = 1000) => {
    setRunning(true);
    setStats(null);

    const prizeCounts = {};
    prizes.forEach((p) => (prizeCounts[p.id] = { ...p, count: 0 }));
    let guaranteedDrops = 0;
    let casesUntilGuaranteed = 30;

    for (let i = 0; i < count; i++) {
      const result = rollPrize(casesUntilGuaranteed, prizes);
      const id = result.prize?.id;
      if (id && prizeCounts[id]) prizeCounts[id].count++;

      if (result.isGuaranteed) {
        guaranteedDrops++;
        casesUntilGuaranteed = 30;
      } else if (result.prize.isGuaranteed) {
        casesUntilGuaranteed = 30;
      } else {
        casesUntilGuaranteed = Math.max(0, casesUntilGuaranteed - 1);
      }
    }

    const items = Object.values(prizeCounts).map((p) => ({
      ...p,
      actualPercent: ((p.count / count) * 100).toFixed(2),
      expectedPercent: p.chance,
    }));

    setStats({
      total: count,
      guaranteedDrops,
      items,
    });
    setRunning(false);
  }, []);

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <h3>Админ: симуляция открытий</h3>
        <button className="btn btn--ghost btn--sm" onClick={onClose}>
          Закрыть
        </button>
      </div>
      <p className="admin-panel__desc">
        Симуляция 1000 открытий для проверки фактических вероятностей.
      </p>
      <button
        className="btn btn--secondary"
        onClick={() => runSimulation(1000)}
        disabled={running}
      >
        {running ? "Выполняется…" : "Симулировать 1000 открытий"}
      </button>

      {stats && (
        <div className="admin-panel__stats">
          <p>
            Гарантированных выпадений: <strong>{stats.guaranteedDrops}</strong> из{" "}
            {stats.total}
          </p>
          <table className="admin-panel__table">
            <thead>
              <tr>
                <th>Приз</th>
                <th>Выпало</th>
                <th>Факт %</th>
                <th>Ожид. %</th>
              </tr>
            </thead>
            <tbody>
              {stats.items.map((p) => (
                <tr key={p.id}>
                  <td>
                    {p.name}
                    {p.isGuaranteed && (
                      <span className="admin-panel__badge">Главный</span>
                    )}
                  </td>
                  <td>{p.count}</td>
                  <td>{p.actualPercent}%</td>
                  <td>{p.chance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
