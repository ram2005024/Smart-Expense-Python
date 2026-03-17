import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axios/axiosInstance";

// Thunk to fetch all the budgets

export const fetchBudget = createAsyncThunk(
    'budget-slice/fetchBudget',
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get("/budget/get_all_budgets")
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || "Unknown error")
        }
    }
)
export const fetchBudgetWithLimit = createAsyncThunk(
    'budget-slice/fetchBudgetWithLimit',
    async (limit, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/budget/budgets?limit=${limit}`)
            return res.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)