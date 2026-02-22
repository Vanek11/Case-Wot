import React from "react";
import "./PrizeCard.css";

const rarityStyles = {
  common: "prize-card--common",
  rare: "prize-card--rare",
  epic: "prize-card--epic",
  legendary: "prize-card--legendary",
};

export function PrizeCard({ prize, isWinner, compact = false }) {
  const rarityClass = rarityStyles[prize?.rarity] || "prize-card--common";
  const customColor = prize?.color;
  const title = prize?.description || prize?.name;

  return (
    <div
      className={`prize-card ${rarityClass} ${isWinner ? "prize-card--winner" : ""} ${
        compact ? "prize-card--compact" : ""
      }`}
      style={customColor ? { "--glow": customColor + "80", borderColor: customColor } : undefined}
      title={title}
    >
      <div className="prize-card__image-wrap">
        <img
          className="prize-card__image"
          src={prize?.image}
          alt={prize?.name ?? ""}
          onError={(e) => {
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%23333' width='80' height='80'/%3E%3Ctext x='40' y='45' fill='%23888' text-anchor='middle' font-size='12'%3E?%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>
      {!compact && <span className="prize-card__name">{prize?.name ?? ""}</span>}
    </div>
  );
}
