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
  {
    description: "should successfully activate a user",
    requestData: dataProvider.userActivate.request,
    expectedStatus: dataProvider.userActivate.status,
    expectedResponse: dataProvider.userActivate.response,
  },
];
