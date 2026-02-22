import React, { useState, useRef } from "react";
import { t } from "../config/i18n";
import "./CaseCard.css";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23333' width='80' height='80'/%3E%3Ctext x='40' y='45' fill='%23888' text-anchor='middle' font-size='10'%3E?%3C/text%3E%3C/svg%3E";

/** Мемоизированная карточка — предотвращает перезагрузку изображений при клике */
export const CaseCard = React.memo(function CaseCard({ caseItem, isSelected, onSelect, lang, stats, isLocked, lockHint }) {
  const [imgSrc, setImgSrc] = useState(caseItem.image);
  const usedFallback = useRef(false);

  const handleError = () => {
    if (!usedFallback.current) {
      usedFallback.current = true;
      setImgSrc(PLACEHOLDER);
    }
  };

  const handleClick = () => {
    if (!isLocked) onSelect(caseItem);
  };

  const s = stats?.[caseItem.id];

  return (
    <button
      type="button"
      className={`case-card ${isSelected ? "case-card--selected" : ""} ${isLocked ? "case-card--locked" : ""}`}
      onClick={handleClick}
      disabled={isLocked}
      title={lockHint || undefined}
    >
      <img
        className="case-card__image"
        src={imgSrc}
        alt=""
        loading="eager"
        onError={handleError}
      />
      <span className="case-card__name">{t(caseItem.nameKey, lang)}</span>
      {isLocked && lockHint && (
        <span className="case-card__lock-hint">{lockHint}</span>
      )}
      {s && !isLocked && (
        <div className="case-card__stats">
          <span title={t("total_opened", lang)}>{s.totalOpened ?? 0}</span>
          <span title={t("until_guarantee", lang)}>{s.casesUntilGuaranteed ?? 30}</span>
        </div>
      )}
    </button>
  );
});
