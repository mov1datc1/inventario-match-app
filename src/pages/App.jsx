import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UploadPage from "./UploadPage";
import ComparisonPage from "./ComparisonPage";
import InventoryCleanPage from "./InventoryCleanPage";
import DashboardPage from "./DashboardPage";
import ConfigPage from "./ConfigPage";

const App = () => {
  const [masterData, setMasterData] = useState([]);
  const [erpData, setErpData] = useState([]);

  // Leer datos desde localStorage al iniciar
  useEffect(() => {
    const savedMaster = localStorage.getItem("masterData");
    const savedErp = localStorage.getItem("erpData");
    if (savedMaster) setMasterData(JSON.parse(savedMaster));
    if (savedErp) setErpData(JSON.parse(savedErp));
  }, []);

  // Guardar automáticamente en localStorage al subir archivos
  const handleUpload = (data, filename) => {
    try {
      const parsed = JSON.parse(JSON.stringify(data));
      if (filename.toLowerCase().includes("erp")) {
        setErpData(parsed);
        localStorage.setItem("erpData", JSON.stringify(parsed));
      } else {
        setMasterData(parsed);
        localStorage.setItem("masterData", JSON.stringify(parsed));
      }
    } catch (error) {
      console.error("Error procesando archivo:", error);
    }
  };

  const isEmpty = masterData.length === 0 || erpData.length === 0;

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 w-full p-6">
        <Routes>
          <Route
            path="/"
            element={
              isEmpty ? (
                <div className="text-center mt-20">
                  <h1 className="text-3xl font-bold text-gray-700 mb-4">👋 Bienvenido</h1>
                  <p className="text-gray-600 text-lg">
                    Aún no has subido archivos. Por favor, dirígete a{" "}
                    <span className="font-semibold text-green-600">“Subir Archivos”</span> y carga
                    tanto el archivo Maestro como el archivo ERP.
                  </p>
                </div>
              ) : (
                <h1 className="text-3xl font-bold text-green-600">Inventario Match App</h1>
              )
            }
          />
          <Route path="/upload" element={<UploadPage onUpload={handleUpload} />} />
          <Route path="/comparison" element={<ComparisonPage masterData={masterData} erpData={erpData} />} />
          <Route path="/clean" element={<InventoryCleanPage masterData={masterData} erpData={erpData} />} />
          <Route path="/dashboard" element={<DashboardPage masterData={masterData} erpData={erpData} />} />
          <Route path="/config" element={<ConfigPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

