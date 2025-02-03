import { HttpMessages } from "@/common/response/messages";

export const response = {
  validData: {
    success: true,
    message: "Usuario creado correctamente",
    responseObject: {},
    statusCode: 200,
  },
  emptyUsername: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      username: {
        messages: ["Usuario es requerido"],
      },
    },
    statusCode: 400,
  },
  longUsername: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      username: {
        messages: ["Usuario no puede exceder de 30 caracteres"],
      },
    },
    statusCode: 400,
  },
  duplicatedUsername: {
    success: false,
    message: "El nombre de usuario ya existe",
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
        messages: ["Formato de UUID inválido"],
      },
    },
    statusCode: 400,
  },
  duplicatedUuid: {
    success: false,
    message: "El UUID ya existe",
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
        messages: ["Empleado debe ser un número"],
      },
    },
    statusCode: 400,
  },
  notFoundEmployeeId: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      employee_id: {
        messages: ["No se hencontraron empleados con los filtros proporcionados"],
      },
    },
    statusCode: 400,
  },
  duplicatedEmployeeId: {
    success: false,
    message: "El ID de empleado ya está vinculado con otro usuario",
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
          "Contraseña debe contener al menos 8 caracteres",
          "Contraseña debe contener al menos una letra mayúscula",
          "Contraseña debe contener al menos una letra minúscula",
          "Contraseña debe contener al menos un número",
          "Contraseña debe contener al menos alguno de los siguientes simbolos [!@#$%^&*,._-=?]",
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
        messages: ["Contraseña debe contener al menos 8 caracteres"],
      },
    },
    statusCode: 400,
  },
  longPassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      password: {
        messages: ["Contraseña no puede exceder de 30 caracteres"],
      },
    },
    statusCode: 400,
  },
  upperCasePassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      password: {
        messages: ["Contraseña debe contener al menos una letra mayúscula"],
      },
    },
    statusCode: 400,
  },
  lowerCasePassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      password: {
        messages: ["Contraseña debe contener al menos una letra minúscula"],
      },
    },
    statusCode: 400,
  },
  oneNumberPassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      password: {
        messages: ["Contraseña debe contener al menos un número"],
      },
    },
    statusCode: 400,
  },
  oneSymbolPassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      password: {
        messages: ["Contraseña debe contener al menos alguno de los siguientes simbolos [!@#$%^&*,._-=?]"],
      },
    },
    statusCode: 400,
  },
  emptyRoleId: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      role_id: {
        messages: ["Rol es requerido"],
      },
    },
    statusCode: 400,
  },
  notFoundRole: {
    success: false,
    message: "El rol no existe",
    responseObject: {
      role_id: 999,
    },
    statusCode: 400,
  },
};
