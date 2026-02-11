import { generator } from "./generator";
import { HttpMessages } from "@/common/response/messages";
import { validationMessages } from "@/common/validation/messages";

export const response = {
  emptyParams: generator.response({
    responseObject: {
      name: {
        messages: [validationMessages.required("Nombre(s)")],
      },
      paternalLastName: {
        messages: [validationMessages.required("Apellido paterno")],
      },
      maternalLastName: {
        messages: [validationMessages.required("Apellido materno")],
      },
      birthday: {
        messages: [validationMessages.invalidaFormat("Fecha de nacimiento")],
      },
      genderId: {
        messages: [validationMessages.required("Género")],
      },
      rfc: {
        messages: [validationMessages.required("RFC")],
      },
      curp: {
        messages: [validationMessages.required("CURP")],
      },
      addressLine1: {
        messages: [validationMessages.required("Calle")],
      },
      addressLine2: {
        messages: [validationMessages.required("Número de casa")],
      },
      addressLine3: {
        messages: [validationMessages.required("Número de Departamento")],
      },
      addressLine4: {
        messages: [validationMessages.required("Colonia")],
      },
      postalCode: {
        messages: [validationMessages.required("Código postal")],
      },
      postalCodeSat: {
        messages: [validationMessages.required("Código postal SAT")],
      },
      municipalityId: {
        messages: [validationMessages.required("Municipio")],
      },
      startJobDate: {
        messages: [validationMessages.invalidaFormat("Fecha de inicio")],
      },
      endJobDate: {
        messages: [validationMessages.invalidaFormat("Fecha de terminación")],
      },
      categoryId: {
        messages: [validationMessages.required("Categoria")],
      },
      employeeTypeName: {
        messages: [validationMessages.required("Tipo de empleado")],
      },
      direccionId: {
        messages: [validationMessages.required("Órgano administrativo")],
      },
    },
  }),
  emptyNumberEmployee: generator.response({
    responseObject: {
      numberEmployee: {
        messages: [validationMessages.required("Número de empleado")],
      },
    },
  }),
  emptyName: generator.response({
    responseObject: {
      name: {
        messages: [validationMessages.required("Nombre(s)")],
      },
    },
  }),
  emptyPaternalLastName: generator.response({
    responseObject: {
      paternalLastName: {
        messages: [validationMessages.required("Apellido paterno")],
      },
    },
  }),
  emptyMaternalLastName: generator.response({
    responseObject: {
      maternalLastName: {
        messages: [validationMessages.required("Apellido materno")],
      },
    },
  }),
  emptyBirthday: generator.response({
    responseObject: {
      birthday: {
        messages: [validationMessages.invalidaFormat("Fecha de nacimiento")],
      },
    },
  }),
  emptyGenderId: generator.response({
    responseObject: {
      genderId: {
        messages: [validationMessages.required("Género")],
      },
    },
  }),
  emptyRfc: generator.response({
    responseObject: {
      rfc: {
        messages: [validationMessages.required("RFC"), validationMessages.invalidFormat("RFC")],
      },
    },
  }),
  emptyCurp: generator.response({
    responseObject: {
      curp: {
        messages: [validationMessages.required("CURP"), validationMessages.invalidFormat("CURP")],
      },
    },
  }),
  longNumberEmployee: generator.response({
    responseObject: {
      numberEmployee: {
        messages: [validationMessages.maxLength("Número de empleado", 6)],
      },
    },
  }),
  longName: generator.response({
    responseObject: {
      name: {
        messages: [validationMessages.maxLength("Nombre(s)", 255)],
      },
    },
  }),
  longPaternalLastName: generator.response({
    responseObject: {
      paternalLastName: {
        messages: [validationMessages.maxLength("Apellido paterno", 255)],
      },
    },
  }),
  longMaternalLastName: generator.response({
    responseObject: {
      maternalLastName: {
        messages: [validationMessages.maxLength("Apellido materno", 255)],
      },
    },
  }),
  duplicatedRfcCurp: generator.response({
    message: HttpMessages.employee.alreadyExists,
    responseObject: {},
  }),
  validData: generator.response({
    success: true,
    message: "Empleado creado correctamente",
    responseObject: {
      employeeId: 123,
    },
    statusCode: 200,
  }),
  emptyAddressLine1: generator.response({
    responseObject: {
      addressLine1: {
        messages: [validationMessages.required("Calle")],
      },
    },
  }),
  longAddressLine1: generator.response({
    responseObject: {
      addressLine1: {
        messages: [validationMessages.maxLength("Calle", 255)],
      },
    },
  }),
  emptyAddressLine2: generator.response({
    responseObject: {
      addressLine2: {
        messages: [validationMessages.required("Número de casa")],
      },
    },
  }),
  longAddressLine2: generator.response({
    responseObject: {
      addressLine2: {
        messages: [validationMessages.maxLength("Número de casa", 255)],
      },
    },
  }),
  emptyAddressLine4: generator.response({
    responseObject: {
      addressLine4: {
        messages: [validationMessages.required("Colonia")],
      },
    },
  }),
  longAddressLine4: generator.response({
    responseObject: {
      addressLine4: {
        messages: [validationMessages.maxLength("Colonia", 255)],
      },
    },
  }),
  emptyPostalCode: generator.response({
    responseObject: {
      postalCode: {
        messages: [validationMessages.required("Código postal")],
      },
    },
  }),
  emptyPostalCodeSat: generator.response({
    responseObject: {
      postalCodeSat: {
        messages: [validationMessages.required("Código postal SAT")],
      },
    },
  }),
  emptyMunicipalityId: generator.response({
    responseObject: {
      municipalityId: {
        messages: [validationMessages.required("Municipio")],
      },
    },
  }),
  emptyStartJobDate: generator.response({
    responseObject: {
      startJobDate: {
        messages: [validationMessages.invalidaFormat("Fecha de inicio")],
      },
    },
  }),
  emptyEndJobDate: generator.response({
    responseObject: {
      endJobDate: {
        messages: [validationMessages.invalidaFormat("Fecha de terminación")],
      },
    },
  }),
  emptyCategoryId: generator.response({
    responseObject: {
      categoryId: {
        messages: [validationMessages.required("Categoria")],
      },
    },
  }),
  emptyMaritalStatusId: generator.response({
    responseObject: {
      maritalStatusId: {
        messages: [validationMessages.required("Estado Civil")],
      },
    },
  }),
  emptySchoolingId: generator.response({
    responseObject: {
      schoolingId: {
        messages: [validationMessages.required("Escolaridad")],
      },
    },
  }),
  emptyOccupationId: generator.response({
    responseObject: {
      occupationId: {
        messages: [validationMessages.required("Ocupación")],
      },
    },
  }),
  emptyProfessionId: generator.response({
    responseObject: {
      professionId: {
        messages: [validationMessages.required("Profesión")],
      },
    },
  }),
  emptyIdentificationTypeId: generator.response({
    responseObject: {
      identificationTypeId: {
        messages: [validationMessages.required("Tipo de identificacion")],
      },
    },
  }),
  emptyEmployeeTypeName: generator.response({
    responseObject: {
      employeeTypeName: {
        messages: [validationMessages.required("Tipo de empleado")],
      },
    },
  }),
  invalidEmployeeTypeName: generator.response({
    responseObject: {
      employeeTypeName: {
        messages: [validationMessages.invalid("Tipo de empleado")],
      },
    },
  }),
  emptyEmployeeTypeBaseSindicalizado: generator.response({
    responseObject: {
      tradeUnionId: {
        messages: [validationMessages.requiredIf("Sindicato", "Tipo de empleado", "BASE SINDICALIZADO")],
      },
    },
  }),
  emptyDireccionId: generator.response({
    responseObject: {
      direccionId: {
        messages: [validationMessages.required("Órgano administrativo")],
      },
    },
  }),
};
