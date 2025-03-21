import { generator } from "./generator";
import { HttpMessages } from "@/common/response/messages";
import { validationMessages } from "@/common/validation/messages";

export const response = {
  validData: generator.response({
    success: true,
    message: HttpMessages.employee.updatedSuccess,
    responseObject: {
      employeeId: 1,
    },
    statusCode: 200,
  }),
  emptyNumberEmployee: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      numberEmployee: {
        messages: [validationMessages.required("Número de empleado")],
      },
    },
    statusCode: 400,
  }),
  emptyName: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      name: {
        messages: [validationMessages.required("Nombre(s)")],
      },
    },
    statusCode: 400,
  }),
  emptyPaternalLastName: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      paternalLastName: {
        messages: [validationMessages.required("Apellido paterno")],
      },
    },
    statusCode: 400,
  }),
  emptyMaternalLastName: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      maternalLastName: {
        messages: [validationMessages.required("Apellido materno")],
      },
    },
    statusCode: 400,
  }),
  emptyBirthday: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      birthday: {
        messages: [validationMessages.invalidaFormat("Fecha de nacimiento")],
      },
    },
    statusCode: 400,
  }),
  longNumberEmployee: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      numberEmployee: {
        messages: [validationMessages.maxLength("Número de empleado", 6)],
      },
    },
    statusCode: 400,
  }),
  longName: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      name: {
        messages: [validationMessages.maxLength("Nombre(s)", 255)],
      },
    },
    statusCode: 400,
  }),
  duplicatedRfcCurp: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      rfc: {
        messages: [validationMessages.invalidFormat("RFC")],
      },
      curp: {
        messages: [validationMessages.invalidFormat("CURP")],
      },
    },
    statusCode: 400,
  }),
  emptyAddressLine1: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      addressLine1: {
        messages: [validationMessages.required("Calle")],
      },
    },
    statusCode: 400,
  }),
  emptyPostalCode: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      postalCode: {
        messages: [validationMessages.required("Código postal")],
      },
    },
    statusCode: 400,
  }),
  emptyMunicipalityId: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      municipalityId: {
        messages: [validationMessages.required("Municipio")],
      },
    },
    statusCode: 400,
  }),
  emptyCategoryId: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      categoryId: {
        messages: [validationMessages.required("Categoria")],
      },
    },
    statusCode: 400,
  }),
  emptyEmployeeTypeName: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      employeeTypeName: {
        messages: [validationMessages.required("Tipo de empleado")],
      },
    },
    statusCode: 400,
  }),
};
