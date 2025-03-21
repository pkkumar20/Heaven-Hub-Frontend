import { useEffect, useState } from "react";
import { useAuth } from "./Auth";
import NotFound from "./NotFound";
import Review from "./Reviews";
import toast from "react-hot-toast";

const UserReview = () => {
  const { user,removereview } = useAuth();
  const [showNotFound, setShowNotFound] = useState(false);
  const [reviewData, setReviewData] = useState(null);


  useEffect(() => {
    if (!user || !user.reviews) return;
    setReviewData(user.reviews);
    setShowNotFound(user.reviews.length === 0);
  }, [user]);

  // Function to handle review removal
  const handleRemoveReview = async(reviewId) => {
    const data = await removereview(reviewId);
    if (!data.success) { 
      toast.error(data.data.data.message);
    } else {
      toast.success(data.data.data.message);
    }
  };

  // Function to format date
  const convertDate = (crdate) => {
    const date = new Date(crdate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="py-8 px-4 mx-auto max-w-5xl lg:py-2 bg-white rounded-lg dark:bg-gray-800 dark:border-gray-700">
      {reviewData !== null &&
        reviewData.map((review) => (
          <Review
            key={review._id}
            reviewId={review._id}
            name={review.createdBy.fullname}
            date={convertDate(review.createdAt)}
            rating={review.rating}
            comment={review.comment}
            owner={review.createdBy._id}
            handleRemoveReview={handleRemoveReview}
            createdFor={review.createdFor}
          />
        ))}
      {showNotFound && (
        <NotFound
          message={"You have not created any reviews yet."}
          link={"/dashboard/User-data"}
        />
      )}
    </div>
  );
};

export default UserReview;
