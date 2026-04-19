import React from "react";
import { RefreshCw } from "lucide-react";

const RefreshButton = () => {
  return (
    <button className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium">
      <RefreshCw className="w-4 h-4" />
      <span>Refresh</span>
    </button>
  );
};

export default RefreshButton;
