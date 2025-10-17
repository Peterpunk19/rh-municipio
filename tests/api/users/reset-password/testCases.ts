import { request } from "./request";
import { response } from "./response";

export const testCases = [
  {
    description: "should successfully reset password with valid data",
    requestData: request.validData,
    expectedStatus: response.validData.statusCode,
    expectedResponse: response.validData,
    isAdmin: true,
  },
  {
    description: "should return error for non-existent user",
    requestData: request.notFoundUser,
    expectedStatus: response.notFoundUser.statusCode,
    expectedResponse: response.notFoundUser,
    isAdmin: true,
  },
  {
    description: "should return error when trying to reset admin password",
    requestData: request.adminUser,
    expectedStatus: response.adminUser.statusCode,
    expectedResponse: response.adminUser,
    isAdmin: true,
  },
  {
    description: "should return error for invalid user ID",
    requestData: request.invalidUserId,
    expectedStatus: response.invalidUserId.statusCode,
    expectedResponse: response.invalidUserId,
    isAdmin: true,
  },
  {
    description: "should return error for missing user ID",
    requestData: request.missingUserId,
    expectedStatus: response.missingUserId.statusCode,
    expectedResponse: response.missingUserId,
    isAdmin: true,
  },
  {
    description: "should return unauthorized error for non-admin user",
    requestData: request.validData,
    expectedStatus: response.unauthorized.statusCode,
    expectedResponse: response.unauthorized,
    isAdmin: false,
  },
];
