import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

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

const persistConfig = {
  key: "root",
  storage,
};

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    customizer: persistReducer<any>(persistConfig, CustomizerReducer),
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
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
});

const rootReducer = combineReducers({
  counter: counterReducer,
  customizer: CustomizerReducer,
  employeesReducer: EmployeesReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;
