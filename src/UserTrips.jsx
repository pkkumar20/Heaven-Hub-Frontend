import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NotFound from "./NotFound";
import { useAuth } from "./Auth";
import toast from "react-hot-toast";
import PrivateLoader from "./PrivateRouteLoader";
const UserReservations = () => {
  const { user, removeTrip } = useAuth();
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [showNotFound, setShowNotFound] = useState(false);
  const [currency, setCurrency] = useState("INR"); // Default INR
  const [exchangeRates, setExchangeRates] = useState({ INR: 1 }); // Ensure INR exists
  const navigate = useNavigate();
  const serverUrl = import.meta.env.VITE_Server_Url;

  // Fetch Reservations & Exchange Rates
  useEffect(() => {

    if (!user ) return;
    setReservations(user.reservations);
    setShowNotFound(user.reservations === 0);
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/INR"
        );
        setExchangeRates({ INR: 1, ...response.data.rates }); // Ensure INR is always 1
      } catch (err) {
        console.log("Failed to fetch exchange rates", err);
      }
    };

    fetchExchangeRates();
  }, [user]);
  const handleRemove = async (id) => {
    setLoading(true);
    const data = await removeTrip(id);
    if (!data.success) {
      setLoading(false);
      toast.error(data.data.data.message);
    } else {
       setLoading(false);
      toast.success("Trip deleted sucessfully");
    }
                  
  }
  // Convert Currency with Locale Formatting
  const convertCurrency = (amountInINR) => {
    const rate = exchangeRates[currency] || 1; // Default to 1 if rate is unavailable
    return (amountInINR * rate).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    AUD: "A$",
    CAD: "C$",
  };
  if (loading === true) {
    return <PrivateLoader/>
  }
  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header with Currency Dropdown */}
       {reservations.length > 0 && (
            <div className="flex justify-between items-center mb-6">
       
        <h2 className="text-3xl font-bold text-gray-800">My Trips</h2>
        {/* Currency Dropdown */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-400"
        >
          {Object.keys(currencySymbols).map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>

        )}
    
      {/* Trip Cards */}
      {reservations.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {reservations.map((trip, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg border border-gray-200 p-5 hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {trip.reservFor?.title}
              </h3>

              <div className="flex justify-between text-gray-600 text-sm mb-3">
                <span>
                  Check-in: <strong>{trip.startDate}</strong>
                </span>
                <span>
                  Check-out: <strong>{trip.endDate}</strong>
                </span>
              </div>

              <div className="flex justify-between text-gray-700 font-medium mb-3">
                <span>Nights: {trip.night}</span>
                <span className="text-blue-600">
                  {currencySymbols[currency]} {convertCurrency(trip.totalPrice)}
                </span>
              </div>

              {trip.guests && (
                <p className="text-gray-600 text-sm mb-4">
                  Guests:{" "}
                  {Object.entries(trip.guests)
                    .filter(([_, value]) => value > 0)
                    .map(
                      ([key, value]) =>
                        `${value} ${key.charAt(0).toUpperCase() + key.slice(1)}`
                    )
                    .join(", ")}
                </p>
              )}

              {/* Buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/view/${trip.reservFor}`)}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  View
                </button>
                <button
                  onClick={()=>handleRemove(trip._id)}
                  className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <NotFound
          message="You do not have any Trips yet."
          link="/dashboard/User-data"
        />
      )}
    </div>
  );
};

export default UserReservations;
