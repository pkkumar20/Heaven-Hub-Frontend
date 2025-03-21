import React, { useState, useEffect, useRef } from "react";

const CountrySelect = ({
  data,
  validity,
  message,
  onBlur,
  onChange,
  defaultValue,
  fieldName,
  labelName,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [focused, setFocused] = useState(false);

  const dropdownRef = useRef(null);
  useEffect(() => {
    setSelectedOption(defaultValue);
  });
  const filteredOptions = data.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleSelectChangeOption = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
    onChange(option); // Notify parent about selection
  };

  const handleBlur = (e) => {
    setFocused(false);
    onBlur(e.target.name, selectedOption); // Notify parent about blur
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
    <div className="relative lg:my-0 mb-[1.50rem] mt-[0rem]">
      <div ref={dropdownRef}>
        {/* Dropdown Button */}
        <button
          name={fieldName}
          type="button"
          onClick={toggleDropdown}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          className={`w-full h-[3rem] bg-transparent border rounded-md px-2 outline-none transition duration-300
            ${
              focused
                ? "border-blue-600"
                : validity === true
                ? "border-green-500"
                : validity === false
                ? "border-red-500"
                : "border-gray-400"
            }`}
        >
          <span
            className={`text-left w-full text-sm ${
              selectedOption
                ? validity === true
                  ? "text-green-500"
                  : validity === false
                  ? "text-red-500"
                  : "text-gray-600"
                : focused
                ? "text-gray-400"
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
              validity === true
                ? "text-green-500"
                : validity === false
                ? "text-red-500"
                : "text-gray-500"
            }`}
          style={{ pointerEvents: "none" }}
        >
          {labelName}
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
      {message && (
        <p
          className={`mt-1 text-sm mb-4  ${
            validity === true
              ? "text-green-500"
              : validity === false
              ? "text-red-500"
              : ""
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default CountrySelect;
