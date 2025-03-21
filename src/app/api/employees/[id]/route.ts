import type { NextRequest } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { EmployeeGetByIdSchema, EmployeePostSchema } from "@/schemas/employee";
import type { IEmployeeById, IEmployee } from "@/app/api/employees/interface";
import { validateRequestByUrlParams, validateRequest } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeService } from "@/app/api/services/employee.service";
import { EmployeeTypeService } from "@/app/api/services/employeeType.service";
import { StatusCodes } from "http-status-codes";
import { validationMessages } from "@/common/validation/messages";
import { logger } from "@/lib/logger";

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
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
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
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const employeeId = Number.parseInt((await params).id);
    const validationRequest = await validateRequest<IEmployee>(request, EmployeePostSchema);
    if (validationRequest.response) return validationRequest.response;
    const body = validationRequest.data;

    if (!body) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
      return handleHttpResponse(response);
    }

    if (!body.municipalityId) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {
        municipalityId: {
          messages: [validationMessages.required("Municipio")],
        },
      }, StatusCodes.BAD_REQUEST);
      return handleHttpResponse(response);
    }

    if (!body.categoryId) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {
        categoryId: {
          messages: [validationMessages.required("Categoria")],
        },
      }, StatusCodes.BAD_REQUEST);
      return handleHttpResponse(response);
    }

    const existingEmployee = await EmployeeService.getEmployeeByRfcCurp(body.rfc, body.curp, employeeId);
    if (existingEmployee) {
      const response = HttpResponse.failure(HttpMessages.employee.alreadyExists, {});
      return handleHttpResponse(response);
    }

    const currentEmployee = await EmployeeService.getEmployeeById(employeeId);
    if (!currentEmployee) {
      const response = HttpResponse.failure(HttpMessages.employee.notFoundById, {}, StatusCodes.NOT_FOUND);
      return handleHttpResponse(response);
    }
    if (!currentEmployee.active) {
      const response = HttpResponse.failure(HttpMessages.employee.inactive, {}, StatusCodes.FORBIDDEN);
      return handleHttpResponse(response);
    }

    body.numberEmployee = currentEmployee.number_employee;

    const employeeType = await EmployeeTypeService.getEmployeeTypeByName(body.employeeTypeName);
    if (!employeeType) {
      const response = HttpResponse.failure(HttpMessages.employee.invalidEmployeeType, {
        employeeTypeName: {
          messages: [body.employeeTypeName],
        },
      });
      return handleHttpResponse(response);
    }
    body.employeeTypeId = employeeType.id;
    const [employee] = await EmployeeService.updateEmployee(body, currentEmployee);
    const response = HttpResponse.success(HttpMessages.employee.updatedSuccess, {
      employeeId: employee.id,
    });

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
}
