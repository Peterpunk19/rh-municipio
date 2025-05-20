import { generator } from "./generator";
import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  validData: generator.response({
    success: true,
    message: HttpMessages.administrativeOrganizations.leadersCreatedSuccess,
    responseObject: {
      director: [],
      deputyDirector: [],
    },
    statusCode: 200,
  }),
  direccionIdNotNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      direccionId: {
        messages: [validationMessages.number("El ID del organismo administrativo")],
      },
    },
    statusCode: 400,
  },
  direccionIdZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      direccionId: {
        messages: [validationMessages.minNumber("El ID del organismo administrativo", 1)],
      },
    },
    statusCode: 400,
  },
  direccionIdNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      direccionId: {
        messages: [validationMessages.minNumber("El ID del organismo administrativo", 1)],
      },
    },
    statusCode: 400,
  },
  direccionIdLong: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      direccionId: {
        messages: [validationMessages.maxNumber("El ID del organismo administrativo", 999999999999999)],
      },
    },
    statusCode: 400,
  },
  directorNotNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      director: {
        messages: [validationMessages.number("El ID del director")],
      },
    },
    statusCode: 400,
  },
  directorZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      director: {
        messages: [validationMessages.minNumber("El ID del director", 1)],
      },
    },
    statusCode: 400,
  },
  directorNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      director: {
        messages: [validationMessages.minNumber("El ID del director", 1)],
      },
    },
    statusCode: 400,
  },
  directorLong: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      director: {
        messages: [validationMessages.maxNumber("El ID del director", 999999999999999)],
      },
    },
    statusCode: 400,
  },
  deputyDirectorNotNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      deputyDirector: {
        messages: [validationMessages.number("El ID del subdirector")],
      },
    },
    statusCode: 400,
  },
  deputyDirectorZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      deputyDirector: {
        messages: [validationMessages.minNumber("El ID del subdirector", 1)],
      },
    },
    statusCode: 400,
  },
  deputyDirectorNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      deputyDirector: {
        messages: [validationMessages.minNumber("El ID del subdirector", 1)],
      },
    },
    statusCode: 400,
  },
  deputyDirectorLong: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      deputyDirector: {
        messages: [validationMessages.maxNumber("El ID del subdirector", 999999999999999)],
      },
    },
    statusCode: 400,
  },
  emptyStartDate: generator.response({
    responseObject: {
      startDate: {
        messages: [validationMessages.invalidaFormat("Fecha de inicio")],
      },
    },
  }),
  emptyEndDate: generator.response({
    responseObject: {
      endDate: {
        messages: [validationMessages.invalidaFormat("Fecha de fin")],
      },
    },
  }),
};
