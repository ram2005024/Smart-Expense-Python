import React from "react";

const Suggestion = () => {
  const suggestion_queries = [
    "Hello, What is the purpose of this?",
    "What is my overspend?",
    "What is my spend prediction?",
    "What are my top savings?",
    "Can you compare my expenses?",
    "Is there a sudden jump in my expenses?",
  ];
  return (
    <div className="w-full py-4 px-3 flex flex-col gap-2 bg-white rounded-lg">
      <span className=" font-semibold text-gray-900">💡 Try asking</span>
      {suggestion_queries.map((item, index) => (
        <div
          key={index}
          className="bg-slate-100 rounded-lg p-2 text-xs font-semibold text-black/60"
        >
          "{item}"
        </div>
      ))}
    </div>
  );
};

export default Suggestion;
