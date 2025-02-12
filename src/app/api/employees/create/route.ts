import { NextRequest } from "next/server";
import { EmployeePostSchema } from "@/schemas/employee";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { validateRequest } from "@/common/request/validateRequest";
import { EmployeeService } from "@/app/api/services/employee.service";
import { HttpMessages } from "@/common/response/messages";
import { IEmployee } from "@/app/api/employees/interface";
import { EmployeeTypeService } from "@/app/api/services/employeeType.service";

export async function POST(request: NextRequest) {
  const validationRequest = await validateRequest<IEmployee>(request, EmployeePostSchema);
  if (validationRequest.response) return validationRequest.response;

  const body = validationRequest.data;

  if (!body) {
    const response = HttpResponse.failure(HttpMessages.error.invalidRequest, {});
    return handleHttpResponse(response);
  }

  try {
    body.numberEmployee = await EmployeeService.getNumberEmployee();

    const existingEmployee = await EmployeeService.getEmployeeByRfcCurp(body.rfc, body.curp);

    if (existingEmployee) {
      const response = HttpResponse.failure(HttpMessages.employee.alreadyExists, {
        rfc: body.rfc,
        curp: body.curp,
      });

      return handleHttpResponse(response);
    }

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

    const [employee] = await EmployeeService.createEmployee(body);
    const response = HttpResponse.success(HttpMessages.employee.createdSuccess, {
      employeeId: employee.id,
    });

    return handleHttpResponse(response);
  } catch (error: any) {
    console.log(error.message);

    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });

    return handleHttpResponse(response);
  }
}
