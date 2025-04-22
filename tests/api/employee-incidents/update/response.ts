import { generator } from "./generator";
import { HttpMessages } from "@/common/response/messages";
import { validationMessages } from "@/common/validation/messages";

export const response = {
  emptyId: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      id: {
        messages: [validationMessages.required("ID de Incidencia")],
      },
    },
    statusCode: 400,
  }),
  idNotNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      id: { messages: [validationMessages.required("ID de Incidencia")] },
    },
    statusCode: 400,
  },
  idZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      id: {
        messages: [validationMessages.minNumber("ID de Incidencia", 1)],
      },
    },
    statusCode: 400,
  },
  idNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      id: {
        messages: [validationMessages.minNumber("ID de Incidencia", 1)],
      },
    },
    statusCode: 400,
  },
  idLong: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      id: {
        messages: [validationMessages.maxNumber("ID de Incidencia", 999999999999999)],
      },
    },
    statusCode: 400,
  },
  emptyIncidentStatusId: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      incidentStatusId: {
        messages: [validationMessages.required("Estatus")],
      },
    },
    statusCode: 400,
  }),
  validData: generator.response({
    success: true,
    message: HttpMessages.employeeIncidents.updatedSuccess,
    responseObject: {},
    statusCode: 200,
  }),
};
