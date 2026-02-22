import React from "react";
import { getTotalChance } from "../config/prizes";
import { t } from "../config/i18n";
import "./ChancesPage.css";

export function ChancesPage({ caseData, lang }) {
  if (!caseData?.prizes?.length) return null;

  const prizes = caseData.prizes;
  const total = getTotalChance(prizes);

  return (
    <div className="chances-page">
      <h3 className="chances-page__title">{t("chances", lang)}</h3>
      <table className="chances-page__table">
        <thead>
          <tr>
            <th>{t("prize_name", lang)}</th>
            <th>%</th>
            <th>Редкость</th>
          </tr>
        </thead>
        <tbody>
          {prizes.map((p) => (
            <tr key={p.id} className={`chances-page__row--${p.rarity}`}>
              <td>{p.name}</td>
              <td>{((p.chance / total) * 100).toFixed(1)}%</td>
              <td>{p.rarity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
