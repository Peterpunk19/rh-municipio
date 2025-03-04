import { generator } from "./generator";
import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  emptyParams: generator.response({
    responseObject: {
      checkIn: {
        messages: [validationMessages.invalidaFormat("Entrada")],
      },
      checkOut: {
        messages: [validationMessages.invalidaFormat("Salida")],
      },
      description: {
        messages: [validationMessages.required("Descripción")],
      },
      employeeId: {
        messages: [validationMessages.required("Empleado")],
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
  emptyCheckIn: generator.response({
    responseObject: {
      checkIn: {
        messages: [validationMessages.invalidaFormat("Entrada")],
      },
    },
  }),
  emptyCheckOut: generator.response({
    responseObject: {
      checkOut: {
        messages: [validationMessages.invalidaFormat("Salida")],
      },
    },
  }),
  invalidDateRange: generator.response({
    responseObject: {
      checkOut: {
        messages: [validationMessages.invalidDateRange("Salida", "Entrada")],
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
    message: HttpMessages.employeeAttendance.createdSuccess,
    responseObject: {},
    statusCode: 200,
  }),
  invalidEmployeeData: generator.response({
    success: false,
    message: HttpMessages.employeeLocation.notFound,
    responseObject: {},
    statusCode: 400,
  }),
};
