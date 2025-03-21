import { useAuth } from "./Auth";
import React, { useState, useRef, useEffect } from "react";
import {useNavigate } from "react-router-dom";
export default function PersonalInfo() {
    const navigate = useNavigate();
  const [form,setForm] = useState(true)
        const {user} = useAuth();
        const showForm = ()=>{
          setForm(!form);
        }
  return (
    <>
      <div className="py-8 px-2 mx-auto max-w-xl">
        <div className="flex justify-between  mt-4 items-center border-b pb-2">
          <div>
            <h1 className="text-4xl font-semibold mb-10">Personal Info</h1>
          </div>
          <button
            className="text-lg font-bold underline"
            onClick={() => {
              navigate("/dashboard/personal-info/edit");
            }}
          >
            Edit
          </button>
        </div>
        <div className="flex justify-between  mt-4 items-center border-b pb-2">
          <div>
            <h4 className="text-xl font-medium text-gray-800">Name</h4>
            {<TextComponent text={user.fullname} />}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 border-b pb-2">
          <div>
            <h4 className="text-xl font-medium text-gray-800">Email Address</h4>
            <p className="text-lg text-gray-500 mb-4">{user.email}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 border-b pb-2">
          <div>
            <h4 className="text-xl font-medium text-gray-800">Mobile No</h4>
            <p className="text-lg text-gray-500 mb-4">{user.phoneNumber}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 border-b pb-2">
          <div>
            <h4 className="text-xl font-medium text-gray-800">Gender</h4>
            <p className="text-lg text-gray-500 mb-4">
              <TextComponent2 text={user.gender} />
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 border-b pb-2">
          <div>
            <h4 className="text-xl font-medium text-gray-800">Address</h4>
            <p className="text-lg text-gray-500 mb-4">
              <TextComponent2 text={user.streetAddress} />,{user.city.name},
              {user.state.name},{user.country.name}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
const TextComponent = ({ text }) => {
  const formattedText =
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  return <p className="text-lg text-gray-500 mb-4">{formattedText}</p>;
};
const TextComponent2 = ({ text }) => {
  const formattedText =
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  return <span>{formattedText}</span>;
};
