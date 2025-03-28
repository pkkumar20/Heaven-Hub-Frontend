import React, { useState, useRef, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "./PrivateRouteLoader";
import toast from "react-hot-toast";
import Joi, { object } from "joi";
import CountrySelect from "./Test3";
import { useAuth } from "./Auth";
import country from "./country/countriesminified.json";
import state from "./country/statesminified.json";
import city from "./country/citiesminified.json";
export default function FormComponent() {
  const schema = Joi.object({
    fullname: Joi.string().min(3).required().messages({
      "string.empty": "Full Name is required",
      "string.min": "Name must be at least 3 characters long",
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
  });
      const { user, loading, updateUser } = useAuth();
  // country select
  if(loading===true||user===null){
    return(
      <p>Loading</p>
    )
  }else{
  const [countriesList, setCountriesList] = useState(country);
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  // file select
  const navigate = useNavigate();
    const [loaDing, setLoaDing] = useState(false);
  // form
  const [userDetails, setuserDetails] = useState({
    fullname:user.fullname|| "",
    phoneNumber:String(user.phoneNumber)|| "",
    gender:user.gender||"",
    country: user.country||"",
    state: user.state||"",
    city: user.city||"",
    streetAddress: user.streetAddress||"",
  });
   useEffect(() => {
    //  get state list
       let StatesData = state.find(
         (state) => state.id == userDetails.country.id
       );
       setStatesList(StatesData.states);
      //  get city list 
        let StateData = city.find(
          (country) => country.id == userDetails.country.id
        );
        let CityData = StateData.states.find(
          (state) => state.id == userDetails.state.id
        );
        setCitiesList(CityData.cities);
   }, []);
  const [validity, setValidity] = useState({
    fullname: null,
    phoneNumber: null,
    gender: null,
    country: null,
    state: null,
    city: null,
    streetAddress: null,
  });

  const [messages, setMessages] = useState({
    fullname: "",
    phoneNumber: "",
    gender: "",
    country: "",
    state: "",
    city: "",
    streetAddress: "",
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
      state: "",
    }));
    setValidity((prev) => ({ ...prev, state: null }));
    setMessages((prev) => ({ ...prev, state: "" }));

    // Use `option.id` directly to fetch states
   let StatesData = state.find((state) => state.id == data.id);
   setStatesList(StatesData.states);
    // reset city
    setuserDetails((prevData) => ({
      ...prevData,
      city: "",
    }));
    setValidity((prev) => ({ ...prev, city: null }));
    setMessages((prev) => ({ ...prev, city: "" }));
  };
  const handleStateSelectChange = (option) => {
    setValidity((prev) => ({ ...prev, state: true }));
    setMessages((prev) => ({ ...prev, state: "Looks Good" }));
    let data = { id: option.id, name: option.name };
    setuserDetails((prevData) => ({
      ...prevData,
      state: data,
    })); // Update the selected state
    // reset city
    setuserDetails((prevData) => ({
      ...prevData,
      city: "",
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
    setMessages((prev) => ({ ...prev, city: "Looks Good" }));
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
    if (name === "phoneNumber") fieldSchema = schema.extract("phoneNumber");
    if (name === "gender") fieldSchema = schema.extract("gender");
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
  const handleSubmit = async (event) => {
    event.preventDefault();

    let isFormValid = true;
    // setMessages({});
    // setValidity({});

    try {
      // Validate all fields using Joi
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

    // Manual validation for dropdowns (Country, State, City)
    ["country", "state", "city"].forEach((field) => {
      if (!userDetails[field]) {
        isFormValid = false;
        setMessages((prev) => ({ ...prev, [field]: `${field} is required.` }));
        setValidity((prev) => ({ ...prev, [field]: false }));
      }
    });

    if (!isFormValid) return; // Stop submission if validation fails
    setLoaDing(true);
    // Prepare form data
    const newData = {
      id: user._id,
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

    const formData = new FormData();
    formData.append("userDetails", JSON.stringify(newData));
      let data = await updateUser({userDetails:{    id: user._id,
        fullname: userDetails.fullname,
        email: userDetails.email,
        phoneNumber: userDetails.phoneNumber,
        gender: userDetails.gender,
        country: userDetails.country,
        state: userDetails.state,
        city: userDetails.city,
        streetAddress: userDetails.streetAddress,
        password: userDetails.password,}
    
      });
    if (!data.success) { 
      setLoaDing(false);
              toast.error("Failed to update profile. Please try again.");
    } else {
      navigate(data.data.data.redirectUrl)
      setLoaDing(false);
        toast.success("Details updated successfully! 🎉");
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
     if (loaDing === true) {
      return <Loader/>
    }
  return (
    <>
      <div className="lg:py-4 py-2 px-2 mx-auto max-w-2xl">
        <h1 className="lg:text-4xl lg:my-5 my-3 text-3xl font-bold">
          Edit your Personal details
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

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-6">
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
            <div className="relative ">
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
          </div>
          <div className="bg-white min-h-[200px] flex items-center">
            <button
              type="submit"
              className="px-6 py-2 font-medium bg-black text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] "
            >
              Edit
            </button>
          </div>
          <p>
            Changed your mind ?
            <a
              onClick={() => navigate("/dashboard/personal-info")}
              className="text-blue-900 cursor-pointer hover:underline"
            >
              Click here!
            </a>
          </p>
        </form>
      </div>
    </>
  );
}
}
