import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axios/axiosInstance";
export const fetchOverview = createAsyncThunk(
  "ai-slice/fetchOverview",
  async (date, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`ai/overview?date=${date}`);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Unknown error",
      );
    }
  },
);
