import React from "react";
import {Router, Routes, Route } from "react-router-dom";
import './App.css'
import AuthRedirect from './AuthRedirect.Jsx';
import Nav from './Nav'
import Footer from './Footer'
import New from './New'
import View from './View'
import Signup from './Signup';
import Login from './Login';
import Home from './Home';
import Update from "./Update"
import ChangePassword from "./ChangePassword";
import ForgetPass from "./ForgetPass"
import PersonalInfo from './PersonalInfo';
import Profile from './Profile';
import LoginSecurity from './Login&Security';
import UserData from './UserData';
import PrivateRoutes from './AuthenticatedUserRoutes'
import Dashboard from './Dashboard'
import UpdateUser from "./UpdateUserdetails"
import UserFavriote from "./UserFavriote"
import UserHometel from "./UserHometels"
import UserReview from "./UserReviews"
import UserTrips from "./UserTrips"
import NotFound from './RouteNotFound';
import Find from './Find';
import PrivacyPolicy from './PrivacyPolicy';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import Reserv from "./Reserv"
function App() { 
  return (
    <>
      <Nav />
      <div className="div1 ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find" element={<Find />} />
          <Route path="/view/:id" element={<View />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/forget-password" element={<ForgetPass />} />
          <Route element={<AuthRedirect />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Private Routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/personal-info" element={<PersonalInfo />} />
            <Route
              path="/dashboard/personal-info/edit"
              element={<UpdateUser />}
            />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route
              path="/dashboard/Login&security"
              element={<LoginSecurity />}
            />
            <Route path="/update/:id" element={<Update />} />
            <Route path="/dashboard/User-data" element={<UserData />} />
            <Route path="/new" element={<New />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/dashboard/user-hometel" element={<UserHometel />} />
            <Route path="/dashboard/user-favriote" element={<UserFavriote />} />
            <Route path="/dashboard/user-reviews" element={<UserReview />} />
            <Route path="/dashboard/user-trips" element={<UserTrips />} />
            <Route path="/reserv/:id" element={<Reserv />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App
