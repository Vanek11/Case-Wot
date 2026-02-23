import React, { useEffect, useRef, useState } from "react";
import { PrizeCard } from "./PrizeCard";
import { ROULETTE_SCROLL_DURATION_MS } from "../config/settings";
import "./Roulette.css";

const EASING_POWER = 4;

export function Roulette({
  prizes,
  winningIndex,
  onComplete,
  durationMs,
  isAnimating = true,
}) {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [animating, setAnimating] = useState(false);
  const containerRef = useRef(null);
  const viewportRef = useRef(null);
  const getItemWidth = () => {
    if (typeof window === "undefined") return 130;
    const w = window.innerWidth;
    return w <= 480 ? 82 : w <= 768 ? 100 : 130;
  };
  const [itemWidth, setItemWidth] = useState(getItemWidth);
  const gapPx = 8;
  useEffect(() => {
    const updateWidth = () => setItemWidth(getItemWidth());
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [prizes.length]);
  const duration = durationMs ?? ROULETTE_SCROLL_DURATION_MS;
  /** Позиция выигрыша: при наступлении на линию — передний (левый) край карточки совпадает с центром вьюпорта (линия 50%) */

  useEffect(() => {
    if (!isAnimating || !prizes.length || winningIndex === undefined) return;

    setAnimating(true);
    const itemCount = prizes.length;
    const totalTrackWidth = itemCount * itemWidth + (itemCount - 1) * gapPx;
    const winningItemLeftEdge = winningIndex * (itemWidth + gapPx);

    const runAnimation = () => {
      const measuredWidth = viewportRef.current?.offsetWidth ?? 0;
      const viewportWidth = measuredWidth > 0 ? measuredWidth : totalTrackWidth;
      const viewportCenter = viewportWidth / 2;
      const targetOffset = winningItemLeftEdge - viewportCenter;
      const clampedTarget = Math.max(
        0,
        Math.min(targetOffset, totalTrackWidth - viewportWidth)
      );

      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, EASING_POWER);
        const currentOffset = eased * clampedTarget;
        setScrollOffset(currentOffset);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimating(false);
          onComplete?.();
        }
      };

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(runAnimation);
  }, [isAnimating, prizes.length, winningIndex, onComplete, duration]);

  if (!prizes.length) return null;

  return (
    <div className="roulette" ref={containerRef}>
      <div className="roulette__viewport" ref={viewportRef}>
        <div
          className="roulette__track"
          style={{
            transform: `translateX(-${scrollOffset}px)`,
          }}
        >
          {prizes.map((prize, idx) => (
            <div
              key={`${prize.id}-${idx}`}
              className={`roulette__item ${
                idx === winningIndex && !animating ? "roulette__item--winner" : ""
              }`}
              style={{ width: itemWidth }}
            >
              <PrizeCard
                prize={prize}
                isWinner={idx === winningIndex && !animating}
                compact
              />
            </div>
          ))}
        </div>
      </div>
      <div className="roulette__center-line" />
    </div>
  );
}
