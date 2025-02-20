import { request } from "./request";
import { response } from "./response";

export const dataProvider = {
  idNotnumber: {
    status: 400,
    request: request.idNotnumber,
    response: response.idNotnumber,
  },
  idZero: {
    status: 400,
    request: request.idZero,
    response: response.idZero,
  },
  idNegative: {
    status: 400,
    request: request.idNegative,
    response: response.idNegative,
  },
  idLong: {
    status: 400,
    request: request.idLong,
    response: response.idLong,
  },
  validData: {
    status: 200,
    request: request.validData,
    response: response.validData,
  },
};
