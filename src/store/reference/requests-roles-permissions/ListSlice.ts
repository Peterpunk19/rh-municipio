"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRequestsRolesPermissions } from "@/services/requests-roles-permissions";
import { updateTotal } from "@/store/tables/PaginationSlice";
import type { AppDispatch } from "@/store/store";

const fetchDataAPI = async (query: string) => {
  const response = await getRequestsRolesPermissions(
    query ? { ...Object.fromEntries(new URLSearchParams(query)) } : {},
  );
  return response;
};

interface RequestsRolesPermissionsState {
  data: any[];
  meta: any;
  loading: boolean;
  error: string | null;
  emptyMessage: string;
}

const initialState: RequestsRolesPermissionsState = {
  data: [],
  meta: {},
  loading: false,
  error: null,
  emptyMessage: "No se encontraron datos de permisos de solicitudes",
};

const requestsRolesPermissionsSlice = createSlice({
  name: "requestsRolesPermissions",
  initialState,
  reducers: {
    hasError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getData: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    emptyMessage: (state, action) => {
      state.emptyMessage = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { hasError, getData, emptyMessage, setLoading } = requestsRolesPermissionsSlice.actions;

export const fetchData = (filters: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await fetchDataAPI(filters);
    dispatch(getData(response.responseObject.data));
    dispatch(updateTotal(response.responseObject.total));
    if (response.responseObject.total === 0) {
      dispatch(emptyMessage(response.message));
    }
  } catch (error: any) {
    dispatch(hasError(error?.message || "Error fetching data"));
  }
};

export default requestsRolesPermissionsSlice.reducer;
