import React from "react";
import { CircleAlert } from "lucide-react";

const BasicShowcaseError = ({
  error = "This error has been occured due to the system crash.Please try again later.",
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center text-center p-6 border border-red-300 bg-red-50 rounded-lg max-w-md">
        <CircleAlert className="size-10 text-red-500 mb-2" />
        <p className="text-lg font-semibold text-red-600">
          Something went wrong
        </p>
        <span className="text-sm text-red-500 mt-1">{error}</span>
      </div>
    </div>
  );
};

export default BasicShowcaseError;
