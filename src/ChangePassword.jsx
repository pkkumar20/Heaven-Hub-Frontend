import React, { useState, useRef, useEffect } from "react";
import styled from 'styled-components';
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./ReservLoader"
import toast from "react-hot-toast";
import * as Yup from "yup"; 
import { useAuth } from "./Auth";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importing icons
export default function FormComponent() {
  // file select
    const ServerUrl = import.meta.env.VITE_Server_Url;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shownewPassword, setShownewPassword] = useState(false);
  const [userDetails, setuserDetails] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [validity, setValidity] = useState({
    oldPassword: null,
    newPassword: null,
  });

  const [messages, setMessages] = useState({
    oldPassword: "",
    newPassword: "",
  });
  // validation schema
  const validationSchema = Yup.object().shape({
       oldPassword: Yup.string()
      .required("Current Password is required")
      .min(8, "Current Password must be at least 8 characters")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Current Password must contain at least one symbol"
      )
      .matches(/[0-9]/, "Current Password must contain at least one number")
      .matches(/[A-Z]/, "Current Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "Current Password must contain at least one lowercase letter"),
    newPassword: Yup.string()
      .required("New Password is required")
      .min(8, "New Password must be at least 8 characters")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "New Password must contain at least one symbol"
      )
      .matches(/[0-9]/, "New Password must contain at least one number")
      .matches(/[A-Z]/, "New Password must contain at least one uppercase letter")
      .matches(/[a-z]/, "New Password must contain at least one lowercase letter"),
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
  const togglenewPasswordVisibility = () => {
    setShownewPassword(!shownewPassword);
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
    if(userDetails.newPassword===userDetails.oldPassword){
        isFormValid =false;
        toast.error("New Password must be different")
    }
    if (isFormValid === true) {
      setLoading(true)
      let data = {
        oldPassword: userDetails.oldPassword,
        newPassword: userDetails.newPassword,
        email: user.email,
        id: user._id,
      };
      const Data = new FormData();
      Data.append("user", JSON.stringify(data));
      try{
        const response = await axios.put(
          `${ServerUrl}/user/change-pass`,
          Data,
          {
            withCredentials: true,
            headers: { "content-type": "application/x-www-form-urlencoded" },
          }
        );
        setLoading(false)
        if(response.status===200){
          toast.success("Password Changed Successfully");
          navigate("/dashboard/Login&security");
        }
      } catch (err) {
         setLoading(false)
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
        <h1 className=" text-4xl  my-4 font-bold">Change Your Password</h1>

        <form onSubmit={handleSubmit}>
          {/* oldPassword Input */}
          <div className="relative  my-10">
            <input
              type="oldPassword"
              name="oldPassword"
              value={userDetails.oldPassword}
              onChange={handleInputsChange}
              onBlur={handleInputBlur}
              className={`peer w-full h-12 placeholder-transparent bg-transparent border ${getBorderClass(
                "oldPassword"
              )} rounded-md px-2 pt-4 outline-none transition duration-300 focus:border-blue-500 ${getTextColorClass(
                "oldPassword"
              )}`}
              placeholder=" "
            />
            <label
              className={`absolute left-3 transition-all duration-300 transform bg-white px-1 ${getLabelClass(
                "oldPassword"
              )} 
            peer-placeholder-shown:top-3
            peer-placeholder-shown:text-base
            peer-focus:top-[-0.6rem]
            peer-focus:left-2
            peer-focus:text-sm
            ${
              userDetails.oldPassword
                ? "top-[-0.6rem] text-sm"
                : "top-3 text-base"
            }
          `}
            >
              Current Password
            </label>
            {getIcon("oldPassword")}
          </div>
          {messages.oldPassword && (
            <p
              className={`mt-[-25px] text-sm mb-4 ${
                validity.oldPassword ? "text-green-500" : "text-red-500"
              }`}
            >
              {messages.oldPassword}
            </p>
          )}
          {/* newPassword Input */}
          <div className="relative my-10">
            <input
              type={shownewPassword ? "text" : "newPassword"}
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
      ${userDetails.newPassword ? "top-[-0.6rem] text-sm" : "top-3 text-base"}
    `}
            >
              New Password
            </label>
            <button
              type="button"
              onClick={togglenewPasswordVisibility}
              className={`absolute ${
                getIcon("newPassword") ? "right-9" : "right-3"
              } top-3 text-gray-500 hover:text-blue-500 focus:outline-none`}
            >
              {shownewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
            {getIcon("newPassword")}
            <p
              className={`mt-4 text-sm mb-4 ${
                validity.newPassword ? "text-green-500" : "text-red-500"
              }`}
            >
              {messages.newPassword}
            </p>
          </div>
         <Button/>
        </form>
        <p>
          Forgot password ?{" "}
          <a
            onClick={() => navigate("/forget-password")}
            className="text-blue-900 cursor-pointer hover:underline"
          >
            Click here!
          </a>
        </p>
        {loading && <Loader />}
      </div>
    </>
  );
}



const Button = () => {
  return (
    <StyledWrapper>
      <button className="btn">
        <span>
          Submit 
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g strokeWidth={0} id="SVGRepo_bgCarrier" /><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" /><g id="SVGRepo_iconCarrier"> <path fill="#ffffff" d="M20.33 3.66996C20.1408 3.48213 19.9035 3.35008 19.6442 3.28833C19.3849 3.22659 19.1135 3.23753 18.86 3.31996L4.23 8.19996C3.95867 8.28593 3.71891 8.45039 3.54099 8.67255C3.36307 8.89471 3.25498 9.16462 3.23037 9.44818C3.20576 9.73174 3.26573 10.0162 3.40271 10.2657C3.5397 10.5152 3.74754 10.7185 4 10.85L10.07 13.85L13.07 19.94C13.1906 20.1783 13.3751 20.3785 13.6029 20.518C13.8307 20.6575 14.0929 20.7309 14.36 20.73H14.46C14.7461 20.7089 15.0192 20.6023 15.2439 20.4239C15.4686 20.2456 15.6345 20.0038 15.72 19.73L20.67 5.13996C20.7584 4.88789 20.7734 4.6159 20.7132 4.35565C20.653 4.09541 20.5201 3.85762 20.33 3.66996ZM4.85 9.57996L17.62 5.31996L10.53 12.41L4.85 9.57996ZM14.43 19.15L11.59 13.47L18.68 6.37996L14.43 19.15Z" /> </g></svg>
        </span>
        <span>
          Sure ?
        </span>
        <span>
         Done
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g strokeWidth={0} id="SVGRepo_bgCarrier" /><g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" /><g id="SVGRepo_iconCarrier"> <path strokeLinecap="round" strokeWidth={2} stroke="#ffffff" d="M8.00011 13L12.2278 16.3821C12.6557 16.7245 13.2794 16.6586 13.6264 16.2345L22.0001 6" /> <path fill="#ffffff" d="M11.1892 12.2368L15.774 6.63327C16.1237 6.20582 16.0607 5.5758 15.6332 5.22607C15.2058 4.87635 14.5758 4.93935 14.226 5.36679L9.65273 10.9564L11.1892 12.2368ZM8.02292 16.1068L6.48641 14.8263L5.83309 15.6248L2.6 13.2C2.15817 12.8687 1.53137 12.9582 1.2 13.4C0.868627 13.8419 0.95817 14.4687 1.4 14.8L4.63309 17.2248C5.49047 17.8679 6.70234 17.7208 7.381 16.8913L8.02292 16.1068Z" clipRule="evenodd" fillRule="evenodd" /> </g></svg>
        </span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn {
    position: relative;
    outline: 0;
    border: 1px solid transparent;
    background-color: black;
    color: #ffffff;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    overflow: hidden;
  }

  .btn span {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    transition: all .4s ease;
  }

  button svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .btn span:nth-child(2),.btn span:nth-child(3) {
    position: absolute;
    top: 40px;
    color: #fff;
  }

  .btn span:nth-child(2) {
    background-color:  black;
  }

  .btn span:nth-child(3) {
    background-color:  black;
  }

  .btn:hover span:nth-child(2), .btn:focus span:nth-child(3) {
    top: 0;
  }

  .btn:focus {
    box-shadow: none;
  }`;

