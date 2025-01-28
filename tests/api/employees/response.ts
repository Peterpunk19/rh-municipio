export const response = {
  invalidRequest: {
    success: false,
    message: "Invalid request",
    responseObject: {
      numberEmployee: {
        messages: ["Número de empleado es requerido"],
      },
      name: {
        messages: ["Nombre(s) es requerido"],
      },
      paternalLastName: {
        messages: ["Apellido paterno es requerido"],
      },
      maternalLastName: {
        messages: ["Required"],
      },
      birthday: {
        messages: ["Formato de Fecha de nacimiento inválida"],
      },
      genderId: {
        messages: ["Género es requerido"],
      },
      rfc: {
        messages: ["Required"],
      },
      curp: {
        messages: ["Required"],
      },
    },
    statusCode: 400,
  },
  emptyNumberEmployee: {
    success: false,
    message: "Invalid request",
    responseObject: {
      numberEmployee: {
        messages: ["Número de empleado es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyName: {
    success: false,
    message: "Invalid request",
    responseObject: {
      name: {
        messages: ["Nombre(s) es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyPaternalLastName: {
    success: false,
    message: "Invalid request",
    responseObject: {
      paternalLastName: {
        messages: ["Apellido paterno es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyMaternalLastName: {
    success: false,
    message: "Invalid request",
    responseObject: {
      maternalLastName: {
        messages: ["Apellido materno es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyBirthday: {
    success: false,
    message: "Invalid request",
    responseObject: {
      birthday: {
        messages: ["Formato de Fecha de nacimiento inválida"],
      },
    },
    statusCode: 400,
  },
  emptyGenderId: {
    success: false,
    message: "Invalid request",
    responseObject: {
      genderId: {
        messages: ["Género es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyRfc: {
    success: false,
    message: "Invalid request",
    responseObject: {
      rfc: {
        messages: ["RFC es requerido", "Formato de RFC inválido"],
      },
    },
    statusCode: 400,
  },
  emptyCurp: {
    success: false,
    message: "Invalid request",
    responseObject: {
      curp: {
        messages: ["CURP es requerido", "Formato de CURP inválido"],
      },
    },
    statusCode: 400,
  },
  longNumberEmployee: {
    success: false,
    message: "Invalid request",
    responseObject: {
      numberEmployee: {
        messages: ["Número de empleado no puede exceder de 6 caracteres"],
      },
    },
    statusCode: 400,
  },
  longName: {
    success: false,
    message: "Invalid request",
    responseObject: {
      name: {
        messages: ["Nombre(s) no puede exceder de 255 caracteres"],
      },
    },
    statusCode: 400,
  },
  longFirstName: {
    success: false,
    message: "Invalid request",
    responseObject: {
      name: {
        messages: ["Nombre(s) no puede exceder de 255 caracteres"],
      },
    },
    statusCode: 400,
  },
  longPaternalLastName: {
    success: false,
    message: "Invalid request",
    responseObject: {
      paternalLastName: {
        messages: ["Apellido paterno no puede exceder de 255 caracteres"],
      },
    },
    statusCode: 400,
  },
  longMaternalLastName: {
    success: false,
    message: "Invalid request",
    responseObject: {
      maternalLastName: {
        messages: ["Apellido materno no puede exceder de 255 caracteres"],
      },
    },
    statusCode: 400,
  },
  validData: {
    success: true,
    message: "Empleado creado correctamente",
    responseObject: {},
    statusCode: 200,
  },
  duplicatedRfcCurp: {
    success: false,
    message: "RFC or CURP ya existen",
    responseObject: {
      rfc: "DIBP921019QV0",
      curp: "DIBP921019HDFZLD09",
    },
    statusCode: 400,
  },
};
