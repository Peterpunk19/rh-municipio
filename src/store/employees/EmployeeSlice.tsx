import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IEmployeeState } from "@/store/employees/Interface";

const initialState: IEmployeeState = {
  values: {
    name: "",
    paternalLastName: "",
    maternalLastName: "",
    birthday: "",
    rfc: "",
    curp: "",
    genderId: "0",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    addressLine4: "",
    postalCode: "",
    postalCodeSat: "",
    stateId: "0",
    municipalityId: "0",
    startJobDate: "",
    endJobDate: "",
    categoryId: "0",
    employeeTypeName: "",
    tradeUnionId: "",
    secretariaId: "0",
    direccionId: "0",
  },
  errors: {
    name: "",
    paternalLastName: "",
    maternalLastName: "",
    birthday: "",
    rfc: "",
    curp: "",
    genderId: "",
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    addressLine4: "",
    postalCode: "",
    postalCodeSat: "",
    municipalityId: "",
    startJobDate: "",
    endJobDate: "",
    categoryId: "",
    employeeTypeName: "",
    tradeUnionId: "",
    secretariaId: "",
    direccionId: "",
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

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    updateCatalogs: (state, action: PayloadAction<Partial<IEmployeeState["catalogs"]>>) => {
      state.catalogs = { ...state.catalogs, ...action.payload };
    },
    updateValues: (state, action: PayloadAction<Partial<IEmployeeState["values"]>>) => {
      state.values = { ...state.values, ...action.payload };
    },
    updateHelperText: (state, action: PayloadAction<Partial<IEmployeeState["helperText"]>>) => {
      state.helperText = { ...state.helperText, ...action.payload };
    },
    updateErrors: (state, action: PayloadAction<Partial<IEmployeeState["errors"]>>) => {
      state.errors = { ...state.errors, ...action.payload };
    },
    resetFormValues: (state) => {
      state.values = initialState.values;
    },
  },
});

export const { updateValues, updateErrors, resetFormValues, updateHelperText, updateCatalogs } = employeeSlice.actions;

export default employeeSlice.reducer;
