import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { getEmployeesIncidents as fetchEmployeesAPI } from "@/services/employees-incidents";
import { updateTotal } from "@/store/tables/PaginationSlice";

interface StateType {
  employeesIncidents: any[];
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
  search: "",
  sortBy: "id",
  total: 0,
  page: 1,
  limit: 10,
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

export default EmployeesIncidentsSlice.reducer;
