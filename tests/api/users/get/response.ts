export const response = {
  limitNotnumber: {
    success: false,
    message: "Invalid request",
    responseObject: {
      limit: { messages: ["El limite debe ser un número"] },
    },
    statusCode: 400,
  },
  limitZero: {
    success: false,
    message: "Invalid request",
    responseObject: {
      limit: {
        messages: ["El limite debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  limitNegative: {
    success: false,
    message: "Invalid request",
    responseObject: {
      limit: {
        messages: ["El limite debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  pageNotnumber: {
    success: false,
    message: "Invalid request",
    responseObject: {
      page: {
        messages: ["El número de página debe ser un número"],
      },
    },
    statusCode: 400,
  },
  pageZero: {
    success: false,
    message: "Invalid request",
    responseObject: {
      page: {
        messages: ["El número de página debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  pageNegative: {
    success: false,
    message: "Invalid request",
    responseObject: {
      page: {
        messages: ["El número de página debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  roleIdNotNumber: {
    success: false,
    message: "Invalid request",
    responseObject: {
      role_id: {
        messages: ["El ID del rol de usuario debe ser un número"],
      },
    },
    statusCode: 400,
  },
  roleIdZero: {
    success: false,
    message: "Invalid request",
    responseObject: {
      role_id: {
        messages: ["El ID del rol de usuario debe ser un número igual o mayor a 1"],
      },
    },
    statusCode: 400,
  },
  roleIdNegative: {
    success: false,
    message: "Invalid request",
    responseObject: {
      role_id: {
        messages: ["El ID del rol de usuario debe ser un número igual o mayor a 1"],
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
  validData: {
    success: true,
    message: "Usuarios encontrados correctamente",
    responseObject: {
      total: 100,
      totalPages: 10,
      currentPage: 1,
      users: [],
    },
    statusCode: 200,
  },
};
