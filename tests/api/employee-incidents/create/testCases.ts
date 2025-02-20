import { dataProvider } from "./dataProvider";
import type { IEmployeeIncident } from "@/app/api/employee-incidents/types";

export const testCases = [
  {
    description: "should return invalid request",
    requestData: {} as IEmployeeIncident,
    expectedStatus: dataProvider.emptyParams.status,
    expectedResponse: dataProvider.emptyParams.response,
  },
  {
    description: "should return error for empty employee",
    requestData: dataProvider.emptyEmployeeId.request as IEmployeeIncident,
    expectedStatus: dataProvider.emptyEmployeeId.status,
    expectedResponse: dataProvider.emptyEmployeeId.response,
  },
  {
    description: "should return error for empty incident type",
    requestData: dataProvider.emptyIncidentId.request as IEmployeeIncident,
    expectedStatus: dataProvider.emptyIncidentId.status,
    expectedResponse: dataProvider.emptyIncidentId.response,
  },
  {
    description: "should return error for empty start date",
    requestData: dataProvider.emptyStartDate.request as IEmployeeIncident,
    expectedStatus: dataProvider.emptyStartDate.status,
    expectedResponse: dataProvider.emptyStartDate.response,
  },
  {
    description: "should return error for empty end date",
    requestData: dataProvider.emptyEndDate.request as IEmployeeIncident,
    expectedStatus: dataProvider.emptyEndDate.status,
    expectedResponse: dataProvider.emptyEndDate.response,
  },
  {
    description: "should return error for invalid date range",
    requestData: dataProvider.invalidDateRange.request as IEmployeeIncident,
    expectedStatus: dataProvider.invalidDateRange.status,
    expectedResponse: dataProvider.invalidDateRange.response,
  },
  {
    description: "should return error for empty description",
    requestData: dataProvider.emptyDescription.request as IEmployeeIncident,
    expectedStatus: dataProvider.emptyDescription.status,
    expectedResponse: dataProvider.emptyDescription.response,
  },
  {
    description: "should return error for long description",
    requestData: dataProvider.longDescription.request as IEmployeeIncident,
    expectedStatus: dataProvider.longDescription.status,
    expectedResponse: dataProvider.longDescription.response,
  },
  {
    description: "should successfully send message with valid data",
    requestData: dataProvider.validData.request as IEmployeeIncident,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
];
