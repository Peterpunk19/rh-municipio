import { EmployeeService } from "@/app/api/services/employee.service";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { logger } from "@/lib/logger";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const jobSchedule = await EmployeeService.getCurrentJobSchedule(Number(id));

    const response = HttpResponse.success(HttpMessages.employee.getScheduleSuccess, jobSchedule);
    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
}
