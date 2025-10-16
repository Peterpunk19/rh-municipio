import { generator } from "./generator";
import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  validData: {
    success: true,
    message: HttpMessages.administrativeOrganizations.leadersCreatedSuccess,
    responseObject: {
      success: true,
      responseObject: [],
    },
    statusCode: 200,
  },
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
  secretaryNotNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      secretary: {
        messages: [validationMessages.number("El ID del secretario")],
      },
    },
    statusCode: 400,
  },
  secretaryZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      secretary: {
        messages: [validationMessages.minNumber("El ID del secretario", 1)],
      },
    },
    statusCode: 400,
  },
  secretaryNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      secretary: {
        messages: [validationMessages.minNumber("El ID del secretario", 1)],
      },
    },
    statusCode: 400,
  },
  secretaryLong: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      secretary: {
        messages: [validationMessages.maxNumber("El ID del secretario", 999999999999999)],
      },
    },
    statusCode: 400,
  },
  coordinatorNotNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      coordinator: {
        messages: [validationMessages.number("El ID del coordinador")],
      },
    },
    statusCode: 400,
  },
  coordinatorZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      coordinator: {
        messages: [validationMessages.minNumber("El ID del coordinador", 1)],
      },
    },
    statusCode: 400,
  },
  coordinatorNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      coordinator: {
        messages: [validationMessages.minNumber("El ID del coordinador", 1)],
      },
    },
    statusCode: 400,
  },
  coordinatorLong: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      coordinator: {
        messages: [validationMessages.maxNumber("El ID del coordinador", 999999999999999)],
      },
    },
    statusCode: 400,
  },
  immediateResponsibleNotNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      immediateResponsible: {
        messages: [validationMessages.number("El ID del responsable inmediato")],
      },
    },
    statusCode: 400,
  },
  immediateResponsibleZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      immediateResponsible: {
        messages: [validationMessages.minNumber("El ID del responsable inmediato", 1)],
      },
    },
    statusCode: 400,
  },
  immediateResponsibleNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      immediateResponsible: {
        messages: [validationMessages.minNumber("El ID del responsable inmediato", 1)],
      },
    },
    statusCode: 400,
  },
  immediateResponsibleLong: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      immediateResponsible: {
        messages: [validationMessages.maxNumber("El ID del responsable inmediato", 999999999999999)],
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
