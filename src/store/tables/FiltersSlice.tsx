import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface EntityFiltersState {
  sortBy: string;
  values: Record<string, any>;
  searchTerm: string;
}

interface EntityConfig {
  name: string;
  initialSortBy?: string;
  initialSearchTerm?: string;
}

export const createFiltersSlice = (configs: EntityConfig[]) => {
  const initialState: Record<string, EntityFiltersState> = {};

  configs.forEach((config) => {
    initialState[config.name] = {
      sortBy: config.initialSortBy || "id",
      searchTerm: config.initialSearchTerm || "",
      values: {},
    };
  });

  return createSlice({
    name: "filters",
    initialState,
    reducers: {
      updateFilter: (
        state,
        action: PayloadAction<{
          entity: string;
          key: string;
          value: any;
        }>,
      ) => {
        const { entity, key, value } = action.payload;
        if (state[entity]) {
          state[entity].values[key] = value;
        }
      },
      updateSearch: (state, action: PayloadAction<{ entity: string; searchTerm: string }>) => {
        const { entity, searchTerm } = action.payload;
        if (state[entity]) {
          state[entity].searchTerm = searchTerm;
        }
      },
      sortBy: (state, action: PayloadAction<{ entity: string; sortBy: string }>) => {
        const { entity, sortBy } = action.payload;
        if (state[entity]) {
          state[entity].sortBy = sortBy;
        }
      },
      resetFilters: (state, action: PayloadAction<{ entity: string }>) => {
        const { entity } = action.payload;
        if (state[entity]) {
          state[entity].values = {};
          state[entity].searchTerm = "";
          state[entity].sortBy = configs.find((c) => c.name === entity)?.initialSortBy || "id";
        }
      },
    },
  });
};

const employeeConfig: EntityConfig = {
  name: "employee",
  initialSortBy: "name",
};

const userConfig: EntityConfig = {
  name: "user",
  initialSortBy: "email",
};

export const filtersSlice = createFiltersSlice([employeeConfig, userConfig]);

export const { updateFilter, updateSearch, sortBy, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
