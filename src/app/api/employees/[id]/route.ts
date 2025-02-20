import { handleHttpResponse } from "@/common/response/handler";
import { EmployeeGetByIdSchema } from "@/schemas/employee";
import type { IEmployeeById } from "@/app/api/employees/interface";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeService } from "@/app/api/services/employee.service";
import { StatusCodes } from "http-status-codes";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number.parseInt((await params).id);
    const requestParams = {
      id,
    };
    const validationRequest = await validateRequestByUrlParams<IEmployeeById>(requestParams, EmployeeGetByIdSchema);
    if (validationRequest.response) return validationRequest.response;
    const validRequestData = validationRequest.data;

    if (!validRequestData) {
      const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
      return handleHttpResponse(response);
    }

    const existingEmployee = await EmployeeService.getEmployeeById(validRequestData.id);
    if (!existingEmployee) {
      const response = HttpResponse.failure(HttpMessages.employee.notFoundById, {}, StatusCodes.NOT_FOUND);
      return handleHttpResponse(response);
    }
    if (!existingEmployee.active) {
      const response = HttpResponse.failure(HttpMessages.employee.inactive, {}, StatusCodes.FORBIDDEN);
      return handleHttpResponse(response);
    }
    const response = HttpResponse.success(HttpMessages.employee.foundById, existingEmployee);
    return handleHttpResponse(response);
  } catch (error) {
    console.error(`An error occurred detail: ${error}`);
    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
}
