import React, { useState, useCallback, useEffect, useRef } from "react";
import { Roulette } from "./Roulette";
import { PrizeCard } from "./PrizeCard";
import { Particles } from "./Particles";
import { rollPrize, applyDrop, buildRouletteItems, getPoolForCase, GUARANTEED_AFTER } from "../utils/dropLogic";
import { prizes } from "../config/prizes";
import { ROULETTE_SCROLL_DURATION_MS, COUNTDOWN_ENABLED, DAILY_BONUS_BALANCE } from "../config/settings";
import { t } from "../config/i18n";
import "./CaseOpener.css";

const RARITY_SOUNDS = {
  common: "/sounds/common.mp3",
  rare: "/sounds/rare.mp3",
  epic: "/sounds/epic.mp3",
  legendary: "/sounds/legendary.mp3",
};
const QUICK_SCROLL_DURATION = 800;

const playSound = (url) => {
  try {
    const audio = new Audio(url);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch {}
};

export function CaseOpener({
  state,
  caseData,
  onStateChange,
  onClose,
  quickOpen = false,
  lang,
}) {
  const [phase, setPhase] = useState("preview"); // preview | spinning | result
  const [rouletteData, setRouletteData] = useState(null);
  const [countdown, setCountdown] = useState(COUNTDOWN_ENABLED ? 3 : 0);
  const [useQuickScroll, setUseQuickScroll] = useState(false);
  const scrollDurationRef = useRef(ROULETTE_SCROLL_DURATION_MS);
  const hasStartedRef = useRef(false);

  const caseId = caseData?.id ?? "default";
  const caseState = state.cases?.[caseId] ?? {
    casesUntilGuaranteed: GUARANTEED_AFTER,
    history: [],
    wonMainPrizeIds: [],
    closed: false,
  };
  const rewardType = caseData?.rewardType ?? "branch_reset";
  const fullPool = caseData?.prizes?.length ? caseData.prizes : prizes;
  const prizePool = getPoolForCase(fullPool, caseState, rewardType, state);

  const scrollDuration = useQuickScroll ? QUICK_SCROLL_DURATION : ROULETTE_SCROLL_DURATION_MS;

  const initRoll = useCallback(() => {
    const result = rollPrize(caseState.casesUntilGuaranteed, prizePool);
    const items = buildRouletteItems(result.prize, prizePool);
    const winningIndex = Math.floor(items.length * 0.75);
    setRouletteData({ items, winningIndex, result });
  }, [caseState.casesUntilGuaranteed, prizePool]);

  useEffect(() => {
    if (!quickOpen && !rouletteData) initRoll();
  }, [quickOpen, rouletteData, initRoll]);

  const handleStartSpin = useCallback(() => {
    if (!rouletteData) return;
    const soundUrl = rouletteData.result.prize?.sound ||
      RARITY_SOUNDS[rouletteData.result.prize?.rarity] || "/sounds/open.mp3";
    playSound(soundUrl);
    setPhase("spinning");
  }, [rouletteData]);

  useEffect(() => {
    if (phase !== "preview" || hasStartedRef.current) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    hasStartedRef.current = true;
    handleStartSpin();
  }, [phase, countdown, handleStartSpin]);

  const handleSkip = useCallback(() => {
    if (phase === "spinning") {
      setPhase("result");
    } else if (phase === "preview" && countdown > 0) {
      setCountdown(0);
      hasStartedRef.current = true;
      handleStartSpin();
    } else if (phase === "preview" && countdown === 0 && rouletteData) {
      handleStartSpin();
    }
  }, [phase, countdown, handleStartSpin, rouletteData]);

  const handleQuickScroll = useCallback(() => {
    setUseQuickScroll(true);
    if (phase === "preview" && !hasStartedRef.current) {
      setCountdown(0);
      hasStartedRef.current = true;
      handleStartSpin();
    }
  }, [phase, handleStartSpin]);

  const handleRouletteComplete = useCallback(() => setPhase("result"), []);

  const handleClaim = useCallback(() => {
    if (!rouletteData) return;
    const cost = caseData?.cost ?? 0;
    let newState = applyDrop(state, rouletteData.result, caseId, cost, rewardType);
    const today = new Date().toISOString().slice(0, 10);
    if (newState.lastDailyBonusDate !== today && DAILY_BONUS_BALANCE > 0) {
      newState = {
        ...newState,
        balance: (newState.balance ?? 0) + DAILY_BONUS_BALANCE,
        lastDailyBonusDate: today,
      };
    }
    onStateChange(newState);
    onClose?.();
  }, [rouletteData, state, caseId, caseData?.cost, rewardType, onStateChange, onClose]);

  useEffect(() => {
    if (quickOpen && !rouletteData) {
      const result = rollPrize(caseState.casesUntilGuaranteed, prizePool);
      playSound(result.prize?.sound || RARITY_SOUNDS[result.prize?.rarity] || "/sounds/open.mp3");
      setRouletteData({ items: [result.prize], winningIndex: 0, result });
    }
  }, [quickOpen, rouletteData, caseState.casesUntilGuaranteed, prizePool]);

  if (quickOpen) {
    if (!rouletteData) return null;
    const { result } = rouletteData;
    return (
      <div className="case-opener case-opener--result">
        {result.prize?.hasParticles && <Particles active color="#f59e0b" />}
        <h3 className="case-opener__won-title">{t("you_won", lang)}</h3>
        <PrizeCard prize={result.prize} isWinner />
        {result.isGuaranteed && (
          <span className="case-opener__guaranteed-badge">{t("guaranteed_badge", lang)}</span>
        )}
        <button className="btn btn--primary" onClick={handleClaim}>
          {t("claim", lang)}
        </button>
        <button className="btn btn--ghost case-opener__back" onClick={handleClaim}>
          {t("back", lang)}
        </button>
      </div>
    );
  }

  if (!rouletteData) return null;

  if (phase === "result") {
    const { result } = rouletteData;
    return (
      <div className="case-opener case-opener--result">
        {result.prize?.hasParticles && <Particles active color="#f59e0b" />}
        <h3 className="case-opener__won-title">{t("you_won", lang)}</h3>
        <PrizeCard prize={result.prize} isWinner />
        {result.isGuaranteed && (
          <span className="case-opener__guaranteed-badge">{t("guaranteed_badge", lang)}</span>
        )}
        <button className="btn btn--primary" onClick={handleClaim}>
          {t("claim", lang)}
        </button>
        <button className="btn btn--ghost case-opener__back" onClick={handleClaim}>
          {t("back", lang)}
        </button>
      </div>
    );
  }

  return (
    <div className="case-opener case-opener--preview">
      <div className="case-opener__roulette-wrap">
        <Roulette
          key={`${phase}-${useQuickScroll}`}
          prizes={rouletteData.items}
          winningIndex={rouletteData.winningIndex}
          onComplete={handleRouletteComplete}
          durationMs={scrollDuration}
          isAnimating={phase === "spinning"}
        />
      </div>

      {phase === "preview" && COUNTDOWN_ENABLED && (
        <div className="case-opener__countdown">{countdown > 0 ? countdown : "..."}</div>
      )}

      <div className="case-opener__actions">
        <button
          className="btn btn--secondary"
          onClick={handleQuickScroll}
          disabled={phase === "result"}
        >
          {t("quick_scroll", lang)}
        </button>
        <button
          className="btn btn--ghost"
          onClick={handleSkip}
          disabled={phase === "result"}
        >
          {t("skip", lang)}
        </button>
        <button className="btn btn--ghost" onClick={onClose}>
          {t("back", lang)}
        </button>
      </div>
    </div>
  );
}
