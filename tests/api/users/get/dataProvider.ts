import { request } from "./request";
import { response } from "./response";

export const dataProvider = {
  limitNotnumber: {
    status: 400,
    request: request.limitNotnumber,
    response: response.limitNotnumber,
  },
  limitZero: {
    status: 400,
    request: request.limitZero,
    response: response.limitZero,
  },
  limitNegative: {
    status: 400,
    request: request.limitNegative,
    response: response.limitNegative,
  },
  pageNotnumber: {
    status: 400,
    request: request.pageNotnumber,
    response: response.pageNotnumber,
  },
  pageZero: {
    status: 400,
    request: request.pageZero,
    response: response.pageZero,
  },
  pageNegative: {
    status: 400,
    request: request.pageNegative,
    response: response.pageNegative,
  },
  roleIdNotNumber: {
    status: 400,
    request: request.roleIdNotNumber,
    response: response.roleIdNotNumber,
  },
  roleIdZero: {
    status: 400,
    request: request.roleIdZero,
    response: response.roleIdZero,
  },
  roleIdNegative: {
    status: 400,
    request: request.roleIdNegative,
    response: response.roleIdNegative,
  },
  activeNotBoolean: {
    status: 400,
    request: request.activeNotBoolean,
    response: response.activeNotBoolean,
  },
  activeAsNumber: {
    status: 400,
    request: request.activeAsNumber,
    response: response.activeAsNumber,
  },
  validData: {
    status: 200,
    request: request.validData,
    response: response.validData,
  },
};
