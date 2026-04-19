import { Dot } from "lucide-react";
import React from "react";
import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import ExportButton from "./Buttons/ExportButton";
import ShareButton from "./Buttons/ShareButton";
import RefreshButton from "./Buttons/RefreshButton";
import DateButton from "./Buttons/DateButton";
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
        <DateButton />
        {/* Export button */}
        <ExportButton />
        {/* Share Button */}
        <ShareButton />
        {/* Refresh Button */}
        <RefreshButton />
      </div>
    </div>
  );
};

export default MainHeader;
