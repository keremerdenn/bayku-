"use client";

import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const LineChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
          datasets: [
            {
              label: "TYT Net",
              data: [75, 78, 82, 80, 85, 88, 92],
              borderColor: "#0ea5e9",
              backgroundColor: "rgba(14, 165, 233, 0.1)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "AYT Net",
              data: [55, 54, 60, 62, 65, 63, 68],
              borderColor: "#10b981",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { color: "#334155" },
            },
          },
          scales: {
            x: { ticks: { color: "#64748b" } },
            y: { ticks: { color: "#64748b" } },
          },
        },
      });
    }
    return () => {
      chartInstance.current?.destroy();
    };
  }, []);

  return <canvas ref={chartRef} className="w-full h-full" />;
};

export default LineChart; 