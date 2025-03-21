import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "./ReservLoader";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useAuth } from "./Auth";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing icons
export default function FormComponent({email}) {
    const ServerUrl = import.meta.env.VITE_Server_Url;
  // file select
  const { resetPassword ,isAuthenticated,user} = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false); // Track if user has touched the
  // form
  const [showconfirmPassword, setShowconfirmPassword] = useState(false);
  const [userDetails, setuserDetails] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [validity, setValidity] = useState({
    newPassword: null,
    confirmPassword: null,
  });

  const [messages, setMessages] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  // validation schema
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required("New Password is required")
      .min(8, "New Password must be at least 8 characters")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "New Password must contain at least one symbol"
      )
      .matches(/[0-9]/, "New Password must contain at least one number")
      .matches(
        /[A-Z]/,
        "New Password must contain at least one uppercase letter"
      )
      .matches(
        /[a-z]/,
        "New Password must contain at least one lowercase letter"
      ),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .min(8, "Confirm Password must be at least 8 characters")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Confirm Password must contain at least one symbol"
      )
      .matches(/[0-9]/, "Confirm Password must contain at least one number")
      .matches(
        /[A-Z]/,
        "Confirm Password must contain at least one uppercase letter"
      )
      .matches(
        /[a-z]/,
        "Confirm Password must contain at least one lowercase letter"
      ),
  });
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
  const toggleconfirmPasswordVisibility = () => {
    setShowconfirmPassword(!showconfirmPassword);
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
            }));
          } else {
            isFormValid = false;
            setValidity((prev) => ({ ...prev, [field]: false }));
            setMessages((prev) => ({
              ...prev,
              [field]: validationErrors[field],
            }));
          }
      }
    });
    if (userDetails.confirmPassword !== userDetails.newPassword) {
      isFormValid = false;
      toast.error("Password Must Be Same");
      let message = "Password Must Be Same";
      setValidity((prev) => ({ ...prev, confirmPassword: false }));
      setMessages((prev) => ({ ...prev, confirmPassword: message }));
    }
    if (isFormValid === true) {
      try {
        setLoading(true)
        const data = await resetPassword({
          password: userDetails.newPassword,
          email: email,
        });
        if (!data.success) {
           setLoading(false)
              toast.error(data.data.data.message);
        } else {
          setLoading(false)
           if (isAuthenticated===true) {
             navigate("/dashboard");
           } else {
             navigate("/login")
           }
            toast.success(data.data.data.message)
           }
      } catch (err) {
        console.log(err);
        toast.error(err.response.data.message);
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
        <h1 className=" text-4xl  my-4 font-bold">Reset Your Password</h1>

        <form onSubmit={handleSubmit}>
          {/* newPassword Input */}
          <div className="relative  my-10">
            <input
              type="newPassword"
              name="newPassword"
              value={userDetails.newPassword}
              onChange={handleInputsChange}
              onBlur={handleInputBlur}
              className={`peer w-full h-12 placeholder-transparent bg-transparent border ${getBorderClass(
                "newPassword"
              )} rounded-md px-2 pt-4 outline-none transition duration-300 focus:border-blue-500 ${getTextColorClass(
                "newPassword"
              )}`}
              placeholder=" "
            />
            <label
              className={`absolute left-3 transition-all duration-300 transform bg-white px-1 ${getLabelClass(
                "newPassword"
              )} 
            peer-placeholder-shown:top-3
            peer-placeholder-shown:text-base
            peer-focus:top-[-0.6rem]
            peer-focus:left-2
            peer-focus:text-sm
            ${
              userDetails.newPassword
                ? "top-[-0.6rem] text-sm"
                : "top-3 text-base"
            }
          `}
            >
            New Password
            </label>
            {getIcon("newPassword")}
          </div>
          {messages.newPassword && (
            <p
              className={`mt-[-25px] text-sm mb-4 ${
                validity.newPassword ? "text-green-500" : "text-red-500"
              }`}
            >
              {messages.newPassword}
            </p>
          )}
          {/* confirmPassword Input */}
          <div className="relative my-10">
            <input
              type={showconfirmPassword ? "text" : "password"}
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
      ${userDetails.confirmPassword ? "top-[-0.6rem] text-sm" : "top-3 text-base"}
    `}
            >
              Confirm Password
            </label>
            <button
              type="button"
              onClick={toggleconfirmPasswordVisibility}
              className={`absolute ${
                getIcon("confirmPassword") ? "right-9" : "right-3"
              } top-3 text-gray-500 hover:text-blue-500 focus:outline-none`}
            >
              {showconfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
            {getIcon("confirmPassword")}
            <p
              className={`mt-4 text-sm mb-4 ${
                validity.confirmPassword ? "text-green-500" : "text-red-500"
              }`}
            >
              {messages.confirmPassword}
            </p>
          </div>
          <Button/>
        </form>
        {loading && <Loader />}
      </div>
    </>
  );
}




const Button = () => {
  return (
    <StyledWrapper>
      <button>
        <div>
          <span>
            <p>Click Me</p><p>:)</p>
          </span>
        </div>
        <div>
          <span>
            <p>Thanks</p><p>:D</p>
          </span>
        </div>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
   outline: 0;
   border: 0;
   display: flex;
   flex-direction: column;
   width: 100%;
   max-width: 140px;
   height: 50px;
   border-radius: 0.5em;
   box-shadow: 0 0.625em 1em 0 rgba(30, 143, 255, 0.35);
   overflow: hidden;
  }

  button div {
   transform: translateY(0px);
   width: 100%;
  }

  button,
  button div {
   transition: 0.6s cubic-bezier(.16,1,.3,1);
  }

  button div span {
   display: flex;
   align-items: center;
   justify-content: space-between;
   height: 50px;
   padding: 0.75em 1.125em;
  }

  button div:nth-child(1) {
   background-color: #1e90ff;
  }

  button div:nth-child(2) {
   background-color: #21dc62;
  }

  button:hover {
   box-shadow: 0 0.625em 1em 0 rgba(33, 220, 98, 0.35);
  }

  button:hover div {
   transform: translateY(-50px);
  }

  button p {
   font-size: 17px;
   font-weight: bold;
   color: #ffffff;
  }

  button:active {
   transform: scale(0.95);
  }`;


