import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Success/Error icons
import { Loader2 } from "lucide-react"; // Loading spinner
import { X } from "react-feather"; // Close button
import toast from "react-hot-toast";

const CustomToast = ({ id, status, message, imgSrc }) => {
  return (
    <div
      className={`relative flex items-center gap-3 p-4 rounded-lg shadow-lg border w-80 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700"`}
    >
      {/* Image Box / Loading Spinner */}
      <div className="w-12 h-12 flex items-center justify-center bg-white border rounded-md">
        {status === "loading" ? (
          <Loader2 className="animate-spin text-gray-500 w-6 h-6" />
        ) : (
          <img src={imgSrc} alt="toast-img" className="w-12 h-12 rounded-md" />
        )}
      </div>

      {/* Message & Icon */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {status === "loading" && (
            <Loader2 className="animate-spin w-5 h-5 text-gray-500" />
          )}
          {status === "success" && (
            <FaCheckCircle className="w-5 h-5 text-green-600" />
          )}
          {status === "error" && (
            <FaTimesCircle className="w-5 h-5 text-red-600" />
          )}
          <p className="text-gray-800 dark:text-gray-100">{message}</p>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => toast.remove(id)} // ✅ Fix: Instantly remove toast
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CustomToast;
