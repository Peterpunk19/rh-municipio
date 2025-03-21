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
  duplicatedRfcCurp: generator.response({
    message: HttpMessages.employee.alreadyExists,
    responseObject: {},
  }),
  emptyGenderId: generator.response({
    responseObject: {
      genderId: {
        messages: [validationMessages.required("Género")],
      },
    },
  }),
  emptyAddressLine1: generator.response({
    responseObject: {
      addressLine1: {
        messages: [validationMessages.required("Calle")],
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
  emptyMunicipalityId: generator.response({
    responseObject: {
      municipalityId: {
        messages: [validationMessages.required("Municipio")],
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
        messages: [validationMessages.required("Tipo de empleado")],
      },
    },
  }),
};
