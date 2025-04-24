import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { getEmployeeRequests as fetchEmployeeRequestsAPI } from "@/services/employee-requests";
import { updateTotal } from "@/store/tables/PaginationSlice";
import { IEmployeesRequestsState } from "./Interface";

const initialState: IEmployeesRequestsState = {
  employeeRequests: [],
  search: "",
  sortBy: "id",
  total: 0,
  page: 1,
  limit: 20,
  filters: {
    request_id: 0,
    request_status_id: 0,
    created_at: "",
    request_date: "",
  },
  emptyMessage: "",
  error: "",
};

export const EmployeesRequestsFiltersSlice = createSlice({
  name: "employeeRequests",
  initialState,
  reducers: {
    hasError(state: IEmployeesRequestsState, action) {
      state.error = action.payload;
    },

    getEmployeeRequests: (state, action) => {
      state.employeeRequests = action.payload;
    },
    searchEmployeeRequest: (state, action) => {
      state.search = action.payload;
    },

    sortById(state, action) {
      state.sortBy = action.payload;
    },

    filterEmployeeRequests(state, action) {
      state.filters.request_id = action.payload.request_id;
      state.filters.request_status_id = action.payload.request_status_id;
      state.filters.created_at = action.payload.created_at;
      state.filters.request_date = action.payload.request_date;
    },

    filterReset(state) {
      state.filters.request_id = 0;
      state.filters.request_status_id = 0;
      state.filters.created_at = "";
      state.filters.request_date = "";
      state.sortBy = "id";
    },
    emptyMessage: (state, action) => {
      state.emptyMessage = action.payload;
    },
  },
});
export const { 
  hasError, 
  getEmployeeRequests, 
  searchEmployeeRequest, 
  sortById, 
  filterEmployeeRequests, 
  filterReset, 
  emptyMessage 
} = EmployeesRequestsFiltersSlice.actions;

export const fetchEmployeeRequests = (filters: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await fetchEmployeeRequestsAPI(filters);
    
    const data = response?.responseObject?.data || [];
    const total = response?.responseObject?.total || 0;
    
    dispatch(getEmployeeRequests(data));
    dispatch(updateTotal(total));
    
    if (total === 0) {
      dispatch(emptyMessage("No se encontraron solicitudes con los filtros seleccionados"));
    } else {
      dispatch(emptyMessage(""));
    }
  } catch (error) {
    dispatch(getEmployeeRequests([]));
    dispatch(updateTotal(0));
    dispatch(emptyMessage("Error al cargar los datos"));
    dispatch(hasError(error));
  }
};

export default EmployeesRequestsFiltersSlice.reducer;
