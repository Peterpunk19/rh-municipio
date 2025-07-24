import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

interface EntityFiltersState {
  sortBy: string;
  values: Record<string, any>;
  searchTerm: string;
  filterOpen: boolean;
  title: string;
  showSearchBar: boolean;
}

interface EntityConfig {
  name: string;
  initialSortBy?: string;
  initialSearchTerm?: string;
  title?: string;
  showSearchBar?: boolean;
}

export const createFiltersSlice = (configs: EntityConfig[]) => {
  const initialState: Record<string, EntityFiltersState> = {};

  configs.forEach((config) => {
    initialState[config.name] = {
      sortBy: config.initialSortBy || "id",
      searchTerm: config.initialSearchTerm || "",
      values: {},
      filterOpen: false,
      title: config.title || "",
      showSearchBar: config.showSearchBar || true,
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
      updateFilterOpen: (state, action: PayloadAction<{ entity: string; filterOpen: boolean }>) => {
        const { entity, filterOpen } = action.payload;
        if (state[entity]) {
          state[entity].filterOpen = filterOpen;
        }
      },
      updateConfigFilters: (state, action: PayloadAction<{ entity: string; title: string, showSearchBar: boolean }>) => {
        const { entity, title, showSearchBar } = action.payload;
        if (state[entity]) {
          state[entity].title = title;
          state[entity].showSearchBar = showSearchBar;
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

const employeesIncidentsConfig: EntityConfig = {
  name: "employeesIncidents",
  initialSortBy: "name",
  title: "Incidencias de empleados",
  showSearchBar: true,
};

const employeeRequestsConfig: EntityConfig = {
  name: "employeeRequests",
  initialSortBy: "created_at",
  title: "Solicitudes de empleados",
  showSearchBar: true,
};

const incidentsRolesPermissionsConfig: EntityConfig = {
  name: "incidentsRolesPermissions",
  initialSortBy: "id",
  title: "Permisos de Incidencias",
  showSearchBar: true,
};

const incidentsRulesConfig: EntityConfig = {
  name: "incidentsRules",
  initialSortBy: "id",
  title: "Lineamientos de Incidencias",
  showSearchBar: true,
};

const userConfig: EntityConfig = {
  name: "user",
  initialSortBy: "email",
};

const employeesAttendancesConfig: EntityConfig = {
  name: "employeesAttendances",
  initialSortBy: "name",
  title: "Asistencias de empleados",
  showSearchBar: true,
};

export const filtersSlice = createFiltersSlice([
  employeeConfig,
  userConfig,
  employeesIncidentsConfig,
  employeeRequestsConfig,
  employeesAttendancesConfig,
  incidentsRolesPermissionsConfig,
  incidentsRulesConfig,
]);

export const { updateFilter, updateSearch, sortBy, resetFilters, updateFilterOpen, updateConfigFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
