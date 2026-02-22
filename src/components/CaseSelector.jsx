import React from "react";
import { getCasesByType } from "../config/cases";
import { CaseCard } from "./CaseCard";
import { t } from "../config/i18n";
import "./CaseSelector.css";

export function CaseSelector({ selectedCaseId, onSelect, lang, casesStats }) {
  const nationCases = getCasesByType("nation");
  const classCases = getCasesByType("class");
  const lbtCases = getCasesByType("personalMission");

  const CaseGroup = ({ title, items }) => (
    <div className="case-selector__group">
      <h4 className="case-selector__group-title">{title}</h4>
      <div className="case-selector__list">
        {items.map((c) => (
          <CaseCard
            key={c.id}
            caseItem={c}
            isSelected={selectedCaseId === c.id}
            onSelect={onSelect}
            lang={lang}
            stats={casesStats}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="case-selector">
      <h3 className="case-selector__title">{t("choose_case", lang)}</h3>
      {nationCases.length > 0 && (
        <CaseGroup title={t("by_nation", lang)} items={nationCases} />
      )}
      {classCases.length > 0 && (
        <CaseGroup title={t("by_class", lang)} items={classCases} />
      )}
      {lbtCases.length > 0 && (
        <CaseGroup title="ЛБЗ" items={lbtCases} />
      )}
    </div>
  );
}
