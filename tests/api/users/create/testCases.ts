import { dataProvider } from "./dataProvider";
import { IUser } from "@/app/api/users/interface";

export const testCases = [
  {
    description: "should successfully send message with valid data",
    requestData: dataProvider.validData.request as IUser,
    expectedStatus: dataProvider.validData.status,
    expectedResponse: dataProvider.validData.response,
  },
  {
    description: "should return error for empty username",
    requestData: dataProvider.emptyUsername.request,
    expectedStatus: dataProvider.emptyUsername.status,
    expectedResponse: dataProvider.emptyUsername.response,
  },
  {
    description: "should return error for long username",
    requestData: dataProvider.longUsername.request,
    expectedStatus: dataProvider.longUsername.status,
    expectedResponse: dataProvider.longUsername.response,
  },
  {
    description: "should return error for existing username",
    requestData: dataProvider.duplicatedUsername.request as IUser,
    expectedStatus: dataProvider.duplicatedUsername.status,
    expectedResponse: dataProvider.duplicatedUsername.response,
  },
  {
    description: "should return error for invalid uuid",
    requestData: dataProvider.invalidUuid.request,
    expectedStatus: dataProvider.invalidUuid.status,
    expectedResponse: dataProvider.invalidUuid.response,
  },
  {
    description: "should return error for existing uuid",
    requestData: dataProvider.duplicatedUuid.request as IUser,
    expectedStatus: dataProvider.duplicatedUuid.status,
    expectedResponse: dataProvider.duplicatedUuid.response,
  },
  {
    description: "should return error for invalid employee_id",
    requestData: dataProvider.invalidEmployeeId.request,
    expectedStatus: dataProvider.invalidEmployeeId.status,
    expectedResponse: dataProvider.invalidEmployeeId.response,
  },
  {
    description: "should return error for not found employee_id",
    requestData: dataProvider.notFoundEmployeeId.request,
    expectedStatus: dataProvider.notFoundEmployeeId.status,
    expectedResponse: dataProvider.notFoundEmployeeId.response,
  },
  {
    description: "should return error for existing employee_id",
    requestData: dataProvider.duplicatedEmployeeId.request as IUser,
    expectedStatus: dataProvider.duplicatedEmployeeId.status,
    expectedResponse: dataProvider.duplicatedEmployeeId.response,
  },
  {
    description: "should return error for empty password",
    requestData: dataProvider.emptyPassword.request as IUser,
    expectedStatus: dataProvider.emptyPassword.status,
    expectedResponse: dataProvider.emptyPassword.response,
  },
  {
    description: "should return error for short password",
    requestData: dataProvider.shortPassword.request,
    expectedStatus: dataProvider.shortPassword.status,
    expectedResponse: dataProvider.shortPassword.response,
  },
  {
    description: "should return error for long password",
    requestData: dataProvider.longPassword.request,
    expectedStatus: dataProvider.longPassword.status,
    expectedResponse: dataProvider.longPassword.response,
  },
  {
    description: "should return error for password without upper case",
    requestData: dataProvider.upperCasePassword.request,
    expectedStatus: dataProvider.upperCasePassword.status,
    expectedResponse: dataProvider.upperCasePassword.response,
  },
  {
    description: "should return error for password without lower case",
    requestData: dataProvider.lowerCasePassword.request,
    expectedStatus: dataProvider.lowerCasePassword.status,
    expectedResponse: dataProvider.lowerCasePassword.response,
  },
  {
    description: "should return error for password without number",
    requestData: dataProvider.oneNumberPassword.request,
    expectedStatus: dataProvider.oneNumberPassword.status,
    expectedResponse: dataProvider.oneNumberPassword.response,
  },
  {
    description: "should return error for password without symbol",
    requestData: dataProvider.oneSymbolPassword.request,
    expectedStatus: dataProvider.oneSymbolPassword.status,
    expectedResponse: dataProvider.oneSymbolPassword.response,
  },
  {
    description: "should return error for empty role_id",
    requestData: dataProvider.emptyRoleId.request,
    expectedStatus: dataProvider.emptyRoleId.status,
    expectedResponse: dataProvider.emptyRoleId.response,
  },
  {
    description: "should return error for not found role",
    requestData: dataProvider.notFoundRole.request,
    expectedStatus: dataProvider.notFoundRole.status,
    expectedResponse: dataProvider.notFoundRole.response,
  },
];
