import { generator } from "./generator";
import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  pageNotNumber: generator.response({
    responseObject: {
      page: {
        messages: [validationMessages.number("Página")],
      },
    },
  }),
  pageZero: generator.response({
    responseObject: {
      page: {
        messages: [validationMessages.minNumber("Página", 1)],
      },
    },
  }),
  pageNegative: generator.response({
    responseObject: {
      page: {
        messages: [validationMessages.minNumber("Página", 1)],
      },
    },
  }),
  limitNotNumber: generator.response({
    responseObject: {
      limit: {
        messages: [validationMessages.number("Limite")],
      },
    },
  }),
  limitZero: generator.response({
    responseObject: {
      limit: {
        messages: [validationMessages.minNumber("Limite", 1)],
      },
    },
  }),
  limitNegative: generator.response({
    responseObject: {
      limit: {
        messages: [validationMessages.minNumber("Limite", 1)],
      },
    },
  }),
  invalidIncidentId: generator.response({
    responseObject: {
      incident_id: {
        messages: [validationMessages.number("Tipo de incidencia")],
      },
    },
  }),
  invalidIncidentStatusId: generator.response({
    responseObject: {
      incident_status_id: {
        messages: [validationMessages.number("Estatus de incidencia")],
      },
    },
  }),
  invalidStartDate: generator.response({
    responseObject: {
      start_date: {
        messages: [validationMessages.invalidaFormat("Fecha de Inicio")],
      },
    },
  }),
  invalidEndDate: generator.response({
    responseObject: {
      end_date: {
        messages: [validationMessages.invalidaFormat("Fecha de terminacion")],
      },
    },
  }),
  longSearch: generator.response({
    responseObject: {
      search: {
        messages: [validationMessages.maxLength("Búsqueda", 255)],
      },
    },
  }),
  validData: generator.response({
    success: true,
    message: HttpMessages.employeeIncidents.getSuccess,
    responseObject: {
      data: [],
      total: 1,
      currentPage: 1,
      totalPages: 1,
    },
    statusCode: 200,
  }),
};
