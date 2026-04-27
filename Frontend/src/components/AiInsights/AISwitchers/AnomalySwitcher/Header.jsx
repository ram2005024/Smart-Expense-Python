import React from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const { overview, riskCount, anomaliesCount } = useSelector(
    (state) => state.ai,
  );

  return (
    <div className="flex justify-between items-center">
      <div className="text-xs text-gray-400  flex items-center gap-0.5">
        <span>{anomaliesCount} detected</span>
        <span>•</span>
        <span>{riskCount} need immediate review.</span>
      </div>
      <div>Here buttons will come</div>
    </div>
  );
};

export default Header;
