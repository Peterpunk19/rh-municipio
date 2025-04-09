import { dataProvider } from "./dataProvider";
import type { IEmployeeRequest } from "@/app/api/employee-requests/types";

export const testCases = [
  {
    description: "should successfully send message with valid data",
    requestData: dataProvider.validData.request as IEmployeeRequest,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
  {
    description: "should return invalid request",
    requestData: {} as IEmployeeRequest,
    expectedStatus: dataProvider.emptyParams.status,
    expectedResponse: dataProvider.emptyParams.response,
  },
  {
    description: "should return error for empty description",
    requestData: dataProvider.emptyDescription.request as IEmployeeRequest,
    expectedStatus: dataProvider.emptyDescription.status,
    expectedResponse: dataProvider.emptyDescription.response,
  },
  {
    description: "should return error for empty request id",
    requestData: dataProvider.emptyRequestId.request as IEmployeeRequest,
    expectedStatus: dataProvider.emptyRequestId.status,
    expectedResponse: dataProvider.emptyRequestId.response,
  },
  {
    description: "should return error for empty employee id",
    requestData: dataProvider.emptyEmployeeId.request as IEmployeeRequest,
    expectedStatus: dataProvider.emptyEmployeeId.status,
    expectedResponse: dataProvider.emptyEmployeeId.response,
  },
];
