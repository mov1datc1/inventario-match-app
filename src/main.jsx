import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App.jsx";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <>
      <App />
      <ToastContainer />
    </>
  </BrowserRouter>
);
