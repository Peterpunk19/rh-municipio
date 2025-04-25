import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StateType {
  employeeData: any;
  formData: {
    employeeId: string;
    description: string;
    checkIn: null;
    checkOut: null;
  };
  errors: {
    [key: string]: string;
  };
  emptyMessage: string;
  error: string;
}

const initialState: StateType = {
  employeeData: null,
  formData: {
    employeeId: "0",
    description: "",
    checkIn: "",
    checkOut: "",
  },
  errors: {},
  emptyMessage: "",
  error: "",
};

export const CreateEmployeeAttendanceSlice = createSlice({
  name: "createEmployeeAttendance",
  initialState,
  reducers: {
    setEmployeeData(state, action: PayloadAction<any>) {
      state.employeeData = action.payload;
    },
    updateFormData(state, action: PayloadAction<{ field: string; value: any }>) {
      const { field, value } = action.payload;
      const fields = field.split('.');
      let current: any = state.formData;

      for (let i = 0; i < fields.length - 1; i++) {
        current = current[fields[i]];
      }

      current[fields[fields.length - 1]] = value;
    },
    setErrors(state, action: PayloadAction<{ [key: string]: string }>) {
      state.errors = action.payload;
    },
    clearErrors(state) {
      state.errors = {};
    },
    resetForm(state) {
      state.formData = initialState.formData;
      state.errors = {};
    },
  },
});

export const {
  setEmployeeData,
  updateFormData,
  setErrors,
  clearErrors,
  resetForm
} = CreateEmployeeAttendanceSlice.actions;


export default CreateEmployeeAttendanceSlice.reducer;
