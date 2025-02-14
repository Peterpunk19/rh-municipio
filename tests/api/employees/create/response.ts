import { generator } from "./generator";

export const response = {
  emptyParams: generator.response({
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
      addressLine4: {
        messages: ["Colonia es requerido"],
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
  }),
  emptyNumberEmployee: generator.response({
    responseObject: {
      numberEmployee: {
        messages: ["Número de empleado es requerido"],
      },
    },
  }),
  emptyName: generator.response({
    responseObject: {
      name: {
        messages: ["Nombre(s) es requerido"],
      },
    },
  }),
  emptyPaternalLastName: generator.response({
    responseObject: {
      paternalLastName: {
        messages: ["Apellido paterno es requerido"],
      },
    },
  }),
  emptyMaternalLastName: generator.response({
    responseObject: {
      maternalLastName: {
        messages: ["Apellido materno es requerido"],
      },
    },
  }),
  emptyBirthday: generator.response({
    responseObject: {
      birthday: {
        messages: ["Formato de Fecha de nacimiento inválida"],
      },
    },
  }),
  emptyGenderId: generator.response({
    responseObject: {
      genderId: {
        messages: ["Género es requerido"],
      },
    },
  }),
  emptyRfc: generator.response({
    responseObject: {
      rfc: {
        messages: ["RFC es requerido", "Formato de RFC inválido"],
      },
    },
  }),
  emptyCurp: generator.response({
    responseObject: {
      curp: {
        messages: ["CURP es requerido", "Formato de CURP inválido"],
      },
    },
  }),
  longNumberEmployee: generator.response({
    responseObject: {
      numberEmployee: {
        messages: ["Número de empleado no puede exceder de 6 caracteres"],
      },
    },
  }),
  longName: generator.response({
    responseObject: {
      name: {
        messages: ["Nombre(s) no puede exceder de 255 caracteres"],
      },
    },
  }),
  longFirstName: generator.response({
    responseObject: {
      name: {
        messages: ["Nombre(s) no puede exceder de 255 caracteres"],
      },
    },
  }),
  longPaternalLastName: generator.response({
    responseObject: {
      paternalLastName: {
        messages: ["Apellido paterno no puede exceder de 255 caracteres"],
      },
    },
  }),
  longMaternalLastName: generator.response({
    responseObject: {
      maternalLastName: {
        messages: ["Apellido materno no puede exceder de 255 caracteres"],
      },
    },
  }),
  validData: generator.response({
    success: true,
    message: "Empleado creado correctamente",
    responseObject: {},
    statusCode: 200,
  }),
  duplicatedRfcCurp: generator.response({
    message: "RFC or CURP ya existen",
    responseObject: {
      rfc: "DIBP921019Q12",
      curp: "DIBP921019HDFZLD12",
    },
  }),
  emptyAddressLine1: generator.response({
    responseObject: {
      addressLine1: {
        messages: ["Calle es requerido"],
      },
    },
  }),
  longAddressLine1: generator.response({
    responseObject: {
      addressLine1: {
        messages: ["Calle no puede exceder de 255 caracteres"],
      },
    },
  }),
  emptyAddressLine2: generator.response({
    responseObject: {
      addressLine2: {
        messages: ["Número de casa es requerido"],
      },
    },
  }),
  longAddressLine2: generator.response({
    responseObject: {
      addressLine2: {
        messages: ["Número de casa no puede exceder de 255 caracteres"],
      },
    },
  }),
  emptyAddressLine4: generator.response({
    responseObject: {
      addressLine4: {
        messages: ["Colonia es requerido"],
      },
    },
  }),
  longAddressLine4: generator.response({
    responseObject: {
      addressLine4: {
        messages: ["Colonia no puede exceder de 255 caracteres"],
      },
    },
  }),
  emptyPostalCode: generator.response({
    responseObject: {
      postalCode: {
        messages: ["Código postal es requerido"],
      },
    },
  }),
  emptyPostalCodeSat: generator.response({
    responseObject: {
      postalCodeSat: {
        messages: ["Código postal SAT es requerido"],
      },
    },
  }),
  emptyMunicipalityId: generator.response({
    responseObject: {
      municipalityId: {
        messages: ["Municipio es requerido"],
      },
    },
  }),
  emptyStartJobDate: generator.response({
    responseObject: {
      startJobDate: {
        messages: ["Formato de Fecha de inicio inválida"],
      },
    },
  }),
  emptyEndJobDate: generator.response({
    responseObject: {
      endJobDate: {
        messages: ["Formato de Fecha de terminación inválida"],
      },
    },
  }),
  emptyCategoryId: generator.response({
    responseObject: {
      categoryId: {
        messages: ["Categoria es requerido"],
      },
    },
  }),
  emptyEmployeeTypeId: generator.response({
    responseObject: {
      employeeTypeId: {
        messages: ["Tipo de empleado es requerido"],
      },
    },
  }),
  emptyDireccionId: generator.response({
    responseObject: {
      direccionId: {
        messages: ["Organo administrativo es requerido"],
      },
    },
  }),
};
