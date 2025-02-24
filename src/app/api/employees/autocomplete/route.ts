import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeService } from "@/app/api/services/employee.service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.has("search") ? searchParams.get("search") : null;

    let response = HttpResponse.success(HttpMessages.error.notFound, {});

    if (search) {
      const existingEmployees = await EmployeeService.getEmployeesAutocomplete(search);
      response = HttpResponse.success(HttpMessages.catalog.success, existingEmployees);
    }

    return handleHttpResponse(response);
  } catch (error) {
    console.error(`An error occurred detail: ${error}`);
    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
}
