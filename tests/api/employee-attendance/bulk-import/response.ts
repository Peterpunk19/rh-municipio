import { generator } from "./generator";
import { validationMessages } from "@/common/validation/messages";

export const response = {
  emptyParams: generator.response({
    responseObject: {
      "": {
        messages: [validationMessages.array],
      },
    },
  }),
  emptyId: generator.response({
    responseObject: {
      "0.id": {
        messages: [validationMessages.required("ID")],
      },
    },
  }),
  emptyNumberEmployee: generator.response({
    responseObject: {
      "0.numberEmployee": {
        messages: [validationMessages.required("Número de empleado")],
      },
    },
  }),
  emptyIsEntry: generator.response({
    responseObject: {
      "0.isEntry": {
        messages: [validationMessages.required("isEntry")],
      },
    },
  }),
  emptyDateTime: generator.response({
    responseObject: {
      "0.dateTime": {
        messages: [validationMessages.invalidFormat("fecha")],
      },
    },
  }),
  emptyValues: generator.response({
    responseObject: {
      "0.id": {
        messages: [validationMessages.required("ID")],
      },
      "0.numberEmployee": {
        messages: [validationMessages.required("Número de empleado")],
      },
      "0.isEntry": {
        messages: [validationMessages.required("isEntry")],
      },
      "0.dateTime": {
        messages: [validationMessages.invalidFormat("fecha")],
      },
    },
  }),
  validData: {
    success: true,
    message: "Asistencias procesadas",
    responseObject: [
      {
        id: 12,
        numberEmployee: "107991",
        isEntry: 1,
        dateTime: "2025-11-01 08:30:09",
        status: "success",
      },
    ],
    statusCode: 200,
  },
};
