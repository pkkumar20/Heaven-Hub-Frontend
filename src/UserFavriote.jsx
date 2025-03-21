import React, { useEffect, useState } from "react";
import Content from "./Content";
import { useAuth } from "./Auth";
import NotFound from "./NotFound";


function Home() {
  const { user, removeFavorite, favoriteHometels } = useAuth(); // ✅ Get removeFavorite function
  const [datas, setDatas] = useState([]);
  const [showNotFound, setShowNotFound] = useState(false);

  useEffect(() => {
    if (!user || !user.favoriteHometels) return;
    setDatas(favoriteHometels);
    setShowNotFound(favoriteHometels.length === 0);
  }, [user]);

  // ✅ Remove from local state immediately
  const handleRemoveFavorite = async (hometelId) => {
    const response = await removeFavorite(hometelId);
    if (response.success) {
      setDatas((prev) => prev.filter((item) => item._id !== hometelId)); // ✅ Update UI immediately
    }
  };

  if (showNotFound)
    return (
      <NotFound
        message="You do not have any favorite Hometels yet."
        link="/dashboard/User-data"
      />
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1">
      {datas.length > 0 ? (
        datas.map((item) => (
          <Content
            key={item._id}
            imagelink={item.image?.url}
            title={item.title}
            price={item.price}
            id={item._id}
            isLiked={true}
            onRemove={() => handleRemoveFavorite(item._id)} // ✅ Pass remove function
          />
        ))
      ) : (
        <NotFound
          message="You do not have any favorite Hometels yet."
          link="/dashboard/User-data"
        />
      )}
    </div>
  );
}

export default Home;
