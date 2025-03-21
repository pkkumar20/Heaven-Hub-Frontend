import React, { useState, useRef, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import schema from "./schema";
import { useAuth } from "./Auth";
import toast from "react-hot-toast";
import country from "./country/countriesminified.json";
import state from "./country/statesminified.json";
import city from "./country/citiesminified.json";
import CountrySelect from "./Test3";
const options = [
  "Trending",
  "Dessert",
  "Top Cities",
  "Lake Front",
  "Outside City",
  "Inside City",
  "Tiny Homes",
  "Caves",
  "Camping",
  "Hut",
  "Pool",
  "villa",
  "Arctic",
  "castel",
  "Island",
  "Farm",
  "Mountain",
  "Rooms",
  "Luxery",
  "Beach",
  "Others",
];
export default function FormComponent() {
    const ServerUrl = import.meta.env.VITE_Server_Url;
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, addHometel } = useAuth();
  // country select
  const [countriesList, setCountriesList] = useState(country);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const [loading, setLoading] = useState(false);
  const maxFileSize = 800 * 1024; // 800 KB
  const validFileTypes = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/svg+xml",
  ];

  const validateFile = (file) => {
    if (!file) {
      return "File is required.";
    }
    if (!validFileTypes.includes(file.type)) {
      toast.error("Invalid file type. Only SVG, PNG, JPG, and GIF are allowed");
      return "Invalid file type. Only SVG, PNG, JPG, and GIF are allowed.";
    }
    if (file.size > maxFileSize) {
      return `File size exceeds the maximum allowed size of ${(
        maxFileSize / 1024
      ).toFixed(2)} KB.`;
    }
    return "";
  };

  // Handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const validationError = validateFile(file);
    setIsTouched(true);
    if (!validationError) {
      setSelectedFile(file);
      setError("");
      setSuccess(true);
    } else {
      setSelectedFile(null);
      setError(validationError);
      setSuccess(false);
      // onFileSelect(null);
    }
  };

  // Handle onBlur
  const handleBlur = () => {
    setIsTouched(true);
    if (!selectedFile) {
      setError("File is required.");
      setSuccess(false);
    }
  };
  // select js
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false); // Track if user has touched the input
  const dropdownRef = useRef(null);

  const isValid = selectedOptions.length > 0;

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    setSearchTerm("");
  };

  const handleSelectChangeOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((selected) => selected !== option)
        : [...prev, option]
    );
  };

  const removeChip = (optionToRemove) => {
    setSelectedOptions((prev) =>
      prev.filter((option) => option !== optionToRemove)
    );
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
      setFocused(false); // Lost focus
      setTouched(true); // Mark as touched when focus is lost
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLabelShrunk = dropdownOpen || selectedOptions.length > 0;

  const selectedPreview =
    selectedOptions.length > 2
      ? `${selectedOptions.slice(0, 2).join(", ")} +${
          selectedOptions.length - 2
        } more`
      : selectedOptions.join(", ");
  //  ends
  // form
  const [listingDetails, setListingDetails] = useState({
    title: "",
    description: "",
    streetAddress: "",
    price: "",
    country: null,
    state: null,
    city: null,
  });
  const [selectedNames, setSelectedNames] = useState([]);
  const [validity, setValidity] = useState({
    title: null,
    description: null,
    streetAddress: null,
    price: null,
    country: null,
    state: null,
    city: null,
  });

  const [messages, setMessages] = useState({
    title: "",
    description: "",
    streetAddress: "",
    price: "",
    country: "",
    state: "",
    city: "",
  });
  const handleCountrySelectChange = (option) => {
    setValidity((prev) => ({ ...prev, country: true }));
    setMessages((prev) => ({ ...prev, country: "Looks Good" }));
    let data = { id: option.id, name: option.name };
    setListingDetails((prevData) => ({
      ...prevData,
      country: data,
    })); // Update the selected country

    // Reset state validity and message
    setStatesList([])
    setListingDetails((prevData) => ({
      ...prevData,
      state: null,
    }));
    setValidity((prev) => ({ ...prev, state: null }));
    setMessages((prev) => ({ ...prev, state: "" }));
    let StatesData = state.find((state) => state.id == data.id);
    setStatesList(StatesData.states);
    // reset city
    setCitiesList([])
    setListingDetails((prevData) => ({
      ...prevData,
      city: null,
    }));
    setValidity((prev) => ({ ...prev, city: null }));
    setMessages((prev) => ({ ...prev, city: "" }));
  };
  const handleStateSelectChange = (option) => {
    setValidity((prev) => ({ ...prev, state: true }));
    setMessages((prev) => ({ ...prev, state: "Selection is valid!" }));
    let data = { id: option.id, name: option.name };
    setListingDetails((prevData) => ({
      ...prevData,
      state: data,
    })); // Update the selected state
    // reset city
    setCitiesList([])
    setListingDetails((prevData) => ({
      ...prevData,
      city: null,
    }));
    setValidity((prev) => ({ ...prev, city: null }));
    setMessages((prev) => ({ ...prev, city: "" }));

    // get city
    let StateData = city.find(
      (country) => country.id == listingDetails.country.id
    );
    let CityData = StateData.states.find((state) => state.id == option.id);
    setCitiesList(CityData.cities);
  };
  const handleCitySelectChange = (option) => {
    setValidity((prev) => ({ ...prev, city: true }));
    setMessages((prev) => ({ ...prev, city: "Selection is valid!" }));
    let data = { id: option.id, name: option.name };
    setListingDetails((prevData) => ({
      ...prevData,
      city: data,
    })); // Update the selected state
  };
  const handleblur = (name, option) => {
    if (option == null) {
      setValidity((prev) => ({ ...prev, [name]: false }));
      setMessages((prev) => ({
        ...prev,
        [name]: `${
          name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        } is requrid`,
      }));
    }
  };
  const handleSelectChange = (name) => {
    setSelectedNames(name);
  };
  const handleInputsChange = (event) => {
    const { name, value } = event.target;
    setListingDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setMessages((prev) => ({ ...prev, [name]: "" }));
  };
let message;
const handleInputBlur = async (event) => {
  const { name, value } = event.target;
  // Validate on blur for the specific field
  let fieldSchema;
  if (name === "title") fieldSchema = schema.extract("title");
  if (name === "description") fieldSchema = schema.extract("description");
  if (name === "price") fieldSchema = schema.extract("price");
  if (name === "country") fieldSchema = schema.extract("country");
  if (name === "state") fieldSchema = schema.extract("state");
  if (name === "city") fieldSchema = schema.extract("city");
  if (name === "streetAddress") fieldSchema = schema.extract("streetAddress");
  try {
    await fieldSchema.validateAsync(value);
    message = "Looks Good";
    setValidity((prev) => ({ ...prev, [name]: true }));
    setMessages((prev) => ({
      ...prev,
      [name]: message,
    }));
  } catch (err) {
    message = err.message;
    setValidity((prev) => ({ ...prev, [name]: false }));
    setMessages((prev) => ({
      ...prev,
      [name]: message,
    }));
  }
};
  // const handleInputBlur = (event) => {
  //   const { name, value } = event.target;
  //   let isValid = true;
  //   let message = "Looks good!";

  //   if (!value.trim()) {
  //     isValid = false;
  //     message = `${name[0].toUpperCase() + name.slice(1)} is required.`;
  //   } else if (name === "price" && value <= 0) {
  //     isValid = false;
  //     message = "Please add a valid price.";
  //   } else if (name === "streetAddress" && value <= 0) {
  //     isValid = false;
  //     message = "Street Address is requried";
  //   }
  //   setValidity((prev) => ({ ...prev, [name]: isValid }));
  //   setMessages((prev) => ({ ...prev, [name]: message }));
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsTouched(true); // Ensure errors are displayed even if it's the first interaction
    let isFormValid = true;
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setSuccess(false);
      isFormValid = false;
    } else {
      setError("");
      setSuccess(true);
      // Add your submission logic here
    }
    setTouched(true);
    if (isValid === false) {
      toast.error("Please Select at least one option.");
      isFormValid = false;
    }
    // ✅ Initialize validation states
    let newMessages = { ...messages };
    let newValidity = { ...validity };

    try {
      await schema.validateAsync(listingDetails, { abortEarly: false });

      // ✅ Mark all fields as valid if schema passes
      Object.keys(listingDetails).forEach((key) => {
        newMessages[key] = "Looks Good";
        newValidity[key] = true;
      });
    } catch (err) {
      isFormValid = false; // ❌ Mark form invalid if any errors occur
      err.details.forEach((error) => {
        newMessages[error.path[0]] = error.message;
        newValidity[error.path[0]] = false;
      });
    }
    // ✅ Validate required fields manually (Fixing trim() issue)
    const requiredFields = ["country", "state", "city", "streetAddress"];
    requiredFields.forEach((field) => {
      const value = listingDetails[field];

      if (!value || (typeof value === "string" && value.trim() === "")) {
        newMessages[field] = `${field} is required.`;
        newValidity[field] = false;
        isFormValid = false;
      }
    });

    // ✅ Update state before checking final formValid
    setMessages(newMessages);
    setValidity(newValidity);
    if (isFormValid) {
      setLoading(true);
      listingDetails.category = selectedOptions;
      // listingDetails.file = selectedFile;
      const Data = new FormData();
      Data.append("image", selectedFile); // Append the file
      Data.append("listing", JSON.stringify(listingDetails));
      // Add your form submission logic here
      const data = await addHometel({ image: selectedFile, listing: listingDetails });
      if (!data.success) { 
        setLoading(false);
         toast.error(data.data.data.message);
      } else {
        setLoading(false);
        navigate(data.data.data.redirectUrl);
        toast.success(data.data.data.message);
      }
    }
  };

  const getBorderClass = (field) => {
    if (validity[field] === null) return "border-gray-400";
    return validity[field] ? "border-green-500" : "border-red-500";
  };

  const getTextColorClass = (field) => {
    if (validity[field] === null) return "text-gray-500";
    return validity[field] ? "text-green-500" : "text-red-500";
  };

  const getLabelClass = (field) => {
    if (validity[field] === null) return "text-gray-500";
    return validity[field] ? "text-green-500" : "text-red-500";
  };

  const getIcon = (field) => {
    if (validity[field] === null) return null;
    return validity[field] ? (
      <FaCheckCircle className="text-green-500 absolute right-3 top-3" />
    ) : (
      <FaExclamationCircle className="text-red-500 absolute right-3 top-3" />
    );
  };
  const sucessIcon = () => {
    return <FaCheckCircle className="text-green-500 absolute right-3 top-3" />;
  };
  const failIcon = () => {
    return (
      <FaExclamationCircle className="text-red-500 absolute right-3 top-3" />
    );
  };
  // Determine border color
  const borderColor = error
    ? "border-red-500"
    : success
    ? "border-green-500"
    : "border-gray-400";
  return (
    <>
      <div className="py-8 px-2 mx-auto max-w-4xl">
        <h1 className="lg:text-4xl lg:my-5 my-3 text-3xl font-bold">
          Create a new hometel
        </h1>
        <form onSubmit={handleSubmit} className="my-6">
          {/* Title Input */}
          <div className="relative my-4">
            <input
              type="text"
              name="title"
              value={listingDetails.title}
              onChange={handleInputsChange}
              onBlur={handleInputBlur}
              className={`peer w-full h-12 placeholder-transparent bg-transparent border ${getBorderClass(
                "title"
              )} rounded-md px-2 pt-4 outline-none transition duration-300 focus:border-blue-500 ${getTextColorClass(
                "title"
              )}`}
              placeholder=" "
            />
            <label
              className={`absolute left-3 transition-all duration-300 transform bg-white px-1 ${getLabelClass(
                "title"
              )} 
            peer-placeholder-shown:top-3
            peer-placeholder-shown:text-base
            peer-focus:top-[-0.6rem]
            peer-focus:left-2
            peer-focus:text-sm
            ${
              listingDetails.title ? "top-[-0.6rem] text-sm" : "top-3 text-base"
            }
          `}
            >
              Title
            </label>
            {getIcon("title")}
          </div>
          {messages.title && (
            <p
              className={`mt-[-11px] text-sm mb-4 ${
                validity.title ? "text-green-500" : "text-red-500"
              }`}
            >
              {messages.title}
            </p>
          )}

          {/* Description Input */}
          <div className="relative my-4">
            <textarea
              name="description"
              value={listingDetails.description}
              onChange={handleInputsChange}
              onBlur={handleInputBlur}
              className={`peer w-full h-24 placeholder-transparent bg-transparent border ${getBorderClass(
                "description"
              )} rounded-md px-2 pt-4 outline-none transition duration-300 focus:border-blue-500 ${getTextColorClass(
                "description"
              )}`}
              placeholder=" "
            />
            <label
              className={`absolute left-3 transition-all duration-300 transform bg-white px-1 ${getLabelClass(
                "description"
              )}
            peer-placeholder-shown:top-3
            peer-placeholder-shown:text-base
            peer-focus:top-[-0.6rem]
            peer-focus:left-2
            peer-focus:text-sm
            ${
              listingDetails.description
                ? "top-[-0.6rem] text-sm"
                : "top-3 text-base"
            }
          `}
            >
              Description
            </label>
            {getIcon("description")}
          </div>
          {messages.description && (
            <p
              className={`mt-[-18px] text-sm mb-4 ${
                validity.description ? "text-green-500" : "text-red-500"
              }`}
            >
              {messages.description}
            </p>
          )}
          {/* Select Options */}
          <div className="relative">
            <div className="" ref={dropdownRef}>
              <button
                type="button"
                onClick={toggleDropdown}
                onFocus={() => setFocused(true)} // Mark as focused on focus
                onBlur={() => {
                  setFocused(false); // Blur event to indicate focus is lost
                  setTouched(true); // Mark as touched after losing focus
                }}
                className={`w-full h-[3rem] bg-gray-500 text-green-500 bg-transparent border rounded-md px-2 outline-none transition duration-300
            ${
              focused
                ? "border-2 border-blue-600"
                : touched
                ? isValid
                  ? "border-green-500"
                  : "border-red-500"
                : "border-gray-400"
            }`}
              >
                {selectedOptions.length > 0 ? selectedPreview : ""}
              </button>

              {/* Label */}
              <label
                className={`absolute left-2 bg-white text-md text-gray-500 px-1 transition-all duration-400 
            ${isLabelShrunk ? "-top-3 scale-75" : "top-2 text-gray-500"} 
            ${touched ? (isValid ? "text-green-500" : "text-red-500") : ""}`}
                style={{
                  pointerEvents: "none",
                  zIndex: 10,
                }}
              >
                Select Category
              </label>
              {touched && (isValid ? sucessIcon() : failIcon())}
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-400 rounded-md shadow-lg">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 px-2 text-gray-500 bg-transparent border-b border-gray-400 outline-none transition duration-300 focus:border-blue-600"
                  />
                  <ul className="max-h-48 overflow-y-auto">
                    {filteredOptions.map((option) => (
                      <li
                        key={option}
                        onClick={() => handleSelectChangeOption(option)}
                        className={`flex justify-between items-center px-3 py-2 cursor-pointer text-lg
                    ${
                      selectedOptions.includes(option)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-500"
                    }
                  hover:bg-blue-50`}
                      >
                        <span>{option}</span>
                        {selectedOptions.includes(option) && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {selectedOptions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedOptions.map((option) => (
                  <div
                    key={option}
                    className="inline-flex items-center px-3 py-1 text-xl font-medium bg-blue-100 text-blue-700 rounded-full"
                  >
                    {option}
                    <button
                      type="button"
                      onClick={() => removeChip(option)}
                      className="ml-2 text-blue-400 hover:text-blue-600 focus:outline-none"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Validation Message */}
            {touched && (
              <p
                className={`mt-1 mb-2 text-sm ${
                  isValid ? "text-green-500" : "text-red-500"
                }`}
              >
                {isValid
                  ? "Selection is valid!"
                  : "Please select at least one option."}
              </p>
            )}
          </div>
          {/* Price Input */}
          <div className="relative my-4">
            <input
              type="number"
              name="price"
              min={1}
              value={listingDetails.price}
              onChange={handleInputsChange}
              onBlur={handleInputBlur}
              className={`peer w-full h-12 placeholder-transparent bg-transparent border ${getBorderClass(
                "price"
              )} rounded-md px-2 pt-4 outline-none transition duration-300 focus:border-blue-500 ${getTextColorClass(
                "price"
              )}`}
              placeholder=" "
            />
            <label
              className={`absolute left-3 transition-all duration-300 transform bg-white px-1 ${getLabelClass(
                "price"
              )} 
      peer-placeholder-shown:top-3
      peer-placeholder-shown:text-base
      peer-focus:top-[-0.6rem]
      peer-focus:left-2
      peer-focus:text-sm
      ${listingDetails.price ? "top-[-0.6rem] text-sm" : "top-3 text-base"}
    `}
            >
              Price
            </label>
            {getIcon("price")}
            <p
              className={`mt-1 text-sm mb-4 ${
                validity.price ? "text-green-500" : "text-red-500"
              } `}
            >
              {messages.price}
            </p>
          </div>

          <div className="grid md:grid-cols-2 md:gap-6 sm:gap-6">
            <CountrySelect
              data={countriesList}
              validity={validity.country} // Pass country validity
              message={messages.country} // Pass country message
              onChange={handleCountrySelectChange} // Handle selection
              onBlur={handleblur} // Handle blur
              defaultValue={listingDetails.country}
              fieldName={"country"}
              labelName={"Country"}
            />
            {/* State  */}
            <CountrySelect
              data={statesList}
              validity={validity.state} // Pass country validity
              message={messages.state} // Pass country message
              onChange={handleStateSelectChange} // Handle selection
              onBlur={handleblur} // Handle blur
              defaultValue={listingDetails.state}
              fieldName={"state"}
              labelName={"State"}
            />
            {/* city  */}
            <CountrySelect
              data={citiesList}
              validity={validity.city} // Pass country validity
              message={messages.city} // Pass country message
              onChange={handleCitySelectChange} // Handle selection
              onBlur={handleblur} // Handle blur
              defaultValue={listingDetails.city}
              fieldName={"city"}
              labelName={"City"}
            />
            {/* streetAddress Input */}
            <div className="relative">
              <input
                type="text"
                name="streetAddress"
                value={listingDetails.streetAddress}
                onChange={handleInputsChange}
                onBlur={handleInputBlur}
                className={`peer w-full h-12 placeholder-transparent bg-transparent border ${getBorderClass(
                  "streetAddress"
                )} rounded-md px-2 pt-4 outline-none transition duration-300 focus:border-blue-500 ${getTextColorClass(
                  "streetAddress"
                )}`}
                placeholder=" "
              />
              <label
                className={`absolute left-3 transition-all duration-300 transform bg-white px-1 ${getLabelClass(
                  "streetAddress"
                )} 
            peer-placeholder-shown:top-3
            peer-placeholder-shown:text-base
            peer-focus:top-[-0.6rem]
            peer-focus:left-2
            peer-focus:text-sm
            ${
              listingDetails.streetAddress
                ? "top-[-0.6rem] text-sm"
                : "top-3 text-base"
            }
          `}
              >
                Street Address
              </label>
              {getIcon("streetAddress")}

              {messages.streetAddress && (
                <p
                  className={`mt-1 text-sm mb-4 ${
                    validity.streetAddress ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {messages.streetAddress}
                </p>
              )}
            </div>
          </div>
          {/* File  */}
          <div
            className={`flex items-center justify-center mt-4 mb-5 h-15 w-full`}
          >
            <label
              htmlFor="image"
              className={`flex flex-col items-center justify-center w-full h-64 border-[1px] ${borderColor}  rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800 KB)
                </p>
              </div>
              <input
                id="image"
                type="file"
                name="image"
                className="hidden"
                onChange={handleFileChange}
                onBlur={handleBlur}
              />
            </label>
          </div>
          {error && <p className="text-sm text-red-500 mb-2 ">{error}</p>}
          {selectedFile && success && (
            <p className="text-sm text-green-500 mt-2">
              File selected successfully!
            </p>
          )}
          {selectedFile && !error && (
            <div className="mt-3 mb-3 text-md text-green-500 dark:text-green-400">
              <h1>Selected File Details :</h1>
              <p>File: {selectedFile.name}</p>
              <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
              <p>Type: {selectedFile.type}</p>
            </div>
          )}
          <button
            type="submit"
            className="inline-flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
          >
            Submit
            <svg
              className="w-8 h-8 justify-end group-hover:rotate-50 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512.001 512.001"
            >
              <path
                style={{ fill: "#9BFCFF" }}
                d="M1.398,431.634l21.593-89.001c3.063-12.622,11.283-23.562,22.554-30.015l83.684-47.915c6.723-3.849,6.738-13.546,0-17.403l-83.685-47.915c-11.271-6.453-19.491-17.392-22.554-30.014L1.398,80.368C-7.908,42.012,30.961,9.702,66.967,25.834l416.96,186.83c37.455,16.782,37.407,69.913,0.001,86.675L66.967,486.168C30.933,502.312-7.892,469.921,1.398,431.634z"
              />
              <path
                style={{ fill: "#83C9FF" }}
                d="M483.927,212.665L256.011,110.541v290.923L483.929,299.34C521.334,282.578,521.383,229.446,483.927,212.665z"
              />
              <path
                style={{ fill: "#2586FD" }}
                d="M186.997,329.76c-4.231-9.44-0.006-20.523,9.434-24.752l109.37-49.006l-109.37-49.006c-9.44-4.229-13.665-15.312-9.434-24.752c4.229-9.44,15.309-13.666,24.752-9.434l147.519,66.1c14.727,6.598,14.739,27.583,0,34.186l-147.519,66.1C202.311,343.423,191.229,339.205,186.997,329.76z"
              />
              <path
                style={{ fill: "#3A4DE2" }}
                d="M359.268,238.908L256.01,192.64v41.05l49.791,22.311l-49.791,22.311v41.05l103.258-46.268C374.006,266.491,373.995,245.507,359.268,238.908z"
              />
            </svg>
          </button>
        </form>
      </div>
      {loading && <Loader />}
    </>
  );
}
