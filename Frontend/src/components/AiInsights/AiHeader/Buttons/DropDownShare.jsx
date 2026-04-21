import React, { useState } from "react";
import { Link, Download, Mail, X, DownloadIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAxios } from "../../../../hooks/useAxios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import SnapshotUI from "../SnapshotUI";

const DropDownShare = ({ open, setOpen }) => {
  const [showSnapshot, setShowSnapshot] = useState(false);
  const { overview } = useSelector((state) => state.ai);
  // Basics
  const axios = useAxios();
  // Function for handeling the copy link
  const handleCopyLink = async () => {
    try {
      const res = await axios.get("/ai/generate_share_link");
      if (res.status == 200) {
        navigator.clipboard
          .writeText(res.data.share_link)
          .then(() => {
            toast.success("Share link copied successfully");
          })
          .catch((error) => {
            toast.error("Failed to copy:", error);
          });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleShareEmail = async () => {
    try {
      const res = await axios.get("/ai/generate_share_link");
      if (res.status == 200) {
        const subject = encodeURIComponent(
          `Finanicial snapshot of ${overview?.user?.username}`,
        );
        const body = encodeURIComponent(
          `Here’s my financial snapshot link:\n\n${res.data.share_link}`,
        );
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          onClick={() => setOpen(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50"
        >
          {/* Inner card */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-80 bg-white shadow-lg rounded-md border border-gray-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">Share</span>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Options */}
            <ul className="flex flex-col">
              <li>
                <button
                  onClick={() => handleCopyLink()}
                  className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <Link className="w-4 h-4 text-gray-500" />
                  Copy Link
                </button>
              </li>
              <li>
                <button
                  className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 w-full"
                  onClick={() => setShowSnapshot(true)}
                >
                  <DownloadIcon className="w-4 h-4 text-gray-500" />
                  Download Snapshot
                </button>
                {showSnapshot && (
                  <SnapshotUI
                    data={overview}
                    username={overview?.user?.username}
                    onClose={() => setShowSnapshot(false)}
                  />
                )}
              </li>
              <li>
                <button
                  onClick={() => handleShareEmail()}
                  className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <Mail className="w-4 h-4 text-gray-500" />
                  Share via Email
                </button>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DropDownShare;
