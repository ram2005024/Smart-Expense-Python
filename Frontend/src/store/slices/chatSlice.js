import { createSlice, isPending, isRejected } from "@reduxjs/toolkit";
import { sendMessage } from "../thunks/chatThunk";

const initialState = {
  queryData: [
    {
      sender: "ai",
      receiver: "user",
      message: `Hi! I've analyzed your ${new Date().toLocaleDateString("en-US", { month: "long" })} expenses.Please query for more details😊 `,
    },
  ],
  ai_response: null,
  chatLoading: false,
  chatError: null,
};
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setQueryData: (state, action) => {
      state.queryData.push({
        sender: action.payload.sender,
        receiver: action.payload.receiver,
        message: action.payload.message,
      });
    },
    clearQueryData: (state) => {
      state.queryData = [];
    },
    toggleChatLoading: (state) => {
      state.chatLoading = !state.chatLoading;
    },
  },
  extraReducers: (builder) => {
    // For sending the message
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.queryData.push({
        sender: "ai",
        receiver: "user",
        message: action.payload.message,
      });
      state.chatLoading = false;
    });

    // Matchers
    builder.addMatcher(isPending(sendMessage), (state) => {
      state.chatLoading = true;
    });
    builder.addMatcher(isRejected(sendMessage), (state, action) => {
      state.chatLoading = false;
      state.chatError = action.payload;
    });
  },
});
export default chatSlice.reducer;
export const { setQueryData, toggleChatLoading, clearQueryData } =
  chatSlice.actions;
