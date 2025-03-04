import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { getUsers as fetchUsersAPI } from "@/services/user";
import { updateTotal } from "@/store/tables/PaginationSlice";

interface StateType {
  users: any[];
  search: string;
  sortBy: string;
  total: number;
  page: number;
  limit: number;
  filters: {
    active: boolean | null;
    role: number;
  };
  emptyMessage: string;
  error: string;
}

const initialState = {
  users: [],
  search: "",
  sortBy: "id",
  total: 0,
  page: 1,
  limit: 10,
  filters: {
    active: null,
    role: 1,
  },
  emptyMessage: "",
  error: "",
};

export const UsersFiltersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    hasError(state: StateType, action) {
      state.error = action.payload;
    },
    getUsers: (state, action) => {
      state.users = action.payload;
    },
    searchUser: (state, action) => {
      state.search = action.payload;
    },
    sortById(state, action) {
      state.sortBy = action.payload;
    },
    filterUsers(state, action) {
      state.filters.active = action.payload.active;
    },
    filterReset(state) {
      state.filters.active = null;
      state.sortBy = "id";
    },
    emptyMessage: (state, action) => {
      state.emptyMessage = action.payload;
    },
  },
});
export const { hasError, getUsers, searchUser, sortById, filterUsers, filterReset, emptyMessage } =
  UsersFiltersSlice.actions;

export const fetchUsers = (filters: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await fetchUsersAPI(filters);
    dispatch(getUsers(response.responseObject.users));
    dispatch(updateTotal(response.responseObject.total));
    if (response.responseObject.total === 0) {
      dispatch(emptyMessage(response.message));
    }
  } catch (error) {
    dispatch(hasError(error));
  }
};

export default UsersFiltersSlice.reducer;
