import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Auth";
import IsLiked from "./Liked";
import { Star } from "lucide-react";

export default function Content({
  imagelink,
  title,
  price,
  id,
  isLiked,
  stars,
}) {
  const { isAuthenticated, user, loading, favoriteHometels } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(stars);
  const [isFavorited, setIsFavorited] = useState(false);
  useEffect(() => {
    if (user !== null && favoriteHometels !== null) {
      let isAvailable = favoriteHometels.some(item => item._id === id)
      setIsFavorited(isAvailable);
    }
  }, [user, favoriteHometels, id]);

  return (
    <div
      className="relative px-2 mx-auto lg:h-[60vh] w-full mb-2 mt-2 max-w-lg bg-white rounded-lg dark:bg-gray-800 dark:border-gray-700 
      transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105"
      onClick={() => navigate(`/view/${id}`)}
    >
      <div
        className="absolute top-3 right-3 p-2"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <IsLiked isLiked={isFavorited} id={id} imagelink={imagelink} />
      </div>

      {loading ? (
        <div className="bg-gray-300 h-[200px] sm:h-[250px] lg:h-[68%] w-full animate-pulse rounded-t-3xl"></div>
      ) : (
        <img
          className="rounded-t-3xl object-cover h-[200px] sm:h-[250px] lg:h-[68%] w-full"
          src={imagelink}
          alt={title}
        />
      )}

      <div className="px-5 mt-2 pb-5">
        {loading ? (
          <div className="h-6 w-4/5 bg-gray-300 rounded animate-pulse"></div>
        ) : (
          <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
        )}

        {/* ⭐ Rating Section */}
        {loading ? (
          <div className="h-6 w-4/5 bg-gray-300 rounded animate-pulse mt-2 mb-2"></div>
        ) : (       <div className="flex items-center mt-2 text-yellow-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              fill={index < rating ? "currentColor" : "none"}
              className="w-5 h-5"
            />
          ))}
        </div>)}
 

        {loading ? (
          <div className="h-8 w-3/5 bg-gray-300 rounded animate-pulse"></div>
        ) : (
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              &#8377;{price.toLocaleString("en-IN")}/night
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
