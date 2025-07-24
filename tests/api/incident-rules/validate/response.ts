import { generator } from "./generator";
import { HttpMessages } from "@/common/response/messages";
import { validationMessages } from "@/common/validation/messages";

export const response = {
  missingEmployeeId: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      employeeId: {
        messages: [validationMessages.required("Empleado")],
      },
    },
    statusCode: 400,
  }),
  invalidIncidentId: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      incidentId: {
        messages: [validationMessages.required("Tipo de Incidencia")],
      },
    },
    statusCode: 400,
  }),
  invalidDateFormat: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      startDate: {
        messages: [validationMessages.invalidaFormat("Fecha de Inicio")],
      },
    },
    statusCode: 400,
  }),
  valid: generator.response({
    success: true,
    message: HttpMessages.incidentRules.getSuccess,
    responseObject: {
      isValid: true,
      details: {},
      hasRules: true,
    },
    statusCode: 200,
  }),
};
