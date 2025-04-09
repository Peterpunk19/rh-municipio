import { generator } from "./generator";
import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  validData: generator.response({
    success: true,
    message: HttpMessages.employeeRequests.createdSuccess,
    responseObject: {},
    statusCode: 200,
  }),
  emptyParams: generator.response({
    responseObject: {
      description: {
        messages: [validationMessages.required("Descripción")],
      },
      requestId: {
        messages: [validationMessages.required("Tipo de solicitud")],
      },
      employeeId: {
        messages: [validationMessages.required("Empleado")],
      },
    },
  }),
  emptyDescription: generator.response({
    responseObject: {
      description: {
        messages: [validationMessages.minLength("Descripción", 50)],
      },
    },
  }),
  emptyRequestId: generator.response({
    responseObject: {
      requestId: {
        messages: [validationMessages.required("Tipo de solicitud")],
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
};
