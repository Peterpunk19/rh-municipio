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
  organismPublicNotNumber: {
    status: 400,
    request: request.organismPublicNotNumber,
    response: response.organismPublicNotNumber,
  },
  organismAdministrativeNotNumber: {
    status: 400,
    request: request.organismAdministrativeNotNumber,
    response: response.organismAdministrativeNotNumber,
  },
  organismPublicZero: {
    status: 400,
    request: request.organismPublicZero,
    response: response.organismPublicZero,
  },
  organismAdministrativeZero: {
    status: 400,
    request: request.organismAdministrativeZero,
    response: response.organismAdministrativeZero,
  },
  organismPublicNegative: {
    status: 400,
    request: request.organismPublicNegative,
    response: response.organismPublicNegative,
  },
  organismAdministrativeNegative: {
    status: 400,
    request: request.organismAdministrativeNegative,
    response: response.organismAdministrativeNegative,
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
