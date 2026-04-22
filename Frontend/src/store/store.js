import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./slices/expenseSlice.js";
import budgetReducer from "./slices/budgetSlice.js";
import aiReducer from "./slices/aiSlice.js";
import chatReducer from "./slices/chatSlice.js";
export const store = configureStore({
  reducer: {
    expense: expenseReducer,
    budget: budgetReducer,
    ai: aiReducer,
    chat: chatReducer,
  },
});
