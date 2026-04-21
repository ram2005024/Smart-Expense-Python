import React, { useState } from "react";
import SpendTrendChart from "./MainOverview/SpendTrendForecastGraph";
import { useSelector } from "react-redux";
import LinkBar from "./MainOverview/LinkBar";
import LinkDashboard from "./MainOverview/LinkDashboard";

const MainOverviewSwitcher = () => {
  const { overview } = useSelector((state) => state.ai);
  const [sorting, setSorting] = useState("Recent");
  const [activeLink, setActiveLink] = useState("All");
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-13 gap-3 mt-4 px-3">
      {/* Left content */}
      <div className="col-span-9">
        <div className="flex flex-col gap-2.5">
          {/* Spend trend and forecast graph */}
          <SpendTrendChart data={overview?.spend_trend} />
          {/* Showcard for ai predictions */}
          <div className="flex flex-col mt-3 gap-2">
            {/* Link Bar */}
            <LinkBar
              activeLink={activeLink}
              setActiveLink={setActiveLink}
              sorting={sorting}
              setSorting={setSorting}
            />
            {/* Show the link dashboard */}
            <LinkDashboard activeLink={activeLink} sorting={sorting} />
          </div>
        </div>
      </div>

      {/* Right content */}
      <div className="grid-cols-5 ">I am right content</div>
    </div>
  );
};

export default MainOverviewSwitcher;
