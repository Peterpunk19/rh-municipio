import { request } from "./request";
import { response } from "./response";

export const dataProvider = {
  validData: {
    status: 200,
    request: request.validData,
    response: response.validData,
  },
  validDataWithErrors: {
    status: 200,
    request: request.validData,
    response: response.validDataWithErrors,
  },
  emptyLegacyDatabase: {
    status: 200,
    request: request.validData,
    response: response.emptyLegacyDatabase,
  },
  unauthorizedUser: {
    status: 400,
    request: request.unauthorizedUser,
    response: response.unauthorizedUser,
  },
  unauthenticatedUser: {
    status: 401,
    request: request.unauthenticatedUser,
    response: response.unauthenticatedUser,
  },
  missingDatabaseUrl: {
    status: 500,
    request: request.validData,
    response: response.missingDatabaseUrl,
  },
  databaseConnectionError: {
    status: 500,
    request: request.validData,
    response: response.databaseConnectionError,
  },
};
