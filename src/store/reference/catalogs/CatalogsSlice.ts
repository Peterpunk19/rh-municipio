import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../store";
import { fetchCatalogData } from "@/services/catalogs";
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
  loading: boolean;
}

const initialState: StateType = {
  data: [],
  search: "",
  sortBy: "id",
  total: 0,
  page: 1,
  limit: 10,
  emptyMessage: "",
  error: "",
  loading: false,
};

export const catalogsSlice = createSlice({
  name: "catalogsList",
  initialState,
  reducers: {
    hasError(state: StateType, action) {
      state.error = action.payload;
      state.loading = false;
    },
    getData: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    emptyMessage: (state, action) => {
      state.emptyMessage = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { hasError, getData, emptyMessage, setLoading } = catalogsSlice.actions;

export const fetchCatalog = (catalogName: string, queryParams?: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));

    const params: Record<string, any> = {};
    if (queryParams) {
      queryParams.split("&").forEach((param) => {
        const [key, value] = param.split("=");
        if (key && value) {
          params[key] = value;
        }
      });
    }

    const response = await fetchCatalogData(catalogName, Object.keys(params).length > 0 ? params : undefined);
    if (response?.success && response?.responseObject) {
      const data = response.responseObject.data || response.responseObject;
      const total =
        response.responseObject.total || (Array.isArray(response.responseObject) ? response.responseObject.length : 0);

      dispatch(getData(data));
      dispatch(updateTotal(total));
      if (Array.isArray(data) && data.length === 0) {
        dispatch(emptyMessage("No hay datos disponibles"));
      } else {
        dispatch(emptyMessage("hola"));
      }
    } else {
      dispatch(getData([]));
      dispatch(emptyMessage("No hay datos disponibles"));
    }
  } catch (error) {
    dispatch(hasError(error));
    dispatch(getData([]));
    dispatch(emptyMessage("Error al cargar datos"));
  }
};

export default catalogsSlice.reducer;
