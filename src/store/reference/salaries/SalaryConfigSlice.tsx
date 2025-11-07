import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISalaryConfigState } from "./Interface";
import type { AppDispatch } from "@/store/store";
import { getAll as getConfigYears } from "@/services/config-years";
import {
  getByYear as getSalariesByYear,
  update as putCategoryEmployeeType,
  create as postCategoryEmployeeType,
  type CategoryEmployeeTypePayload,
} from "@/services/category-employee-types";

const initialState: ISalaryConfigState = {
  values: {
    category_id: null,
    employee_type_id: null,
    salary: null,
    config_year_id: null,
  },
  errors: {
    category_id: "",
    employee_type_id: "",
    salary: "",
    config_year_id: "",
  },
  helperText: {
    salary: "",
  },
  catalogs: {
    categories: { success: false, responseObject: [] },
    employeeTypes: { success: false, responseObject: [] },
    configYears: { success: false, responseObject: [] },
  },
  tableData: [],
  selectedYear: null,
  loading: false,
  error: null,
};

export const salaryConfigSlice = createSlice({
  name: "salaryConfig",
  initialState,
  reducers: {
    updateValues: (state, action: PayloadAction<Partial<ISalaryConfigState["values"]>>) => {
      state.values = { ...state.values, ...action.payload };
    },
    updateErrors: (state, action: PayloadAction<Partial<ISalaryConfigState["errors"]>>) => {
      state.errors = { ...state.errors, ...action.payload };
    },
    updateHelperText: (state, action: PayloadAction<Partial<ISalaryConfigState["helperText"]>>) => {
      state.helperText = { ...state.helperText, ...action.payload };
    },
    updateCatalogs: (state, action: PayloadAction<Partial<ISalaryConfigState["catalogs"]>>) => {
      state.catalogs = { ...state.catalogs, ...action.payload };
    },
    setTableData: (state, action: PayloadAction<any[]>) => {
      state.tableData = action.payload;
    },
    setSelectedYear: (state, action: PayloadAction<number | null>) => {
      state.selectedYear = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetForm: (state) => {
      state.values = initialState.values;
      state.errors = initialState.errors;
      state.helperText = initialState.helperText;
    },
  },
});

export const {
  updateValues,
  updateErrors,
  updateHelperText,
  updateCatalogs,
  setTableData,
  setSelectedYear,
  setLoading,
  setError,
  resetForm,
} = salaryConfigSlice.actions;

export default salaryConfigSlice.reducer;

const processTableData = (data: any[], categories: any[], employeeTypes: any[], hasSelectedYear: boolean) => {
  return categories.map((category: any) => {
    const row: any = {
      id: category.id,
      category_id: category.id,
      category_name: category.display_name,
    };

    employeeTypes.forEach((type: any) => {
      const item = data.find((it: any) => it.category_id === category.id && it.employee_type_id === type.id);

      if (item) {
        row[`type_${type.id}`] = item.salary != null ? Number(item.salary) : null;
        if (item.id) row[`type_${type.id}_id`] = item.id;
      } else if (hasSelectedYear) {
        row[`type_${type.id}`] = null;
      }
    });

    return row;
  });
};

export const fetchConfigYears = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    const result = await getConfigYears();
    if (!result.success) {
      throw new Error((result as any).message || "Error al cargar los años de configuración");
    }
    const years = (result as any).responseObject ?? [];
    dispatch(
      updateCatalogs({
        configYears: { success: true, responseObject: years },
      }),
    );
    return years;
  } catch (err: any) {
    dispatch(setError(err.message || "Error al cargar los años de configuración"));
    return [];
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchSalariesByYear =
  (params: { year: number; categoryId?: number | null }) => async (dispatch: AppDispatch) => {
    try {
      const { year, categoryId } = params;
      dispatch(setLoading(true));
      dispatch(setError(null));
      const result = await getSalariesByYear(year, categoryId);
      if (!result.success) {
        throw new Error((result as any).message || "Error al cargar los salarios");
      }

      const payload = (result as any).responseObject ?? {};
      const categories = payload?.categories || [];
      const employeeTypes = payload?.employeeTypes || [];
      const rows = processTableData(payload?.data || [], categories, employeeTypes, !!year);

      dispatch(
        updateCatalogs({
          categories: { success: true, responseObject: categories },
          employeeTypes: { success: true, responseObject: employeeTypes },
          ...(payload?.configYears && payload.configYears.length
            ? { configYears: { success: true, responseObject: payload.configYears } }
            : {}),
        }),
      );
      dispatch(setTableData(rows));
    } catch (err: any) {
      dispatch(setError(err.message || "No se pudieron cargar los salarios"));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const saveSalaryByYear =
  (payload: CategoryEmployeeTypePayload & { id?: number | null }) => async (dispatch: AppDispatch) => {
    try {
      const { id, ...data } = payload || {};
      const result = id ? await putCategoryEmployeeType(id, data) : await postCategoryEmployeeType(data);
      if (!result.success) {
        throw new Error((result as any).error || (result as any).message || "Error al guardar el salario");
      }
      return (result as any).responseObject;
    } catch (err: any) {
      dispatch(setError(err.message || "Error al guardar el salario"));
      return false;
    }
  };
