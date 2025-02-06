import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  values: Record<string, any>;
}

const initialState: FiltersState = {
  values: {},
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    updateFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.values[action.payload.key] = action.payload.value;
    },
    resetFilters: (state) => {
      state.values = {};
    },
  },
});

export const { updateFilter, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
