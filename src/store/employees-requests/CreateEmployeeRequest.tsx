import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StateType {
  employeeData: any;
  formData: {
    employeeId: string;
    description: string;
    typeRequestId: string;
    fingerprintForm: {
      locationId: number;
      requestDate: string;
    };
    scheduleForm: {
      schedules: Array<{
        startDayId: number;
        endDayId: number;
        startHourId: number;
        endHourId: number;
      }>;
      startDate: string;
      endDate: string;
    };
    locationForm: {
      currentLocationId: number;
      newLocationId: number;
      startDate: string;
      endDate: string;
    };
    attendanceTypeForm: {
      attendanceType: string;
      applicationDate: string;
    };
    adscriptionForm: {
      direccionId: number;
      locationId: number;
      attendanceType: string;
    };
  };
  errors: {
    [key: string]: string;
  };
  currentJobSchedule: any;
  emptyMessage: string;
  error: string;
}

const initialState: StateType = {
  employeeData: null,
  formData: {
    employeeId: "0",
    description: "",
    typeRequestId: "0",
    fingerprintForm: {
      locationId: 0,
      requestDate: "",
    },
    scheduleForm: {
      schedules: [],
      startDate: "",
      endDate: "",
    },
    locationForm: {
      currentLocationId: 0,
      newLocationId: 0,
      startDate: "",
      endDate: "",
    },
    attendanceTypeForm: {
      attendanceType: "",
      applicationDate: "",
    },
    adscriptionForm: {
      attendanceType: "",
      locationId: 0,
      direccionId: 0,
    },
  },
  errors: {},
  currentJobSchedule: null,
  emptyMessage: "",
  error: "",
};

export const CreateEmployeeRequestSlice = createSlice({
  name: "createEmployeeRequest",
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
    removeSchedule(state, action: PayloadAction<number>) {
      state.formData.scheduleForm.schedules.splice(action.payload, 1);
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
  removeSchedule,
  setErrors,
  clearErrors,
  resetForm
} = CreateEmployeeRequestSlice.actions;


export default CreateEmployeeRequestSlice.reducer;
