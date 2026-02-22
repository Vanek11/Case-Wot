import React, { useEffect, useState } from "react";
import "./Particles.css";

export function Particles({ active, color = "#f59e0b" }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) return;
    const count = 30;
    const arr = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      delay: Math.random() * 300,
      duration: 800 + Math.random() * 400,
      size: 4 + Math.random() * 6,
    }));
    setParticles(arr);
    const t = setTimeout(() => setParticles([]), 1500);
    return () => clearTimeout(t);
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particles__item"
          style={{
            "--x": `${p.x}px`,
            "--y": `${p.y}px`,
            "--delay": `${p.delay}ms`,
            "--duration": `${p.duration}ms`,
            "--size": `${p.size}px`,
            "--color": color,
          }}
        />
      ))}
    </div>
  );
}
