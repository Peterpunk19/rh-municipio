import { dataProvider } from "./dataProvider";
import type { IEmployeeIncidentFilters } from "@/app/api/employee-incidents/types";

export const testCases = [
  {
    description: "should return error for page not number",
    requestData: dataProvider.pageNotNumber.request as IEmployeeIncidentFilters,
    expectedStatus: dataProvider.pageNotNumber.status,
    expectedResponse: dataProvider.pageNotNumber.response,
  },
  {
    description: "should return error for page is 0",
    requestData: dataProvider.pageZero.request as IEmployeeIncidentFilters,
    expectedStatus: dataProvider.pageZero.status,
    expectedResponse: dataProvider.pageZero.response,
  },
  {
    description: "should return error for page is negative number",
    requestData: dataProvider.pageNegative.request as IEmployeeIncidentFilters,
    expectedStatus: dataProvider.pageNegative.status,
    expectedResponse: dataProvider.pageNegative.response,
  },
  {
    description: "should return error for page is not number",
    requestData: dataProvider.limitNotNumber.request as IEmployeeIncidentFilters,
    expectedStatus: dataProvider.limitNotNumber.status,
    expectedResponse: dataProvider.limitNotNumber.response,
  },
  {
    description: "should return error for page is 0",
    requestData: dataProvider.limitZero.request as IEmployeeIncidentFilters,
    expectedStatus: dataProvider.limitZero.status,
    expectedResponse: dataProvider.limitZero.response,
  },
  {
    description: "should return error for page is negative number",
    requestData: dataProvider.limitNegative.request as IEmployeeIncidentFilters,
    expectedStatus: dataProvider.limitNegative.status,
    expectedResponse: dataProvider.limitNegative.response,
  },
  {
    description: "should return error for invalid incident id",
    requestData: dataProvider.invalidIncidentId.request as IEmployeeIncidentFilters,
    expectedStatus: dataProvider.invalidIncidentId.status,
    expectedResponse: dataProvider.invalidIncidentId.response,
  },
  {
    description: "should return error for invalid incident status id",
    requestData: dataProvider.invalidIncidentStatusId.request as IEmployeeIncidentFilters,
    expectedStatus: dataProvider.invalidIncidentStatusId.status,
    expectedResponse: dataProvider.invalidIncidentStatusId.response,
  },
  {
    description: "should return error for invalid start date",
    requestData: dataProvider.invalidStartDate.request as IEmployeeIncidentFilters,
    expectedStatus: dataProvider.invalidStartDate.status,
    expectedResponse: dataProvider.invalidStartDate.response,
  },
  {
    description: "should return error for invalid end date",
    requestData: dataProvider.invalidEndDate.request as IEmployeeIncidentFilters,
    expectedStatus: dataProvider.invalidEndDate.status,
    expectedResponse: dataProvider.invalidEndDate.response,
  },
  {
    description: "should return error for long search",
    requestData: dataProvider.longSearch.request as IEmployeeIncidentFilters,
    expectedStatus: dataProvider.longSearch.status,
    expectedResponse: dataProvider.longSearch.response,
  },
  {
    description: "should successfully send message with valid data",
    requestData: dataProvider.validData.request as IEmployeeIncidentFilters,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
];
