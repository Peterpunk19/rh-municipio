import { generator } from "./generator";
import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  emptyParams: generator.response({
    responseObject: {
      employeeIds: {
        messages: [validationMessages.required("Empleado")],
      },
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
    },
  }),
  emptyEmployeeIds: generator.response({
    responseObject: {
      employeeIds: {
        messages: [validationMessages.required("Empleado")],
      },
      incidentDates: {
        messages: [validationMessages.required("Fechas de incidencia")],
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
        messages: ["Invalid date"],
      },
    },
  }),
  emptyEndDate: generator.response({
    responseObject: {
      endDate: {
        messages: ["Invalid date"],
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
      incidentDates: {
        messages: [validationMessages.required("Fechas de incidencia")],
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
  longOficio: generator.response({
    responseObject: {
      oficio: {
        messages: [validationMessages.maxLength("Oficio", 30)],
      },
    },
  }),
  emptyIncidentDates: generator.response({
    responseObject: {
      incidentDates: {
        messages: [validationMessages.required("Fechas de incidencia")],
      },
    },
  }),
  incidentNotAllowBulk: generator.response({
    message: HttpMessages.employeeIncidents.bulkNotAllowed,
    responseObject: {},
  }),
  permissionDenied: generator.response({
    message: HttpMessages.employeeIncidents.incidentsRolesPermissionsCreateFailed,
    responseObject: {},
  }),
  validData: generator.response({
    success: true,
    message: "Incidencias masivas creadas correctamente",
    responseObject: {
      incidents: [
        {
          id: 1,
          folio: "000015",
          oficio: "",
          start_date: "2026-02-11T00:00:00.000Z",
          end_date: "2026-02-12T00:00:00.000Z",
          description: "Incidencias masivas",
          incident_id: 2,
          incident_status_id: 1,
          employee_id: 1,
          created_by_id: 1,
          created_at: "2026-02-11T23:08:38.869Z",
          validated_at: "2026-02-11T23:08:38.870Z",
          validated_by_id: null,
          direccion_id: 11,
          active: true,
        },
        {
          id: 2,
          folio: "000016",
          oficio: "",
          start_date: "2026-02-11T00:00:00.000Z",
          end_date: "2026-02-12T00:00:00.000Z",
          description: "Incidencias masivas",
          incident_id: 2,
          incident_status_id: 1,
          employee_id: 2,
          created_by_id: 1,
          created_at: "2026-02-11T23:08:38.912Z",
          validated_at: "2026-02-11T23:08:38.913Z",
          validated_by_id: null,
          direccion_id: 11,
          active: true,
        },
        {
          id: 3,
          folio: "000017",
          oficio: "",
          start_date: "2026-02-11T00:00:00.000Z",
          end_date: "2026-02-12T00:00:00.000Z",
          description: "Incidencias masivas",
          incident_id: 2,
          incident_status_id: 1,
          employee_id: 3,
          created_by_id: 1,
          created_at: "2026-02-11T23:08:38.913Z",
          validated_at: "2026-02-11T23:08:38.914Z",
          validated_by_id: null,
          direccion_id: 11,
          active: true,
        },
      ],
    },
    statusCode: 200,
  }),
};
