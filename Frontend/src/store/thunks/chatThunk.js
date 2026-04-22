import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axios/axiosInstance";
// Message send thunk
export const sendMessage = createAsyncThunk(
  "chat/send-messages",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/ai/chat", {
        query: data.query,
      });
      await new Promise((resolve) => {
        setTimeout(resolve, 3000);
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  },
);
