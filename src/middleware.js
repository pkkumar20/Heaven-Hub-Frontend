import { useCallback } from "react";

const useDateRangeFormatter = () => {
  const formatDateRange = useCallback((startDate, endDate) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startDay = start.getDate();
    const startMonth = months[start.getMonth()];

    const endDay = end.getDate();
    const endMonth = months[end.getMonth()];

    return startMonth === endMonth
      ? `${startDay} ${startMonth} - ${endDay} ${endMonth}`
      : `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  }, []);

  return { formatDateRange };
};

export default useDateRangeFormatter;
