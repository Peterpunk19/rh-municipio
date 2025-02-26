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
      user: {},
    },
    statusCode: 200,
  },
};
