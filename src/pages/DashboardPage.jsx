import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = ({ masterData = [], erpData = [] }) => {
  const total = masterData.length;

  const correct = masterData.filter((item) =>
    erpData.find(
      (e) => e.SKU === item.SKU && Number(e.Total) === Number(item["PIEZAS PRODUCIDAS"])
    )
  ).length;

  const withDiff = total - correct;
  const inTransit = erpData.filter((e) => Number(e.EnTransito || 0) > 0).length;

  const barData = {
    labels: ["Correctos", "Con diferencias", "En tránsito"],
    datasets: [
      {
        label: "SKUs",
        data: [correct, withDiff, inTransit],
        backgroundColor: ["#22c55e", "#ef4444", "#facc15"],
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: ["Correctos", "Con diferencias"],
    datasets: [
      {
        data: [correct, withDiff],
        backgroundColor: ["#3b82f6", "#ef4444"],
        borderWidth: 2,
      },
    ],
  };

  // Gráfico de distribución por almacén
  const almacenes = ["DF", "MTY", "GDL", "QRO"];
  const almacenData = almacenes.map(
    (key) => erpData.reduce((acc, curr) => acc + Number(curr[key] || 0), 0)
  );

  const almacenesBarData = {
    labels: almacenes,
    datasets: [
      {
        label: "Cantidad por Almacén",
        data: almacenData,
        backgroundColor: ["#10b981", "#6366f1", "#f59e0b", "#ec4899"],
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-md font-semibold mb-3 text-gray-700">📊 Resumen por Estado</h3>
        <div style={{ height: "300px" }}>
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-md font-semibold mb-3 text-gray-700">🥧 Distribución de SKUs</h3>
        <div style={{ height: "300px" }}>
          <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 bg-white p-4 shadow rounded">
        <h3 className="text-md font-semibold mb-3 text-gray-700">🏬 Distribución por Almacén</h3>
        <div style={{ height: "300px" }}>
          <Bar
            data={almacenesBarData}
            options={{
              indexAxis: "y",
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

