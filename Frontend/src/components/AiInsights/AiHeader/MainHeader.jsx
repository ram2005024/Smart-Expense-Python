import { Dot } from "lucide-react";
import React from "react";
import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
const MainHeader = () => {
  const { overview, selectedDate } = useSelector((state) => state.ai);
  const dispatch = useDispatch();
  return (
    <div className="w-full flex justify-between items-center">
      {/* Left side */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <h2 className="text-2xl font-semibold">Ai Insights</h2>
          <div className="px-2 p-1 rounded-4xl flex items-center justify-center border border-green-800">
            <Dot className="text-xl text-green-400 size-4" />
            <span className="text-xs font-semibold text-green-600">LIVE</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <p>Real time expense intillegence</p>
          <Dot className="size-3" />
          <span>Updated just {moment(overview?.updated_on).fromNow()}</span>
        </div>
      </div>
      {/* Right Side */}
      <div className="flex items-center gap-2">
        {/* Date Button */}
        <button className="px-3 p-2 border border-gray-200 rounded-lg gap-2  inline-flex items-center text-sm text-gray-900 outline-none bg-white ">
          <span>🗓️</span>
          <span>{selectedDate}</span>
        </button>
        {/* Export button */}

        {/* Share Button */}

        {/* Refresh Button */}
      </div>
    </div>
  );
};

export default MainHeader;
