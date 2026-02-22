import React from "react";
import { getCasesByType, isSpecialLbzCaseUnlocked } from "../config/cases";
import { CaseCard } from "./CaseCard";
import { t } from "../config/i18n";
import "./CaseSelector.css";

const SPECIAL_UNLOCK_HINT = {
  armt: null,
  tf2clark: "lbt_unlock_armt",
  projectmurat: "lbt_unlock_tf2clark",
};

export function CaseSelector({ activeCategory = "progress", selectedCaseId, onSelect, lang, casesStats, inventory }) {
  const nationCases = getCasesByType("nation");
  const classCases = getCasesByType("class");
  const resetCases = getCasesByType("branch_reset");
  const lbtCases = getCasesByType("personalMission");
  const specialLbtCases = getCasesByType("personalMissionSpecial");

  const CaseGroup = ({ title, items, getLock }) => (
    <div className="case-selector__group">
      <h4 className="case-selector__group-title">{title}</h4>
      <div className="case-selector__list">
        {items.map((c) => {
          const closed = c.rewardType === "lbz" && casesStats?.[c.id]?.closed;
          const specialLock = getLock ? getLock(c) : false;
          const isLocked = specialLock || closed;
          const lockHint = closed
            ? t("case_completed", lang)
            : specialLock
              ? t(SPECIAL_UNLOCK_HINT[c.filter] || "lbt_unlock_prev", lang)
              : null;
          return (
            <CaseCard
              key={c.id}
              caseItem={c}
              isSelected={selectedCaseId === c.id}
              onSelect={onSelect}
              lang={lang}
              stats={casesStats}
              isLocked={!!isLocked}
              lockHint={lockHint}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="case-selector">
      <h3 className="case-selector__title">{t("choose_case", lang)}</h3>
      {activeCategory === "progress" && (
        <>
          {nationCases.length > 0 && (
            <CaseGroup title={t("by_nation", lang)} items={nationCases} />
          )}
          {classCases.length > 0 && (
            <CaseGroup title={t("by_class", lang)} items={classCases} />
          )}
        </>
      )}
      {activeCategory === "reset" && resetCases.length > 0 && (
        <CaseGroup title={t("by_reset", lang)} items={resetCases} />
      )}
      {activeCategory === "lbz" && (
        <>
          {lbtCases.length > 0 && (
            <CaseGroup title="ЛБЗ" items={lbtCases} />
          )}
          {specialLbtCases.length > 0 && (
            <CaseGroup
              title="ЛБЗ (спец.)"
              items={specialLbtCases}
              getLock={(c) => !isSpecialLbzCaseUnlocked(c, inventory)}
            />
          )}
        </>
      )}
    </div>
  );
}
