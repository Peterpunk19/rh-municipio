import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CatalogState = {
  [key: string]: Array<{ value: any; label: string }>;
};

const initialState: CatalogState = {};

export const catalogsSlice = createSlice({
  name: "catalogs",
  initialState,
  reducers: {
    setCatalog: (
      state,
      action: PayloadAction<{
        key: string;
        data: Array<{ value: any; label: string }>;
      }>,
    ) => {
      state[action.payload.key] = action.payload.data;
    },
  },
});

export const { setCatalog } = catalogsSlice.actions;
export default catalogsSlice.reducer;
