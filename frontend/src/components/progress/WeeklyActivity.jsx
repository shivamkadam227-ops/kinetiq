"use client";
import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import { getWeeklyActivity } from "@/lib/dataStore";

export default function WeeklyActivity() {
  const [data, setData] = useState([]);
  const [maxSessions, setMaxSessions] = useState(1);

  useEffect(() => {
    const activity = getWeeklyActivity();
    setData(activity);
    const max = Math.max(...activity.map((d) => d.sessions), 1);
    setMaxSessions(max);
  }, []);

  const hasActivity = data.some((d) => d.sessions > 0);

  return (
    <Card className="p-5" hover={false}>
      <h3 className="text-sm font-semibold text-white mb-2">Weekly Activity</h3>
      <p className="text-xs text-slate-500 mb-6">Sessions per day this week</p>
      {!hasActivity ? (
        <div className="flex items-end justify-center h-32 text-slate-600 text-sm">
          No activity this week yet. Start learning!
        </div>
      ) : (
        <div className="relative">
          {/* SVG Bar Chart */}
          <svg viewBox="0 0 350 160" className="w-full h-40">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="40" y1={20 + i * 30}
                x2="340" y2={20 + i * 30}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />
            ))}

            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4].map((i) => {
              const val = Math.round(maxSessions * (1 - i / 4));
              return (
                <text
                  key={i}
                  x="30" y={25 + i * 30}
                  fill="rgba(148,163,184,0.6)"
                  fontSize="10"
                  textAnchor="end"
                >
                  {val}
                </text>
              );
            })}

            {/* Bars */}
            {data.map((d, i) => {
              const barWidth = 30;
              const gap = (300 - barWidth * 7) / 6;
              const x = 45 + i * (barWidth + gap);
              const height = (d.sessions / maxSessions) * 120;
              const y = 140 - height;

              return (
                <g key={d.day}>
                  {/* Bar */}
                  <defs>
                    <linearGradient id={"barGrad" + i} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={Math.max(height, 2)}
                    rx="4"
                    fill={"url(#barGrad" + i + ")"}
                    opacity={d.sessions > 0 ? 1 : 0.2}
                  />
                  {/* Value label */}
                  {d.sessions > 0 && (
                    <text
                      x={x + barWidth / 2}
                      y={y - 6}
                      fill="rgba(196,181,253,0.8)"
                      fontSize="10"
                      textAnchor="middle"
                      fontWeight="600"
                    >
                      {d.sessions}
                    </text>
                  )}
                  {/* Day label */}
                  <text
                    x={x + barWidth / 2}
                    y={155}
                    fill="rgba(148,163,184,0.6)"
                    fontSize="10"
                    textAnchor="middle"
                  >
                    {d.day}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </Card>
  );
}