import { handleHttpResponse } from "@/common/response/handler";
import { validateRequestByUrlParams } from "@/common/request/validateRequest";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { getParamsFromUrl } from "@/common/utils";
import { logger } from "@/lib/logger";
import { authMiddleware } from "@/middleware/authMiddleware";
import { NextResponse } from "next/server";
import { IJobScheduleCalendarFilters } from "@/app/api/job-schedule-calendar/types";
import { JobScheduleCalendarGetSchema } from "@/schemas/job-schedule-calendar";
import { JobScheduleCalendarService } from "@/app/api/services/job-schedule-calendar.service";

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export async function GET(request: Request) {
  try {
    const params = {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      search: null,
      from: null,
      to: null,
    };

    const requestParams = await getParamsFromUrl(request, params);
    const authData = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    const validationRequest = await validateRequestByUrlParams<IJobScheduleCalendarFilters>(
      requestParams,
      JobScheduleCalendarGetSchema,
    );

    if (validationRequest.response) return validationRequest.response;

    const validRequestData = validationRequest.data;

    if (!validRequestData) {
      const response = HttpResponse.failure(HttpMessages.error.validationFields, {});
      return handleHttpResponse(response);
    }

    const jobScheduleCalendar = await JobScheduleCalendarService.getJobScheduleCalendar(validRequestData);

    if (jobScheduleCalendar && jobScheduleCalendar.total === 0) {
      const response = HttpResponse.success(HttpMessages.jobScheduleCalendar.notFound, {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
      });

      return handleHttpResponse(response);
    }

    const response = HttpResponse.success(HttpMessages.employeeAttendance.getSuccess, jobScheduleCalendar);

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, {
      error: HttpMessages.error.internalServerError,
    });
    return handleHttpResponse(response);
  }
}
