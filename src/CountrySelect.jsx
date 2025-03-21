import React, { useState, useEffect, useRef } from "react";

const CountrySelect = ({ data, field, selected }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);

selected(selectedOption);
  const dropdownRef = useRef(null);

  const filteredOptions = data.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine validation status
  const isValid = touched && !!selectedOption; // Valid if touched and has a selected option
  const isInvalid = touched && !selectedOption; // Invalid if touched and no option is selected

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSelectChangeOption = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative  lg:my-0 mb-[1.50rem] mt-[1.50rem]">
      <div ref={dropdownRef}>
        {/* Dropdown Button */}
        <button
          type="button"
          onClick={toggleDropdown}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setTouched(true); // Mark as touched when losing focus
          }}
          className={`w-full h-[3rem] bg-transparent border rounded-md px-2 outline-none transition duration-300
            ${
              focused
                ? "border-blue-600"
                : isValid
                ? "border-green-500"
                : isInvalid
                ? "border-red-500"
                : "border-gray-400"
            }`}
        >
          <span
            className={`text-left w-full  text-sm ${
              selectedOption
                ? isValid
                  ? "text-green-500"
                  : "text-red-500"
                : focused
                ? "text-gray-400"
                : isInvalid
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            {selectedOption ? selectedOption.name : ""}
          </span>
        </button>

        {/* Floating Label */}
        <label
          className={`absolute left-2 text-sm bg-white px-1 transition-all duration-300 
            ${
              focused || selectedOption
                ? "-top-2.5 scale-90"
                : "top-2.5 text-gray-500"
            }
            ${
              isValid
                ? "text-green-500"
                : isInvalid
                ? "text-red-500"
                : "text-gray-500"
            }`}
          style={{ pointerEvents: "none" }}
        >
          {field}
        </label>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-400 rounded-md shadow-lg">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 px-2 text-gray-600 bg-transparent border-b border-gray-400 outline-none transition duration-300 focus:border-blue-600"
            />
            <ul className="max-h-48 overflow-y-auto">
              {filteredOptions.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleSelectChangeOption(option)}
                  className={`flex justify-between items-center px-3 py-2 cursor-pointer text-sm
                    ${
                      selectedOption?.id === option.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600"
                    }
                  hover:bg-blue-50`}
                >
                  {option.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Validation Message */}
      {touched && (
        <p
          className={`mt-2 mb-2 text-sm ${
            isValid ? "text-green-500" : isInvalid ? "text-red-500" : ""
          }`}
        >
          {isValid
            ? "Selection is valid!"
            : `Please select a ${field} to proceed.`}
        </p>
      )}
    </div>
  );
};

export default CountrySelect;
