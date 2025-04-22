import React from "react";
import { toast } from "react-toastify";

const ConfigPage = () => {
  const handleClearStorage = () => {
    localStorage.clear();
    toast.success("Local Storage limpiado correctamente ✅");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Configuración del Sistema</h2>
      <button
        onClick={handleClearStorage}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Limpiar almacenamiento local
      </button>
    </div>
  );
};

export default ConfigPage;
