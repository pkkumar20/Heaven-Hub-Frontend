import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Auth";
import App from './App.jsx'
import './index.css'
import { Toaster } from "react-hot-toast";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster/>
    </AuthProvider>
  </BrowserRouter>
);
