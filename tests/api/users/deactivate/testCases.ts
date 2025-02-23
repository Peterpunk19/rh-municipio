import { dataProvider } from "./dataProvider";
import type { IUserDeactivate } from "@/app/api/users/interface";

export const testCases = [
  {
    description: "should return error for id not number",
    requestData: dataProvider.userIdNotnumber.request,
    expectedStatus: dataProvider.userIdNotnumber.status,
    expectedResponse: dataProvider.userIdNotnumber.response,
  },
  {
    description: "should return error for id zero",
    requestData: dataProvider.userIdZero.request as IUserDeactivate,
    expectedStatus: dataProvider.userIdZero.status,
    expectedResponse: dataProvider.userIdZero.response,
  },
  {
    description: "should return error for id negative",
    requestData: dataProvider.userIdNegative.request as IUserDeactivate,
    expectedStatus: dataProvider.userIdNegative.status,
    expectedResponse: dataProvider.userIdNegative.response,
  },
  {
    description: "should return error for id too long",
    requestData: dataProvider.userIdLong.request,
    expectedStatus: dataProvider.userIdLong.status,
    expectedResponse: dataProvider.userIdLong.response,
  },
  {
    description: "should return error for user already deactivated",
    requestData: dataProvider.userAlreadyDeactivate.request,
    expectedStatus: dataProvider.userAlreadyDeactivate.status,
    expectedResponse: dataProvider.userAlreadyDeactivate.response,
  },
  {
    description: "should return error for id not found",
    requestData: dataProvider.userIdNotFound.request,
    expectedStatus: dataProvider.userIdNotFound.status,
    expectedResponse: dataProvider.userIdNotFound.response,
  },
  {
    description: "should successfully send message with valid data",
    requestData: dataProvider.validData.request,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
];
