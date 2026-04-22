import { CircleAlert, Sparkles } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const Body = () => {
  // Basics
  const { queryData, chatLoading } = useSelector((state) => state.chat);
  console.log("Ayo hai yeta response: ", queryData);
  return (
    <div className="min-h-56 overflow-y-scroll">
      {queryData.length === 0 ? (
        <div className="flex text-gray-400 w-full h-full items-center justify-center">
          <div className="flex flex-col items-center">
            <CircleAlert className=" size-10" />
            <p className="text-2xl text-gray-500    font-semibold ">
              No message history
            </p>
            <span className="text-xs ">
              Please chat and query about your expense records
            </span>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-full overflow-y-scroll flex  flex-col  justify-end items-end">
          {queryData.map((i, index) => {
            return (
              <div
                className="flex gap-2 items-center max-h-32 overflow-y-auto my-2 px-2"
                key={index}
              >
                {/* Show the ai icon if the sender is ai */}
                {i.sender === "ai" && (
                  <span className="p-2 bg-indigo-400 rounded-lg">
                    <Sparkles className="size-4 text-amber-300 fill-amber-300" />
                  </span>
                )}
                <p
                  className={`p-2 min-w-1/2 wrap-break-word px-3 text-xs rounded-2xl ${i.sender === "ai" ? "bg-slate-200 max-w-10/12 text-gray-500 self-start" : "bg-indigo-600 text-white self-end"}`}
                >
                  {i.message}
                </p>
              </div>
            );
          })}
          {/* If chat is loading show the chat bubble */}
          {chatLoading && (
            <div className="bg-slate-200 text-gray-500 rounded-2xl px-3 py-2 text-xs self-start m-4">
              <span className="flex gap-1">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:200ms]"></span>
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:400ms]"></span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Body;
