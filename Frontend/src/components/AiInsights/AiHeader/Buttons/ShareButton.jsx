import React from "react";
import { Share2 } from "lucide-react";

const ShareButton = () => {
  return (
    <button className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-white rounded-md hover:bg-gray-200 text-sm font-medium text-gray-700">
      <Share2 className="w-4 h-4" />
      <span>Share</span>
    </button>
  );
};

export default ShareButton;
