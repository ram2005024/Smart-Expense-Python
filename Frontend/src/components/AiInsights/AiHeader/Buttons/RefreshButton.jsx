import React from "react";
import { RefreshCw } from "lucide-react";
import { useAxios } from "../../../../hooks/useAxios";
import { useDispatch, useSelector } from "react-redux";
import {
  setOverview,
  setRefreshing,
  unsetIsRefreshing,
} from "../../../../store/slices/aiSlice";
import toast from "react-hot-toast";

const RefreshButton = () => {
  const { selectedDate } = useSelector((state) => state.ai);
  const axios = useAxios();
  const dispatch = useDispatch();
  const handleRefresh = async () => {
    try {
      dispatch(setRefreshing());
      const res = await axios.get(
        `ai/overview?date=${selectedDate}&refresh=true`,
      );
      if (res.status == 200) {
        await dispatch(setOverview(res.data)).unwrap();
        toast.success("Refresh successfully");
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(unsetIsRefreshing());
    }
  };
  return (
    <button
      onClick={() => handleRefresh()}
      className="flex cursor-pointer items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
    >
      <RefreshCw className="w-4 h-4" />
      <span>Refresh</span>
    </button>
  );
};

export default RefreshButton;
