import { request } from "./request";
import { response } from "./response";

export const dataProvider = {
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
  statusEmployeeIdNotNumber: {
    status: 400,
    request: request.statusEmployeeIdNotNumber,
    response: response.statusEmployeeIdNotNumber,
  },
  statusEmployeeIdZero: {
    status: 400,
    request: request.statusEmployeeIdZero,
    response: response.statusEmployeeIdZero,
  },
  statusEmployeeIdNegative: {
    status: 400,
    request: request.statusEmployeeIdNegative,
    response: response.statusEmployeeIdNegative,
  },
  locationIdNotNumber: {
    status: 400,
    request: request.locationIdNotNumber,
    response: response.locationIdNotNumber,
  },
  locationIdZero: {
    status: 400,
    request: request.locationIdZero,
    response: response.locationIdZero,
  },
  locationIdNegative: {
    status: 400,
    request: request.locationIdNegative,
    response: response.locationIdNegative,
  },
  invalidStartDate: {
    status: 400,
    request: request.invalidStartDate,
    response: response.invalidStartDate,
  },
  invalidEndDate: {
    status: 400,
    request: request.invalidEndDate,
    response: response.invalidEndDate,
  },
  emptySearch: {
    status: 400,
    request: request.emptySearch,
    response: response.emptySearch,
  },
  longSearch: {
    status: 400,
    request: request.longSearch,
    response: response.longSearch,
  },
  validData: {
    status: 200,
    request: request.validData,
    response: response.validData,
  },
};
