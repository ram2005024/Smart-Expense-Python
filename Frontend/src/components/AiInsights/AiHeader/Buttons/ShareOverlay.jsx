import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Image, FileText } from "lucide-react";
import html2canvas from "html2canvas";
import OverviewUI from "../ShareOverviewUI";
import { useSelector } from "react-redux";

const ShareOverlay = ({ open, setOpen }) => {
  const { overview } = useSelector((state) => state.ai);
  const overviewRef = useRef();

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [setOpen]);

  const handleDownloadPNG = async () => {
    if (!overviewRef.current) {
      console.error("overviewRef is null — ensure OverviewUI uses forwardRef");
      return;
    }

    const canvas = await html2canvas(overviewRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
    });

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "overview.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Hidden Overview for capture */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <OverviewUI ref={overviewRef} data={overview} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 30 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md z-50 rounded-2xl bg-white shadow-xl border border-gray-200 p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  Share Overview
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-md hover:bg-gray-100 transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <button
                  onClick={handleDownloadPNG}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700"
                >
                  <Image className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Download as PNG</span>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Download as PDF</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareOverlay;
