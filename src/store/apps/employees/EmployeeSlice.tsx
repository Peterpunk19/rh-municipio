import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {IEmployeeState} from "@/store/apps/employees/Interface";

const initialState: IEmployeeState = {
  values: {
    name: '',
    paternalLastName: '',
    maternalLastName: '',
    birthday: '',
    rfc: '',
    curp: '',
    genderId: '0',
  },
  errors: {
    name: '',
    paternalLastName: '',
    maternalLastName: '',
    birthday: '',
    rfc: '',
    curp: '',
    genderId: '',
  },
};

export const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    updateValues: (state, action: PayloadAction<Partial<IEmployeeState['values']>>) => {
      state.values = { ...state.values, ...action.payload };
    },
    updateErrors: (state, action: PayloadAction<Partial<IEmployeeState['errors']>>) => {
      state.errors = { ...state.errors, ...action.payload };
    },
    resetFormValues: (state) => {
      state.values = initialState.values;
    },
  },
});


export const { updateValues, updateErrors, resetFormValues } = employeeSlice.actions;

export default employeeSlice.reducer;