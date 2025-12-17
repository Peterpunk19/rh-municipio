import { EmployeeService } from "@/app/api/services/employee.service";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { logger } from "@/lib/logger";
import { getParamsFromUrl } from "@/common/utils";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const filters = {
      from: null,
      to: null,
    };

    const requestParams = await getParamsFromUrl(request, filters);
    const jobSchedule = await EmployeeService.getCurrentJobScheduleCalendar(
      Number(id),
      requestParams.from,
      requestParams.to,
    );

    const response = HttpResponse.success(HttpMessages.employee.getScheduleSuccess, jobSchedule);
    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });

    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
}
