import StarRating from "./Star";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";
import Loader from "./HometelLoader";
const Review = ({ hometelId }) => {
  const { addReview} = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [commentMessage, setMessage] = useState("");
  const [commentValadity, setValadity] = useState(null);
  const [id, setId] = useState(null);
  const [reting, setReting] = useState(0);
  const [drating, setdreting] = useState(0);
  useEffect(() => {
    setId(hometelId);
    const pendingAction = sessionStorage.getItem("pendingReview");
    if (pendingAction) {
      const { comment, rating } = JSON.parse(pendingAction);
      setCommentValue(comment);
      setdreting(rating);
      sessionStorage.removeItem("pendingReview");
    }
  }, []); // Runs only once when the component mounts
  const getBorderClass = () => {
    if (commentValadity === null) return "border-gray-400";
    return commentValadity ? "border-green-500" : "border-red-500";
  };

  const getTextColorClass = () => {
    if (commentValadity === null) return "text-gray-500";
    return commentValadity ? "text-green-500" : "text-red-500";
  };

  const getLabelClass = () => {
    if (commentValadity === null) return "text-gray-500";
    return commentValadity ? "text-green-500" : "text-red-500";
  };

  const getIcon = () => {
    if (commentValadity === null) return null;
    return commentValadity ? (
      <FaCheckCircle className="text-green-500 absolute right-3 top-3" />
    ) : (
      <FaExclamationCircle className="text-red-500 absolute right-3 top-3" />
    );
  };
  const handleInputsChange = (event) => {
    const { value } = event.target;
    setCommentValue(value);
    setMessage("");
    handleInputBlur(event);
  };
  const getReting = (rating) => {
    setReting(rating);
  };
  const handleInputBlur = (event) => {
    const { value } = event.target;
    let isValid = true;
    let message = "Looks good!";

    if (!value.trim()) {
      isValid = false;
      message = `Comment is required.`;
    } else if (value.length < 10) {
      isValid = false;
      message = `Minimum 10 words are requried`;
    }
    setValadity(isValid);
    setMessage(message);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    let isFormValid = false;
    let isValid = true;
    let message = "Looks good!";
    if (!commentValue.trim()) {
      isFormValid = false;
      isValid = false;
      message = `Comment is required.`;
    } else if (commentValue.length < 10) {
      isFormValid = false;
      isValid = false;
      message = `Minimum 10 words are requried`;
    } else {
      isFormValid = true;
      isValid = true;
      message = `Looks Good`;
    }
    setValadity(isValid);
    setMessage(message);
    if (isFormValid === true) {
      setLoading(true);
        const data = await addReview({
          rating: Number(reting),
          comment: commentValue,
          hometelId: hometelId,
        });
      if (!data.success) {
        setLoading(false);
          sessionStorage.setItem(
          "pendingReview",
          JSON.stringify({
            comment: commentValue,
            rating: reting,
            redirectUrl: `/view/${id}`,
          })
        );
          navigate(data.data.data.redirectUrl);
           toast.error(data.data.data.message);
      } else {
        setLoading(false);
          setCommentValue("");
          setReting(null); // Reset rating to 0
          setdreting(0); // Reset default rating to 0
          setValadity(null);
          setMessage("");
               setTimeout(() => {
              setdreting(-1); // Temporarily set to -1
              setTimeout(() => setdreting(0), 10); // Then reset to 0 after a short delay
            }, 10);
          toast.success("Review Added Sucessfully")
         }

    }
  };
  if (loading === true) {
    return <Loader/>
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h1 className="text-lg mb-3 font-semibold">Rating</h1>
        <StarRating sendRating={getReting} defaultRating={drating} />
        <h1 className="text-lg mb-3 mt-2 font-semibold">Comment</h1>
        {/* comment Input */}
        <div className="relative my-4">
          <textarea
            name="Comment"
            value={commentValue}
            onChange={handleInputsChange}
            onBlur={handleInputBlur}
            className={`peer w-full h-24 placeholder-transparent bg-transparent border ${getBorderClass()} rounded-md px-2 pt-4 outline-none transition duration-300 focus:border-blue-500 ${getTextColorClass()}`}
            placeholder=" "
          />
          <label
            className={`absolute left-3 transition-all duration-300 transform bg-white px-1 ${getLabelClass()}
            peer-placeholder-shown:top-3
            peer-placeholder-shown:text-base
            peer-focus:top-[-0.6rem]
            peer-focus:left-2
            peer-focus:text-sm
            ${commentValue ? "top-[-0.6rem] text-sm" : "top-3 text-base"}
          `}
          >
            Comment
          </label>
          {getIcon()}
        </div>
        {commentMessage && (
          <p
            className={`mt-[-18px] text-sm mb-4 ${
              commentValadity ? "text-green-500" : "text-red-500"
            }`}
          >
            {commentMessage}
          </p>
        )}
        <button
          type="submit"
          className="inline-flex justify-center gap-2 mb-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-yellow-600 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
        >
          Add Review
          <Star
            className="w-10 h-10 justify-end group-hover:rotate-50 group-hover:bg-white text-yellow-600 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2"
            fill="currentColor"
          />
        </button>
        <hr />
      </form>
    </>
  );
};
export default Review;
