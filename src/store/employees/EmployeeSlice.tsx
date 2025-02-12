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
    employeeTypeId: "0",
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
    employeeTypeId: "",
    secretariaId: "",
    direccionId: "",
  },
  helperText: {
    salary: "",
  },
};

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    updateValues: (state, action: PayloadAction<Partial<IEmployeeState["values"]>>) => {
      state.values = { ...state.values, ...action.payload };
    },
    updateHelperText: (state, action: PayloadAction<Partial<IEmployeeState["values"]>>) => {
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

export const { updateValues, updateErrors, resetFormValues, updateHelperText } = employeeSlice.actions;

export default employeeSlice.reducer;
