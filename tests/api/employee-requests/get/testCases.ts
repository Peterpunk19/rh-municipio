import { dataProvider } from "./dataProvider";
import type { IEmployeeRequestsFilters } from "@/app/api/employee-requests/types";

export const testCases = [
  {
    description: "should return error for page not number",
    requestData: dataProvider.pageNotnumber.request as IEmployeeRequestsFilters,
    expectedStatus: dataProvider.pageNotnumber.status,
    expectedResponse: dataProvider.pageNotnumber.response,
  },
  {
    description: "should return error for page zero",
    requestData: dataProvider.pageZero.request as IEmployeeRequestsFilters,
    expectedStatus: dataProvider.pageZero.status,
    expectedResponse: dataProvider.pageZero.response,
  },
  {
    description: "should return error for page negative",
    requestData: dataProvider.pageNegative.request as IEmployeeRequestsFilters,
    expectedStatus: dataProvider.pageNegative.status,
    expectedResponse: dataProvider.pageNegative.response,
  },
  {
    description: "should return error for limit not number",
    requestData: dataProvider.limitNotnumber.request as IEmployeeRequestsFilters,
    expectedStatus: dataProvider.limitNotnumber.status,
    expectedResponse: dataProvider.limitNotnumber.response,
  },
  {
    description: "should return error for limit zero",
    requestData: dataProvider.limitZero.request as IEmployeeRequestsFilters,
    expectedStatus: dataProvider.limitZero.status,
    expectedResponse: dataProvider.limitZero.response,
  },
  {
    description: "should return error for limit negative",
    requestData: dataProvider.limitNegative.request as IEmployeeRequestsFilters,
    expectedStatus: dataProvider.limitNegative.status,
    expectedResponse: dataProvider.limitNegative.response,
  },
  {
    description: "should return error for request ID not number",
    requestData: dataProvider.requestIdNotNumber.request as IEmployeeRequestsFilters,
    expectedStatus: dataProvider.requestIdNotNumber.status,
    expectedResponse: dataProvider.requestIdNotNumber.response,
  },
  {
    description: "should return error for request status ID not number",
    requestData: dataProvider.requestStatusIdNotNumber.request as IEmployeeRequestsFilters,
    expectedStatus: dataProvider.requestStatusIdNotNumber.status,
    expectedResponse: dataProvider.requestStatusIdNotNumber.response,
  },
  {
    description: "should return error for request ID zero",
    requestData: dataProvider.requestIdZero.request as IEmployeeRequestsFilters,
    expectedStatus: dataProvider.requestIdZero.status,
    expectedResponse: dataProvider.requestIdZero.response,
  },
  {
    description: "should return error for request status ID zero",
    requestData: dataProvider.requestStatusIdZero.request as IEmployeeRequestsFilters,
    expectedStatus: dataProvider.requestStatusIdZero.status,
    expectedResponse: dataProvider.requestStatusIdZero.response,
  },
  {
    description: "should return error for request ID negative",
    requestData: dataProvider.requestIdNegative.request as IEmployeeRequestsFilters,
    expectedStatus: dataProvider.requestIdNegative.status,
    expectedResponse: dataProvider.requestIdNegative.response,
  },
  {
    description: "should return error for request status ID negative",
    requestData: dataProvider.requestStatusIdNegative.request as IEmployeeRequestsFilters,
    expectedStatus: dataProvider.requestStatusIdNegative.status,
    expectedResponse: dataProvider.requestStatusIdNegative.response,
  },
  {
    description: "should return error for long search",
    requestData: dataProvider.longSearch.request as IEmployeeRequestsFilters,
    expectedStatus: dataProvider.longSearch.status,
    expectedResponse: dataProvider.longSearch.response,
  },
  {
    description: "should successfully send message with valid data",
    requestData: dataProvider.validData.request as IEmployeeRequestsFilters,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
];
