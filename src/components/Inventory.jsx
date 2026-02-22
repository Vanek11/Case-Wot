import React from "react";
import { PrizeCard } from "./PrizeCard";
import { t } from "../config/i18n";
import "./Inventory.css";

const formatNumber = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n.toLocaleString("ru-RU"));

export function Inventory({ inventory, accumulatedResources, lang }) {
  const items = inventory || [];
  const acc = accumulatedResources ?? { credits: 0, bonds: 0, freexp: 0, tickets: 0 };
  const hasResources = (acc.credits || 0) + (acc.bonds || 0) + (acc.freexp || 0) + (acc.tickets || 0) > 0;

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
      <h3 className="inventory__title">{t("inventory", lang)}</h3>
      {items.length === 0 ? (
        <p className="inventory__empty">{t("empty_history", lang)}</p>
      ) : (
        <div className="inventory__grid">
          {items
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
