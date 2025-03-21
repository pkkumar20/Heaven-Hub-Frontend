import React, { useEffect, useState, useMemo } from "react";
import Content from "./Content";
import axios from "axios";
import { useAuth } from "./Auth";
import NotFound from "./NotFound";
import PrivateLoader from "./PrivateRouteLoader";
function Home() {
  const { user, favoriteHometels } = useAuth();
  const [datas, setDatas] = useState([]);
  const [favorite, setFavorite] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotFound, setShowNotFound] = useState(false);
  const [hasFetched, setHasFetched] = useState(false); // Prevent multiple fetches
  const serverUrl = useMemo(() => import.meta.env.VITE_Server_Url, []);

  // Fetch Hometels on mount
  useEffect(() => {
      if (!user || !user.favoriteHometels) return;
      setDatas(user.hometels);
      setShowNotFound(user.hometels.length === 0);
      setFavorite(favoriteHometels);
  }, [user]);
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1">
        {datas.length > 0 &&
          datas.map((item) => {
            let isAvailable = favorite.includes(item._id);
            return (
              <Content
                key={item._id}
                imagelink={item.image.url}
                title={item.title}
                price={item.price}
                id={item._id}
                isLiked={isAvailable}
              />
            );
          })}
      </div>

      {showNotFound && (
        <NotFound
          message="You have not created any Hometel yet"
          link="/dashboard/User-data"
        />
      )}

    </>
  );
}

export default Home;
