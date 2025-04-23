import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { getEmployeesIncidents as fetchEmployeesAPI } from "@/services/employees-incidents";
import { updateTotal } from "@/store/tables/PaginationSlice";

interface StateType {
  employeesIncidents: any[];
  employeeData: any;
  formData: {
    employeeId: string,
    incidentId: string,
    startDate: string,
    endDate: string,
    description: string,
  };
  errors: {
    [key: string]: string;
  };
  search: string;
  sortBy: string;
  total: number;
  page: number;
  limit: number;
  filters: {
    active: boolean;
    statusEmployeeId: number;
    locationId: number;
    startDate: string;
    endDate: string;
  };
  emptyMessage: string;
  error: string;
}

const initialState = {
  employeesIncidents: [],
  employeeData: null,
  search: "",
  sortBy: "id",
  total: 0,
  page: 1,
  limit: 10,
  formData: {
    employeeId: "0",
    incidentId: "0",
    startDate: "",
    endDate: "",
    description: "",
  },
  errors: {},
  filters: {
    active: true,
    statusEmployeeId: 1,
    locationId: 1,
    startDate: "",
    endDate: "",
  },
  emptyMessage: "",
  error: "",
};

export const EmployeesIncidentsSlice = createSlice({
  name: "employeesIncidents",
  initialState,
  reducers: {
    hasError(state: StateType, action) {
      state.error = action.payload;
    },

    getEmployees: (state, action) => {
      state.employeesIncidents = action.payload;
    },
    searchEmployee: (state, action) => {
      state.search = action.payload;
    },

    sortById(state, action) {
      state.sortBy = action.payload;
    },

    filterEmployees(state, action) {
      state.filters.active = action.payload.active;
      state.filters.statusEmployeeId = action.payload.statusEmployeeId;
      state.filters.locationId = action.payload.locationId;
      state.filters.startDate = action.payload.startDate;
      state.filters.endDate = action.payload.endDate;
    },

    filterReset(state) {
      state.filters.active = true;
      state.filters.statusEmployeeId = 1;
      state.filters.locationId = 1;
      state.filters.startDate = "";
      state.filters.endDate = "";
      state.sortBy = "id";
    },
    emptyMessage: (state, action) => {
      state.emptyMessage = action.payload;
    },

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
export const { hasError, getEmployees, searchEmployee, sortById, filterEmployees, filterReset, emptyMessage } =
  EmployeesIncidentsSlice.actions;

export const fetchEmployees = (filters: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await fetchEmployeesAPI(filters);
    dispatch(getEmployees(response.responseObject.data));
    dispatch(updateTotal(response.responseObject.total));
    if (response.responseObject.total === 0) {
      dispatch(emptyMessage(response.message));
    }
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const {
  setEmployeeData,
  updateFormData,
  setErrors,
  clearErrors,
  resetForm
} = EmployeesIncidentsSlice.actions;


export default EmployeesIncidentsSlice.reducer;
