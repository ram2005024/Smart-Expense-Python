import React, { useState } from "react";
import { Share } from "lucide-react";
import { useSelector } from "react-redux";
import DropDownShare from "./DropDownShare";

const ShareButton = () => {
  const { overview } = useSelector((state) => state.ai);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-white rounded-md hover:bg-gray-200 text-sm font-medium text-gray-700"
      >
        <Share className="w-4 h-4" />
        <span>Share</span>
      </button>
      {/* Drop down for share button  */}
      <DropDownShare open={isOpen} setOpen={setIsOpen} />
    </div>
  );
};

export default ShareButton;
