import React from "react";
import { PrizeCard } from "./PrizeCard";
import { t } from "../config/i18n";
import "./DropHistory.css";

export function DropHistory({ history, inventory, maxItems = 10, lang }) {
  const source = inventory?.length ? inventory.slice(-maxItems).reverse() : history || [];
  const items = source.slice(0, maxItems).map((e) => (e.prize ? e : { prize: e, isGuaranteed: false }));

  if (items.length === 0) {
    return (
      <div className="drop-history">
        <h3 className="drop-history__title">{t("history", lang)}</h3>
        <p className="drop-history__empty">{t("empty_history", lang)}</p>
      </div>
    );
  }

  return (
    <div className="drop-history">
        <h3 className="drop-history__title">{t("history", lang)}</h3>
      <div className="drop-history__list">
        {items.map((entry, idx) => (
          <div key={idx} className="drop-history__item">
            <PrizeCard prize={entry.prize} compact />
            <span className="drop-history__name">{entry.prize?.name ?? "—"}</span>
            {entry.isGuaranteed && (
              <span className="drop-history__badge">Гарант</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
