import { createSlice } from "@reduxjs/toolkit";
import { fetchBudget, fetchBudgetWithLimit } from "../thunks/budgetThunk";

const initialState = {
    budgets: [],
    budgetsWithLimit: [],
    budgetLoading: false,
    error: null,
    activeBudgetType: "MONTHLY",
    activeView: "GRID",
    isAddBudget: false,
    budgetAdd: false,
    isNewBudgetAdd: false
}
const budgetSlice = createSlice({
    name: "budget-slice",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.budgetLoading = action.payload
        },
        setActiveBudgetType: (state, action) => {
            state.activeBudgetType = action.payload
        },
        setActiveView: (state, action) => {
            state.activeView = action.payload
        },
        setIsAddBudget: (state, action) => {
            state.isAddBudget = action.payload
        },
        setBudgetAdd: (state, action) => {
            state.budgetAdd = action.payload
        },
        setIsNewBudgetAdd: (state, action) => {
            state.isNewBudgetAdd = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            // All Budgets

            .addCase(fetchBudget.pending, (state) => {
                state.budgetLoading = true
                state.error = null
            })
            .addCase(fetchBudget.fulfilled, (state, action) => {
                state.budgetLoading = false
                state.budgets = action.payload
            })
            .addCase(fetchBudget.rejected, (state, action) => {
                state.budgetLoading = false
                state.error = action.payload
            })

            // Budgets with limit
            .addCase(fetchBudgetWithLimit.fulfilled, (state, action) => {
                state.budgetsWithLimit = action.payload
            })
    }
})
export default budgetSlice.reducer
export const { setLoading, setIsNewBudgetAdd, setActiveBudgetType, setActiveView, setIsAddBudget, setBudgetAdd } = budgetSlice.actions
