import { createSlice } from "@reduxjs/toolkit";

interface StateType {
  total: number;
  page: number;
  limit: number;
}

const initialState: StateType = {
  total: 0,
  page: 1,
  limit: 10,
};

export const PaginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    updateTotal(state, action) {
      state.total = action.payload;
    },
    updatePage(state, action) {
      state.page = action.payload;
    },
    updateLimit(state, action) {
      state.limit = action.payload;
    },
  },
});
export const { updateTotal, updatePage, updateLimit } = PaginationSlice.actions;

export default PaginationSlice.reducer;
