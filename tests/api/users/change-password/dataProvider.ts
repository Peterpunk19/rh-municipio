import { request } from "./request";
import { response } from "./response";

export const dataProvider = {
  validData: {
    status: 200,
    request: request.validData,
    response: response.validData,
  },
  wrongCurrentPassword: {
    status: 401,
    request: request.wrongCurrentPassword,
    response: response.wrongCurrentPassword,
  },
  passwordsMismatch: {
    status: 400,
    request: request.passwordsMismatch,
    response: response.passwordsMismatch,
  },
  weakPassword: {
    status: 400,
    request: request.weakPassword,
    response: response.weakPassword,
  },
  noUppercase: {
    status: 400,
    request: request.noUppercase,
    response: response.noUppercase,
  },
  noLowercase: {
    status: 400,
    request: request.noLowercase,
    response: response.noLowercase,
  },
  noNumber: {
    status: 400,
    request: request.noNumber,
    response: response.noNumber,
  },
  noSymbol: {
    status: 400,
    request: request.noSymbol,
    response: response.noSymbol,
  },
  sameAsOld: {
    status: 400,
    request: request.sameAsOld,
    response: response.sameAsOld,
  },
  missingCurrentPassword: {
    status: 400,
    request: request.missingCurrentPassword,
    response: response.missingCurrentPassword,
  },
  missingNewPassword: {
    status: 400,
    request: request.missingNewPassword,
    response: response.missingNewPassword,
  },
  missingConfirmPassword: {
    status: 400,
    request: request.missingConfirmPassword,
    response: response.missingConfirmPassword,
  },
  unauthorized: {
    status: 401,
    request: request.validData,
    response: response.unauthorized,
  },
  serviceError: {
    status: 500,
    request: request.validData,
    response: response.serviceError,
  },
};
