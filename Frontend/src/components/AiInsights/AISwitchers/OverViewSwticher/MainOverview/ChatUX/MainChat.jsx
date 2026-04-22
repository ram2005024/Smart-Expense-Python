import { Dot, Sparkle, Sparkles } from "lucide-react";
import React from "react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

const MainChat = () => {
  return (
    <div
      className="
  sm:w-sm w-auto flex flex-col h-96 bg-white  rounded-lg "
    >
      {/* Header  */}
      <Header />
      {/* Body */}
      <Body />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainChat;
