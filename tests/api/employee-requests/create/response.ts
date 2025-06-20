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
      requestId: {
        messages: [
          validationMessages.invalidDiscriminator("Invalid discriminator value. Expected 1 | 2 | 3 | 4 | 5 | 6 | 7"),
        ],
      },
    },
  }),
  emptyDescription: generator.response({
    responseObject: {
      description: {
        messages: [validationMessages.minLength("Descripción", 10)],
      },
    },
  }),
  emptyRequestId: generator.response({
    responseObject: {
      requestId: {
        messages: [
          validationMessages.invalidDiscriminator("Invalid discriminator value. Expected 1 | 2 | 3 | 4 | 5 | 6 | 7"),
        ],
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
