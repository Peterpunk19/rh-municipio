import { generator } from "./generator";
import { HttpMessages } from "@/common/response/messages";

export const response = {
  successGetAll: generator.response({
    success: true,
    message: HttpMessages.catalog.success,
    responseObject: [generator.configYear()],
    statusCode: 200,
  }),
  errorGetAll: generator.response({
    success: false,
    message: "network error",
    responseObject: [],
    statusCode: 500,
  }),
};
