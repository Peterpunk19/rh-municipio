import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  validData: {
    success: true,
    message: HttpMessages.user.changePasswordSuccess,
    responseObject: {
      userId: 2,
      username: "testuser",
      mustChangePassword: false,
    },
    statusCode: 200,
  },

  wrongCurrentPassword: {
    success: false,
    message: HttpMessages.user.changePasswordCurrentInvalid,
    responseObject: {},
    statusCode: 401,
  },

  passwordsMismatch: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      confirmNewPassword: {
        messages: [validationMessages.passwordsMustMatch],
      },
    },
    statusCode: 400,
  },

  weakPassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      newPassword: {
        messages: [validationMessages.minLength("Nueva contraseña", 8)],
      },
    },
    statusCode: 400,
  },

  noUppercase: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      newPassword: {
        messages: [validationMessages.oneUppercaseLetter("Nueva contraseña")],
      },
    },
    statusCode: 400,
  },

  noLowercase: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      newPassword: {
        messages: [validationMessages.oneLowercaseLetter("Nueva contraseña")],
      },
    },
    statusCode: 400,
  },

  noNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      newPassword: {
        messages: [validationMessages.oneNumber("Nueva contraseña")],
      },
    },
    statusCode: 400,
  },

  noSymbol: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      newPassword: {
        messages: [validationMessages.oneSymbol("Nueva contraseña")],
      },
    },
    statusCode: 400,
  },

  sameAsOld: {
    success: false,
    message: HttpMessages.user.changePasswordSameAsOld,
    responseObject: {},
    statusCode: 400,
  },

  missingCurrentPassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      currentPassword: {
        messages: [validationMessages.required("Contraseña actual")],
      },
    },
    statusCode: 400,
  },

  missingNewPassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      newPassword: {
        messages: [validationMessages.required("Nueva contraseña")],
      },
    },
    statusCode: 400,
  },

  missingConfirmPassword: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      confirmNewPassword: {
        messages: [validationMessages.required("Confirmar nueva contraseña")],
      },
    },
    statusCode: 400,
  },

  unauthorized: {
    success: false,
    message: HttpMessages.error.notAuthenticated,
    responseObject: {},
    statusCode: 401,
  },

  serviceError: {
    success: false,
    message: HttpMessages.user.changePasswordServiceError,
    responseObject: {},
    statusCode: 500,
  },
};
