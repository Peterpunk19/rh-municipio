import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { getEmployeesAttendances as fetchEmployeesAPI } from "@/services/employees-attendances";
import { updateTotal } from "@/store/tables/PaginationSlice";

interface StateType {
  employeesAttendances: any[];
  search: string;
  sortBy: string;
  total: number;
  page: number;
  limit: number;
  filters: {
    checkIn: string;
    checkOut: string;
  };
  emptyMessage: string;
  error: string;
}

const initialState = {
  employeesAttendances: [],
  search: "",
  sortBy: "id",
  total: 0,
  page: 1,
  limit: 10,
  filters: {
    checkIn: "",
    checkOut: "",
  },
  emptyMessage: "",
  error: "",
};

export const EmployeesAttendancesSlice = createSlice({
  name: "employeesAttendances",
  initialState,
  reducers: {
    hasError(state: StateType, action) {
      state.error = action.payload;
    },
    getEmployees: (state, action) => {
      state.employeesAttendances = action.payload;
    },
    searchEmployee: (state, action) => {
      state.search = action.payload;
    },
    sortById(state, action) {
      state.sortBy = action.payload;
    },
    filterEmployees(state, action) {
      state.filters.checkIn = action.payload.checkIn;
      state.filters.checkOut = action.payload.checkOut;
    },
    filterReset(state) {
      state.filters.checkIn = "";
      state.filters.checkOut = "";
      state.sortBy = "id";
    },
    emptyMessage: (state, action) => {
      state.emptyMessage = action.payload;
    },
  },
});

export const { hasError, getEmployees, searchEmployee, sortById, filterEmployees, filterReset, emptyMessage } =
  EmployeesAttendancesSlice.actions;

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

export default EmployeesAttendancesSlice.reducer;
