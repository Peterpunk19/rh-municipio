import { request } from "./request";
import { response } from "./response";

export const dataProvider = {
  validData: {
    status: 200,
    request: request.validData,
    response: response.validData,
  },
  emptyUsername: {
    status: 400,
    request: request.emptyUsername,
    response: response.emptyUsername,
  },
  longUsername: {
    status: 400,
    request: request.longUsername,
    response: response.longUsername,
  },
  duplicatedUsername: {
    status: 409,
    request: request.duplicatedUsername,
    response: response.duplicatedUsername,
  },
  invalidUuid: {
    status: 400,
    request: request.invalidUuid,
    response: response.invalidUuid,
  },
  duplicatedUuid: {
    status: 409,
    request: request.duplicatedUuid,
    response: response.duplicatedUuid,
  },
  invalidEmployeeId: {
    status: 400,
    request: request.invalidEmployeeId,
    response: response.invalidEmployeeId,
  },
  notFoundEmployeeId: {
    status: 400,
    request: request.notFoundEmployeeId,
    response: response.notFoundEmployeeId,
  },
  duplicatedEmployeeId: {
    status: 400,
    request: request.duplicatedEmployeeId,
    response: response.duplicatedEmployeeId,
  },
  emptyPassword: {
    status: 400,
    request: request.emptyPassword,
    response: response.emptyPassword,
  },
  shortPassword: {
    status: 400,
    request: request.shortPassword,
    response: response.shortPassword,
  },
  longPassword: {
    status: 400,
    request: request.longPassword,
    response: response.longPassword,
  },
  upperCasePassword: {
    status: 400,
    request: request.upperCasePassword,
    response: response.upperCasePassword,
  },
  lowerCasePassword: {
    status: 400,
    request: request.lowerCasePassword,
    response: response.lowerCasePassword,
  },
  oneNumberPassword: {
    status: 400,
    request: request.oneNumberPassword,
    response: response.oneNumberPassword,
  },
  oneSymbolPassword: {
    status: 400,
    request: request.oneSymbolPassword,
    response: response.oneSymbolPassword,
  },
  emptyRoleId: {
    status: 400,
    request: request.emptyRoleId,
    response: response.emptyRoleId,
  },
  notFoundRole: {
    status: 400,
    request: request.notFoundRole,
    response: response.notFoundRole,
  },
};
