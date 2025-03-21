import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import DatePicker from "./DatePicker";
import { useAuth } from "./Auth";
import axios from "axios";
import toast from "react-hot-toast";
import GuestSelector from "./GuestSelector";
import middleware from "./middleware";
import Loader from "./ReservLoader";
const BookingSummary = () => {
  const { user, addTrip } = useAuth();
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();
  const { formatDateRange } = middleware();
  const [card, setCard] = useState(null);
  const [reservationDates, setReservationDates] = useState([]); // Store booked dates
  const { id } = useParams();
  const serverUrl = import.meta.env.VITE_Server_Url;

  // Fetch listing details
  useEffect(() => {
    axios
      .get(`${serverUrl}/listing/view/${id}`, { withCredentials: true })
      .then((response) => {
        setCard(response.data);
      })
      .catch((err) => {
        navigate(err.response.data.redirectUrl);
        toast.error(err.response.data.message);
      });
  }, [id]);

  // Extract reserved dates
    useEffect(() => {
      if (card && card.reservations?.length > 0) {
        const dates = card.reservations.map((reservation) => ({
          startDate: reservation.startDate,
          endDate: reservation.endDate,
        }));

        setReservationDates(dates);
      }
    }, [card]);

  const today = new Date().toISOString().split("T")[0];
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const startDate = queryParams.get("startDate") || today;
  const endDate = queryParams.get("endDate") || today;
  const night = queryParams.get("night") || 1;
  const [showCalender, setShowCalender] = useState(false);
  const handleShowDatePicker = (value) => {
    setShowCalender(value);
  };
  const [isOpen, setIsOpen] = useState(false);
  const [guestInfo, setGuestInfo] = useState({ adults: 1 });

  // Get selected dates
  const selectedDates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    selectedDates.push(currentDate.toISOString().split("T")[0]); // Convert to string format
    currentDate.setDate(currentDate.getDate() + 1);
  }

const isReserved = reservationDates.some((reservation) => {
  const resStart = new Date(reservation.startDate);
  const resEnd = new Date(reservation.endDate);

  return selectedDates.some((date) => {
    const currentDate = new Date(date);
    return currentDate >= resStart && currentDate <= resEnd;
  });
});


  const handleReserv = async () => {
  
    if (isReserved) {
      toast.error("Selected dates are already reserved. Please choose different dates.");
      return;
    }
  setLoading(true)
    const totalPrice =
      card.price * night + 150 + 420 + (card.price * night * 18) / 100;
    
    const reservData = {
      totalPrice,
      startDate,
      endDate,
      guests: guestInfo,
      reservFor: id,
      night,
    };
      
    const data = await addTrip(reservData);

    if (!data.success) {
      setLoading(false);
      toast.error(data.data.data.message);
    } else {
      setLoading(false);
      navigate("/dashboard/user-trips");
      toast.success("Trip added successfully");
    }
  };
  if (loading===true) {
  return <Loader/>
}
  if (!card) {
    return (
     <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-12 max-w-6xl mx-auto animate-pulse">
      {/* Left Section: Trip Details Skeleton */}
      <div className="lg:w-2/3 mt-12">
        <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
        <div className="mb-6 mt-10">
          <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>

          <div className="flex justify-between mt-2">
            <div>
              <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded mt-10"></div>
              <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mt-1"></div>
            </div>
            <div className="h-6 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>

          <div className="flex justify-between mt-10">
            <div>
              <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded mt-1"></div>
            </div>
            <div className="h-6 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
          <hr className="my-4" />
        </div>
      </div>

      {/* Right Section: Price Details Skeleton */}
      <div className="lg:w-1/3 border p-6 mt-14 rounded-lg shadow-lg">
        <div className="flex gap-4 mb-4">
          <div className="h-20 w-20 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
          <div>
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mt-1"></div>
          </div>
        </div>
        <hr className="my-4" />

        <div className="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>

        <div className="flex justify-between mb-2">
          <div className="h-4 w-28 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        <div className="flex justify-between mb-2">
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        <div className="flex justify-between mb-2">
          <div className="h-4 w-36 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-14 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        <div className="flex justify-between text-lg font-semibold">
          <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <hr className="my-4" />

        {/* Reserve Button Skeleton */}
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-12 max-w-6xl mx-auto">
      {/* Left Section: Trip Details & Login */}
      <div className="lg:w-2/3 mt-12">
        <h2 className="text-3xl font-semibold mt-6 mb-6">Request to book</h2>
        <div className="mb-6 mt-10">
          <h3 className="text-xl font-semibold">Your trip</h3>
          <div className="flex justify-between mt-2">
            <div>
              <p className="font-medium mt-10">Dates</p>
              <p className="text-gray-600">{formatDateRange(startDate, endDate)}</p>
            </div>
            <button onClick={() => setShowCalender(true)} className="text-blue-600 font-medium">
              Edit
            </button>
          </div>
          <div className="flex justify-between mt-10">
            <div>
              <p className="font-medium">Guests</p>
              {guestInfo && (
                <p className=" text-gray-600">
                  {Object.entries(guestInfo)
                    .filter(([_, value]) => value > 0)
                    .map(([key, value]) => `${value} ${key.charAt(0).toUpperCase() + key.slice(1)}`)
                    .join(", ")}
                </p>
              )}
            </div>
            <button onClick={() => setIsOpen(true)} className="text-blue-600 font-medium">
              Edit
            </button>
          </div>
          <hr className="my-4" />
        </div>
      </div>

      {/* Right Section: Price Details */}
      <div className="lg:w-1/3 border p-6 mt-14 rounded-lg shadow-lg">
        <div className="flex gap-4 mb-4">
          <img src={card.image.url} alt="Cottage" className="w-20 h-20 rounded-lg object-cover" />
          <div>
            <h3 className="font-semibold">{card.title}</h3>
            <p className="text-gray-600 text-sm">Room in cottage</p>
          </div>
        </div>
        <hr className="my-4" />

        <h3 className="text-xl font-semibold mb-3">Price details</h3>
        <div className="flex justify-between mb-2">
          <p>₹{card.price} x {night} nights</p>
          <p>₹{card.price * night}</p>
        </div>
          <div className="flex justify-between mb-2">
          <p>Cleaning Fee</p>
          <p>₹150</p>
        </div>
         <div className="flex justify-between mb-2">
          <p>Heven-Hub Fee</p>
          <p>₹420</p>
        </div>
         <div className="flex justify-between mb-2">
          <p>Taxes(GST)</p>
          <p>18%</p>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <p>Total (INR)</p>
          <p>₹{card.price * night + 150 + 420 + (card.price * night * 18) / 100}</p>
        </div>
        <hr className="my-4" />

        {/* Disable button if dates are reserved */}
        <button
          onClick={handleReserv}
          disabled={isReserved}
          className={`font-semibold px-6 py-3 rounded-lg transition duration-300 mx-auto block ${
            isReserved ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Reserve Now
        </button>
      </div>

      {showCalender && <DatePicker showValue={handleShowDatePicker} hometelId={id} reservDates={reservationDates} />}
      {isOpen && <GuestSelector onClose={() => setIsOpen(false)} onSave={(data) => setGuestInfo(data)} />}
    </div>
  );
};

export default BookingSummary;
