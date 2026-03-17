import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./slices/expenseSlice.js"
import budgetReducer from "./slices/budgetSlice.js"
export const store = configureStore({
    reducer: {
        expense: expenseReducer,
        budget: budgetReducer
    }
})