import React, { useEffect, useState } from "react";
import Content from "./Content";
import axios from "axios";
import { useAuth } from "./Auth";
import FilterBar from "./FilterBar";
import NotFound from "./NotFound";
import Loader from "./HomeLoader";
import toast from "react-hot-toast";
function Home() {

    const { favoriteHometels, user, isAuthenticated, } = useAuth();
  const ServerUrl = import.meta.env.VITE_Server_Url;
      const [loading, setLoading] = useState(false);
  const [datas, setDatas] = useState(null); // State to hold the data
   const [favorite, setFavorite] = useState([]);
       const [showNotFound, setShowNotFound] = useState(false);
    useEffect(() => {
      setLoading(true);
      // Fetch the card details from the backend
      axios
        .get(`${ServerUrl}/listing/home`, {
          withCredentials: true,
        })
        .then((response) => {
          setDatas(response.data.hometels);
          setShowNotFound(response.data.hometels.length === 0);
          setLoading(false);
        })
        .catch((error) => {
          toast.error("Error fetching Hometels")
          console.log("Error fetching card details:", error)
          setLoading(false);
        } );
        async()=>{await refreshAuth()}
    }, [user]);
    useEffect(()=>{
      // fetct favoriteHometels
      if (user !== null&&isAuthenticated===true) {
        setFavorite(favoriteHometels);
      }else{
        setFavorite(null);
      }
    },[user]);
  return (
    <>
      <div className="py-2 px-2 ">
        <FilterBar />
      </div>

      <div className=" grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1">
        {datas ? (
          <>
            {datas.map((item) => {
              let stars;
              if (item.reviews.length > 0) {
                const validRatings = item.reviews
                  .map((item2) => item2.rating)
                  .filter((rating) => rating > 0); // Keep only ratings > 0

                const averageRating =
                  validRatings.length > 0
                    ? validRatings.reduce((sum, rating) => sum + rating, 0) /
                      validRatings.length
                    : 0; // Avoid division by zero
                stars = Math.floor(averageRating);
              } else {
                stars = 0;
              }
              let isavaialbel;
              if (user!==null&&favorite !== null) {
                 isavaialbel = favorite.some(iTem => iTem._id === item._id);
              }
              return (
                <Content
                  key={item._id}
                  imagelink={item.image.url}
                  title={item.title}
                  price={item.price}
                  id={item._id}
                  isLiked={isavaialbel}
                  stars={stars}
                />
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div>
      {showNotFound && <NotFound message={"No Hometel Found "} link={"/"} />}
      {loading ? <Loader /> : null}
    </>
  );
}

export default Home;
