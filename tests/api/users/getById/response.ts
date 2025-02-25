import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  idNotnumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      id: { messages: [validationMessages.number("El ID")] },
    },
    statusCode: 400,
  },
  idZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      id: {
        messages: [validationMessages.minNumber("El ID", 1)],
      },
    },
    statusCode: 400,
  },
  idNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      id: {
        messages: [validationMessages.minNumber("El ID", 1)],
      },
    },
    statusCode: 400,
  },
  idLong: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      id: {
        messages: [validationMessages.maxNumber("El ID", 999999999999999)],
      },
    },
    statusCode: 400,
  },
  validData: {
    success: true,
    message: HttpMessages.user.foundById,
    responseObject: {
      id: 1,
      username: "carloszh",
      role_id: 3,
      role_display_name: "Empleado",
      active: true,
      created_at: "2025-02-14T02:45:21.416Z",
      updated_at: "2025-02-14T02:45:21.416Z",
    },
    statusCode: 200,
  },
};
