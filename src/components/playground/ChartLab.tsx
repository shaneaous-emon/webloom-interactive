"use client";

import { useEffect, useRef, useState } from "react";
import {
  Chart,
  BarController,
  LineController,
  RadarController,
  DoughnutController,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Filler,
  Tooltip,
  type ChartType,
} from "chart.js";

Chart.register(
  BarController,
  LineController,
  RadarController,
  DoughnutController,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Filler,
  Tooltip
);

const TYPES: { id: ChartType; label: string }[] = [
  { id: "bar", label: "Bar" },
  { id: "line", label: "Line" },
  { id: "radar", label: "Radar" },
  { id: "doughnut", label: "Doughnut" },
];

// Sample data only (illustrative)
const labels = ["Discover", "Define", "Create", "Launch", "Refine", "Grow"];
const a = [32, 48, 41, 66, 74, 88];
const b = [20, 28, 36, 40, 52, 61];

export default function ChartLab({ paused }: { paused: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const chart = useRef<Chart | null>(null);
  const [type, setType] = useState<ChartType>("bar");

  useEffect(() => {
    if (!canvas.current) return;
    const ctx = canvas.current.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 0, 320);
    grad.addColorStop(0, "rgba(255,107,71,0.55)");
    grad.addColorStop(1, "rgba(255,107,71,0)");
    const isRound = type === "doughnut";
    const grid = "rgba(199,206,209,0.08)";
    chart.current?.destroy();
    chart.current = new Chart(ctx, {
      type,
      data: {
        labels,
        datasets: isRound
          ? [
              {
                data: a,
                backgroundColor: ["#FF6B47", "#ff8d70", "#C7CED1", "#8e989d", "#454F54", "#2a3034"],
                borderColor: "#171A1C",
                borderWidth: 4,
                hoverOffset: 18,
              },
            ]
          : [
              {
                label: "Experience",
                data: a,
                backgroundColor: type === "line" || type === "radar" ? grad : "#FF6B47",
                borderColor: "#FF6B47",
                borderWidth: 2,
                fill: true,
                tension: 0.42,
                borderRadius: 10,
                pointBackgroundColor: "#FF6B47",
                pointRadius: 4,
              },
              {
                label: "Baseline",
                data: b,
                backgroundColor: type === "bar" ? "#454F54" : "rgba(199,206,209,0.08)",
                borderColor: "#C7CED1",
                borderWidth: 1.5,
                fill: type === "radar",
                tension: 0.42,
                borderRadius: 10,
                pointRadius: 3,
                pointBackgroundColor: "#C7CED1",
              },
            ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: paused ? false : { duration: 1200, easing: "easeOutQuart" },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: "#F1F2F3", titleColor: "#171A1C", bodyColor: "#171A1C", padding: 12, cornerRadius: 10 },
        },
        cutout: isRound ? "62%" : undefined,
        scales:
          type === "radar"
            ? { r: { grid: { color: grid }, angleLines: { color: grid }, pointLabels: { color: "#C7CED1", font: { family: "var(--font-mono)" } }, ticks: { display: false } } }
            : isRound
              ? {}
              : {
                  x: { grid: { display: false }, ticks: { color: "#8e989d" }, border: { display: false } },
                  y: { grid: { color: grid }, ticks: { color: "#8e989d" }, border: { display: false } },
                },
      } as never,
    });
    return () => {
      chart.current?.destroy();
      chart.current = null;
    };
  }, [type, paused]);

  return (
    <div className="lab lab--chart">
      <div className="c-wrap">
        <canvas ref={canvas} aria-label={`Sample data shown as a ${type} chart`} role="img" />
      </div>
      <div className="lab__control lab__control--seg" role="group" aria-label="Chart type">
        <span className="mono">Chart</span>
        {TYPES.map((t) => (
          <button key={t.id} type="button" className={`seg ${type === t.id ? "is-on" : ""}`} onClick={() => setType(t.id)} aria-pressed={type === t.id}>
            {type === t.id && <span className="seg__bg" />}
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
