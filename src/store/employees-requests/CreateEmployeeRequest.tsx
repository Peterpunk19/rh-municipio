import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import REQUEST_TYPES from "@/common/constants/RequestTypes";

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
    addSchedule(state, action: PayloadAction<any>) {
      state.formData.scheduleForm.schedules.push(action.payload);
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
    setCurrentJobSchedule(state, action: PayloadAction<any>) {
      state.currentJobSchedule = action.payload;
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
  addSchedule, 
  removeSchedule,
  setErrors,
  clearErrors,
  setCurrentJobSchedule,
  resetForm
} = CreateEmployeeRequestSlice.actions;

export const validateForm = () => (dispatch: AppDispatch) => {
  const errors: { [key: string]: string } = {};

  if (!state.formData.employeeId || state.formData.employeeId === "0") {
    errors.employeeId = "El empleado es requerido";
  }

  if (!state.formData.description) {
    errors.description = "La descripción es requerida";
  }

  if (!state.formData.typeRequestId || state.formData.typeRequestId === "0") {
    errors.typeRequestId = "El tipo de solicitud es requerido";
  }

  switch (Number(state.formData.typeRequestId)) {
    case REQUEST_TYPES.SCHEDULE:
      if (state.formData.scheduleForm.schedules.length === 0) {
        errors.scheduleForm = "Debe agregar al menos un horario";
      }
      break;
    case REQUEST_TYPES.LOCATION:
      if (!state.formData.locationForm.newLocationId) {
        errors.newLocationId = "La nueva ubicación es requerida";
      }
      if (!state.formData.locationForm.startDate) {
        errors.startDate = "La fecha de inicio es requerida";
      }
      if (!state.formData.locationForm.endDate) {
        errors.endDate = "La fecha de fin es requerida";
      }
      break;
    case REQUEST_TYPES.ATTENDANCE:
      if (!state.formData.attendanceTypeForm.attendanceType) {
        errors.attendanceType = "El tipo de checado es requerido";
      }
      if (!state.formData.attendanceTypeForm.applicationDate) {
        errors.applicationDate = "La fecha de aplicación es requerida";
      }
      break;
    case REQUEST_TYPES.FINGERPRINT:
      if (!state.formData.fingerprintForm.locationId) {
        errors.locationId = "La ubicación es requerida";
      }
      if (!state.formData.fingerprintForm.requestDate) {
        errors.requestDate = "La fecha de registro es requerida";
      }
      break;
  }
  
  dispatch(setErrors(errors));
  return Object.keys(errors).length === 0;
};

export default CreateEmployeeRequestSlice.reducer;
