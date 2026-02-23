import React, { useMemo } from "react";
import { t } from "../config/i18n";
import { getCaseById } from "../config/cases";
import { GUARANTEED_AFTER } from "../utils/dropLogic";
import "./StatsPage.css";

const TYPE_LABEL_KEYS = {
  nation: "by_nation",
  class: "by_class",
  personalMission: "tab_lbz",
  personalMissionSpecial: "tab_lbz",
  branch_reset: "by_reset",
};

export function StatsPage({ state, lang }) {
  const totalOpened = state?.totalOpened ?? 0;
  const casesData = state?.cases ?? {};

  const byType = useMemo(() => {
    const map = {};
    Object.entries(casesData).forEach(([caseId, cState]) => {
      const caseItem = getCaseById(caseId);
      const type = caseItem?.type ?? "other";
      const key = type === "personalMissionSpecial" ? "personalMissionSpecial" : type;
      if (!map[key]) map[key] = { total: 0, cases: [] };
      const opened = cState?.totalOpened ?? 0;
      map[key].total += opened;
      map[key].cases.push({ caseId, caseItem, totalOpened: opened, casesUntilGuaranteed: cState?.casesUntilGuaranteed ?? GUARANTEED_AFTER, closed: cState?.closed });
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [casesData]);

  const topPrizes = useMemo(() => {
    const inventory = state?.inventory ?? [];
    const count = {};
    inventory.forEach((entry) => {
      const name = entry.prize?.name ?? entry.prize?.id ?? "—";
      count[name] = (count[name] || 0) + 1;
    });
    return Object.entries(count)
      .map(([name, n]) => ({ name, count: n }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [state?.inventory]);

  const guaranteeProgress = useMemo(() => {
    const list = [];
    Object.entries(casesData).forEach(([caseId, cState]) => {
      if (cState?.closed) return;
      const caseItem = getCaseById(caseId);
      const until = cState?.casesUntilGuaranteed ?? GUARANTEED_AFTER;
      list.push({
        caseId,
        caseItem,
        casesUntilGuaranteed: until,
        totalOpened: cState?.totalOpened ?? 0,
      });
    });
    return list.sort((a, b) => a.casesUntilGuaranteed - b.casesUntilGuaranteed).slice(0, 12);
  }, [casesData]);

  return (
    <div className="stats-page">
      <h2 className="stats-page__title">{t("stats_title", lang)}</h2>

      <section className="stats-page__section">
        <h3 className="stats-page__section-title">{t("stats_total", lang)}</h3>
        <p className="stats-page__big-number">{totalOpened.toLocaleString("ru-RU")}</p>
      </section>

      <section className="stats-page__section">
        <h3 className="stats-page__section-title">{t("stats_by_type", lang)}</h3>
        <div className="stats-page__table-wrap">
          <table className="stats-page__table">
            <thead>
              <tr>
                <th>{t("stats_type", lang)}</th>
                <th>{t("stats_opened", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {byType.map(([typeKey, { total }]) => (
                <tr key={typeKey}>
                  <td>{t(TYPE_LABEL_KEYS[typeKey] ?? typeKey, lang)}</td>
                  <td>{total.toLocaleString("ru-RU")}</td>
                </tr>
              ))}
              {byType.length === 0 && (
                <tr>
                  <td colSpan={2} className="stats-page__empty">{t("empty_history", lang)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="stats-page__section">
        <h3 className="stats-page__section-title">{t("stats_most_frequent", lang)}</h3>
        <div className="stats-page__table-wrap">
          <table className="stats-page__table">
            <thead>
              <tr>
                <th>{t("prize_name", lang)}</th>
                <th>{lang === "ru" ? "Раз" : "Times"}</th>
              </tr>
            </thead>
            <tbody>
              {topPrizes.map(({ name, count }, i) => (
                <tr key={i}>
                  <td className="stats-page__prize-name">{name}</td>
                  <td>{count}</td>
                </tr>
              ))}
              {topPrizes.length === 0 && (
                <tr>
                  <td colSpan={2} className="stats-page__empty">{t("empty_history", lang)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="stats-page__section">
        <h3 className="stats-page__section-title">{t("stats_until_guarantee", lang)}</h3>
        <p className="stats-page__hint">{t("stats_until_guarantee_hint", lang)}</p>
        <div className="stats-page__table-wrap">
          <table className="stats-page__table">
            <thead>
              <tr>
                <th>{t("stats_case", lang)}</th>
                <th>{t("until_guarantee", lang)}</th>
                <th>{t("stats_opened", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {guaranteeProgress.map(({ caseId, caseItem, casesUntilGuaranteed, totalOpened: opened }) => (
                <tr key={caseId}>
                  <td>{caseItem ? t(caseItem.nameKey, lang) : caseId}</td>
                  <td className="stats-page__until">{casesUntilGuaranteed}</td>
                  <td>{opened.toLocaleString("ru-RU")}</td>
                </tr>
              ))}
              {guaranteeProgress.length === 0 && (
                <tr>
                  <td colSpan={3} className="stats-page__empty">{t("empty_history", lang)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
