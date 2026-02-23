import React, { useMemo, useState } from "react";
import { PrizeCard } from "./PrizeCard";
import { t } from "../config/i18n";
import { getCaseByIdWithSeasonal } from "../config/cases";
import "./Inventory.css";

const formatNumber = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n.toLocaleString("ru-RU"));
const RESOURCE_TYPES = ["credits", "bonds", "freexp", "tickets"];

export function Inventory({ inventory, accumulatedResources, deductionLog, lang, seasonalCases = [] }) {
  const items = inventory || [];
  const [filterType, setFilterType] = useState("all");
  const [filterCaseId, setFilterCaseId] = useState("all");

  const acc = accumulatedResources ?? { credits: 0, bonds: 0, freexp: 0, tickets: 0 };
  const hasResources = (acc.credits || 0) + (acc.bonds || 0) + (acc.freexp || 0) + (acc.tickets || 0) > 0;

  const uniqueCaseIds = useMemo(() => {
    const ids = new Set();
    items.forEach((e) => {
      const cid = e.caseId;
      if (cid) ids.add(cid);
    });
    return Array.from(ids).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((entry) => {
      const p = entry.prize;
      const prizeType = p?.type;
      const isResource = prizeType && RESOURCE_TYPES.includes(prizeType);
      const isTank = !isResource;
      if (filterType !== "all") {
        if (filterType === "tanks" && !isTank) return false;
        if (filterType !== "tanks" && prizeType !== filterType) return false;
      }
      if (filterCaseId !== "all" && entry.caseId !== filterCaseId) return false;
      return true;
    });
  }, [items, filterType, filterCaseId]);

  const deductions = deductionLog ?? [];

  return (
    <div className="inventory">
      {hasResources && (
        <div className="inventory__totals">
          <h4 className="inventory__totals-title">{t("accumulated_resources", lang)}</h4>
          <div className="inventory__totals-grid">
            {(acc.credits || 0) > 0 && (
              <div className="inventory__total">
                <span className="inventory__total-label">{t("credits", lang)}</span>
                <span className="inventory__total-value">{formatNumber(acc.credits)}</span>
              </div>
            )}
            {(acc.bonds || 0) > 0 && (
              <div className="inventory__total">
                <span className="inventory__total-label">{t("bonds", lang)}</span>
                <span className="inventory__total-value">{formatNumber(acc.bonds)}</span>
              </div>
            )}
            {(acc.freexp || 0) > 0 && (
              <div className="inventory__total">
                <span className="inventory__total-label">{t("freexp", lang)}</span>
                <span className="inventory__total-value">{formatNumber(acc.freexp)}</span>
              </div>
            )}
            {(acc.tickets || 0) > 0 && (
              <div className="inventory__total">
                <span className="inventory__total-label">{t("tickets", lang)}</span>
                <span className="inventory__total-value">{formatNumber(acc.tickets)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {deductions.length > 0 && (
        <div className="inventory__deductions">
          <h4 className="inventory__deductions-title">{t("deduction_history", lang)}</h4>
          <ul className="inventory__deductions-list">
            {deductions.slice().reverse().slice(0, 30).map((d, i) => {
              const parts = [];
              if ((d.credits || 0) > 0) parts.push(`${t("credits", lang)}: −${formatNumber(d.credits)}`);
              if ((d.bonds || 0) > 0) parts.push(`${t("bonds", lang)}: −${formatNumber(d.bonds)}`);
              if ((d.freexp || 0) > 0) parts.push(`${t("freexp", lang)}: −${formatNumber(d.freexp)}`);
              if ((d.tickets || 0) > 0) parts.push(`${t("tickets", lang)}: −${formatNumber(d.tickets)}`);
              const sumText = parts.join("; ");
              return (
                <li key={i} className="inventory__deduction-item">
                  <span className="inventory__deduction-date">
                    {new Date(d.timestamp).toLocaleString("ru-RU")}
                  </span>
                  <span className="inventory__deduction-sum">{sumText}</span>
                  {d.note && (
                    <span className="inventory__deduction-note" title={d.note}>
                      {t("note", lang)}: {d.note}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="inventory__header">
        <h3 className="inventory__title">{t("inventory", lang)}</h3>
        <div className="inventory__filters">
          <label className="inventory__filter">
            <span className="inventory__filter-label">{t("filter_by_type", lang)}</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="inventory__select"
            >
              <option value="all">{t("filter_all", lang)}</option>
              <option value="tanks">{t("filter_tanks", lang)}</option>
              <option value="credits">{t("filter_credits", lang)}</option>
              <option value="bonds">{t("filter_bonds", lang)}</option>
              <option value="freexp">{t("filter_freexp", lang)}</option>
              <option value="tickets">{t("filter_tickets", lang)}</option>
            </select>
          </label>
          <label className="inventory__filter">
            <span className="inventory__filter-label">{t("filter_by_case", lang)}</span>
            <select
              value={filterCaseId}
              onChange={(e) => setFilterCaseId(e.target.value)}
              className="inventory__select"
            >
              <option value="all">{t("filter_all", lang)}</option>
              {uniqueCaseIds.map((cid) => {
                const caseItem = getCaseByIdWithSeasonal(cid, seasonalCases);
                const label = caseItem ? (caseItem.type === "seasonal" ? caseItem.name : t(caseItem.nameKey, lang)) : cid;
                return (
                  <option key={cid} value={cid}>
                    {label}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      </div>
      {filteredItems.length === 0 ? (
        <p className="inventory__empty">{t("empty_history", lang)}</p>
      ) : (
        <div className="inventory__grid">
          {filteredItems
            .slice()
            .reverse()
            .map((entry, i) => (
              <div key={i} className="inventory__item">
                <PrizeCard prize={entry.prize} compact />
                <span className="inventory__name">{entry.prize?.name ?? "—"}</span>
                {entry.isGuaranteed && (
                  <span className="inventory__badge">Гарант</span>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
