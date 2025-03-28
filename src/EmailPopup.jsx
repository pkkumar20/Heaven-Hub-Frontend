import axios from "axios";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Loader2 from "./Loader2";
import { useAuth } from './Auth';
import { useNavigate } from "react-router-dom";
const OTPOverlay = ({ email, loadingData ,token,type,sendDetails}) => {
    const ServerUrl = import.meta.env.VITE_Server_Url;
  const [otp, setOtp] = useState(new Array(5).fill(""));
  const [seconds, setSeconds] = useState(60); // Start with 60 seconds
  const [emailLoading, setEmailLoading] = useState(true);
  const [userToken,setUserToken]= useState(token);
  const [resetPass, setResetPass] = useState(false);
   const { signup, verifyResetPasswordOtp } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    setEmailLoading(loadingData);
    setUserToken(token)
  }, [loadingData,token]);
  useEffect(() => {
    if (seconds > 0) {
      const timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(timer); // Clear the interval on component unmount
    }
  }, [seconds]);

  const handleChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };
  function checkArrayForEmpty(arr) {
    return !arr.some((element) => element === "");
  }
  const resendOtp = async ()=>{
    setEmailLoading(true)
    let Data = new FormData();
    Data.append("email",email);
        Data.append("token", userToken);
        Data.append("type",type)
    try{
      let response = await axios.post(`${ServerUrl}/user/resendotp`, Data, {
        withCredentials: true,
        headers: { "content-type": "application/x-www-form-urlencoded" },
      });
      if(response.status===200){
        setEmailLoading(false);
        setSeconds(60);
        toast.success("Otp resend sucessfully")
      }
    }catch(err){
      console.log(err);
    }
  }
  const handleVerify = async () => {
    let data = checkArrayForEmpty(otp);
    if (data === false) {
      toast.error("Please Enter correct otp");
    } else {
     
      let numb = parseInt(otp.join(""), 10);
      try {
        if(type==="forget"){
           setEmailLoading(true);
          const data = await verifyResetPasswordOtp({
            Otp: Number(numb),
            email: email,
          });
          if (data.success) {
           setEmailLoading(false);
          sendDetails(true);
         } else {
            setEmailLoading(false);
           toast.error(data.data.data.message);
         }
        } else {
           setEmailLoading(true);
          const data = await signup({ Otp: Number(numb), email: email });
          if (!data.success) {
              setEmailLoading(false);
              toast.error(data.data.data.message);
          } else {
            setEmailLoading(false);
            toast.success("You Sign Up sucessfully")
            navigate("/")

           }
        }
      } catch (error) {
        console.log(error.response);
        // toast.error(error.response.data.message);
      }
    }
  };
return (
  <div className="fixed py-8 px-2 mx-auto inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md mx-auto p-6 rounded-lg shadow-lg">
      {emailLoading === true && <Loader2 />}
      {emailLoading === false && (
        <>
          <h2 className="text-2xl font-semibold text-center mb-4">
            Email Verification
          </h2>
          <p className="text-gray-500 text-sm text-center mb-6">
            We've sent an OTP to {email}.
          </p>
          <div className="flex  justify-center space-x-2 mb-6">
            {otp.map((value, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={value}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 h-25 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-gray-500 focus:ring-black focus:border-transparent"
              />
            ))}
          </div>
          <div class="flex flex-col space-y-5">
            <div>
              <button
                class="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-black border-none text-white text-sm shadow-sm"
                onClick={handleVerify}
              >
                Verify Account
              </button>
            </div>
            {seconds !== 0 && (
              <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                Time to resend OTP 00:{seconds < 10 ? "0" : ""}
                {seconds}
              </div>
            )}

            {seconds === 0 && (
              <div class="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                <p>Didn't recieve code?</p>{" "}
                <a
                  class="flex flex-row items-center text-blue-600 cursor-pointer"
                  onClick={resendOtp}
                  rel="noopener noreferrer"
                >
                  Click Here
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  </div>
);
  
};

export default OTPOverlay;
