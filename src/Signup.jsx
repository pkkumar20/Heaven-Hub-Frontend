import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import { json, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import toast from "react-hot-toast";
import Joi, { object } from "joi";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing icons
import EmailPopup from "./EmailPopup";
import CountrySelect from "./Test3";
import { useAuth } from "./Auth";
import country from "./country/countriesminified.json";
import state from "./country/statesminified.json";
import city from "./country/citiesminified.json";
export default function FormComponent() {
      const { isAuthenticated } = useAuth();
    const ServerUrl = import.meta.env.VITE_Server_Url;
    const navigate = useNavigate();
  const schema = Joi.object({
    fullname: Joi.string().min(3).required().messages({
      "string.empty": "Full Name is required",
      "string.min": "Name must be at least 3 characters long",
    }),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
      }),
    phoneNumber: Joi.string()
      .pattern(/^\d{10}$/)
      .required()
      .messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Phone number must be 10 digits",
      }),
    gender: Joi.string().required().messages({
      "string.empty": "Gender is required",
    }),
    country: Joi.object().optional().allow(null, ""),
    state: Joi.object().optional().allow(null, ""),
    city: Joi.object().optional().allow(null, ""),
    streetAddress: Joi.string().min(4).required().messages({
      "string.empty": "Street address is required",
      "string.min": "Street address must be at least 4 characters long",
    }),
    password: Joi.string()
      .min(8)
      .pattern(/[A-Z]/)
      .pattern(/[0-9]/)
      .pattern(/[@$!%*?&]/)
      .required()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must include at least one uppercase letter, one number, and one special character",
      }),
    confirmPassword: Joi.string().required().messages({
      "string.empty": "Confirm Password is required",
    }),
  });
  // country select
  const [countriesList, setCountriesList] = useState(country);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  // file select
  const [loading, setLoading] = useState(false);
  const [emailloading, setEmailLoading] = useState(false);
  const [otpPopUp, setOtpPopUp] = useState(false);
  const [touched, setTouched] = useState(false); // Track if user has touched the
  // form
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userDetails, setuserDetails] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    gender: "",
    country: null,
    state: null,
    city: null,
    streetAddress: "",
    password: "",
    confirmPassword: "",
  });
  const [validity, setValidity] = useState({
    fullname: null,
    email: null,
    phoneNumber: null,
    gender: null,
    country: null,
    state: null,
    city: null,
    streetAddress: null,
    password: null,
    confirmPassword: null,
  });

  const [messages, setMessages] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    gender: "",
    country: "",
    state: "",
    city: "",
    streetAddress: "",
    password: "",
    confirmPassword: "",
  });
  const handleCountrySelectChange = (option) => {
    setValidity((prev) => ({ ...prev, country: true }));
    setMessages((prev) => ({ ...prev, country: "Looks Good" }));
    let data = { id: option.id, name: option.name };
    setuserDetails((prevData) => ({
      ...prevData,
      country: data,
    })); // Update the selected country

    // Reset state validity and message
    setuserDetails((prevData) => ({
      ...prevData,
      state: null,
    }));
    setValidity((prev) => ({ ...prev, state: null }));
    setMessages((prev) => ({ ...prev, state: "" }));
    let StatesData = state.find((state) => state.id == data.id);
    setStatesList(StatesData.states);
    // reset city
    setuserDetails((prevData) => ({
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
    setuserDetails((prevData) => ({
      ...prevData,
      state: data,
    })); // Update the selected state
    // reset city
    setuserDetails((prevData) => ({
      ...prevData,
      city: null,
    }));
    setValidity((prev) => ({ ...prev, city: null }));
    setMessages((prev) => ({ ...prev, city: "" }));
    // get city
    let StateData = city.find(
      (country) => country.id == userDetails.country.id
    );
    let CityData = StateData.states.find((state) => state.id == option.id);
    setCitiesList(CityData.cities);
  };
  const handleCitySelectChange = (option) => {
    setValidity((prev) => ({ ...prev, city: true }));
    setMessages((prev) => ({ ...prev, city: "Selection is valid!" }));
    let data = { id: option.id, name: option.name };
    setuserDetails((prevData) => ({
      ...prevData,
      city: data,
    })); // Update the selected state
  };
  const handleBlur = (name, option) => {
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
  const handleInputsChange = (event) => {
    const { name, value } = event.target;
    setuserDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setMessages((prev) => ({ ...prev, [name]: "" }));
    handleInputBlur(event);
  };
  let message;
  const handleInputBlur = async (event) => {
    const { name, value } = event.target;
    // Validate on blur for the specific field
    let fieldSchema;
    if (name === "fullname") fieldSchema = schema.extract("fullname");
    if (name === "email") fieldSchema = schema.extract("email");
    if (name === "phoneNumber") fieldSchema = schema.extract("phoneNumber");
    if (name === "gender") fieldSchema = schema.extract("gender");
    if (name === "country") fieldSchema = schema.extract("country");
    if (name === "state") fieldSchema = schema.extract("state");
    if (name === "city") fieldSchema = schema.extract("city");
    if (name === "streetAddress") fieldSchema = schema.extract("streetAddress");
    if (name === "password") fieldSchema = schema.extract("password");
    if (name === "confirmPassword")
      fieldSchema = schema.extract("confirmPassword");
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

    // Custom check for confirmPassword to ensure it matches the password
    if (name === "confirmPassword" && userDetails.password !== value) {
      message = "Passwords must match";
      setValidity((prev) => ({ ...prev, [name]: false }));
      setMessages((prev) => ({
        ...prev,
        [name]: message,
      }));
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    let isFormValid = true;
    let message = "";

    // Validate password & confirmPassword
    if (userDetails.confirmPassword !== userDetails.password) {
      message = "Passwords must match";
      setValidity((prev) => ({ ...prev, confirmPassword: false }));
      setMessages((prev) => ({ ...prev, confirmPassword: message }));
      isFormValid = false;
    } else {
      setValidity((prev) => ({ ...prev, confirmPassword: true }));
      setMessages((prev) => ({ ...prev, confirmPassword: "Looks Good" }));
    }

    // Validate using schema
    try {
      await schema.validateAsync(userDetails, { abortEarly: false });

      setMessages((prev) => ({
        ...prev,
        ...Object.keys(prev).reduce((acc, key) => {
          if (!prev[key] || prev[key] !== "Looks Good") {
            acc[key] = "Looks Good";
          }
          return acc;
        }, {}),
      }));

      setValidity((prev) => ({
        ...prev,
        ...Object.keys(prev).reduce((acc, key) => {
          if (!prev[key] || prev[key] !== true) {
            acc[key] = true;
          }
          return acc;
        }, {}),
      }));
    } catch (err) {
      isFormValid = false;
      const validationErrors = {};

      err.details.forEach((error) => {
        validationErrors[error.path[0]] = error.message;
      });

      setMessages((prev) => ({ ...prev, ...validationErrors }));
      setValidity((prev) => ({
        ...prev,
        ...Object.keys(validationErrors).reduce(
          (acc, key) => ({ ...acc, [key]: false }),
          {}
        ),
      }));
    }

    // Validate country, state, city
    const requiredFields = ["country", "state", "city"];
    let locationValid = true;
    const newMessages = {};
    const newValidity = {};

    requiredFields.forEach((field) => {
      if (!userDetails[field]) {
        newMessages[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required.`;
        newValidity[field] = false;
        locationValid = false;
      } else {
        newMessages[field] = "Looks Good";
        newValidity[field] = true;
      }
    });

    setMessages((prev) => ({ ...prev, ...newMessages }));
    setValidity((prev) => ({ ...prev, ...newValidity }));

    if (!locationValid) {
      isFormValid = false;
    }

    if (!isFormValid) return;

    // Prepare data for submission
    const newData = {
      fullname: userDetails.fullname,
      email: userDetails.email,
      phoneNumber: userDetails.phoneNumber,
      gender: userDetails.gender,
      country: userDetails.country,
      state: userDetails.state,
      city: userDetails.city,
      streetAddress: userDetails.streetAddress,
      password: userDetails.password,
    };
    const Data = new FormData();
    Data.append("userDetails", JSON.stringify(newData));
    setEmailLoading(true);
setOtpPopUp(true);
    try {
      const response = await axios.post(`${ServerUrl}/user/signup`, Data, {
        withCredentials: true,
        headers: { "content-type": "application/x-www-form-urlencoded" },
      });

      if (response.status === 200) {
        setEmailLoading(false);
        setToken(response.data.token);
        toast.success("OTP Sent successfully");
      } else {
        setOtpPopUp(false);
      }
    } catch (error) {
      console.log(error);
      setOtpPopUp(false);
      toast.error(error.response.data.message);
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
  return (
    <>
      <div className="lg:py-4 py-2 px-2 mx-auto max-w-2xl">
        <h1 className="lg:text-4xl lg:my-5 my-3 text-3xl font-bold">
          Sign Up On Heaven Hub
        </h1>
        <form
          onSubmit={handleSubmit}
          className="my-12"
          encType="application/x-www-form-urlencoded"
        >
          {/* fullname Input */}
          <div className="relative my-10">
            <input
              type="text"
              name="fullname"
              value={userDetails.fullname}
              onChange={handleInputsChange}
              onBlur={handleInputBlur}
              className={`peer w-full h-12 placeholder-transparent bg-transparent border ${getBorderClass(
                "fullname"
              )} rounded-md px-2 pt-4 outline-none transition duration-300 focus:border-blue-500 ${getTextColorClass(
                "fullname"
              )}`}
              placeholder=" "
            />
            <label
              className={`absolute left-3 transition-all duration-300 transform bg-white px-1 ${getLabelClass(
                "fullname"
              )} 
            peer-placeholder-shown:top-3
            peer-placeholder-shown:text-base
            peer-focus:top-[-0.6rem]
            peer-focus:left-2
            peer-focus:text-sm
            ${
              userDetails.fullname ? "top-[-0.6rem] text-sm" : "top-3 text-base"
            }
          `}
            >
              Full Name
            </label>
            {getIcon("fullname")}
          </div>
          {messages.fullname && (
            <p
              className={`mt-[-2rem] text-sm  ${
                validity.fullname ? "text-green-500" : "text-red-500"
              }`}
            >
              {messages.fullname}
            </p>
          )}
          {/* email Input */}
          <div className="relative my-10">
            <input
              name="email"
              value={userDetails.email}
              onChange={handleInputsChange}
              onBlur={handleInputBlur}
              className={`peer w-full h-12 placeholder-transparent bg-transparent border ${getBorderClass(
                "email"
              )} rounded-md px-2 pt-4 outline-none transition duration-300 focus:border-blue-500 ${getTextColorClass(
                "email"
              )}`}
              placeholder=" "
            />
            <label
              className={`absolute left-3 transition-all duration-300 transform bg-white px-1 ${getLabelClass(
                "email"
              )} 
            peer-placeholder-shown:top-3
            peer-placeholder-shown:text-base
            peer-focus:top-[-0.6rem]
            peer-focus:left-2
            peer-focus:text-sm
            ${userDetails.email ? "top-[-0.6rem] text-sm" : "top-3 text-base"}
          `}
            >
              Email
            </label>
            {getIcon("email")}
          </div>
          {messages.email && (
            <p
              className={`mt-[-2rem] text-sm  ${
                validity.email ? "text-green-500" : "text-red-500"
              }`}
            >
              {messages.email}
            </p>
          )}
          {/* phoneNumber Input */}
          <div className="relative my-10">
            <input
              type="tel"
              name="phoneNumber"
              value={userDetails.phoneNumber}
              onChange={handleInputsChange}
              onBlur={handleInputBlur}
              className={`peer w-full h-12 placeholder-transparent bg-transparent border ${getBorderClass(
                "phoneNumber"
              )} rounded-md px-2 pt-4 outline-none transition duration-300 focus:border-blue-500 ${getTextColorClass(
                "phoneNumber"
              )}`}
              placeholder=" "
            />
            <label
              className={`absolute left-3 transition-all duration-300 transform bg-white px-1 ${getLabelClass(
                "phoneNumber"
              )} 
            peer-placeholder-shown:top-3
            peer-placeholder-shown:text-base
            peer-focus:top-[-0.6rem]
            peer-focus:left-2
            peer-focus:text-sm
            ${
              userDetails.phoneNumber
                ? "top-[-0.6rem] text-sm"
                : "top-3 text-base"
            }
          `}
            >
              Phone Number
            </label>
            {getIcon("phoneNumber")}
          </div>
          {messages.phoneNumber && (
            <p
              className={`mt-[-2rem] text-sm  ${
                validity.phoneNumber ? "text-green-500" : "text-red-500"
              }`}
            >
              {messages.phoneNumber}
            </p>
          )}
          {/* Gender  */}
          <div className="relative my-10">
            <select
              name="gender"
              value={userDetails.gender}
              onChange={handleInputsChange}
              onBlur={handleInputBlur}
              className={`peer w-full h-12 bg-transparent border ${getBorderClass(
                "gender"
              )} rounded-md px-2 pt-4 pl-3 text-left outline-none transition duration-300 focus:border-blue-500 ${getTextColorClass(
                "gender"
              )} appearance-none`}
            >
              <option selected hidden value=""></option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <label
              className={`absolute left-3 transition-all duration-300 transform bg-white px-1 ${getLabelClass(
                "gender"
              )} 
    peer-placeholder-shown:top-3
    peer-placeholder-shown:text-base
    peer-focus:top-[-0.6rem]
    peer-focus:left-2
    peer-focus:text-sm
    ${userDetails.gender ? "top-[-0.6rem] text-sm" : "top-3 text-base"}
  `}
            >
              Gender
            </label>
            {getIcon("gender")}
          </div>
          {messages.gender && (
            <p
              className={`mt-[-2rem] text-sm mb-[2.50rem] ${
                validity.gender ? "text-green-500" : "text-red-500"
              }`}
            >
              {messages.gender}
            </p>
          )}

          <div className="grid md:grid-cols-2  md:gap-6 sm:gap-10">
            {/* country  */}
            <CountrySelect
              data={countriesList}
              validity={validity.country} // Pass country validity
              message={messages.country} // Pass country message
              onChange={handleCountrySelectChange} // Handle selection
              onBlur={handleBlur} // Handle blur
              defaultValue={userDetails.country}
              fieldName={"country"}
              labelName={"Country"}
            />
            {/* State  */}
            <CountrySelect
              data={statesList}
              validity={validity.state} // Pass country validity
              message={messages.state} // Pass country message
              onChange={handleStateSelectChange} // Handle selection
              onBlur={handleBlur} // Handle blur
              defaultValue={userDetails.state}
              fieldName={"state"}
              labelName={"State"}
            />
            {/* city  */}
            <CountrySelect
              data={citiesList}
              validity={validity.city} // Pass country validity
              message={messages.city} // Pass country message
              onChange={handleCitySelectChange} // Handle selection
              onBlur={handleBlur} // Handle blur
              defaultValue={userDetails.city}
              fieldName={"city"}
              labelName={"City"}
            />
            {/* Street address  */}
            <div className="relative lg:my-0 mb-[1.50rem] mt-[0rem]">
              <input
                type="text"
                name="streetAddress"
                value={userDetails.streetAddress}
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
              userDetails.streetAddress
                ? "top-[-0.6rem] text-sm"
                : "top-3 text-base"
            }
          `}
              >
                Street address
              </label>
              {getIcon("streetAddress")}

              {messages.streetAddress && (
                <p
                  className={`mt-[0.5rem] text-sm mb-4  ${
                    validity.streetAddress ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {messages.streetAddress}
                </p>
              )}
            </div>
            {/* password Input */}
            <div className="relative lg:my-0 mb-[1.50rem] mt-[0rem]">
              <input
                type="text"
                name="password"
                value={userDetails.password}
                onChange={handleInputsChange}
                onBlur={handleInputBlur}
                className={`peer w-full h-12 placeholder-transparent bg-transparent border ${getBorderClass(
                  "password"
                )} rounded-md px-2 pt-4 outline-none transition duration-300 focus:border-blue-500 ${getTextColorClass(
                  "password"
                )}`}
                placeholder=" "
              />
              <label
                className={`absolute left-3 transition-all duration-300 transform bg-white px-1 ${getLabelClass(
                  "password"
                )} 
      peer-placeholder-shown:top-3
      peer-placeholder-shown:text-base
      peer-focus:top-[-0.6rem]
      peer-focus:left-2
      peer-focus:text-sm
      ${userDetails.password ? "top-[-0.6rem] text-sm" : "top-3 text-base"}
    `}
              >
                Password
              </label>
              {getIcon("password")}
              <p
                className={`mt-[0.5rem] text-sm mb-4 ${
                  validity.password ? "text-green-500" : "text-red-500"
                }`}
              >
                {messages.password}
              </p>
            </div>

            {/* confirmPassword Input */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={userDetails.confirmPassword}
                onChange={handleInputsChange}
                onBlur={handleInputBlur}
                className={`peer w-full h-12 placeholder-transparent bg-transparent border ${getBorderClass(
                  "confirmPassword"
                )} rounded-md px-2 pt-4 outline-none transition duration-300 focus:border-blue-500 ${getTextColorClass(
                  "confirmPassword"
                )}`}
                placeholder=" "
              />
              <label
                className={`absolute left-3 transition-all duration-300 transform bg-white px-1 ${getLabelClass(
                  "confirmPassword"
                )} 
      peer-placeholder-shown:top-3
      peer-placeholder-shown:text-base
      peer-focus:top-[-0.6rem]
      peer-focus:left-2
      peer-focus:text-sm
      ${
        userDetails.confirmPassword
          ? "top-[-0.6rem] text-sm"
          : "top-3 text-base"
      }
    `}
              >
                Confirm Password
              </label>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className={`absolute ${
                  getIcon("confirmPassword") ? "right-9" : "right-3"
                } top-3 text-gray-500 hover:text-blue-500 focus:outline-none`}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
              {getIcon("confirmPassword")}
              <p
                className={`mt-[0.5rem] text-sm mb-4 ${
                  validity.confirmPassword ? "text-green-500" : "text-red-500"
                }`}
              >
                {messages.confirmPassword}
              </p>
            </div>
          </div>
          <div className="mt-2 mb-2">
            <Button />
          </div>

          <p>
            Have an account ?
            <a
              onClick={() => navigate("/login")}
              className="text-blue-900 cursor-pointer hover:underline"
            >
              Click here!
            </a>
          </p>
        </form>
        {otpPopUp && (
          <EmailPopup
            email={userDetails.email}
            token={token}
            loadingData={emailloading}
          />
        )}
        {loading && <Loader />}
      </div>
    </>
  );
}
const Button = () => {
  return (
    <StyledWrapper>
      <button className="Btn">
        <div className="sign">
          <svg viewBox="0 0 512 512">
            <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
          </svg>
        </div>
        <div className="text">SignUp</div>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .Btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background-color: black;
  }

  /* plus sign */
  .sign {
    width: 100%;
    transition-duration: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign svg {
    width: 17px;
  }

  .sign svg path {
    fill: white;
  }
  /* text */
  .text {
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: white;
    font-size: 1.2em;
    font-weight: 600;
    transition-duration: 0.3s;
  }
  /* hover effect on button width */
  .Btn:hover {
    width: 125px;
    border-radius: 40px;
    transition-duration: 0.3s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: 0.3s;
    padding-left: 20px;
  }
  /* hover effect button's text */
  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: 0.3s;
    padding-right: 10px;
  }
  /* button click effect*/
  .Btn:active {
    transform: translate(2px, 2px);
  }
`;


