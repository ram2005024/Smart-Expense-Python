import React, { useState } from "react";
import { Share2 } from "lucide-react";
import ShareOverlay from "./ShareOverlay";

const ShareButton = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-white rounded-md hover:bg-gray-200 text-sm font-medium text-gray-700"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
        {/* When the share button is click display the overlay */}
      </button>
      <ShareOverlay open={open} setOpen={setOpen} />
    </div>
  );
};

export default ShareButton;
