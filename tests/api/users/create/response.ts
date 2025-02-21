import { HttpMessages } from "@/common/response/messages";
import { validationMessages } from "@/common/validation/messages";

export const response = {
  validData: {
    success: true,
    message: HttpMessages.user.createdSuccess,
    responseObject: {},
    statusCode: 200,
  },
  emptyUsername: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      username: {
        messages: [validationMessages.required("Usuario")],
      },
    },
    statusCode: 400,
  },
  longUsername: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      username: {
        messages: [validationMessages.maxLength("Usuario", 30)],
      },
    },
    statusCode: 400,
  },
  duplicatedUsername: {
    success: false,
    message: HttpMessages.user.usernameAlreadyExists,
    responseObject: {
      username: "DUPLICATED",
    },
    statusCode: 409,
  },
  invalidUuid: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      uuid: {
        messages: [validationMessages.invalidFormat("UUID")],
      },
    },
    statusCode: 400,
  },
  duplicatedUuid: {
    success: false,
    message: HttpMessages.user.uuidAlreadyExists,
    responseObject: {
      uuid: "62ae6298-dd74-4fab-9952-96e44d97fad1",
    },
    statusCode: 409,
  },
  invalidEmployeeId: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      employee_id: {
        messages: [validationMessages.number("Empleado")],
      },
    },
    statusCode: 400,
  },
  notFoundEmployeeId: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      employee_id: {
        messages: [HttpMessages.employee.notFound],
      },
    },
    statusCode: 400,
  },
  duplicatedEmployeeId: {
    success: false,
    message: HttpMessages.user.employeeIdAlreadyExists,
    responseObject: {
      employee_id: 6,
    },
    statusCode: 400,
  },
  emptyPassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      password: {
        messages: [
          validationMessages.minLength("Contraseña", 8),
          validationMessages.oneUppercaseLetter("Contraseña"),
          validationMessages.oneLowercaseLetter("Contraseña"),
          validationMessages.oneNumber("Contraseña"),
          validationMessages.oneSymbol("Contraseña"),
        ],
      },
    },
    statusCode: 400,
  },
  shortPassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      password: {
        messages: [validationMessages.minLength("Contraseña", 8)],
      },
    },
    statusCode: 400,
  },
  longPassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      password: {
        messages: [validationMessages.maxLength("Contraseña", 30)],
      },
    },
    statusCode: 400,
  },
  upperCasePassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      password: {
        messages: [validationMessages.oneUppercaseLetter("Contraseña")],
      },
    },
    statusCode: 400,
  },
  lowerCasePassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      password: {
        messages: [validationMessages.oneLowercaseLetter("Contraseña")],
      },
    },
    statusCode: 400,
  },
  oneNumberPassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      password: {
        messages: [validationMessages.oneNumber("Contraseña")],
      },
    },
    statusCode: 400,
  },
  oneSymbolPassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      password: {
        messages: [validationMessages.oneSymbol("Contraseña")],
      },
    },
    statusCode: 400,
  },
  emptyRoleId: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      role_id: {
        messages: [validationMessages.required("Rol")],
      },
    },
    statusCode: 400,
  },
  notFoundRole: {
    success: false,
    message: HttpMessages.role.notFound,
    responseObject: {
      role_id: 999,
    },
    statusCode: 400,
  },
};
