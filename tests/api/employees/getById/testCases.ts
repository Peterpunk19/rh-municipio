import type { IEmployeeById } from "@/app/api/employees/interface";
import { dataProvider } from "./dataProvider";

export const testCases = [
  {
    description: "should return error for id not number",
    requestData: dataProvider.idNotnumber.request,
    expectedStatus: dataProvider.idNotnumber.status,
    expectedResponse: dataProvider.idNotnumber.response,
  },
  {
    description: "should return error for id zero",
    requestData: dataProvider.idZero.request as IEmployeeById,
    expectedStatus: dataProvider.idZero.status,
    expectedResponse: dataProvider.idZero.response,
  },
  {
    description: "should return error for id negative",
    requestData: dataProvider.idNegative.request as IEmployeeById,
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
    description: "should successfully send message with valid data",
    requestData: dataProvider.validData.request,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
];
