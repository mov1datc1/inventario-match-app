import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const ComparisonPage = ({ masterData = [], erpData = [] }) => {
  const [search, setSearch] = useState("");

  const generateTable = () => {
    return masterData.map((item) => {
      const erpMatch = erpData.find((e) => e.SKU === item.SKU);
      const maestroQty = Number(item["PIEZAS PRODUCIDAS"]);
      const erpQty = erpMatch ? Number(erpMatch["Total"]) : null;
      const diferencia = erpQty !== null ? maestroQty - erpQty : null;
      const hayDiferencia = erpQty === null || diferencia !== 0;

      return {
        SKU: item.SKU,
        Maestro: maestroQty,
        ERP: erpQty !== null ? erpQty : "No encontrado",
        Diferencia: hayDiferencia ? "❌" : "✔️",
        "Diferencia Numérica": erpQty === null ? "N/A" : diferencia,
        rowHighlight: hayDiferencia,
      };
    });
  };

  const allData = generateTable();
  const filteredData = allData.filter((row) =>
    row.SKU.toLowerCase().includes(search.toLowerCase())
  );

  const exportToExcel = () => {
    const sheetData = filteredData.map(({ rowHighlight, ...rest }) => rest);
    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Comparación");
    XLSX.writeFile(wb, "Comparacion_Inventarios.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = filteredData.map((row) => [
      row.SKU,
      row.Maestro,
      row.ERP,
      row.Diferencia,
      row["Diferencia Numérica"],
    ]);

    autoTable(doc, {
      head: [["SKU", "Maestro", "ERP", "✔ / ❌", "Diferencia Numérica"]],
      body: tableData,
    });

    doc.save("Comparacion_Inventarios.pdf");
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-lg font-bold">Comparación de Inventarios</h2>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Buscar SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          />
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Exportar Excel
          </button>
          <button
            onClick={exportToPDF}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Exportar PDF
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-2">
        Mostrando <span className="font-semibold">{filteredData.length}</span> de{" "}
        <span className="font-semibold">{allData.length}</span> SKUs totales.
      </p>

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">SKU</th>
            <th className="border px-2 py-1">Maestro (PIEZAS PRODUCIDAS)</th>
            <th className="border px-2 py-1">ERP (Total)</th>
            <th className="border px-2 py-1">✔ / ❌</th>
            <th className="border px-2 py-1">Diferencia Numérica</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index} className={row.rowHighlight ? "bg-orange-100" : "bg-white"}>
              <td className="border px-2 py-1">{row.SKU}</td>
              <td className="border px-2 py-1">{row.Maestro}</td>
              <td className="border px-2 py-1">{row.ERP}</td>
              <td className="border px-2 py-1 text-center">{row.Diferencia}</td>
              <td className="border px-2 py-1 text-center">{row["Diferencia Numérica"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonPage;


