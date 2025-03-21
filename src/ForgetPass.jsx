import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useAuth } from "./Auth";
import EmailPopup from "./EmailPopup"
import ResetPass from "./ResetPass";
export default function FormComponent() {
    const ServerUrl = import.meta.env.VITE_Server_Url;
  // file select
  const {user,isAuthenticated } = useAuth();
  const navigate = useNavigate();
   const [emailloading, setEmailLoading] = useState(false);
    const [otpPopUp, setOtpPopUp] = useState(false);
    const [resetPass,setResetPass]= useState(false);
    const [type, setType] = useState("forget");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false); // Track if user has touched the
  // form
  const [shownewPassword, setShownewPassword] = useState(false);
  const [userDetails, setuserDetails] = useState({
    email: "",
  });
  const [validity, setValidity] = useState({
    email: null,
  });
let token = null;
  const [messages, setMessages] = useState({
    email: "",
  });
  // validation schema
  const validationSchema = Yup.object().shape({
     email: Yup.string()
          .required("Email is required")
          .matches(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            "Please enter a valid Email address"
          ),
  });
  useEffect(()=>{
if (user !== null) {
  setuserDetails((prev) => ({ ...prev, email: user.email }));
}
  },[user])
  
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
      setEmailLoading(true);
      setOtpPopUp(true);
      let data = {
        email:userDetails.email,
      };
      const Data = new FormData();
      Data.append("user", JSON.stringify(data));
      try {
        const response = await axios.post(
          `${ServerUrl}/user/reset-password`,
          Data,
          {
            withCredentials: true,
            headers: { "content-type": "application/x-www-form-urlencoded" },
          }
        );
        if (response.status === 200) {
          setEmailLoading(false);
          setOtpPopUp(true);
        }
      } catch (err) {
        if (err.status===403){
          setType(undefined);
          setEmailLoading(false);
          setOtpPopUp(true);
          toast.error(err.response.data.message);
        } else{
console.log(err.status);
setOtpPopUp(false);
toast.error(err.response.data.message);
        }
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
  const getDetails = (data)=>{
    setResetPass(true)
    if(data===true){
      setOtpPopUp(false)
    }
  }
  if(resetPass===false){

  
  return (
    <>
      <div className="py-8 px-2 mt-5 mx-auto max-w-xl">
        <h1 className=" text-4xl  my-4 font-bold">Forget Your Password</h1>

        <form onSubmit={handleSubmit}>
          {/* oldPassword Input */}
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
      <Button />
        </form>
        {isAuthenticated === false && (
           <p>
          Know password ?{" "}
          <a
            onClick={() => navigate("/login")}
            className="text-blue-900 cursor-pointer hover:underline"
          >
            Click here!
          </a>
        </p>
        )}
       
        {otpPopUp && (
          <EmailPopup
            email={userDetails.email}
            token={token}
            loadingData={emailloading}
            type={type}
            sendDetails={getDetails}
          />
        )}
        {loading && <Loader />}
      </div>
    </>
  );}else{
    return <ResetPass email={userDetails.email}/>
  }
}
const Button = () => {
  return (
    <StyledWrapper>
      <button>
        <span className="circle1" />
        <span className="circle2" />
        <span className="circle3" />
        <span className="circle4" />
        <span className="circle5" />
        <span className="text">Submit</span>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    color: white;
    background-color: #171717;
    padding: 0.5em 2em;
    border: none;
    border-radius: .6rem;
    position: relative;
    cursor: pointer;
    overflow: hidden;
  }

  button span:not(:nth-child(6)) {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 30px;
    width: 30px;
    background-color: #0c66ed;
    border-radius: 50%;
    transition: .6s ease;
  }

  button span:nth-child(6) {
    position: relative;
  }

  button span:nth-child(1) {
    transform: translate(-3.3em, -4em);
  }

  button span:nth-child(2) {
    transform: translate(-6em, 1.3em);
  }

  button span:nth-child(3) {
    transform: translate(-.2em, 1.8em);
  }

  button span:nth-child(4) {
    transform: translate(3.5em, 1.4em);
  }

  button span:nth-child(5) {
    transform: translate(3.5em, -3.8em);
  }

  button:hover span:not(:nth-child(6)) {
    transform: translate(-50%, -50%) scale(4);
    transition: 1.5s ease;
  }`;


