import React from "react";

const LinkBar = ({ activeLink, setActiveLink, sorting, setSorting }) => {
  const links = ["All", "Warnings", "Forecasts", "Tips", "Anomalies"];

  return (
    <div className="w-full flex justify-between items-center">
      {/* LINKS */}
      <div className="flex items-center gap-2 flex-wrap">
        {links.map((item, index) => {
          const isActive = activeLink === item;

          return (
            <button
              key={index}
              onClick={() => setActiveLink(item)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-500 text-white shadow-sm"
                    : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* SORT */}
      <select
        value={sorting}
        onChange={(e) => setSorting(e.target.value)}
        className="border border-gray-200 px-4 py-2 bg-white text-gray-700 text-xs rounded-2xl font-semibold shadow-sm"
      >
        <option value="Recent">Sort: Latest</option>
        <option value="Previous">Sort: Previous</option>
      </select>
    </div>
  );
};

export default LinkBar;
