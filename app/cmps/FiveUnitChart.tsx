"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";

Chart.register(CategoryScale);

export default function FiveUnitChart() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/calculate-five-unit-percentage");
        const data = await response.json();

        const labels = data.data.map((item: any) => item.school);
        const percentages = data.data.map((item: any) => item.percentage);

        setChartData({
          labels,
          datasets: [
            {
              label: "אחוז תלמידים שלומדים 5 יחידות",
              data: percentages,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h2>אחוז תלמידים שלומדים 5 יחידות מתמטיקה</h2>
      {chartData ? <Bar data={chartData} /> : <p>טוען נתונים...</p>}
    </div>
  );
}
