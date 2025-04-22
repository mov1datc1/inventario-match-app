import React, { useState } from "react";
import * as XLSX from "xlsx";

const InventoryCleanPage = ({ masterData, erpData }) => {
  const [search, setSearch] = useState("");

  const processed = masterData.map((item) => {
    const sku = item.SKU;
    const match = erpData.find((e) => e.SKU === sku);

    const maestroQty = Number(item["PIEZAS PRODUCIDAS"]) || 0;
    const piezasBolsa = Number(item["Piezas por Bolsa"]) || 0;
    const bolsas = Number(item["Bolsas"]) || 0;

    const DF = match?.DF || 0;
    const MTY = match?.MTY || 0;
    const GDL = match?.GDL || 0;
    const QRO = match?.QRO || 0;
    const totalErp = match?.Total !== undefined ? Number(match.Total) : 0;
    const enTransito = match?.["EnTransito"] || 0;

    return {
      SKU: sku,
      Maestro: maestroQty,
      "Piezas por Bolsa": piezasBolsa,
      Bolsas: bolsas,
      DF,
      MTY,
      GDL,
      QRO,
      "ERP (Total)": totalErp,
      "En Tránsito": enTransito,
      Final: totalErp + enTransito,
      Diferencia: maestroQty !== totalErp,
    };
  });

  const filtered = processed.filter((row) =>
    row.SKU.toLowerCase().includes(search.toLowerCase())
  );

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventario Limpio");
    XLSX.writeFile(wb, "Inventario_Limpio.xlsx");
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <h2 className="text-lg font-bold">Inventario Limpio</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-2 py-1 border rounded text-sm"
          />
          <button
            onClick={exportExcel}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Exportar Excel
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-1">
        Mostrando <span className="font-semibold">{filtered.length}</span> de{" "}
        <span className="font-semibold">{processed.length}</span> SKUs totales.
      </p>
      <p className="text-sm text-red-600 font-semibold mb-4">
        📦 {filtered.filter((row) => row.Diferencia).length} SKUs con diferencias detectadas
      </p>

      <div className="overflow-auto border rounded">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              {[
                "SKU",
                "Maestro",
                "Piezas por Bolsa",
                "Bolsas",
                "DF",
                "MTY",
                "GDL",
                "QRO",
                "ERP (Total)",
                "En Tránsito",
                "Final",
              ].map((col) => (
                <th key={col} className="border p-1 whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className={row.Diferencia ? "bg-red-100" : ""}>
                <td className="border p-1">{row.SKU}</td>
                <td className="border p-1">{row.Maestro}</td>
                <td className="border p-1">{row["Piezas por Bolsa"]}</td>
                <td className="border p-1">{row.Bolsas}</td>
                <td className="border p-1">{row.DF}</td>
                <td className="border p-1">{row.MTY}</td>
                <td className="border p-1">{row.GDL}</td>
                <td className="border p-1">{row.QRO}</td>
                <td className="border p-1">{row["ERP (Total)"]}</td>
                <td className="border p-1">{row["En Tránsito"]}</td>
                <td className="border p-1">{row.Final}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryCleanPage;

