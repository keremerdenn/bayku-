"use client";

import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const DoughnutChart = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: "doughnut",
        data: {
          labels: ["Matematik", "Fizik", "Türkçe", "Kimya"],
          datasets: [
            {
              label: "Çözülen Soru Sayısı",
              data: [350, 250, 400, 150],
              backgroundColor: ["#0ea5e9", "#10b981", "#f59e0b", "#8b5cf6"],
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
        },
      });
    }
    return () => {
      chartInstance.current?.destroy();
    };
  }, []);

  return <canvas ref={chartRef} className="w-full h-full" />;
};

export default DoughnutChart; 