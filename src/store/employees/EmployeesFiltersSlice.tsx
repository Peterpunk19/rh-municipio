import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import { getEmployees as fetchEmployeesAPI } from '@/services/employees';


interface StateType {
  employees: any[];
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
  error: string;
}

const initialState = {
  employees: [],
  search: '',
  sortBy: 'id',
  total: 0,
  page: 1,
  limit: 10,
  filters: {
    active: true,
    statusEmployeeId: 1,
    locationId: 1,
    startDate: '',
    endDate: '',
  },
  error: '',
};

export const EmployeesFiltersSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {

    hasError(state: StateType, action) {
      state.error = action.payload;
    },

    getEmployees: (state, action) => {
      state.employees = action.payload;
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
      state.filters.locationId =1;
      state.filters.startDate = '';
      state.filters.endDate = '';
      state.sortBy = 'id';
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
} = EmployeesFiltersSlice.actions;

export const fetchEmployees = (filters:string) => async (dispatch: AppDispatch) => {
  try {
    const response = await fetchEmployeesAPI(filters);
    dispatch(getEmployees(response.responseObject.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export default EmployeesFiltersSlice.reducer;
