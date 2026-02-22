import React from "react";
import { GUARANTEED_AFTER } from "../utils/dropLogic";
import "./ProgressBar.css";

export function ProgressBar({ casesUntilGuaranteed }) {
  const filled = GUARANTEED_AFTER - (casesUntilGuaranteed ?? GUARANTEED_AFTER);
  const percent = (filled / GUARANTEED_AFTER) * 100;

  return (
    <div className="progress-bar">
      <div
        className="progress-bar__fill"
        style={{ width: `${percent}%` }}
        role="progressbar"
        aria-valuenow={filled}
        aria-valuemin={0}
        aria-valuemax={GUARANTEED_AFTER}
      />
      <span className="progress-bar__label">
        {filled}/{GUARANTEED_AFTER}
      </span>
    </div>
  );
}
