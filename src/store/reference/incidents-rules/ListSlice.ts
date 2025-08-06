import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import { getIncidentsRules as fetchDataAPI } from "@/services/incidents-rules";
import { updateTotal } from "@/store/tables/PaginationSlice";

interface StateType {
  data: any[];
  search: string;
  sortBy: string;
  total: number;
  page: number;
  limit: number;
  emptyMessage: string;
  error: string;
}

const initialState = {
  data: [],
  search: "",
  sortBy: "id",
  total: 0,
  page: 1,
  limit: 10,
  emptyMessage: "",
  error: "",
};

export const listSlice = createSlice({
  name: "incidentsRulesList",
  initialState,
  reducers: {
    hasError(state: StateType, action) {
      state.error = action.payload;
    },
    getData: (state, action) => {
      state.data = action.payload;
    },
    emptyMessage: (state, action) => {
      state.emptyMessage = action.payload;
    },
  },
});

export const { hasError, getData, emptyMessage } = listSlice.actions;

export const fetchData = (filters: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await fetchDataAPI(filters);
    dispatch(getData(response.responseObject.data));
    dispatch(updateTotal(response.responseObject.total));
    if (response.responseObject.total === 0) {
      dispatch(emptyMessage(response.message));
    }
  } catch (error) {
    dispatch(hasError(error));
  }
};

export default listSlice.reducer;
