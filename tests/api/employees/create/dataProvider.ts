import { request } from "./request";
import { response } from "./response";

export const dataProvider = {
  invalidRequest: {
    status: 400,
    request: {},
    response: response.invalidRequest,
  },
  emptyNumberEmployee: {
    status: 400,
    request: request.emptyNumberEmployee,
    response: response.emptyNumberEmployee,
  },
  emptyName: {
    status: 400,
    request: request.emptyName,
    response: response.emptyName,
  },
  emptyPaternalLastName: {
    status: 400,
    request: request.emptyPaternalLastName,
    response: response.emptyPaternalLastName,
  },
  emptyMaternalLastName: {
    status: 400,
    request: request.emptyMaternalLastName,
    response: response.emptyMaternalLastName,
  },
  emptyBirthday: {
    status: 400,
    request: request.emptyBirthday,
    response: response.emptyBirthday,
  },
  emptyGenderId: {
    status: 400,
    request: request.emptyGenderId,
    response: response.emptyGenderId,
  },
  emptyRfc: {
    status: 400,
    request: request.emptyRfc,
    response: response.emptyRfc,
  },
  emptyCurp: {
    status: 400,
    request: request.emptyCurp,
    response: response.emptyCurp,
  },
  longNumberEmployee: {
    status: 400,
    request: request.longNumberEmployee,
    response: response.longNumberEmployee,
  },
  longName: {
    status: 400,
    request: request.longName,
    response: response.longName,
  },
  longPaternalLastName: {
    status: 400,
    request: request.longPaternalLastName,
    response: response.longPaternalLastName,
  },
  longMaternalLastName: {
    status: 400,
    request: request.longMaternalLastName,
    response: response.longMaternalLastName,
  },
  validData: {
    status: 200,
    request: request.validData,
    response: response.validData,
  },
  duplicatedRfcCurp: {
    status: 400,
    request: request.duplicatedRfcCurp,
    response: response.duplicatedRfcCurp,
  },
  emptyStartJobDate: {
    status: 400,
    request: request.emptyStartJobDate,
    response: response.emptyStartJobDate,
  },
  emptyEndJobDate: {
    status: 400,
    request: request.emptyEndJobDate,
    response: response.emptyEndJobDate,
  },
  emptyCategoryId: {
    status: 400,
    request: request.emptyCategoryId,
    response: response.emptyCategoryId,
  },
  emptyEmployeeTypeId: {
    status: 400,
    request: request.emptyEmployeeTypeId,
    response: response.emptyEmployeeTypeId,
  },
  emptyDepartamentoId: {
    status: 400,
    request: request.emptyDepartamentoId,
    response: response.emptyDepartamentoId,
  },
  emptyPayrollId: {
    status: 400,
    request: request.emptyPayrollId,
    response: response.emptyPayrollId,
  },
  emptyLocationId: {
    status: 400,
    request: request.emptyLocationId,
    response: response.emptyLocationId,
  },
};
