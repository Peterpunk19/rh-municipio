import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import {formatDate} from "@/utils/formatter";

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
  values?: Record<string, any>;
}

export const createFiltersSlice = (configs: EntityConfig[]) => {
  const initialState: Record<string, EntityFiltersState> = {};

  configs.forEach((config) => {
    initialState[config.name] = {
      sortBy: config.initialSortBy || "id",
      searchTerm: config.initialSearchTerm || "",
      values: config.values || {},
      filterOpen: false,
      title: config.title || "",
      showSearchBar: config.showSearchBar ?? true,
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
      updateConfigFilters: (
        state,
        action: PayloadAction<{ entity: string; title: string; showSearchBar: boolean }>,
      ) => {
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
  values: {
    created_at: formatDate(new Date(), "yyyy-MM-dd")
  }
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

const requestsRolesPermissionsConfig: EntityConfig = {
  name: "requestsRolesPermissions",
  initialSortBy: "id",
  title: "Permisos de Solicitudes por Rol",
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

const employeesPayrollConfig: EntityConfig = {
  name: "employeesPayroll",
  initialSortBy: "name",
  title: "Nóminas de empleados",
  showSearchBar: true,
};

const salariesConfig: EntityConfig = {
  name: "salaries",
  initialSortBy: "id",
  title: "Salarios",
  showSearchBar: true,
};

const employeeTypeConfig: EntityConfig = {
  name: "employee-type",
  initialSortBy: "id",
  title: "Tipos de Empleado",
  showSearchBar: false,
};

const categoryConfig: EntityConfig = {
  name: "category",
  initialSortBy: "id",
  title: "Categorías",
  showSearchBar: false,
};

const holidayConfig: EntityConfig = {
  name: "holiday",
  initialSortBy: "date",
  title: "Días Festivos",
  showSearchBar: false,
};

const incidentConfig: EntityConfig = {
  name: "incident",
  initialSortBy: "id",
  title: "Tipos de Incidencias",
  showSearchBar: false,
};

const locationConfig: EntityConfig = {
  name: "location",
  initialSortBy: "id",
  title: "Ubicaciones",
  showSearchBar: false,
};

const maritalStatusConfig: EntityConfig = {
  name: "marital-status",
  initialSortBy: "id",
  title: "Estado Civil",
  showSearchBar: false,
};

const schoolingConfig: EntityConfig = {
  name: "schooling",
  initialSortBy: "id",
  title: "Escolaridad",
  showSearchBar: false,
};

const occupationConfig: EntityConfig = {
  name: "occupation",
  initialSortBy: "id",
  title: "Ocupaciones",
  showSearchBar: false,
};

const professionConfig: EntityConfig = {
  name: "profession",
  initialSortBy: "id",
  title: "Profesiones",
  showSearchBar: false,
};

const requestConfig: EntityConfig = {
  name: "request",
  initialSortBy: "id",
  title: "Tipos de Solicitud",
  showSearchBar: false,
};

const secretariaConfig: EntityConfig = {
  name: "secretaria",
  initialSortBy: "id",
  title: "Secretarías",
  showSearchBar: false,
};

const direccionConfig: EntityConfig = {
  name: "direccion",
  initialSortBy: "id",
  title: "Direcciones",
  showSearchBar: false,
};

const tradeUnionConfig: EntityConfig = {
  name: "trade-union",
  initialSortBy: "id",
  title: "Sindicatos",
  showSearchBar: false,
};

export const filtersSlice = createFiltersSlice([
  employeeConfig,
  userConfig,
  employeesIncidentsConfig,
  employeeRequestsConfig,
  employeesAttendancesConfig,
  incidentsRolesPermissionsConfig,
  incidentsRulesConfig,
  salariesConfig,
  requestsRolesPermissionsConfig,
  employeesPayrollConfig,
  employeeTypeConfig,
  categoryConfig,
  holidayConfig,
  incidentConfig,
  locationConfig,
  maritalStatusConfig,
  schoolingConfig,
  occupationConfig,
  professionConfig,
  requestConfig,
  secretariaConfig,
  direccionConfig,
  tradeUnionConfig,
]);

export const { updateFilter, updateSearch, sortBy, resetFilters, updateFilterOpen, updateConfigFilters } =
  filtersSlice.actions;
export default filtersSlice.reducer;
