import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ConfirmDialogBox from "./CinfirmDilog";
import { useAuth } from "./Auth";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
export default function LoginSecurity() {
  const { isAuthenticated, user,loading, logout, refreshAuth } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);
    const [userResponce, setUserResponce] = useState(false);
      const navigate = useNavigate();
      const serverUrl = import.meta.env.VITE_Server_Url;
      const handleUserResponce = (data) => {
        setUserResponce(data);
        if (data === true) {
          DeleteUser();
        }else{
          setShowConfirm(false);
        }
      };
          
  const DeleteUser = async () => {
    if (!loading && isAuthenticated && user) {
      try {
        // Step 1: Send delete request while user is still authenticated
        await axios.delete(`${serverUrl}/user/${user._id}`, {
          withCredentials: true, // Send authentication credentials
        });

        toast.success("Account deleted successfully", {
          duration: 3000,
          position: "top-center",
        });

        // Step 2: Redirect to home page after deletion
        navigate("/");
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong", {
          duration: 3000,
          position: "top-center",
        });
      }
    }
  };


  return (
    <>
      <div className="py-8 px-2 mx-auto max-w-xl">
        <h1 className="text-4xl font-semibold mb-10">Login & Security</h1>
        <h1 className="text-2xl font-semibold mb-6 border-b pb-2">Password</h1>
        <div className="flex justify-between  mt-4 items-center border-b pb-2">
          {/* Left Section */}
          <div>
            <h4 className="text-lg font-medium text-gray-800">
              Update Password
            </h4>
            <p className="text-md text-gray-500 mb-4">
              To Change or Update your Password
            </p>
          </div>

          {/* Right Section */}
          <button
            className="text-md font-bold underline"
            onClick={() => {
              navigate("/change-password");
            }}
          >
            Update
          </button>
        </div>
        <div className="flex justify-between items-center mt-4 border-b pb-2">
          {/* Left Section */}
          <div>
            <h4 className="text-lg font-medium text-gray-800">
              Forget Password
            </h4>
            <p className="text-md text-gray-500 mb-4">To Reset your Password</p>
          </div>

          {/* Right Section */}
          <button
            className="text-md font-bold underline"
            onClick={() => {
              navigate("/forget-password");
            }}
          >
            Reset
          </button>
        </div>
        <h1 className="text-2xl font-semibold mb-6 border-b pb-7 pt-7">
          Account
        </h1>
        <div className="flex justify-between items-center mt-4 border-b pb-2">
          {/* Left Section */}
          <div>
            <h4 className="text-lg font-medium text-gray-800">
              Delete Account
            </h4>
            <p className="text-md text-gray-500 mb-4">To delete Your Account</p>
          </div>

          {/* Right Section */}
          <Button
            handleClick={() => setShowConfirm(true)}
          />
        </div>
      </div>
      {showConfirm === true && (
        <ConfirmDialogBox result={handleUserResponce} text={"User"} />
      )}
    </>
  );
}


const Button = ({handleClick}) => {
  return (
    <StyledWrapper>
      <button className="btn" onClick={handleClick}>
        <svg viewBox="0 0 15 17.5" height="17.5" width={15} xmlns="http://www.w3.org/2000/svg" className="icon">
          <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill" />
        </svg>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .btn {
    background-color: transparent;
    position: relative;
    border: none;
  }

  .btn::after {
    content: 'delete';
    position: absolute;
    top: -130%;
    left: 50%;
    transform: translateX(-50%);
    width: fit-content;
    height: fit-content;
    background-color: rgb(168, 7, 7);
    padding: 4px 8px;
    border-radius: 5px;
    transition: .2s linear;
    transition-delay: .2s;
    color: white;
    text-transform: uppercase;
    font-size: 12px;
    opacity: 0;
    visibility: hidden;
  }

  .icon {
    transform: scale(1.2);
    transition: .2s linear;
  }

  .btn:hover > .icon {
    transform: scale(1.5);
  }

  .btn:hover > .icon path {
    fill: rgb(168, 7, 7);
  }

  .btn:hover::after {
    visibility: visible;
    opacity: 1;
    top: -160%;
  }`;


