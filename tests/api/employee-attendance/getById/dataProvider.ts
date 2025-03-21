import { request } from "./request";
import { response } from "./response";

export const dataProvider = {
  idNotnumber: {
    request: request.idNotnumber,
    response: response.idNotnumber,
    status: 400,
  },
  idZero: {
    request: request.idZero,
    response: response.idZero,
    status: 400,
  },
  idNegative: {
    request: request.idNegative,
    response: response.idNegative,
    status: 400,
  },
  idLong: {
    request: request.idLong,
    response: response.idLong,
    status: 400,
  },
  validData: {
    request: request.validData,
    response: response.validData,
    status: 200,
  },
};
