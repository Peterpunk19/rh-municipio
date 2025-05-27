import { generator } from "./generator";
import { HttpMessages } from "@/common/response/messages";
import { validationMessages } from "@/common/validation/messages";

export const response = {
  emptyId: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      requestId: { messages: ["Required"] },
    },
    statusCode: 400,
  }),
  idNotNumber: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      requestId: { messages: ["Expected number, received string"] },
    },
    statusCode: 400,
  }),
  idZero: generator.response({
    success: false,
    message: HttpMessages.requestStatus.idNotFound,
    responseObject: {},
    statusCode: 400,
  }),
  idNegative: generator.response({
    success: false,
    message: HttpMessages.requestStatus.idNotFound,
    responseObject: {},
    statusCode: 400,
  }),
  idLong: generator.response({
    success: false,
    message: HttpMessages.requestStatus.idNotFound,
    responseObject: {},
    statusCode: 400,
  }),
  emptyStatus: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      statusId: { messages: [validationMessages.required("Estatus de solicitud")] },
    },
    statusCode: 400,
  }),
  invalidStatus: generator.response({
    success: false,
    message: HttpMessages.requestStatus.invalidStatus,
    responseObject: {},
    statusCode: 400,
  }),
  validData: generator.response({
    success: true,
    message: HttpMessages.employeeRequests.updatedSuccess,
    responseObject: {},
    statusCode: 200,
  }),
};
