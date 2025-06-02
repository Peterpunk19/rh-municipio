import { EmployeeService } from "@/app/api/services/employee.service";
import { handleHttpResponse } from "@/common/response/handler";
import type { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const jobSchedule = await EmployeeService.getCurrentJobSchedule(Number(id));
    return handleHttpResponse({
      success: true,
      statusCode: 200,
      responseObject: jobSchedule,
      message: HttpMessages.employee.getScheduleSuccess,
    } as HttpResponse);
  } catch (error) {
    return handleHttpResponse({
      success: false,
      statusCode: 500,
      message: HttpMessages.error.internalServerError,
    } as HttpResponse);
  }
}
