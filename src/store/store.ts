import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import counterReducer from "./counter/counterSlice";
import CustomizerReducer from "./customizer/CustomizerSlice";
import EcommerceReducer from "./apps/eCommerce/ECommerceSlice";
import ChatsReducer from "./apps/chat/ChatSlice";
import NotesReducer from "./apps/notes/NotesSlice";
import EmailReducer from "./apps/email/EmailSlice";
import TicketReducer from "./apps/tickets/TicketSlice";
import ContactsReducer from "./apps/contacts/ContactSlice";
import EmployeesReducer from "@/store/employees/EmployeeSlice";
import UsersReducer from "@/store/users/UserSlice";
import UserProfileReducer from "./apps/userProfile/UserProfileSlice";
import BlogReducer from "./apps/blog/BlogSlice";
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
import IncidentsRolesPermissionsListSlice from "@/store/reference/incidents-roles-permissions/ListSlice";

const persistConfig = {
  key: "root",
  storage,
};

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    customizer: persistReducer<any>(persistConfig, CustomizerReducer),
    ecommerceReducer: EcommerceReducer,
    chatReducer: ChatsReducer,
    emailReducer: EmailReducer,
    notesReducer: NotesReducer,
    contactsReducer: ContactsReducer,
    ticketReducer: TicketReducer,
    userpostsReducer: UserProfileReducer,
    blogReducer: BlogReducer,
    employeesReducer: EmployeesReducer,
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
    incidentsRolesPermissions: IncidentsRolesPermissionsListSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
});

const rootReducer = combineReducers({
  counter: counterReducer,
  customizer: CustomizerReducer,
  ecommerceReducer: EcommerceReducer,
  chatReducer: ChatsReducer,
  emailReducer: EmailReducer,
  notesReducer: NotesReducer,
  contactsReducer: ContactsReducer,
  employeesReducer: EmployeesReducer,
  ticketReducer: TicketReducer,
  userpostsReducer: UserProfileReducer,
  blogReducer: BlogReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof rootReducer>;
