import { createSlice } from "@reduxjs/toolkit";
import { fetchOverview } from "../thunks/aiThunk";

const initialState = {
  overview: null,
  ai_loading: false,
  ai_error: "",
  selectedDate: new Date().toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  }),
};
const aiSlice = createSlice({
  name: "ai-slice",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.ai_loading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch overview thunk
      .addCase(fetchOverview.pending, (state) => {
        state.ai_loading = true;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.ai_loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.ai_loading = false;
        state.ai_error = action.payload;
      });
  },
});

export default aiSlice.reducer;
export const { setLoading } = aiSlice.actions;
