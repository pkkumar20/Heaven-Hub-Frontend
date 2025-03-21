import React, { useState } from 'react';
import './App.css';
import { useNavigate } from "react-router-dom";
export default function Footer() {
    const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
    return (
      <footer class="h-5 z-10  rounded-lg  border-t dark:bg-gray-900 ">
        <div class="w-full bg-[#f8f9fa] max-w-screen-3xl mx-auto p-4 md:py-8">
          <div class="sm:flex  sm:items-center sm:justify-between">
            <a
              onClick={() => navigate("/")}
              class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse cursor-pointer"
            >
              <img src="/heaven.png" className="h-14 w-36" alt="Logo" />
            </a>
            <ul class="flex flex-wrap items-center  text-lg font-large text-gray-800 sm:mb-0 dark:text-gray-400 cursor-pointer">
              <li>
                <a
                  onClick={() => navigate("/about-us")}
                  class="hover:underline me-4 md:me-6"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  onClick={() => navigate("/privacy-policy")}
                  class="hover:underline me-4 md:me-6 cursor-pointer"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  onClick={() => navigate("/contact-us")}
                  className="hover:underline"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <hr class="my-6 border-gray-400 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span class="block text-lg text-gray-800 sm:text-center dark:text-gray-400">
            © 2025-2026{" "}
            <a
              onClick={() => navigate("/")}
              class="hover:underline cursor-pointer"
            >
              Heaven-Hub™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    );
}
