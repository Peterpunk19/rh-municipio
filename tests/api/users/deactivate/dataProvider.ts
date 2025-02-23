import { request } from "./request";
import { response } from "./response";

export const dataProvider = {
  userIdNotnumber: {
    status: 400,
    request: request.userIdNotnumber,
    response: response.userIdNotnumber,
  },
  userIdZero: {
    status: 400,
    request: request.userIdZero,
    response: response.userIdZero,
  },
  userIdNegative: {
    status: 400,
    request: request.userIdNegative,
    response: response.userIdNegative,
  },
  userIdLong: {
    status: 400,
    request: request.userIdLong,
    response: response.userIdLong,
  },
  userAlreadyDeactivate: {
    status: 400,
    request: request.userAlreadyDeactivate,
    response: response.userAlreadyDeactivate,
  },
  userIdNotFound: {
    status: 404,
    request: request.userIdNotFound,
    response: response.userIdNotFound,
  },
  validData: {
    status: 200,
    request: request.validData,
    response: response.validData,
  },
};
