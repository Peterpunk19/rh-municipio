import { generator } from "./generator";
import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  validData: generator.response({
    success: true,
    message: HttpMessages.administrativeOrganizations.getSuccess,
    responseObject: {
      administrativeOrganizations: [],
      total: 100,
      currentPage: 1,
      totalPages: 10,
    },
    statusCode: 200,
  }),
  pageNotNumber: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      page: {
        messages: [validationMessages.number("Página")],
      },
    },
    statusCode: 400,
  }),
  pageZero: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      page: {
        messages: [validationMessages.minNumber("Página", 1)],
      },
    },
    statusCode: 400,
  }),
  pageNegative: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      page: {
        messages: [validationMessages.minNumber("Página", 1)],
      },
    },
    statusCode: 400,
  }),
  limitNotNumber: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      limit: {
        messages: [validationMessages.number("Limite")],
      },
    },
    statusCode: 400,
  }),
  limitZero: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      limit: {
        messages: [validationMessages.minNumber("Limite", 1)],
      },
    },
    statusCode: 400,
  }),
  limitNegative: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      limit: {
        messages: [validationMessages.minNumber("Limite", 1)],
      },
    },
    statusCode: 400,
  }),
  searchLong: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      search: {
        messages: [validationMessages.maxLength("Búsqueda", 255)],
      },
    },
    statusCode: 400,
  }),
};
