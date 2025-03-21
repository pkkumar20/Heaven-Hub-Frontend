import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./Auth";
import Content from "./Content";
import NotFound from "./NotFound";
import FilterBar from "./FilterBar.Jsx";
import Loader from "./HomeLoader";
const MyComponent = () => {
  const {  favoriteHometels, user,  } = useAuth();
    const [showNotFound, setShowNotFound] = useState(false);
  const [searchParams] = useSearchParams();
  const [hometels, setHometels] = useState([]);
  const [favorite, setFavorite] = useState(null);
    const [loading, setLoading] = useState(false);
  const ServerUrl = import.meta.env.VITE_Server_Url;

  // Get specific query parameters
  const key = searchParams.get("key");
  const area = searchParams.get("area");

  useEffect(() => {
    const FetchHometel = async () => {
      setLoading(true)
      if (!key || !area) return; // Prevent API call if params are missing

      try {
        const response = await axios.get(
          `${ServerUrl}/listing/search?key=${key}&area=${area}`,
          { withCredentials: true }
        );
        setLoading(false)
        setHometels(response.data.hometel);
         setShowNotFound(response.data.hometel.length === 0);
      } catch (err) {
          setLoading(false)
        console.log("Error fetching hometels:", err);
      }
    };

    FetchHometel();
  }, [user,key, area, ServerUrl]); // ✅ Add dependencies to prevent infinite loop
 useEffect(() => {
    if (!user || !user.favoriteHometels) return;
    setFavorite(favoriteHometels);
  }, [user,hometels]);
  return (
    <>
         <div className="py-2 px-2 ">
                <FilterBar />
              </div>
      <div className=" grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1">
        {hometels ? (
          <>
            {hometels.map((item) => {
              let isavaialbel;
              if (favorite !== null) {
                isavaialbel = favorite.includes(item._id);
              }
              return (
                <Content
                  key={item._id}
                  imagelink={item.image.url}
                  title={item.title}
                  price={item.price}
                  id={item._id}
                  isLiked={isavaialbel || false}
                />
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div>
       {loading ? <Loader /> : null}
      {showNotFound && (
        <NotFound
          message={"No Hometel Found With this Keyword"}
          link={"/"}
        />
      )}
    </>
  );
};

export default MyComponent;
