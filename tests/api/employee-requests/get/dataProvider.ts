import { request } from "../get/request";
import { response } from "../get/response";

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
  requestIdNotNumber: {
    status: 400,
    request: request.requestIdNotNumber,
    response: response.requestIdNotNumber,
  },
  requestIdZero: {
    status: 400,
    request: request.requestIdZero,
    response: response.requestIdZero,
  },
  requestIdNegative: {
    status: 400,
    request: request.requestIdNegative,
    response: response.requestIdNegative,
  },
  requestStatusIdNotNumber: {
    status: 400,
    request: request.requestStatusIdNotNumber,
    response: response.requestStatusIdNotNumber,
  },
  requestStatusIdZero: {
    status: 400,
    request: request.requestStatusIdZero,
    response: response.requestStatusIdZero,
  },
  requestStatusIdNegative: {
    status: 400,
    request: request.requestStatusIdNegative,
    response: response.requestStatusIdNegative,
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
