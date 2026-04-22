import { Send } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { sendMessage } from "../../../../../../store/thunks/chatThunk";
import { setQueryData } from "../../../../../../store/slices/chatSlice";

const Footer = () => {
  // Basics
  const dispatch = useDispatch();
  const suggestion_queries = [
    "Hi",
    "What is my overspend?",
    "What is my spend prediction?",
    "What are my top savings?",
    "Can you compare my expenses?",
    "Is there a sudden jump in my expenses?",
  ];
  const [query, setQuery] = useState("");
  const { chatLoading } = useSelector((state) => state.chat);
  const handleSend = async () => {
    try {
      dispatch(
        setQueryData({
          sender: "user",
          receiver: "ai",
          message: query,
        }),
      );
      await dispatch(sendMessage({ query: query })).unwrap();
      setQuery("");
    } catch (error) {
      console.error(error);
      dispatch(
        setQueryData({
          sender: "ai",
          receiver: "user",
          message: error || "Something went wrong",
        }),
      );
      setQuery("");
    }
  };
  return (
    <div className="flex-1">
      {/* For suggestions bar */}
      <div
        className="border-t border-t-gray-100 p-2 px-3 flex gap-2 overflow-x-auto whitespace-nowrap
      "
      >
        {suggestion_queries.map((item, index) => (
          <button
            className={`p-1 px-3 bg-indigo-100 rounded-2xl border border-blue-300 text-indigo-500  text-xs min-w-fit font-semibold `}
            key={index}
            onClick={() => {
              if (query) {
                toast.error("Please clear the input field first");
                return;
              }
              !query && setQuery(item);
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <div
        className="border-t border-t-gray-200 p-2 px-3 flex gap-3
      "
      >
        <input
          type="text"
          className="border transition-all focus:ring focus:ring-indigo-300 border-gray-300 bg-slate-100 text-xs outline-none text-gray-500 rounded-lg flex-1 px-4 p-2 w-9/12 "
          placeholder="Ask about your expenses... "
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className={`p-2 bg-indigo-500 text-white rounded-lg  transition-all  ${!query ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-indigo-600"}`}
          disabled={!query || chatLoading}
          onClick={() => handleSend()}
        >
          <Send className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default Footer;
