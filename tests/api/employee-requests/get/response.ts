import { HttpMessages } from "@/common/response/messages";
import { validationMessages } from "@/common/validation/messages";

export const response = {
  pageNotnumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      page: { messages: [validationMessages.number('Página')] },
    },
    statusCode: 400,
  },
  pageZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      page: {
        messages: [validationMessages.minNumber('Página', 1)],
      },
    },
    statusCode: 400,
  },
  pageNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      page: {
        messages: [validationMessages.minNumber('Página', 1)],
      },
    },
    statusCode: 400,
  },
  limitNotnumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      limit: {
        messages: [validationMessages.number('Límite')],
      },
    },
    statusCode: 400,
  },
  limitZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      limit: {
        messages: [validationMessages.minNumber('Límite', 1)],
      },
    },
    statusCode: 400,
  },
  limitNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      limit: {
        messages: [validationMessages.minNumber('Límite', 1)],
      },
    },
    statusCode: 400,
  },
  requestIdNotNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      request_id: {
        messages: [validationMessages.number('ID de solicitud')],
      },
    },
    statusCode: 400,
  },
  requestStatusIdNotNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      request_status_id: {
        messages: [validationMessages.number('ID de estatus de solicitud')],
      },
    },
    statusCode: 400,
  },
  requestIdZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      request_id: {
        messages: [validationMessages.minNumber('ID de solicitud', 1)],
      },
    },
    statusCode: 400,
  },
  requestStatusIdZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      request_status_id: {
        messages: [validationMessages.minNumber('ID de estatus de solicitud', 1)],
      },
    },
    statusCode: 400,
  },
  requestIdNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      request_id: {
        messages: [validationMessages.minNumber('ID de solicitud', 1)],
      },
    },
    statusCode: 400,
  },
  requestStatusIdNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      request_status_id: {
        messages: [validationMessages.minNumber('ID de estatus de solicitud', 1)],
      },
    },
    statusCode: 400,
  },
  invalidCreatedAt: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      created_at: {
        messages: [validationMessages.invalidaFormat('Fecha de creación')],
      },
    },
    statusCode: 400,
  },
  longSearch: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      search: {
        messages: [validationMessages.maxLength('Búsqueda', 255)],
      },
    },
    statusCode: 400,
  },
  validData: {
    success: true,
    message: HttpMessages.employeeRequests.getSuccess,
    responseObject: {
      requests: [],
      total: 100,
      currentPage: 1,
      totalPages: 10,
    },
    statusCode: 200,
  },
};
