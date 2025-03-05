import { dataProvider } from "./dataProvider";
import type { IEmployeeAttendance } from "@/app/api/employee-attendance/types";

export const testCases = [
  {
    description: "should return invalid request",
    requestData: {} as IEmployeeAttendance,
    expectedStatus: dataProvider.emptyParams.status,
    expectedResponse: dataProvider.emptyParams.response,
  },
  {
    description: "should return error for empty employee",
    requestData: dataProvider.emptyEmployeeId.request as IEmployeeAttendance,
    expectedStatus: dataProvider.emptyEmployeeId.status,
    expectedResponse: dataProvider.emptyEmployeeId.response,
  },
  {
    description: "should return error for empty check in",
    requestData: dataProvider.emptyCheckIn.request as IEmployeeAttendance,
    expectedStatus: dataProvider.emptyCheckIn.status,
    expectedResponse: dataProvider.emptyCheckIn.response,
  },
  {
    description: "should return error for empty check out",
    requestData: dataProvider.emptyCheckOut.request as IEmployeeAttendance,
    expectedStatus: dataProvider.emptyCheckOut.status,
    expectedResponse: dataProvider.emptyCheckOut.response,
  },
  {
    description: "should return error for invalid date range",
    requestData: dataProvider.invalidDateRange.request as IEmployeeAttendance,
    expectedStatus: dataProvider.invalidDateRange.status,
    expectedResponse: dataProvider.invalidDateRange.response,
  },
  {
    description: "should return error for empty description",
    requestData: dataProvider.emptyDescription.request as IEmployeeAttendance,
    expectedStatus: dataProvider.emptyDescription.status,
    expectedResponse: dataProvider.emptyDescription.response,
  },
  {
    description: "should return error for long description",
    requestData: dataProvider.longDescription.request as IEmployeeAttendance,
    expectedStatus: dataProvider.longDescription.status,
    expectedResponse: dataProvider.longDescription.response,
  },
  {
    description: "should successfully send message with valid data",
    requestData: dataProvider.validData.request as IEmployeeAttendance,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
  {
    description: "should return error message with invalid employee data",
    requestData: dataProvider.invalidEmployeeData.request as IEmployeeAttendance,
    expectedStatus: dataProvider.invalidEmployeeData.status,
    expectedResponse: dataProvider.invalidEmployeeData.response,
  },
];
