import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  validData: {
    success: true,
    message:
      "Contraseña reseteada exitosamente. El usuario deberá cambiar su contraseña en el próximo inicio de sesión.",
    responseObject: {
      userId: 2,
      username: "testuser",
      mustChangePassword: true,
    },
    statusCode: 200,
  },

  notFoundUser: {
    success: false,
    message: "Usuario no encontrado",
    responseObject: {
      userId: 999,
    },
    statusCode: 404,
  },

  adminUser: {
    success: false,
    message: "No se puede resetear la contraseña de otro administrador",
    responseObject: {
      userId: 1,
    },
    statusCode: 403,
  },

  invalidUserId: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      userId: {
        messages: [validationMessages.minNumber("ID de usuario", 1)],
      },
    },
    statusCode: 400,
  },

  missingUserId: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      userId: {
        messages: [validationMessages.number("ID de usuario")],
      },
    },
    statusCode: 400,
  },

  unauthorized: {
    success: false,
    message: "No tienes permisos para realizar esta acción. Solo los administradores pueden resetear contraseñas.",
    responseObject: {},
    statusCode: 403,
  },

  serviceError: {
    success: false,
    message: "Error al resetear la contraseña",
    responseObject: {},
    statusCode: 500,
  },
};
