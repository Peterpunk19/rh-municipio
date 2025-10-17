import { request } from "./request";
import { response } from "./response";

export const dataProvider = {
  validData: {
    status: 200,
    request: request.validData,
    response: response.validData,
  },
  notFoundUser: {
    status: 404,
    request: request.notFoundUser,
    response: response.notFoundUser,
  },
  adminUser: {
    status: 403,
    request: request.adminUser,
    response: response.adminUser,
  },
  invalidUserId: {
    status: 400,
    request: request.invalidUserId,
    response: response.invalidUserId,
  },
  missingUserId: {
    status: 400,
    request: request.missingUserId,
    response: response.missingUserId,
  },
  unauthorized: {
    status: 401,
    request: request.validData,
    response: response.unauthorized,
  },
  serviceError: {
    status: 500,
    request: request.validData,
    response: response.serviceError,
  },
};
