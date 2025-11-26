import { dataProvider } from "./dataProvider";
import type { IEmployeeAttendanceBulkImport } from "@/app/api/employee-attendance/types";

export const testCases = [
  {
    description: "should return invalid request",
    requestData: {} as IEmployeeAttendanceBulkImport,
    expectedStatus: dataProvider.emptyParams.status,
    expectedResponse: dataProvider.emptyParams.response,
  },
  {
    description: "should return error for empty id",
    requestData: dataProvider.emptyId.request as IEmployeeAttendanceBulkImport,
    expectedStatus: dataProvider.emptyId.status,
    expectedResponse: dataProvider.emptyId.response,
  },
  {
    description: "should return error for empty numberEmployee",
    requestData: dataProvider.emptyNumberEmployee.request as IEmployeeAttendanceBulkImport,
    expectedStatus: dataProvider.emptyNumberEmployee.status,
    expectedResponse: dataProvider.emptyNumberEmployee.response,
  },
  {
    description: "should return error for empty isEntry",
    requestData: dataProvider.emptyIsEntry.request as IEmployeeAttendanceBulkImport,
    expectedStatus: dataProvider.emptyIsEntry.status,
    expectedResponse: dataProvider.emptyIsEntry.response,
  },
  {
    description: "should return error for invalid dateTime",
    requestData: dataProvider.emptyDateTime.request as IEmployeeAttendanceBulkImport,
    expectedStatus: dataProvider.emptyDateTime.status,
    expectedResponse: dataProvider.emptyDateTime.response,
  },
  {
    description: "should return error for empty values",
    requestData: dataProvider.emptyValues.request as IEmployeeAttendanceBulkImport,
    expectedStatus: dataProvider.emptyValues.status,
    expectedResponse: dataProvider.emptyValues.response,
  },
  {
    description: "should successfully send message with valid data",
    requestData: dataProvider.validData.request as IEmployeeAttendanceBulkImport,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
];
