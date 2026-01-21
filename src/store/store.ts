import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

// 🔥 Storage SSR-safe
const createNoopStorage = () => ({
  getItem() {
    return Promise.resolve(null);
  },
  setItem() {
    return Promise.resolve();
  },
  removeItem() {
    return Promise.resolve();
  },
});

const storage = typeof window !== "undefined" ? require("redux-persist/lib/storage").default : createNoopStorage();

/* ===========================
   Reducers
=========================== */

import counterReducer from "./counter/counterSlice";
import CustomizerReducer from "./customizer/CustomizerSlice";
import EmployeesReducer from "@/store/employees/EmployeeSlice";
import UsersReducer from "@/store/users/UserSlice";
import EmployeesFiltersReducer from "./employees/EmployeesFiltersSlice";
import UsersFiltersReducer from "./users/UsersFiltersSlice";
import FiltersReducer from "./tables/FiltersSlice";
import PaginationReducer from "./tables/PaginationSlice";
import catalogsReducer from "./tables/CatalogsSlice";
import EmployeesIncidentsSlice from "@/store/employees-incidents/EmployeesIncidentsSlice";
import EmployeesRequestsFiltersSlice from "@/store/employees-requests/EmployeesRequestsFiltersSlice";
import CreateEmployeeRequestReducer from "@/store/employees-requests/CreateEmployeeRequest";
import CreateEmployeeAttendanceReducer from "@/store/employees-attendances/CreateEmployeeAttendance";
import EmployeesAttendancesSlice from "@/store/employees-attendances/EmployeesAttendancesSlice";
import EmployeesPayrollSlice from "@/store/employees-payroll/EmployeesPayrollSlice";
import IncidentsRolesPermissionsListSlice from "@/store/reference/incidents-roles-permissions/ListSlice";
import RequestsRolesPermissionsListSlice from "@/store/reference/requests-roles-permissions/ListSlice";
import IncidentsRulesListSlice from "@/store/reference/incidents-rules/ListSlice";
import SalariesListSlice from "@/store/reference/salaries/ListSlice";
import SalaryConfigSlice from "@/store/reference/salaries/SalaryConfigSlice";
import employeeIncidentReducer from "@/store/slices/employeeIncidentSlice";
import CatalogsListSlice from "@/store/reference/catalogs/CatalogsSlice";

/* ===========================
   Persist config (SOLO Customizer)
=========================== */

const customizerPersistConfig = {
  key: "customizer",
  storage,
  whitelist: ["activeMode", "direction", "sidebarType"], // ajusta a tu slice
};

/* ===========================
   Root reducer
=========================== */

const rootReducer = combineReducers({
  counter: counterReducer,
  customizer: persistReducer(customizerPersistConfig, CustomizerReducer),
  employeesReducer: EmployeesReducer,
  employeeIncident: employeeIncidentReducer,
  filterEmployeesSlice: EmployeesFiltersReducer,
  employeesIncidentsSlice: EmployeesIncidentsSlice,
  employeeRequestsSlice: EmployeesRequestsFiltersSlice,
  usersReducer: UsersReducer,
  filterUsersSlice: UsersFiltersReducer,
  filters: FiltersReducer,
  pagination: PaginationReducer,
  catalogs: catalogsReducer,
  createEmployeeRequest: CreateEmployeeRequestReducer,
  createEmployeeIncident: EmployeesIncidentsSlice,
  createEmployeeAttendance: CreateEmployeeAttendanceReducer,
  employeesAttendancesSlice: EmployeesAttendancesSlice,
  employeesPayrollSlice: EmployeesPayrollSlice,
  incidentsRolesPermissions: IncidentsRolesPermissionsListSlice,
  requestsRolesPermissions: RequestsRolesPermissionsListSlice,
  incidentsRules: IncidentsRulesListSlice,
  salaries: SalariesListSlice,
  catalogsList: CatalogsListSlice,
  salaryConfig: SalaryConfigSlice,
});

/* ===========================
   Store
=========================== */

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: false,
    }),
});

/* ===========================
   Persistor (SOLO CLIENTE)
=========================== */

export const persistor = typeof window !== "undefined" ? persistStore(store) : null;

/* ===========================
   Types
=========================== */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
