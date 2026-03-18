import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../utils/axios/axiosInstance";
// Fetch all the expenses of the user
export const fetchExpenses = createAsyncThunk(
    'expense-slice/fetchExpense',
    async (data, thunkAPI) => {
        try {

            const response = await axiosInstance.get(`/expenses/`, {
                params: {
                    ...data,
                    statuses: data.statuses ? data.statuses.join(",") : null,
                    categories: data.categories ? data.categories.join(",") : null,
                },

            })
            console.log("Ayo", response.data.results)
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
        }

    }
)
// Add expense
export const addExpense = createAsyncThunk(
    "expense-slice/addExpense",
    async (data, thunkAPI) => {
        try {
            const response = await axiosInstance.post(
                "/expenses/", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
            )
            // Refetch the expense of current page
            const currentPage = thunkAPI.getState().expense.currentPage
            thunkAPI.dispatch(fetchExpenses({ page: currentPage, page_size: thunkAPI.getState().expense.page_size, date: thunkAPI.getState().expense.selectedMonth }))
            return response.data
        } catch (error) {

            return thunkAPI.rejectWithValue(error.response?.data?.inactive || error.message || "Something went wrong")
        }
    }
)