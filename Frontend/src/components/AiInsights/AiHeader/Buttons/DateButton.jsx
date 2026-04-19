import React from "react";
import { useSelector } from "react-redux";

const DateButton = () => {
  // Grab selectedDate from your ai reducer
  const selectedDate = useSelector((state) => state.ai.selectedDate);

  return (
    <button className="px-3 py-2 border border-gray-200 rounded-lg gap-2 inline-flex items-center text-sm text-gray-900 outline-none bg-white">
      <span>🗓️</span>
      <span>{selectedDate}</span>
    </button>
  );
};

export default DateButton;
