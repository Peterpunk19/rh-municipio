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
  emptyAddressLine1: {
    status: 400,
    request: request.emptyAddressLine1,
    response: response.emptyAddressLine1,
  },
  emptyAddressLine2: {
    status: 400,
    request: request.emptyAddressLine2,
    response: response.emptyAddressLine2,
  },
  emptyPostalCode: {
    status: 400,
    request: request.emptyPostalCode,
    response: response.emptyPostalCode,
  },
  emptyPostalCodeSat: {
    status: 400,
    request: request.emptyPostalCodeSat,
    response: response.emptyPostalCodeSat,
  },
  emptyMunicipalityId: {
    status: 400,
    request: request.emptyMunicipalityId,
    response: response.emptyMunicipalityId,
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
  emptyDireccionId: {
    status: 400,
    request: request.emptyDireccionId,
    response: response.emptyDireccionId,
  },
};
