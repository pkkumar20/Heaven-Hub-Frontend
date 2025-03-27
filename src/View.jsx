import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Review from "./Review";
import Rewiew from "./Reviews"
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "./Auth";
import DeleteLoader from "./DeleteLoader";
import Map from "./Map";
import Host from "./Host"
import Owner from "./OwnedBy"
import IsLiked from "./Liked"
import ConfirmDialogBox from "./CinfirmDilog";
import Datepicker from "./DatePicker";
export default function View() {
      const [deleteLoading, setDeleteLoading] = useState(false);
  const { id } = useParams();
  const [card, setCard] = useState(null);
    const [reservationDates, setReservationDates] = useState([]);
  const [reviewData, setReviewData] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated, user,  favoriteHometels, loading,removeHometel } = useAuth();
  const [favorite, setFavorite] = useState(null);
  const [showConfirm,setShowConfirm] = useState(false);
  const [showCalender,setShowCalender] = useState(false);
  const [userResponce, setUserResponce] = useState(false);
    const serverUrl = import.meta.env.VITE_Server_Url;
  useEffect(() => {
    axios
      .get(`${serverUrl}/listing/view/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setCard(response.data);
        setReviewData(response.data.reviews);
      })
      .catch((err) =>{ navigate(err?.response?.data?.redirectUrl||"/");
      toast.error(err?.response?.data?.message||"Somthing Went wrong");}
      )
  }, [id,user]); // ✅ Runs only when `user` changes
   useEffect(()=>{
      // fetct favoriteHometels
      if (user !== null&&isAuthenticated===true) {
        setFavorite(favoriteHometels);
      }else{
        setFavorite(null);
      }
    },[user]);
   useEffect(()=>{
      // fetct favoriteHometels
      if (user !== null&&isAuthenticated===true) {
        setReviewData(user.reviews);
      }else{
        setFavorite(null);
      }
    },[user]);
  let isavaialbel;
  if (card !== null && favorite !== null) {
    isavaialbel = favorite.some(iTem => iTem._id === id);
  }
  async function deleteListing(id) {
    const data = await removeHometel(id);
    if (!data.success) { 
      setDeleteLoading(false);
      navigate(data.data.data.redirectUrl);
      toast.error(data.data.data.message);
    } else {
       navigate("/");
       setDeleteLoading(false)
       toast.success(data.data.data.message);
    }
  }
  
  const handleUserResponce = (data)=>{
    setUserResponce(data);
    if(data===true){
          setDeleteLoading(true);
 deleteListing(card._id);
    }else{
      setShowConfirm(false);
    }
   
  }
  function updateListing(id) {
    navigate(`/update/${id}`);
  }
    useEffect(() => {
      if (card && card.reservations?.length > 0) {
        const dates = card.reservations.map((reservation) => ({
          startDate: reservation.startDate,
          endDate: reservation.endDate,
        }));

        setReservationDates(dates);
      }
    }, [card]);
    if (!card) {
      return (
       <div className="py-8 px-4 mx-auto max-w-5xl lg:py-2 bg-white rounded-lg dark:bg-gray-800 dark:border-gray-700 animate-pulse">
      {/* Title & Like Button Skeleton */}
      <div className="flex justify-between mt-4 items-center border-b pb-2">
        <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      </div>

      {/* Image Skeleton */}
      <div className="w-full h-[60vh] bg-gray-300 dark:bg-gray-700 rounded-lg mt-4"></div>

      {/* Description Skeleton */}
      <div className="p-1 mb-5 bg-white dark:bg-gray-800">
        <div className="h-6 w-5/6 bg-gray-300 dark:bg-gray-700 rounded mt-3"></div>
        <div className="h-5 w-4/6 bg-gray-300 dark:bg-gray-700 rounded mt-3"></div>
        <div className="h-5 w-3/6 bg-gray-300 dark:bg-gray-700 rounded mt-3"></div>
      </div>

      {/* Buttons Skeleton */}
      <div className="flex gap-4">
        <div className="h-10 w-28 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-10 w-28 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-10 w-28 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      </div>

      {/* Owner Details Skeleton */}
      <hr className="mt-5" />
      <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mt-3"></div>
      <hr className="mt-3" />

      {/* Reviews Skeleton */}
      <div className="h-6 w-5/6 bg-gray-300 dark:bg-gray-700 rounded mt-3"></div>
      <div className="h-5 w-4/6 bg-gray-300 dark:bg-gray-700 rounded mt-3"></div>
      <hr className="mt-3" />
    </div>
      );
    }
  const covertData = (crdate) => {
    const date = new Date(crdate);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return formattedDate;
  };
const handleShowDatePicker = (value)=>{
  setShowCalender(value);
}
  return (
    <div className="py-8 px-4 mx-auto max-w-5xl lg:py-2 bg-white rounded-lg dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between  mt-4 items-center border-b pb-2">
        <h1 className="mb-3 text-3xl font-bold">{card.title}</h1>
        <IsLiked
          isLiked={isavaialbel}
          id={card._id}
          imagelink={card.image.url}
        />
      </div>

      <div className="w-full  overflow-hidden rounded-lg">
        <img
          className="w-full h-[60vh] object-cover"
          src={card.image.url}
          alt={card.title}
        />
      </div>

      <div className="p-1 mb-5 bg-white">
        <h5 className="mb-2 mt-3 text-2xl font-semibold text-gray-700 tracking-tight dark:text-white">
          {card.description}
        </h5>
        <p className="mb-3 text-2xl font-semibold text-gray-700 dark:text-gray-400">
          {card.city.name}, {card.state.name},{card.country.name}
        </p>
        <p className="mb-3 text-2xl font-semibold text-gray-700 dark:text-gray-400">
          &#8377;{card.price.toLocaleString("en-IN")}/night
        </p>
       {user !== null && !loading && (
  <div className="flex flex-col sm:flex-row justify-center items-center gap-3 w-full">
    {/* Edit & Delete Buttons (Only for Owner) */}
    {user._id === card.owner._id && (
      <>
        {/* Edit Button - Fixed Width */}
        <button
          onClick={() => updateListing(card._id)}
          className="flex items-center justify-center gap-2 px-4 py-2 w-40 sm:w-36 text-base font-medium transition-all duration-300 rounded-full shadow-md bg-gray-50 hover:bg-emerald-500 hover:text-white border border-gray-200"
        >
          Edit
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 21v-3.75L16.813 3.438a1.5 1.5 0 0 1 2.12 0l1.628 1.628a1.5 1.5 0 0 1 0 2.12L6.75 21H3z" />
          </svg>
        </button>

        {/* Delete Button - Fixed Width */}
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 w-40 sm:w-36 text-base font-medium transition-all duration-300 rounded-full shadow-md bg-gray-50 hover:bg-red-500 hover:text-white border border-gray-200"
        >
          Delete
          <svg
            className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </>
    )}

    {/* Reserve Button - Fixed Width */}
    <button
      onClick={() => setShowCalender(true)}
      className="flex items-center justify-center gap-2 px-4 py-2 w-40 sm:w-36 text-base font-medium transition-all duration-300 rounded-full shadow-md bg-gray-50 hover:bg-blue-500 hover:text-white border border-gray-200"
    >
      Reserve
      <svg
        className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </button>
  </div>
)}
      </div>
      <hr />
      {card !== null && (
        <Owner name={card.owner.fullname} email={card.owner.email} />
      )}

      <hr />
      {isAuthenticated === true && (
        <>
          <Review hometelId={id}  />
          <hr />
        </>
      )}
      {reviewData !== null &&
        reviewData.map((review) => {
          return (
            <Rewiew
              key={review._id}
              reviewId={review._id}
              name={review.createdBy.fullname}
              date={covertData(review.createdAt)}
              rating={review.rating}
              comment={review.comment}
              owner={review.createdBy._id}
            />
          );
        })}
      {reviewData !== null && reviewData.length > 0 && <hr className="mt-3" />}
      {card.geometry.coordinates !== null && (
        <Map defaultCoordinates={card.geometry.coordinates} className="mb-3"/>
      )}
      <hr />
      {card !== null && (
        <Host name={card.owner.fullname} email={card.owner.email} />
      )}
      {showConfirm === true && (
        <ConfirmDialogBox result={handleUserResponce} text={"Hometel"} />
      )}
      {showCalender === true && (
        <Datepicker
          showValue={handleShowDatePicker}
          hometelId={card._id}
          reservDates={reservationDates}
        />
      )}
      {deleteLoading && <DeleteLoader />}
    </div>
  );
}
