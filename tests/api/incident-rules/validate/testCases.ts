import { request } from "./request";
import { response } from "./response";

export const testCases = [
  {
    description: "should return error for missing employeeId",
    requestData: request.missingEmployeeId,
    expectedStatus: 400,
    expectedResponse: response.missingEmployeeId,
  },
  {
    description: "should return error for invalid incidentId",
    requestData: request.invalidIncidentId,
    expectedStatus: 400,
    expectedResponse: response.invalidIncidentId,
  },
  {
    description: "should return error for invalid date format",
    requestData: request.invalidDateFormat,
    expectedStatus: 400,
    expectedResponse: response.invalidDateFormat,
  },
  {
    description: "should successfully validate with valid data",
    requestData: request.valid,
    expectedStatus: 200,
    expectedResponse: response.valid,
  },
];
