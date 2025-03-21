import { useState } from "react";
import { X } from "lucide-react";
import { DateRange } from "react-date-range";
import {
  addDays,
  isBefore,
  isWithinInterval,
  eachDayOfInterval,
  startOfDay,
} from "date-fns";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const today = startOfDay(new Date());

const ReserveCalendar = ({ showValue, hometelId, reservDates }) => {
  const navigate = useNavigate();
  const [selection, setSelection] = useState({
    startDate: today,
    endDate: today,
    key: "selection",
  });
  const [days, setDays] = useState(1);

  // Generate an array of disabled dates
  const getDisabledDates = () => {
    return reservDates.flatMap((range) =>
      eachDayOfInterval({
        start: new Date(range.startDate),
        end: new Date(range.endDate),
      })
    );
  };

  const disabledDates = getDisabledDates();

  // Check if today is in the disabled dates
  const isTodayDisabled = disabledDates.some(
    (date) => date.getTime() === today.getTime()
  );

  const isRangeDisabled = (startDate, endDate) => {
    return disabledDates.some(
      (date) =>
        isWithinInterval(date, { start: startDate, end: endDate }) ||
        date.getTime() === startDate.getTime() ||
        date.getTime() === endDate.getTime()
    );
  };

  const handleCrossButton = () => {
    if (typeof showValue === "function") {
      showValue(false);
    }
  };

  const handleSelect = (ranges) => {
    const { startDate, endDate } = ranges.selection;

    if (isBefore(startDate, today)) {
      toast.error("Cannot select past dates!");
      return;
    }

    if (isRangeDisabled(startDate, endDate)) {
      toast.error("Your selection includes disabled dates!");
      return;
    }

    setSelection({ startDate, endDate, key: "selection" });
    setDays((endDate - startDate) / (1000 * 60 * 60 * 24) + 1);
  };

  const handleClear = () => {
    setSelection({ startDate: today, endDate: today, key: "selection" });
    setDays(1);
  };

  const handleSubmit = () => {
    const formattedStartDate = selection.startDate.toLocaleDateString("en-CA");
    const formattedEndDate = selection.endDate.toLocaleDateString("en-CA");
    navigate(
      `/reserv/${hometelId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}&night=${days}`
    );
    handleCrossButton();
  };

  return (
    <div className="fixed py-8 px-2 mx-auto inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg mx-auto shadow-lg border">
        <Toaster />
        <X onClick={handleCrossButton} className="cursor-pointer" />

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-2 text-center">
          {days} {days === 1 ? "day" : "days"}
        </h2>
        <p className="text-gray-500 text-center">1 bed · 1 bath</p>

        {/* Centered Calendar */}
        <div className="mt-4 border rounded-lg p-4 flex justify-center">
          <DateRange
            key={selection.key}
            ranges={[selection]}
            onChange={handleSelect}
            minDate={today}
            disabledDates={disabledDates}
            rangeColors={["#000"]}
            showDateDisplay={false}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button onClick={handleClear} className="text-gray-700 underline">
            Clear dates
          </button>
          <button
            onClick={handleSubmit}
            disabled={isRangeDisabled(selection.startDate, selection.endDate)}
            className={`px-6 py-2 rounded-lg ${
              isRangeDisabled(selection.startDate, selection.endDate)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReserveCalendar;
