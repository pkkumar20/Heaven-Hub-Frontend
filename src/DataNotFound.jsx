import React from "react";
import { Link } from "react-router-dom";

function NotFound({ message }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-black px-4">
      <img
        src="/404.svg" // Replace with an actual image URL or asset
        alt="Not Found"
        className="w-64 mb-6"
      />
      <h2 className="text-2xl font-bold text-gray-700">{message}</h2>
      <p className="text-gray-500 mt-2">Try exploring other options.</p>
      <Link
        to="/"
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
