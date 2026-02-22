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
  const itemWidth = 130;
  const visibleCount = 5;
  const duration = durationMs ?? ROULETTE_SCROLL_DURATION_MS;

  useEffect(() => {
    if (!isAnimating || !prizes.length || winningIndex === undefined) return;

    setAnimating(true);
    const itemCount = prizes.length;
    const totalWidth = itemCount * itemWidth;
    const centerOffset = (visibleCount * itemWidth) / 2 - itemWidth / 2;
    const targetOffset = winningIndex * itemWidth - centerOffset;
    const clampedTarget = Math.max(
      0,
      Math.min(targetOffset, totalWidth - visibleCount * itemWidth)
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
  }, [isAnimating, prizes.length, winningIndex, onComplete, duration]);

  if (!prizes.length) return null;

  return (
    <div className="roulette" ref={containerRef}>
      <div className="roulette__viewport">
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
