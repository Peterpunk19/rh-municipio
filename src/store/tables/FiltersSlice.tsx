import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface FiltersState {
  sortBy: string;
  values: Record<string, any>;
  search: string;
}

const initialState: FiltersState = {
  sortBy: "id",
  values: {},
  search: "",
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    updateFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.values[action.payload.key] = action.payload.value;
    },
    sortBy(state, action) {
      state.sortBy = action.payload;
    },
    updateSearch(state, action) {
      state.search = action.payload;
    },
    resetFilters: (state) => {
      state.values = {};
    },
  },
});

export const { updateFilter, resetFilters, updateSearch } = filtersSlice.actions;
export default filtersSlice.reducer;
