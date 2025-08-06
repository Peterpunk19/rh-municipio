import { generator } from "./generator";
import { validationMessages } from "@/common/validation/messages";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  validData: generator.response({
    success: true,
    message: HttpMessages.salaries.getSuccess,
    responseObject: {
      salary: {
        id: 1,
        salary: 100,
        active: true,
      },
    },
    statusCode: 200,
  }),
  categoryIdNotNumber: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      categoryId: {
        messages: [validationMessages.number("Categoría")],
      },
    },
    statusCode: 400,
  }),
  employeeTypeIdNotNumber: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      employeeTypeId: {
        messages: [validationMessages.number("Tipo de Empleado")],
      },
    },
    statusCode: 400,
  }),
  categoryIdZero: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      categoryId: {
        messages: [validationMessages.minNumber("Categoría", 1)],
      },
    },
    statusCode: 400,
  }),
  employeeTypeIdZero: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      employeeTypeId: {
        messages: [validationMessages.minNumber("Tipo de Empleado", 1)],
      },
    },
    statusCode: 400,
  }),
  categoryIdNegative: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      categoryId: {
        messages: [validationMessages.minNumber("Categoría", 1)],
      },
    },
    statusCode: 400,
  }),
  employeeTypeIdNegative: generator.response({
    success: false,
    message: HttpMessages.error.validationFields,
    responseObject: {
      employeeTypeId: {
        messages: [validationMessages.minNumber("Tipo de Empleado", 1)],
      },
    },
    statusCode: 400,
  }),
};
