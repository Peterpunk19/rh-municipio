import { dataProvider } from "./dataProvider";
import type { IEmployeeAttendanceFilters } from "@/app/api/employee-attendance/types";

export const testCases = [
  {
    description: "should return error for page not number",
    requestData: dataProvider.pageNotnumber.request as IEmployeeAttendanceFilters,
    expectedStatus: dataProvider.pageNotnumber.status,
    expectedResponse: dataProvider.pageNotnumber.response,
  },
  {
    description: "should return error for page zero",
    requestData: dataProvider.pageZero.request as IEmployeeAttendanceFilters,
    expectedStatus: dataProvider.pageZero.status,
    expectedResponse: dataProvider.pageZero.response,
  },
  {
    description: "should return error for page negative",
    requestData: dataProvider.pageNegative.request as IEmployeeAttendanceFilters,
    expectedStatus: dataProvider.pageNegative.status,
    expectedResponse: dataProvider.pageNegative.response,
  },
  {
    description: "should return error for limit not number",
    requestData: dataProvider.limitNotnumber.request as IEmployeeAttendanceFilters,
    expectedStatus: dataProvider.limitNotnumber.status,
    expectedResponse: dataProvider.limitNotnumber.response,
  },
  {
    description: "should return error for limit zero",
    requestData: dataProvider.limitZero.request as IEmployeeAttendanceFilters,
    expectedStatus: dataProvider.limitZero.status,
    expectedResponse: dataProvider.limitZero.response,
  },
  {
    description: "should return error for limit negative",
    requestData: dataProvider.limitNegative.request as IEmployeeAttendanceFilters,
    expectedStatus: dataProvider.limitNegative.status,
    expectedResponse: dataProvider.limitNegative.response,
  },
  {
    description: "should return error for organism public not number",
    requestData: dataProvider.organismPublicNotNumber.request as IEmployeeAttendanceFilters,
    expectedStatus: dataProvider.organismPublicNotNumber.status,
    expectedResponse: dataProvider.organismPublicNotNumber.response,
  },
  {
    description: "should return error for organism administrative not number",
    requestData: dataProvider.organismAdministrativeNotNumber.request as IEmployeeAttendanceFilters,
    expectedStatus: dataProvider.organismAdministrativeNotNumber.status,
    expectedResponse: dataProvider.organismAdministrativeNotNumber.response,
  },
  {
    description: "should return error for organism public zero",
    requestData: dataProvider.organismPublicZero.request as IEmployeeAttendanceFilters,
    expectedStatus: dataProvider.organismPublicZero.status,
    expectedResponse: dataProvider.organismPublicZero.response,
  },
  {
    description: "should return error for organism administrative zero",
    requestData: dataProvider.organismAdministrativeZero.request as IEmployeeAttendanceFilters,
    expectedStatus: dataProvider.organismAdministrativeZero.status,
    expectedResponse: dataProvider.organismAdministrativeZero.response,
  },
  {
    description: "should return error for organism public negative",
    requestData: dataProvider.organismPublicNegative.request as IEmployeeAttendanceFilters,
    expectedStatus: dataProvider.organismPublicNegative.status,
    expectedResponse: dataProvider.organismPublicNegative.response,
  },
  {
    description: "should return error for organism administrative negative",
    requestData: dataProvider.organismAdministrativeNegative.request as IEmployeeAttendanceFilters,
    expectedStatus: dataProvider.organismAdministrativeNegative.status,
    expectedResponse: dataProvider.organismAdministrativeNegative.response,
  },
  {
    description: "should return error for long search",
    requestData: dataProvider.longSearch.request as IEmployeeAttendanceFilters,
    expectedStatus: dataProvider.longSearch.status,
    expectedResponse: dataProvider.longSearch.response,
  },
  {
    description: "should successfully send message with valid data",
    requestData: dataProvider.validData.request as IEmployeeAttendanceFilters,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
];
