import React, { useState, useEffect } from "react";
import { redirect, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import CustomToast from "./CustomToast"; // Import custom toast
import { useAuth } from "./Auth";

import { Heart } from "lucide-react";
const isLiked = ({ isLiked, id, imagelink }) => {
    const ServerUrl = import.meta.env.VITE_Server_Url;
      const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(isLiked);
  const { isAuthenticated, user, removeFavorite, addFavorite } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false);
    // Check if there's a pending favorite action
    const pendingAction = sessionStorage.getItem("pendingFavorite");
    if (pendingAction) {
      const { id, action } = JSON.parse(pendingAction);
      handleFavorite(id, action);
      sessionStorage.removeItem("pendingFavorite"); // Clear the stored action
    }
  }, []);
  useEffect(() => {
    if(isAuthenticated===false){
      setIsFavorited(false);
    }else{
      // Sync the favorite state with the incoming isLiked prop
      setIsFavorited(isLiked);
    }
    
  }, [user,isLiked]);
  const handleFavorite = async (id, action) => {
    if (isAuthenticated === false || user === null) {
      // Redirect to login if not authenticated
      sessionStorage.setItem(
        "pendingFavorite",
        JSON.stringify({ id, action, redirectUrl: `/view/${id}` })
      );
      navigate("/login");
      toast.error("Please log in to continue.");
      return;
    } else {
      // Show Loading Toast
      const toastId = toast.custom(
        (t) => (
          <CustomToast id={t.id} status="loading" message="Loading data..." />
        ),
        { position: "bottom-left", duration: Infinity } // Keep open until request finishes
      );
        if (action) {
  const data = await addFavorite(id);
  if (!data.success) {
    toast.custom(
      (t) => (
        <CustomToast
          id={t.id}
          status="error"
          message={data.message || "Error!"}
          imgSrc={imagelink}
        />
      ),
      { id: toastId, duration: 1000 } // ✅ Auto-dismiss after 3 seconds
    );
  } else {
    toast.custom(
      (t) => (
        <CustomToast
          id={t.id}
          status="success"
          message="Added to favorites"
          imgSrc={imagelink}
        />
      ),
      { id: toastId, duration: 1000 } // ✅ Auto-dismiss after 1 seconds
    );
  } 
 } else {
          const data = await removeFavorite(id);
if (!data.success) {
  toast.custom(
    (t) => (
      <CustomToast
        id={t.id}
        status="error"
        message={data.message || "Error!"}
        imgSrc={imagelink}
      />
    ),
    { id: toastId, duration: 1000 } // ✅ Auto-dismiss after 3 seconds
  );
} else {
  toast.custom(
    (t) => (
      <CustomToast
        id={t.id}
        status="success"
        message="Removed from favorites!"
        imgSrc={imagelink}
      />
    ),
    { id: toastId, duration: 3000 } // ✅ Auto-dismiss after 3 seconds
  );
} 
        }
    }
  };

  return (
    <button
      onClick={() => {
        handleFavorite(id, !isFavorited);
      }}
    >
      <Heart
        className={`${
          isFavorited ? "text-red-500 fill-red-500" : "text-black"
        }`}
      />
    </button>
  );
};
export default isLiked;
