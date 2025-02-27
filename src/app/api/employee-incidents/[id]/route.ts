import { handleHttpResponse } from "@/common/response/handler";
import { EmployeeGetByIdSchema } from "@/schemas/employee";
import type { IEmployeeById } from "@/app/api/employees/interface";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeIncidentsService } from "@/app/api/services/employee-incidents.service";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number.parseInt((await params).id);

    const validationRequest = await validateRequestByUrlParams<IEmployeeById>({ id }, EmployeeGetByIdSchema);

    if (validationRequest.response) return validationRequest.response;

    const validRequestData = validationRequest.data;

    if (!validRequestData) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
      return handleHttpResponse(response);
    }

    const existingEmployeeIncident = await EmployeeIncidentsService.getEmployeeIncidentById(validRequestData.id);

    if (!existingEmployeeIncident) {
      const response = HttpResponse.failure(HttpMessages.employeeIncidents.notFoundById, {});
      return handleHttpResponse(response);
    }

    const response = HttpResponse.success(HttpMessages.employeeIncidents.foundById, existingEmployeeIncident);
    return handleHttpResponse(response);
  } catch (error) {
    console.error(`An error occurred detail: ${error}`);
    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
}
