import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  userIdNotnumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      user_id: { messages: [validationMessages.number("El ID")] },
    },
    statusCode: 400,
  },
  userIdZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      user_id: {
        messages: [validationMessages.minNumber("El ID", 1)],
      },
    },
    statusCode: 400,
  },
  userIdNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      user_id: {
        messages: [validationMessages.minNumber("El ID", 1)],
      },
    },
    statusCode: 400,
  },
  userIdLong: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      user_id: {
        messages: [validationMessages.maxNumber("El ID", 999999999999999)],
      },
    },
    statusCode: 400,
  },
  userAlreadyDeactivate: {
    success: false,
    message: HttpMessages.user.alreadyDeactivated,
    responseObject: {
      user_id: 1,
    },
    statusCode: 400,
  },
  userActivate: {
    success: true,
    message: HttpMessages.user.activatedSuccess,
    responseObject: {
      user: {
        id: 3,
        uuid: "test-uuid-2",
        username: "williammrr",
        active: true,
        updated_at: "2025-02-22T22:47:36.946Z",
      },
    },
    statusCode: 200,
  },
  userIdNotFound: {
    success: false,
    message: HttpMessages.user.notFoundById,
    responseObject: {
      user_id: 100000,
    },
    statusCode: 404,
  },
  validData: {
    success: true,
    message: HttpMessages.user.deactivatedSuccess,
    responseObject: {
      user: {
        id: 2,
        uuid: "test-uuid",
        username: "carloszh",
        active: false,
        updated_at: "2025-02-22T22:47:36.946Z",
      },
    },
    statusCode: 200,
  },
};
