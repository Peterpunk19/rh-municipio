import { validationMessages } from "@/common/validation/messages";
export const response = {
  idNotnumber: {
    success: false,
    message: "Invalid request",
    responseObject: {
      id: { messages: [validationMessages.number("ID")] },
    },
    statusCode: 400,
  },
  idZero: {
    success: false,
    message: "Invalid request",
    responseObject: {
      id: {
        messages: [validationMessages.minNumber("ID", 1)],
      },
    },
    statusCode: 400,
  },
  idNegative: {
    success: false,
    message: "Invalid request",
    responseObject: {
      id: {
        messages: [validationMessages.minNumber("ID", 1)],
      },
    },
    statusCode: 400,
  },
  idLong: {
    success: false,
    message: "Invalid request",
    responseObject: {
      id: {
        messages: [validationMessages.maxNumber("ID", 999999999999999)],
      },
    },
    statusCode: 400,
  },
  validData: {
    success: true,
    message: "Empleado encontrado correctamente",
    responseObject: {
      id: 349,
      number_employee: "",
      name: "UBELMAR",
      paternal_last_name: "ABARCA",
      maternal_last_name: "ORANTES",
      birthday: "1981-09-24T00:00:00.000Z",
      rfc: "AAOU-810924",
      curp: "AAOU-810924",
      active: true,
      created_at: "2025-02-17T17:42:16.209Z",
      updated_at: "2025-02-17T17:42:16.396Z",
      user_id: 359,
      status_employee_id: 2,
      gender_id: 1,
      employee_hiring_id: 14,
      director_id: null,
      sustitute_id: null,
      marital_status_id: null,
      schooling_id: null,
      profession_id: null,
      occupation_id: null,
      identification_type_id: null,
      trade_union_id: null,
      employee_hiring: [
        {
          id: 14,
          employee_id: 349,
          start_job_date: "2010-02-15T21:11:55.658Z",
          end_job_date: "2005-11-09T09:35:53.585Z",
          category_id: 44,
          employee_type_id: 1,
          direccion_id: 1,
          active: true,
          created_by: null,
          created_at: "2025-02-17T17:42:16.353Z",
          updated_at: "2025-02-17T17:42:16.354Z",
        },
      ],
      employee_location: [],
    },
    statusCode: 200,
  },
};
