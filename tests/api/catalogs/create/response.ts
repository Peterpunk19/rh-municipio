import { generator } from "./generator";
import { HttpMessages } from "@/common/response/messages";
import { validationMessages } from "@/common/validation/messages";

export const response = {
  emptyParams: generator.response({
    responseObject: {
      name: {
        messages: [validationMessages.required("Nombre")],
      },
      display_name: {
        messages: [validationMessages.required("Nombre para mostrar")],
      },
    },
  }),
  emptyName: generator.response({
    responseObject: {
      name: {
        messages: [validationMessages.required("Nombre")],
      },
    },
  }),
  emptyDisplayName: generator.response({
    responseObject: {
      display_name: {
        messages: [validationMessages.required("Nombre para mostrar")],
      },
    },
  }),
  longName: generator.response({
    responseObject: {
      name: {
        messages: [validationMessages.maxLength("Nombre", 255)],
      },
    },
  }),
  longDisplayName: generator.response({
    responseObject: {
      display_name: {
        messages: [validationMessages.maxLength("Nombre para mostrar", 255)],
      },
    },
  }),
  validData: generator.response({
    success: true,
    message: HttpMessages.category.createdSuccess,
    responseObject: {
      id: 1,
      name: "test_catalog",
      display_name: "Test Catalog",
      active: true,
    },
    statusCode: 200,
  }),
  validDataInactive: generator.response({
    success: true,
    message: HttpMessages.category.createdSuccess,
    responseObject: {
      id: 1,
      name: "test_catalog",
      display_name: "Test Catalog",
      active: false,
    },
    statusCode: 200,
  }),
};
