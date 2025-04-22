import { HttpMessages } from "@/common/response/messages";
import { validationMessages } from "@/common/validation/messages";

export const response = {
  pageNotnumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      page: { messages: [validationMessages.number("Página")] },
    },
    statusCode: 400,
  },
  pageZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      page: {
        messages: [validationMessages.minNumber("Página", 1)],
      },
    },
    statusCode: 400,
  },
  pageNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      page: {
        messages: [validationMessages.minNumber("Página", 1)],
      },
    },
    statusCode: 400,
  },
  limitNotnumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      limit: {
        messages: [validationMessages.number("Límite")],
      },
    },
    statusCode: 400,
  },
  limitZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      limit: {
        messages: [validationMessages.minNumber("Límite", 1)],
      },
    },
    statusCode: 400,
  },
  limitNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      limit: {
        messages: [validationMessages.minNumber("Límite", 1)],
      },
    },
    statusCode: 400,
  },
  longSearch: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      search: {
        messages: [validationMessages.maxLength("Búsqueda", 255)],
      },
    },
    statusCode: 400,
  },
  validData: {
    success: true,
    message: "Asistencias encontradas correctamente",
    responseObject: {
      attendances: [],
      total: 100,
      currentPage: 1,
      totalPages: 10,
    },
    statusCode: 200,
  },
  organismPublicNotNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      organismPublic: {
        messages: [validationMessages.number("Organismo Público")],
      },
    },
    statusCode: 400,
  },
  organismAdministrativeNotNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      organismAdministrative: {
        messages: [validationMessages.number("Organismo Administrativo")],
      },
    },
    statusCode: 400,
  },
  organismPublicZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      organismPublic: {
        messages: [validationMessages.minNumber("Organismo Público", 1)],
      },
    },
    statusCode: 400,
  },
  organismPublicNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      organismPublic: {
        messages: [validationMessages.minNumber("Organismo Público", 1)],
      },
    },
    statusCode: 400,
  },
  organismAdministrativeZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      organismAdministrative: {
        messages: [validationMessages.minNumber("Organismo Administrativo", 1)],
      },
    },
    statusCode: 400,
  },
  organismAdministrativeNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      organismAdministrative: {
        messages: [validationMessages.minNumber("Organismo Administrativo", 1)],
      },
    },
    statusCode: 400,
  },
  invalidCheckIn: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      checkIn: {
        messages: [validationMessages.invalidFormat("Fecha de entrada")],
      },
    },
    statusCode: 400,
  },
  invalidCheckOut: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      checkOut: {
        messages: [validationMessages.invalidFormat("Fecha de salida")],
      },
    },
    statusCode: 400,
  },
};
