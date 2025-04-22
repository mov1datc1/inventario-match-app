import React, { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

const UploadPage = ({ onUpload }) => {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState(""); // ERP o Maestro
  const [previewData, setPreviewData] = useState([]);
  const [rawData, setRawData] = useState(null);

  const detectFileType = (name = "") => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes("erp")) return "ERP";
    if (nameLower.includes("maestro") || nameLower.includes("costos")) return "Maestro";
    return "Desconocido";
  };

  const validateColumns = (type, headers) => {
    const requiredERP = ["SKU", "Total"];
    const requiredMaestro = ["SKU", "PIEZAS PRODUCIDAS"];

    const required = type === "ERP" ? requiredERP : type === "Maestro" ? requiredMaestro : [];

    const missing = required.filter((col) => !headers.includes(col));
    return missing;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const detectedType = detectFileType(file.name);
    setFileName(file.name);
    setFileType(detectedType);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        if (!json.length) {
          toast.error("El archivo está vacío o no tiene datos válidos.");
          return;
        }

        const headers = Object.keys(json[0]);
        const missing = validateColumns(detectedType, headers);

        if (missing.length > 0) {
          toast.error(`❌ Faltan columnas obligatorias para ${detectedType}: ${missing.join(", ")}`);
          setPreviewData([]);
          setRawData(null);
          return;
        }

        setPreviewData(json.slice(0, 10));
        setRawData({ data: json, name: file.name });
        toast.success(`✅ Vista previa lista. Tipo detectado: ${detectedType}`);
      } catch (error) {
        console.error(error);
        toast.error("❌ Error al procesar el archivo.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleConfirmUpload = () => {
    if (rawData) {
      onUpload(rawData.data, rawData.name);
      toast.success("✅ Datos cargados al sistema.");
      setPreviewData([]);
      setRawData(null);
      setFileName("");
      setFileType("");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Subir archivo Excel o CSV</h2>
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
        className="mb-4"
      />
      {fileName && (
        <div className="mb-2 text-sm text-gray-700">
          Archivo: <span className="font-semibold">{fileName}</span>
          <span className={`ml-4 px-2 py-1 rounded text-white ${fileType === "ERP" ? "bg-blue-600" : fileType === "Maestro" ? "bg-green-600" : "bg-gray-500"}`}>
            {fileType}
          </span>
        </div>
      )}

      {previewData.length > 0 && (
        <>
          <h3 className="text-md font-semibold mb-2">Vista previa (primeros 10 registros):</h3>
          <div className="overflow-auto border rounded mb-4">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  {Object.keys(previewData[0]).map((key) => (
                    <th key={key} className="border px-2 py-1 text-left">
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="border px-2 py-1">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            onClick={handleConfirmUpload}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Cargar Datos
          </button>
        </>
      )}
    </div>
  );
};

export default UploadPage;

