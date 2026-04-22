import React from "react";
import MainChat from "../OverViewSwticher/MainOverview/ChatUX/MainChat";
import Suggestion from "./Suggestion";
import AiModelStatus from "./AIModelStatus";

const Main = () => {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-13 gap-8 mt-4 px-3">
      {/* Left content */}
      <div className="col-span-8">
        <MainChat height="600px" bodyHeight="445px" />
      </div>

      {/* Right content */}
      <div className="col-span-4 flex flex-col gap-4">
        <Suggestion />
        <AiModelStatus />
      </div>
    </div>
  );
};

export default Main;
