import { Star, X, Eye } from "lucide-react";
import avatar from "animal-avatar-generator";
import { useAuth } from "./Auth";
import toast from "react-hot-toast";
import Loader from "./HometelLoader";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Review = ({
  reviewId,
  name,
  date,
  rating,
  comment,
  owner,
  createdFor,
}) => {
  const svg = avatar(name || "", { size: 55, blackout: false });
  const { loading, user, removereview } = useAuth();
  const [Loading, SetLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    SetLoading(true);
    const data = await removereview(reviewId);
    if (!data.success) { 
      SetLoading(false)
      toast.error(data.data.data.message);
    } else {
      SetLoading(false)
      toast.success(data.data.data.message);
    }
  };
  if (Loading === true) {
  return <Loader/>
}
  return (
    <div className="flex justify-between items-start p-4 border rounded-lg shadow-md max-w-5xl my-2">
      {/* Left Section: Avatar & Content */}
      <div className="flex gap-4">
        {/* Avatar */}
        <div dangerouslySetInnerHTML={{ __html: svg }} />
        <div>
          {/* Name & Date */}
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-gray-500 text-sm">{date}</p>

          {/* Star Rating */}
          <div className="flex mt-2 text-yellow-500">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                fill={index < rating ? "currentColor" : "none"}
                stroke="currentColor"
                className="w-5 h-5"
              />
            ))}
          </div>

          {/* Review Comment */}
          <p className="text-gray-700 mt-2">{comment}</p>
        </div>
      </div>

      {/* Action Buttons */}
      {!loading && user?._id === owner && (
        <div className="flex gap-2">
          {createdFor && (
            <button
              onClick={() => navigate(`/view/${createdFor}`)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Eye className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Review;
