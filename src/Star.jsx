import { useState, useEffect } from "react";
import { Star } from "lucide-react";

const StarRating = ({ sendRating, defaultRating, }) => {
  const [rating, setRating] = useState(defaultRating);
  const [hover, setHover] = useState(0);
  const totalStars = 5;
  useEffect(() => {
    setRating(defaultRating); // Update rating when defaultRating changes
    setHover(0);
  }, [defaultRating]);

  useEffect(() => {
    sendRating(rating);
  }, [rating]);

  return (
    <div className="flex space-x-1">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
              starValue <= (hover || rating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            fill={starValue <= (hover || rating) ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
