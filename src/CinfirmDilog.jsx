import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import toast, { Toaster } from "react-hot-toast";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Auth";
import axios from "axios";
import { User } from "lucide-react";
export default function ConfirmDialogBox({ result, text }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, loading, refreshAuth } = useAuth();
  const serverUrl = import.meta.env.VITE_Server_Url;
  const accept = () => {
    result(true);
  };
  const reject = () => {
    toast.error("Action Canceled!", {
      duration: 3000,
      position: "top-center",
    });
    result(false);
  };

  const confirmAction = () => {
    confirmDialog({
      group: "headless",
      message: "Are you sure you want to proceed?",
      header: "Confirm Action",
      icon: "pi pi-exclamation-triangle",
      accept,
      reject,
    });
  };
  useEffect(() => {
    confirmAction();
  }, [User]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screenp-4">
      {/* React Hot Toast Notification */}
      <Toaster />
      <ConfirmDialog
        group="headless"
        content={({ headerRef, contentRef, footerRef, hide, message }) => (
          <div className="bg-white p-6 rounded-lg w-96 transition transform scale-100 hover:scale-105 duration-300">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full">
                <i className="pi pi-exclamation-circle text-3xl"></i>
              </div>
              <h2
                ref={headerRef}
                className="text-lg font-semibold text-gray-800 mt-4"
              >
                {message.header}
              </h2>
              <p ref={contentRef} className="text-gray-600 text-center mt-2">
                {message.message}
              </p>
              <div className="flex gap-4 mt-5 w-full">
                <button
                  onClick={(event) => {
                    hide(event);
                    accept();
                  }}
                  className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400 transition"
                >
                  Yes, Proceed
                </button>
                <button
                  onClick={(event) => {
                    hide(event);
                    reject();
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
