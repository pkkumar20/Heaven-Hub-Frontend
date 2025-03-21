import React from "react";
import { Dropdown, Navbar } from "flowbite-react";
import { useEffect, useState } from "react";
import avatar from "animal-avatar-generator";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "./Auth";
import Loader from "./Loader";
const NavbarComponent = () => {
    const ServerUrl = import.meta.env.VITE_Server_Url;
      const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const OnInputChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);
  };
  const handleSubmit = (event) => {
    event.preventDefault(); // ✅ Prevents page reload
    if (searchValue.trim()) {
      navigate(`/find?key=${searchValue}&area=all`); // ✅ Navigates without refresh
      setSearchValue("")
    } else {
      toast.error("Search value cannot be empyt");
    }
  };
const { user, isAuthenticated, logout } = useAuth();
 useEffect(() => {
   const checkAuthStatus = () => {
    // refreshAuth(); // Updates user state
   };

   checkAuthStatus(); // Run immediately when the component mounts

   // Set interval to check authentication status every 10 seconds
   const interval = setInterval(checkAuthStatus, 500);

   return () => clearInterval(interval); // Cleanup interval on unmount
 }, []);
// ✅ Runs only once when the component mounts

  let svg;
  if (user !== null) {
    svg = avatar(user.fullname, { size: 50, blackout: false });
  }
const handleLogout = async () => {
  try {
    const data = await logout();
    toast.success("Logged out sucessfully")
  } catch (error) {
    console.error(
      "Logout Failed:",
      error.response?.data?.message || error.message
    );
  }
};
  return (
    <Navbar
      fluid
      rounded
      className="bg-white h-22 dark:bg-gray-900 border-b border-gray-300"
    >
      <Navbar.Brand onClick={() => navigate("/")}>
        <img src="/heaven.png" className="h-12 w-28" alt="Logo" />
      </Navbar.Brand>
      {/* User Menu and Mobile Toggle */}
      <div className="flex items-center md:order-2  mr-3 lg:mr-2 md:space-x-0 rtl:space-x-reverse">
        {/* User Dropdown */}
        <Dropdown
          arrowIcon={false}
          inline
          label={
            isAuthenticated === true ? (
              <div
                className="w-10 h-10 rounded-full"
                dangerouslySetInnerHTML={{ __html: svg }}
              ></div>
            ) : (
              <img src="/user.svg" className="w-10 h-10 rounded-full" />
            )
          }
        >
          <Dropdown.Header className="rounded-xl">
            {isAuthenticated === true ? (
              <>
                <span className="block text-sm text-gray-900 dark:text-white">
                  {user.fullname}
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  {user.email}
                </span>
              </>
            ) : (
              <>
                <span className="block text-sm text-gray-900 dark:text-white">
                  Guest
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  guest@heaven-hub.com
                </span>
              </>
            )}
          </Dropdown.Header>
          <Dropdown.Item onClick={() => navigate("/dashboard")}>
            Dashboard
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/dashboard/Login&security")}>
            Settings
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/dashboard/user-favriote")}>
            Favorite
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/dashboard/personal-info")}>
            Your Info
          </Dropdown.Item>
          <Dropdown.Divider />
          {isAuthenticated === true ? (
            <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
          ) : (
            <>
              <Dropdown.Item onClick={() => navigate("/login")}>
                Login
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/signup")}>
                Sign Up
              </Dropdown.Item>
            </>
          )}
        </Dropdown>

        {/* Mobile Menu Toggle */}
        <Navbar.Toggle className="ml-6" />
      </div>

      {/* Collapsible Menu */}
      <Navbar.Collapse className="cursor-pointer">
        <Navbar.Link onClick={() => navigate("/")}>Home</Navbar.Link>
        <Navbar.Link onClick={() => navigate("/new")}>New</Navbar.Link>
        <Navbar.Link onClick={() => navigate("/dashboard")}>
          Dashboard
        </Navbar.Link>
        {/* Mobile Search Bar */}
        <form className="md:hidden w-full px-4 mt-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchValue}
              onChange={OnInputChange}
              placeholder="Search..."
              className="flex-1 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Go
            </button>
          </div>
        </form>
      </Navbar.Collapse>
      {/* Desktop Search Bar */}
      <form className="hidden md:flex items-center gap-2">
        <input
          value={searchValue}
          onChange={OnInputChange}
          type="text"
          placeholder="Search..."
          className="block w-40 px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Go
        </button>
      </form>
      {loading && <Loader />}
    </Navbar>
  );
};

export default NavbarComponent;
