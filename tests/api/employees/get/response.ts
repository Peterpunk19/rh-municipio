export const response = {
  pageNotnumber: {
    success: false,
    message: "Invalid request",
    responseObject: {
      page: { messages: ["Página debe ser un número"] },
    },
    statusCode: 400,
  },
  pageZero: {
    success: false,
    message: "Invalid request",
    responseObject: {
      page: {
        messages: ["Página debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  pageNegative: {
    success: false,
    message: "Invalid request",
    responseObject: {
      page: {
        messages: ["Página debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  limitNotnumber: {
    success: false,
    message: "Invalid request",
    responseObject: {
      limit: {
        messages: ["Limite debe ser un número"],
      },
    },
    statusCode: 400,
  },
  limitZero: {
    success: false,
    message: "Invalid request",
    responseObject: {
      limit: {
        messages: ["Limite debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  limitNegative: {
    success: false,
    message: "Invalid request",
    responseObject: {
      limit: {
        messages: ["Limite debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  activeNotBoolean: {
    success: false,
    message: "Invalid request",
    responseObject: {
      active: {
        messages: ["Activo debe ser un valor booleano"],
      },
    },
    statusCode: 400,
  },
  activeAsNumber: {
    success: false,
    message: "Invalid request",
    responseObject: {
      active: {
        messages: ["Activo debe ser un valor booleano"],
      },
    },
    statusCode: 400,
  },
  statusEmployeeIdNotNumber: {
    success: false,
    message: "Invalid request",
    responseObject: {
      status_employee_id: {
        messages: ["Id estatus del empleado debe ser un número"],
      },
    },
    statusCode: 400,
  },
  statusEmployeeIdZero: {
    success: false,
    message: "Invalid request",
    responseObject: {
      status_employee_id: {
        messages: ["Id estatus del empleado debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  statusEmployeeIdNegative: {
    success: false,
    message: "Invalid request",
    responseObject: {
      status_employee_id: {
        messages: ["Id estatus del empleado debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  locationIdNotNumber: {
    success: false,
    message: "Invalid request",
    responseObject: {
      location_id: {
        messages: ["Id de ubicación debe ser un número"],
      },
    },
    statusCode: 400,
  },
  locationIdZero: {
    success: false,
    message: "Invalid request",
    responseObject: {
      location_id: {
        messages: ["Id de ubicación debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  locationIdNegative: {
    success: false,
    message: "Invalid request",
    responseObject: {
      location_id: {
        messages: ["Id de ubicación debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  invalidStartDate: {
    success: false,
    message: "Invalid request",
    responseObject: {
      start_date: {
        messages: ["Formato de Fecha de inicio inválida"],
      },
    },
    statusCode: 400,
  },
  invalidEndDate: {
    success: false,
    message: "Invalid request",
    responseObject: {
      end_date: {
        messages: ["Formato de Fecha de termino inválida"],
      },
    },
    statusCode: 400,
  },
  emptySearch: {
    success: false,
    message: "Invalid request",
    responseObject: {
      search: {
        messages: ["Búsqueda es requerido"],
      },
    },
    statusCode: 400,
  },
  longSearch: {
    success: false,
    message: "Invalid request",
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
