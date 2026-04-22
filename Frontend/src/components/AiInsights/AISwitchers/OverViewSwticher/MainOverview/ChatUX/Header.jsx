import { Dot, Sparkles } from "lucide-react";
import React from "react";
import { useDispatch } from "react-redux";
import { clearQueryData } from "../../../../../../store/slices/chatSlice";

const Header = () => {
  const dispatch = useDispatch();
  return (
    <div className="bg-linear-to-tr from-slate-900 to-indigo-900 p-2 rounded-t-lg h-14">
      <div
        className="   flex justify-between w-11/12 mx-auto rounded-lg
        "
      >
        <div className="flex gap-2">
          <Sparkles className="size-5 self-center fill-yellow-300" />

          <div className="flex flex-col items-center">
            <span className="font-semibold text-[17px] text-white -mb-2">
              Expense AI{" "}
            </span>
            <div className="flex items-center font-semibold  text-[10px] text-green-700">
              <span className="inline-flex items-center">
                <Dot className="size-6 animate-pulse text-green-500" />
                <span className="inline-flex -ml-1">
                  <span>Online•</span>
                  <span>Analyzing</span>
                </span>
              </span>
            </div>
          </div>
        </div>
        {/* Clear Button */}
        <button
          onClick={() => dispatch(clearQueryData())}
          className="transition-all h-fit p-2 hover:bg-slate-500/10 active:scale-95 px-4 text-sm text-gray-500 font-semibold cursor-pointer rounded-lg bg-slate-400/10 backdrop:blur-xs "
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Header;
