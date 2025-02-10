import { HttpMessages } from "@/common/response/messages";

export const response = {
  invalidRequest: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
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
      addressLine1: {
        messages: ["Calle es requerido"],
      },
      addressLine2: {
        messages: ["Número de casa es requerido"],
      },
      addressLine3: {
        messages: ["Número de Departamento es requerido"],
      },
      postalCode: {
        messages: ["Código postal es requerido"],
      },
      postalCodeSat: {
        messages: ["Código postal SAT es requerido"],
      },
      municipalityId: {
        messages: ["Municipio es requerido"],
      },
      startJobDate: {
        messages: ["Formato de Fecha de inicio inválida"],
      },
      endJobDate: {
        messages: ["Formato de Fecha de terminación inválida"],
      },
      categoryId: {
        messages: ["Categoria es requerido"],
      },
      employeeTypeId: {
        messages: ["Tipo de empleado es requerido"],
      },
      direccionId: {
        messages: ["Organo administrativo es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyNumberEmployee: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      numberEmployee: {
        messages: ["Número de empleado es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyName: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      name: {
        messages: ["Nombre(s) es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyPaternalLastName: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      paternalLastName: {
        messages: ["Apellido paterno es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyMaternalLastName: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      maternalLastName: {
        messages: ["Apellido materno es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyBirthday: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      birthday: {
        messages: ["Formato de Fecha de nacimiento inválida"],
      },
    },
    statusCode: 400,
  },
  emptyGenderId: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      genderId: {
        messages: ["Género es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyRfc: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      rfc: {
        messages: ["RFC es requerido", "Formato de RFC inválido"],
      },
    },
    statusCode: 400,
  },
  emptyCurp: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      curp: {
        messages: ["CURP es requerido", "Formato de CURP inválido"],
      },
    },
    statusCode: 400,
  },
  longNumberEmployee: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      numberEmployee: {
        messages: ["Número de empleado no puede exceder de 6 caracteres"],
      },
    },
    statusCode: 400,
  },
  longName: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      name: {
        messages: ["Nombre(s) no puede exceder de 255 caracteres"],
      },
    },
    statusCode: 400,
  },
  longFirstName: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      name: {
        messages: ["Nombre(s) no puede exceder de 255 caracteres"],
      },
    },
    statusCode: 400,
  },
  longPaternalLastName: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      paternalLastName: {
        messages: ["Apellido paterno no puede exceder de 255 caracteres"],
      },
    },
    statusCode: 400,
  },
  longMaternalLastName: {
    success: false,
    message: HttpMessages.error.validationFields,
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
      rfc: "DIBP921019Q12",
      curp: "DIBP921019HDFZLD12",
    },
    statusCode: 400,
  },
  emptyAddressLine1: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      addressLine1: {
        messages: ["Calle es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyAddressLine2: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      addressLine2: {
        messages: ["Número de casa es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyPostalCode: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      postalCode: {
        messages: ["Código postal es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyPostalCodeSat: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      postalCodeSat: {
        messages: ["Código postal SAT es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyMunicipalityId: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      municipalityId: {
        messages: ["Municipio es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyStartJobDate: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      startJobDate: {
        messages: ["Formato de Fecha de inicio inválida"],
      },
    },
    statusCode: 400,
  },
  emptyEndJobDate: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      endJobDate: {
        messages: ["Formato de Fecha de terminación inválida"],
      },
    },
    statusCode: 400,
  },
  emptyCategoryId: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      categoryId: {
        messages: ["Categoria es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyEmployeeTypeId: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      employeeTypeId: {
        messages: ["Tipo de empleado es requerido"],
      },
    },
    statusCode: 400,
  },
  emptyDireccionId: {
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      direccionId: {
        messages: ["Organo administrativo es requerido"],
      },
    },
    statusCode: 400,
  },
};
