import { generator } from "./generator";
import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  idNotNumber: generator.response({
    message: validationMessages.number("ID"),
    responseObject: {},
  }),
  idZero: generator.response({
    responseObject: {
      id: {
        messages: [validationMessages.minNumber("ID", 1)],
      },
    },
  }),
  idNegative: generator.response({
    responseObject: {
      id: {
        messages: [validationMessages.minNumber("ID", 1)],
      },
    },
  }),
  idLong: generator.response({
    responseObject: {
      id: {
        messages: [validationMessages.maxNumber("ID", 999999999999999)],
      },
    },
  }),
  validData: generator.response({
    success: true,
    message: HttpMessages.employeeRequests.foundById,
    responseObject: {
      id: 1,
      folio: "000001",
      oficio: "OFICIO-123",
      justification:
        "Lorem ipsum dolor sit amet consectetur adipiscing elit, porttitor eros quisque enim mattis facilisi, pulvinar dignissim proin ante nibh tempor.",
      request_date: "2025-05-01T00:00:00.000Z",
      created_at: "2025-05-01T20:29:10.773Z",
      request_status: {
        id: 1,
        name: "creada",
        display_name: "CREADA",
        btn_display_name: "Creada",
        btn_icon: "clock",
        btn_color: "warning",
        type: 1,
        active: true,
      },
      employee: {
        name: "FABIAN ALABAT MAYORGA",
        employeeNumber: "060379",
        rfc: "AAMF780120FG7",
        curp: "AAMF780120FG7",
        publicOrganization: "Secretaría de gobernación",
        administrativeOrganization: "Recursos Humanos",
        category: "BARRENDERO A PENSIONADO",
      },
      request: {
        id: 3,
        name: "checker_change_request",
        display_name: "TIPO DE CHECADO",
        active: true,
      },
      request_details: {
        attendance_date: "2025-03-24T00:00:00.000Z",
        current_attendance: {
          id: 2,
          name: "attendance_list",
          display_name: "LISTA DE ASISTENCIA",
          active: true,
        },
        new_attendance: {
          id: 1,
          name: "digital_clock",
          display_name: "RELOJ DIGITAL",
          active: true,
        },
      },
      requestedBy: {
        id: 1,
        username: "carloszh",
      },
      approvedBy: {},
      employee_attendance_status: [
        {
          id: 1,
          created_at: "2025-05-01T20:29:10.785Z",
          request_status: {
            id: 1,
            name: "creada",
            display_name: "CREADA",
            btn_color: "warning",
            btn_icon: "clock",
            btn_display_name: "Creada",
          },
          created_by: {
            id: 1,
            name: "FABIAN",
            paternal_last_name: "ALABAT",
            maternal_last_name: "MAYORGA",
          },
        },
      ],
    },
    statusCode: 200,
  }),
};
