import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  limitNotnumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      limit: { messages: [validationMessages.number("El limite")] },
    },
    statusCode: 400,
  },
  limitZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      limit: {
        messages: [validationMessages.minNumber("El limite", 1)],
      },
    },
    statusCode: 400,
  },
  limitNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      limit: {
        messages: [validationMessages.minNumber("El limite", 1)],
      },
    },
    statusCode: 400,
  },
  pageNotnumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      page: {
        messages: [validationMessages.number("El número de página")],
      },
    },
    statusCode: 400,
  },
  pageZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      page: {
        messages: [validationMessages.minNumber("El número de página", 1)],
      },
    },
    statusCode: 400,
  },
  pageNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      page: {
        messages: [validationMessages.minNumber("El número de página", 1)],
      },
    },
    statusCode: 400,
  },
  roleIdNotNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      role_id: {
        messages: [validationMessages.number("El ID del rol de usuario")],
      },
    },
    statusCode: 400,
  },
  roleIdZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      role_id: {
        messages: [validationMessages.minNumber("El ID del rol de usuario", 1)],
      },
    },
    statusCode: 400,
  },
  roleIdNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      role_id: {
        messages: [validationMessages.minNumber("El ID del rol de usuario", 1)],
      },
    },
    statusCode: 400,
  },
  activeNotBoolean: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      active: {
        messages: [validationMessages.invalidBoolean("Activo")],
      },
    },
    statusCode: 400,
  },
  activeAsNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      active: {
        messages: [validationMessages.invalidBoolean("Activo")],
      },
    },
    statusCode: 400,
  },
  validData: {
    success: true,
    message: HttpMessages.user.getSuccess,
    responseObject: {
      total: 100,
      totalPages: 10,
      currentPage: 1,
      users: [],
    },
    statusCode: 200,
  },
};
