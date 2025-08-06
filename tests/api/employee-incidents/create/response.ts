import { generator } from "./generator";
import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  emptyParams: generator.response({
    responseObject: {
      startDate: {
        messages: [validationMessages.invalidaFormat("Fecha de Inicio")],
      },
      endDate: {
        messages: [validationMessages.invalidaFormat("Fecha de Terminación")],
      },
      description: {
        messages: [validationMessages.required("Descripción")],
      },
      incidentId: {
        messages: [validationMessages.required("Tipo de Incidencia")],
      },
      employeeId: {
        messages: [validationMessages.required("Empleado")],
      },
      incidentDates: {
        messages: [validationMessages.required("Fechas de incidencia")],
      },
    },
  }),
  emptyEmployeeId: generator.response({
    responseObject: {
      employeeId: {
        messages: [validationMessages.required("Empleado")],
      },
    },
  }),
  emptyIncidentId: generator.response({
    responseObject: {
      incidentId: {
        messages: [validationMessages.required("Tipo de Incidencia")],
      },
    },
  }),
  emptyStartDate: generator.response({
    responseObject: {
      startDate: {
        messages: [validationMessages.invalidaFormat("Fecha de Inicio")],
      },
    },
  }),
  emptyEndDate: generator.response({
    responseObject: {
      endDate: {
        messages: [validationMessages.invalidaFormat("Fecha de Terminación")],
      },
    },
  }),
  invalidDateRange: generator.response({
    responseObject: {
      endDate: {
        messages: [validationMessages.invalidDateRange("Fecha de Terminación", "Fecha de Inicio")],
      },
    },
  }),
  emptyDescription: generator.response({
    responseObject: {
      description: {
        messages: [validationMessages.required("Descripción")],
      },
    },
  }),
  longDescription: generator.response({
    responseObject: {
      description: {
        messages: [validationMessages.maxLength("Descripción", 255)],
      },
    },
  }),
  validData: generator.response({
    success: true,
    message: HttpMessages.employeeIncidents.createdSuccess,
    responseObject: {},
    statusCode: 200,
  }),
};
