import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "./Loader";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useAuth } from './Auth';
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing icons
import EmailPopup from "./EmailPopup"
export default function FormComponent() {
    const { login, isAuthenticated, loading } = useAuth();
  
  // file select
const navigate = useNavigate(); 
const location = useLocation();
const redirectUrl = sessionStorage.getItem("redirectUrl") ;
    const [otpPopUp, setOtpPopUp] = useState(false);
      const [emailloading, setEmailLoading] = useState(false);
  const [loaDing, setLoading] = useState(false);
  const [touched, setTouched] = useState(false); // Track if user has touched the
  // form
  const [showPassword, setShowPassword] = useState(false);
  const [userDetails, setuserDetails] = useState({
    email: "",
    password: "",
  });
  const [validity, setValidity] = useState({
    email: null,
    password: null,
  });
  const [messages, setMessages] = useState({
    email: "",
    password: "",
  });
let token= null;
  // validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Please enter a valid email address"
      ),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one symbol"
      )
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter"),
  });
  const pendingFavorite = sessionStorage.getItem("pendingFavorite");
  const pendingReview = sessionStorage.getItem("pendingReview");
  const handleInputsChange = (event) => {
    const { name, value } = event.target;
    setuserDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setMessages((prev) => ({ ...prev, [name]: "" }));
  };
  // Validate a single field
  let isValid = true;
  let message;
  const validateField = async (fieldName, value) => {
    try {
      // Validate the specific field
      await validationSchema.validateAt(fieldName, { [fieldName]: value });

    } catch (error) {
      // Log error message
      isValid = false;
      let data = error.message;
      message = data;
    }
    setValidity((prev) => ({ ...prev, [fieldName]: isValid }));
    setMessages((prev) => ({ ...prev, [fieldName]: message }));
  };
  const handleInputBlur = (event) => {
    // Validation function
    const { name, value } = event.target;

    validateField(name, value);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    let isFormValid = false;
    // setTouched(true);
    await Object.keys(userDetails).forEach(async (field) => {
      try {
        await validationSchema.validate(userDetails, { abortEarly: false });
        setValidity((prev) => ({ ...prev, [field]: true }));
        isFormValid = true;
      } catch (err) {
        isFormValid = false;
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        if (typeof validationErrors[field] === "undefined") {
          delete validationErrors[field];
          let message = "Looks Good";
          setValidity((prev) => ({ ...prev, [field]: true }));
          setMessages((prev) => ({
            ...prev,
            [field]: message,
          })
        );
        } else {
          toast.error(validationErrors[field]);
          isFormValid = false;
          setValidity((prev) => ({ ...prev, [field]: false }));
          setMessages((prev) => ({
            ...prev,
            [field]: validationErrors[field],
          }));
        }
      }
    });
    if (isFormValid === true) {
      setLoading(true)

 try {
   const data = await login({
     username: userDetails.email,
     password: userDetails.password,
   });
   if (!data.success){
     setLoading(false);
     toast.error(data.data.data.message);
     if(data.data.status==400){
      setOtpPopUp(true);
     }
   }else{
  if (redirectUrl !== null) {
    navigate(redirectUrl);
    sessionStorage.removeItem("redirectUrl");
  } else {
    navigate("/dashboard");
  }
  toast.success("Logged in sucessfully");
   }
   
 } catch (error) {
   console.error(
     "Login Failed:",
     error.response?.data?.message || error.message
   );
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
  return (
    <>
      <div className="py-8 px-2 mt-5 mx-auto max-w-xl">
        <h1 className="text-4xl my-4 font-bold">Login To Heaven Hub</h1>

        <form onSubmit={handleSubmit}>
          {/* email Input */}
          <div className="relative  my-10">
            <input
              type="email"
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
              className={`mt-[-25px] text-sm mb-4 ${
                validity.email ? "text-green-500" : "text-red-500"
              }`}
            >
              {messages.email}
            </p>
          )}
          {/* password Input */}
          <div className="relative my-10">
            <input
              type={showPassword ? "text" : "password"}
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
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={`absolute ${
                getIcon("password") ? "right-9" : "right-3"
              } top-3 text-gray-500 hover:text-blue-500 focus:outline-none`}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
            {getIcon("password")}
            <p
              className={`mt-4 text-sm  ${
                validity.password ? "text-green-500" : "text-red-500"
              }`}
            >
              {messages.password}
            </p>
            <p className="text-right">
              <a
                onClick={() => navigate("/forget-password")}
                className="cursor-pointer "
              >
                Forget Password
              </a>
            </p>
          </div>
          <Button />
        </form>
        <p>
          Dont have account .{" "}
          <a
            onClick={() => navigate("/signup")}
            className="text-blue-900 cursor-pointer hover:underline"
          >
            Click here!
          </a>
        </p>
        {otpPopUp && (
          <EmailPopup
            email={userDetails.email}
            token={token}
            loadingData={emailloading}
          />
        )}
        {loaDing && <Loader />}
      </div>
    </>
  );
}


const Button = () => {
  return (
    <StyledWrapper>
      <button className="Btn">
        <div className="sign"><svg viewBox="0 0 512 512"><path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" /></svg></div>
        <div className="text">Login</div>
      </button>
    </StyledWrapper>
  );
}

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
    transition-duration: .3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background-color: black;
  }

  /* plus sign */
  .sign {
    width: 100%;
    transition-duration: .3s;
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
    transition-duration: .3s;
  }
  /* hover effect on button width */
  .Btn:hover {
    width: 125px;
    border-radius: 40px;
    transition-duration: .3s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: .3s;
    padding-left: 20px;
  }
  /* hover effect button's text */
  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: .3s;
    padding-right: 10px;
  }
  /* button click effect*/
  .Btn:active {
    transform: translate(2px ,2px);
  }`;


