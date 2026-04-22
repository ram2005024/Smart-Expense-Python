import { Dot, Sparkle, Sparkles } from "lucide-react";
import React from "react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

const MainChat = ({ height, bodyHeight }) => {
  return (
    <div
      style={{
        height: height,
      }}
      className="
   flex flex-col   bg-white  rounded-lg "
    >
      {/* Header  */}
      <Header />
      {/* Body */}
      <Body bodyHeight={bodyHeight} />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainChat;
