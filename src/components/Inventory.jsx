import React from "react";
import { PrizeCard } from "./PrizeCard";
import { t } from "../config/i18n";
import "./Inventory.css";

export function Inventory({ inventory, lang }) {
  const items = inventory || [];

  return (
    <div className="inventory">
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
