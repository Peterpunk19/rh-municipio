import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserState } from "@/store/users/Interface";

const initialState: IUserState = {
  values: {
    name: "",
    paternalLastName: "",
    maternalLastName: "",
  },
  errors: {
    name: "",
    paternalLastName: "",
    maternalLastName: "",
  },
  helperText: {
    categoryId: "",
  },
  catalogs: {
    municipalities: null,
    direcciones: null,
    categories: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateCatalogs: (state, action: PayloadAction<Partial<IUserState["catalogs"]>>) => {
      state.catalogs = { ...state.catalogs, ...action.payload };
    },
    updateValues: (state, action: PayloadAction<Partial<IUserState["values"]>>) => {
      state.values = { ...state.values, ...action.payload };
    },
    updateHelperText: (state, action: PayloadAction<Partial<IUserState["helperText"]>>) => {
      state.helperText = { ...state.helperText, ...action.payload };
    },
    updateErrors: (state, action: PayloadAction<Partial<IUserState["errors"]>>) => {
      state.errors = { ...state.errors, ...action.payload };
    },
    resetFormValues: (state) => {
      state.values = initialState.values;
    },
  },
});

export const { updateValues, updateErrors, resetFormValues, updateHelperText, updateCatalogs } = userSlice.actions;

export default userSlice.reducer;
