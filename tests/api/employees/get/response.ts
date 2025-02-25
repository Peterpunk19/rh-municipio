import { HttpMessages } from "@/common/response/messages";

export const response = {
  pageNotnumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      page: { messages: ["Página debe ser un número"] },
    },
    statusCode: 400,
  },
  pageZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      page: {
        messages: ["Página debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  pageNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      page: {
        messages: ["Página debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  limitNotnumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      limit: {
        messages: ["Limite debe ser un número"],
      },
    },
    statusCode: 400,
  },
  limitZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      limit: {
        messages: ["Limite debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  limitNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      limit: {
        messages: ["Limite debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  activeNotBoolean: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      active: {
        messages: ["Activo debe ser un valor booleano"],
      },
    },
    statusCode: 400,
  },
  activeAsNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      active: {
        messages: ["Activo debe ser un valor booleano"],
      },
    },
    statusCode: 400,
  },
  statusEmployeeIdNotNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      employee_status: {
        messages: ["Id estatus del empleado debe ser un número"],
      },
    },
    statusCode: 400,
  },
  statusEmployeeIdZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      employee_status: {
        messages: ["Id estatus del empleado debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  statusEmployeeIdNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      employee_status: {
        messages: ["Id estatus del empleado debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  locationIdNotNumber: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      location: {
        messages: ["Id de ubicación debe ser un número"],
      },
    },
    statusCode: 400,
  },
  locationIdZero: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      location: {
        messages: ["Id de ubicación debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  locationIdNegative: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      location: {
        messages: ["Id de ubicación debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  invalidStartDate: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      start_job_date_end: {
        messages: ["Formato de Fecha fin en rango de inicio inválida"],
      },
      start_job_date_start: {
        messages: ["Formato de Fecha de inicio en rango de inicio inválida"],
      },
    },
    statusCode: 400,
  },
  invalidEndDate: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      end_job_date_end: {
        messages: ["Formato de Fecha fin en rango final inválida"],
      },
      end_job_date_start: {
        messages: ["Formato de Fecha de inicio en rango final inválida"],
      },
    },
    statusCode: 400,
  },
  emptySearch: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      search: {
        messages: ["Búsqueda es requerido"],
      },
    },
    statusCode: 400,
  },
  longSearch: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      search: {
        messages: ["Búsqueda no puede exceder de 255 caracteres"],
      },
    },
    statusCode: 400,
  },
  validData: {
    success: true,
    message: "Empleados encontrados correctamente",
    responseObject: {
      data: [],
      total: 1,
      currentPage: 1,
      totalPages: 1,
    },
    statusCode: 200,
  },
};
