import { createSlice } from "@reduxjs/toolkit";
import { fetchOverview } from "../thunks/aiThunk";

const initialState = {
  overview: null,
  ai_loading: false,
  isRefreshing: false,
  anomaliesCount: 0,
  riskCount: 0,
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
    setRefreshing: (state) => {
      state.isRefreshing = true;
    },
    setOverview: (state, action) => {
      state.overview = action.payload;
    },
    unsetIsRefreshing: (state) => {
      state.isRefreshing = false;
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
        state.anomaliesCount = 0;
        state.riskCount = 0;
        if (typeof action.payload == "object") {
          Object.entries(action.payload?.anomalies).map(([_, value]) => {
            if (Array.isArray(value)) {
              state.anomaliesCount += value.length;

              value.forEach((i) => {
                if (i.risk && i.risk === "High") {
                  state.riskCount += 1;
                }
              });
            }
          });
        }
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.ai_loading = false;
        state.ai_error = action.payload;
      });
  },
});

export default aiSlice.reducer;
export const { setRefreshing, setOverview, unsetIsRefreshing } =
  aiSlice.actions;
