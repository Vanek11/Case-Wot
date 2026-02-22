import React from "react";
import { t } from "../config/i18n";
import "./Achievements.css";

const ACH_KEYS = {
  first_case: "ach_first_case",
  first_main: "ach_first_main",
  first_guaranteed: "ach_first_guaranteed",
};

export function Achievements({ achievements, lang }) {
  const list = Object.keys(ACH_KEYS);

  return (
    <div className="achievements">
      <h3 className="achievements__title">{t("achievements", lang)}</h3>
      <div className="achievements__list">
        {list.map((id) => (
          <div
            key={id}
            className={`achievements__item ${
              (achievements || []).includes(id) ? "achievements__item--unlocked" : ""
            }`}
            title={t(ACH_KEYS[id], lang)}
          >
            <span className="achievements__icon">
              {(achievements || []).includes(id) ? "✓" : "?"}
            </span>
            <span className="achievements__name">{t(ACH_KEYS[id], lang)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
