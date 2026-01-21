import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { getEmployeesPayroll as fetchEmployeesAPI } from "@/services/employees-payroll";
import { updateTotal } from "@/store/tables/PaginationSlice";

interface StateType {
  employeesPayroll: any[];
  search: string;
  sortBy: string;
  total: number;
  page: number;
  limit: number;
  filters: {
    employeeId: string;
    from: string;
    to: string;
  };
  emptyMessage: string;
  error: string;
}

const initialState = {
  employeesPayroll: [],
  search: "",
  sortBy: "id",
  total: 0,
  page: 1,
  limit: 10,
  filters: {
    employeeId: "",
    from: "",
    to: "",
  },
  emptyMessage: "",
  error: "",
};

export const EmployeesPayrollSlice = createSlice({
  name: "employeesPayroll",
  initialState,
  reducers: {
    hasError(state: StateType, action) {
      state.error = action.payload;
    },
    getEmployees: (state, action) => {
      state.employeesPayroll = action.payload;
    },
    setEmployeeId: (state, action) => {
      state.filters.employeeId = action.payload;
    },
    searchEmployee: (state, action) => {
      state.search = action.payload;
    },
    sortById(state, action) {
      state.sortBy = action.payload;
    },
    filterEmployees(state, action) {
      state.filters.from = action.payload.from;
      state.filters.to = action.payload.to;
    },
    filterReset(state) {
      state.filters.from = "";
      state.filters.to = "";
      state.sortBy = "id";
    },
    emptyMessage: (state, action) => {
      state.emptyMessage = action.payload;
    },
  },
});

export const {
  hasError,
  getEmployees,
  searchEmployee,
  sortById,
  filterEmployees,
  filterReset,
  emptyMessage,
  setEmployeeId,
} = EmployeesPayrollSlice.actions;

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

export default EmployeesPayrollSlice.reducer;
