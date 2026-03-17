import { createSlice } from "@reduxjs/toolkit";
import { addExpense, fetchExpenses } from "../thunks/expenseThunk";
import dayjs from "dayjs";
const initialState = {
    expenses: null,
    filteredExpenses: null,
    expenseLoading: false,
    error: null,
    totalPages: 1,
    totalExpense: 0,
    totalSpend: 0,
    currentPage: 1,
    pageSize: 10,
    filterActive: false,
    fetchError: null,
    filter: null,
    selectedMonth: dayjs().format("MMM YYYY")
}
const expenseSlice = createSlice({
    name: 'expense-slice',
    initialState,
    reducers: {
        setSelectedMonth: (state, action) => {
            state.selectedMonth = action.payload
        },
        setLoading: (state, action) => {
            state.expenseLoading = action.payload
        },
        setTotalExpenseDetail: (state, action) => {
            state.totalSpend = action.payload.total_spent
            state.totalExpense = action.payload.total_expense
        },
        setFilterActive: (state, action) => {
            state.filterActive = action.payload
        },
        setFilter: (state, action) => {
            state.filter = action.payload
        },
        setFilteredExpenses: (state, action) => {
            state.filteredExpenses = action.payload
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => {
                state.expenseLoading = true
                state.error = null
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.expenseLoading = false
                state.expenses = action.payload.results
                state.filteredExpenses = action.payload.results
                state.totalPages = Math.ceil(action.payload.count / state.pageSize)
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.expenseLoading = false
                state.error = action.payload || action.error.message
            })

            .addCase(addExpense.fulfilled, (state, action) => {
                state.expenseLoading = false
                state.expenses = [...state.expenses, action.payload.data]
                state.filteredExpenses = [...state.expenses]
                state.totalPages = Math.ceil(action.payload.count / state.pageSize)
            })
            .addCase(addExpense.rejected, (state, action) => {
                state.fetchError = action.payload
            })
    }
})
export default expenseSlice.reducer
export const { setSelectedMonth, setLoading, setFilter, setFilteredExpenses, setFilterActive, setTotalExpenseDetail, setCurrentPage } = expenseSlice.actions