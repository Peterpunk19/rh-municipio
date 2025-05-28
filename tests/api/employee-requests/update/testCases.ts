import { dataProvider } from "./dataProvider";
import type { IEmployeeRequestUpdate } from "@/app/api/employee-requests/types";

export const testCases = [
  {
    description: "should return error for empty id",
    requestData: dataProvider.emptyId.request,
    expectedStatus: dataProvider.emptyId.status,
    expectedResponse: dataProvider.emptyId.response,
  },
  {
    description: "should return error for id not number",
    requestData: dataProvider.idNotNumber.request,
    expectedStatus: dataProvider.idNotNumber.status,
    expectedResponse: dataProvider.idNotNumber.response,
  },
  {
    description: "should return error for id zero",
    requestData: dataProvider.idZero.request as IEmployeeRequestUpdate,
    expectedStatus: dataProvider.idZero.status,
    expectedResponse: dataProvider.idZero.response,
  },
  {
    description: "should return error for id negative",
    requestData: dataProvider.idNegative.request as IEmployeeRequestUpdate,
    expectedStatus: dataProvider.idNegative.status,
    expectedResponse: dataProvider.idNegative.response,
  },
  {
    description: "should return error for id too long",
    requestData: dataProvider.idLong.request,
    expectedStatus: dataProvider.idLong.status,
    expectedResponse: dataProvider.idLong.response,
  },
  {
    description: "should return error for empty status",
    requestData: dataProvider.emptyStatus.request,
    expectedStatus: dataProvider.emptyStatus.status,
    expectedResponse: dataProvider.emptyStatus.response,
  },
  {
    description: "should return error for invalid status",
    requestData: dataProvider.invalidStatus.request,
    expectedStatus: dataProvider.invalidStatus.status,
    expectedResponse: dataProvider.invalidStatus.response,
  },
  {
    description: "should successfully send message with valid data",
    requestData: dataProvider.validData.request,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
];
