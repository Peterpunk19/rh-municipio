import { HttpMessages } from "@/common/response/messages";
import { validationMessages } from "@/common/validation/messages";

export const response = {
  idNotnumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      id: {
        messages: [validationMessages.number("ID")],
      },
    },
    statusCode: 400,
  },
  idZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      id: {
        messages: [validationMessages.minNumber("ID", 1)],
      },
    },
    statusCode: 400,
  },
  idNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      id: {
        messages: [validationMessages.minNumber("ID", 1)],
      },
    },
    statusCode: 400,
  },
  idLong: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      id: {
        messages: [validationMessages.maxNumber("ID", 999999999999999)],
      },
    },
    statusCode: 400,
  },
  validData: {
    success: true,
    message: HttpMessages.employeeAttendance.foundById,
    responseObject: {
      "id": 1,
      "check_in": "2025-03-26T14:00:00.000Z",
      "check_out": "2025-03-26T22:00:00.000Z",
      "active": true,
      "description": "Asistencia generada automaticamente",
      "created_at": "2025-04-10T00:43:49.735Z",
      "location": {
        "id": 76,
        "active": true,
        "name": "el_rastro_pavimento",
        "display_name": "EL RASTRO PAVIMENTO"
      },
      "type_attendance": {
        "id": 1,
        "display_name": "RELOJ DIGITAL"
      },
      "employee": {
        "id": 1,
        "number_employee": "453453",
        "name": "William",
        "paternal_last_name": "dsad",
        "maternal_last_name": "ads",
        "fullName": "William dsad ads",
        "rfc": "asda",
        "curp": "asdd"
      },
      "organism_public": {
        "id": 1,
        "name": "gobierno",
        "display_name": "Secretaría de gobernación"
      },
      "organism_administrative": {
        "id": 4,
        "name": "medios",
        "display_name": "Medios"
      },
      "created_by": {
        "id": 44,
        "username": "carloszh"
      }
    },
    statusCode: 200,
  },
};
