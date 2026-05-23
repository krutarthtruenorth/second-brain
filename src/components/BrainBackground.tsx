import { useState } from "react";

/** Animated neural-network brain. Drop `public/brain-bg.gif` to override with your own GIF. */
export default function BrainBackground() {
  const [gifOk, setGifOk] = useState(true);

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      aria-hidden
    >
      {gifOk && (
        <img
          src="/brain-bg.gif"
          alt=""
          className="max-h-[min(70vh,520px)] max-w-[min(85vw,520px)] object-contain opacity-[0.32] animate-brain-float animate-brain-pulse"
          onError={() => setGifOk(false)}
        />
      )}

      {!gifOk && (
        <div className="relative h-[min(70vh,480px)] w-[min(85vw,480px)] animate-brain-float">
          <svg
            viewBox="0 0 400 400"
            className="h-full w-full opacity-[0.35]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g className="origin-center animate-orbit" style={{ transformOrigin: "200px 200px" }}>
              <ellipse
                cx="200"
                cy="200"
                rx="160"
                ry="140"
                stroke="#E85D2C"
                strokeWidth="1"
                strokeDasharray="6 10"
                opacity="0.35"
              />
            </g>
            {[
              [200, 80],
              [280, 120],
              [320, 200],
              [280, 280],
              [200, 320],
              [120, 280],
              [80, 200],
              [120, 120],
              [200, 140],
              [260, 170],
              [270, 230],
              [200, 260],
              [130, 230],
              [130, 170],
            ].map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#E85D2C"
                className="brain-node"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
            {[
              "M200 80 L280 120 L320 200",
              "M320 200 L280 280 L200 320",
              "M200 320 L120 280 L80 200",
              "M80 200 L120 120 L200 80",
              "M200 140 L260 170 L270 230 L200 260 L130 230 L130 170 Z",
              "M200 80 L200 140",
              "M280 120 L260 170",
              "M320 200 L270 230",
              "M200 320 L200 260",
              "M120 280 L130 230",
              "M80 200 L130 170",
              "M120 120 L130 170",
            ].map((d, i) => (
              <path
                key={d}
                d={d}
                stroke="#E85D2C"
                strokeWidth="1.2"
                className="brain-line"
                opacity="0.45"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </svg>
          <div className="absolute inset-0 rounded-full bg-accent/5 blur-3xl" />
        </div>
      )}
    </div>
  );
}
