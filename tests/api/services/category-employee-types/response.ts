import type { IResponse } from "@/utils/types";
import { HttpMessages } from "@/common/response/messages";

export const makeSuccessResponse = (responseObject: any): IResponse => ({
  success: true,
  message: HttpMessages.salaries.getSuccess,
  responseObject,
  statusCode: 200,
});

export const makeErrorResponse = (message = "error"): IResponse => ({
  success: false,
  message,
  responseObject: null,
  statusCode: 500,
});
