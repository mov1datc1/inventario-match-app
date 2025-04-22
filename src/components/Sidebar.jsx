import React from "react";
import { Link } from "react-router-dom";
import { FaUpload, FaBalanceScale, FaBroom, FaClipboardList, FaCog } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-60 h-screen bg-gray-800 text-white fixed top-0 left-0 p-4 flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-6">SIMEX Inventario</h2>
      <Link to="/upload" className="hover:bg-gray-700 p-2 rounded flex items-center gap-2">
        <FaUpload /> Subir Archivos
      </Link>
      <Link to="/comparison" className="hover:bg-gray-700 p-2 rounded flex items-center gap-2">
        <FaBalanceScale /> Comparar Inventario
      </Link>
      <Link to="/clean" className="hover:bg-gray-700 p-2 rounded flex items-center gap-2">
        <FaBroom /> Inventario Ventas
      </Link>
      <Link to="/dashboard" className="hover:bg-gray-700 p-2 rounded flex items-center gap-2">
        <FaClipboardList /> Dashboard
      </Link>
      <Link to="/config" className="hover:bg-gray-700 p-2 rounded flex items-center gap-2 mt-8 border-t pt-4 border-gray-600">
        <FaCog /> Configuración
      </Link>
    </div>
  );
};

export default Sidebar;
