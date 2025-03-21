import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Review from "./Review";
import Rewiew from "./Reviews"
import "react-loading-skeleton/dist/skeleton.css";
import { useAuth } from "./Auth";
import DeleteLoader from "./DeleteLoader.Jsx";
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
      .catch((err) =>{ navigate(err.response.data.redirectUrl);
      toast.error(err.response.data.message);}
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
        {user !== null && loading === false && (
          <div className="flex flex-col sm:items-start md:flex-row lg:flex-row md:items-center lg:items-center gap-4 sm:gap-4 md:gap-6 lg:gap-8">
            {/* Edit & Delete Buttons (Only for Owner) */}
            {user._id === card.owner._id && (
              <>
                {/* Edit Button */}
                <button
                  onClick={() => updateListing(card._id)}
                  className="inline-flex justify-center gap-2 items-center shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
                >
                  Edit
                  <svg
                    fill="#50C878"
                    height="24px"
                    width="24px"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="#50C878"
                    className="w-8 h-8 justify-end group-hover:rotate-50 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2"
                  >
                    <path d="M3 21v-3.75L16.813 3.438a1.5 1.5 0 0 1 2.12 0l1.628 1.628a1.5 1.5 0 0 1 0 2.12L6.75 21H3z"></path>
                  </svg>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => setShowConfirm(true)}
                  className="inline-flex justify-center gap-2 items-center shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-red-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
                >
                  Delete
                  <svg
                    className="w-8 h-8 justify-end group-hover:rotate-50 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M10 11V17M14 11V17M4 7H20M6 7V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V7H6Z"
                      stroke="#FF0000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </button>
              </>
            )}

            {/* Reserve Button (For Any Authenticated User) */}
            <button
              onClick={() => setShowCalender(true)}
              className="inline-flex justify-center gap-2  items-center shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-blue-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
            >
              Reserve
              <svg
                className="w-8 h-8 justify-end group-hover:rotate-50 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M8 2V5M16 2V5M3 9H21M4 7H20V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7Z"
                  stroke="#1D4ED8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M9 14L11 16L15 12"
                  stroke="#1D4ED8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
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
