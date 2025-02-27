import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  idNotnumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      id: { messages: [validationMessages.number("ID")] },
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
    message: HttpMessages.employeeIncidents.foundById,
    responseObject: {
      id: 511,
      folio: "000238",
      oficio: "",
      start_date: "2021-05-25T07:49:16.597Z",
      end_date: "2007-09-28T22:45:40.634Z",
      description: "TEST IMPORT",
      incident_id: 5,
      incident_status_id: 3,
      employee_id: 1,
      employee_attendance_id: null,
      created_at: "2025-02-25T20:54:07.868Z",
      validated_at: "2025-02-25T20:54:07.868Z",
      active: true,
      employee: {
        id: 1,
        number_employee: "12609",
        name: "MA. DE JESUS",
        paternal_last_name: "AGUEDA",
        maternal_last_name: "LOPEZ",
        birthday: "1967-02-18T00:00:00.000Z",
        rfc: "AULJ-670218",
        curp: "AULJ-670218",
        active: true,
        created_at: "2025-02-19T21:23:53.575Z",
        updated_at: "2025-02-19T21:23:53.948Z",
        user_id: 12,
        status_employee_id: 2,
        gender_id: 2,
        employee_hiring_id: 5,
        director_id: null,
        sustitute_id: null,
        marital_status_id: null,
        schooling_id: null,
        profession_id: null,
        occupation_id: null,
        identification_type_id: null,
        trade_union_id: null,
      },
    },
    statusCode: 200,
  },
};
