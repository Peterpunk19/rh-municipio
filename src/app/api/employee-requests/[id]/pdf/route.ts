import { NextRequest } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeRequestService } from "@/app/api/services/employee-request.service";
import { formatDate } from "@/utils/formatter";
import type { RequestTemplateData } from "@/components/shared/pdfs/templates/requests/types";
import { REQUEST_TYPES_NAME } from "@/common/constants/RequestTypes";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const requestId = Number(id);
    if (!id || isNaN(requestId)) {
      const response = HttpResponse.failure(HttpMessages.employeeRequests.invalidId, {});
      return handleHttpResponse(response);
    }

    const employeeRequest = await EmployeeRequestService.getEmployeeRequestForPDF(requestId);

    if (!employeeRequest) {
      const response = HttpResponse.notFound(HttpMessages.employeeRequests.requestNotFound, {});
      return handleHttpResponse(response);
    }

    if (!employeeRequest.rhDirector || !employeeRequest.requestDetail) {
      const response = HttpResponse.notFound(HttpMessages.employeeRequests.incompleteDataForPDF, {});
      return handleHttpResponse(response);
    }

    const needDestinationDirector: string[] = [REQUEST_TYPES_NAME.ADSCRIPTION];
    if (needDestinationDirector.includes(employeeRequest.request.name) && !employeeRequest.destinationDirector) {
      const response = HttpResponse.notFound(HttpMessages.employeeRequests.incompleteDataForPDF, {});
      return handleHttpResponse(response);
    }

    const pdfData: RequestTemplateData = {
      folio: employeeRequest.folio,
      oficio: employeeRequest.oficio ?? "",
      request_date: formatDate(employeeRequest.request_date, "dd/MM/yyyy"),
      created_at: formatDate(employeeRequest.created_at, "dd/MM/yyyy"),
      employee: {
        name: employeeRequest.employee.name,
        paternal_last_name: employeeRequest.employee.paternal_last_name,
        maternal_last_name: employeeRequest.employee.maternal_last_name,
        number_employee: employeeRequest.employee.number_employee,
        rfc: employeeRequest.employee.rfc,
        curp: employeeRequest.employee.curp,
        employee_hiring:
          employeeRequest.employee.employee_hiring?.map((hiring) => ({
            direccion: hiring.direccion
              ? {
                  display_name: hiring.direccion.display_name,
                  secretaria: hiring.direccion.secretaria
                    ? {
                        display_name: hiring.direccion.secretaria.display_name,
                      }
                    : undefined,
                }
              : undefined,
            employee_type: hiring.employee_type
              ? {
                  display_name: hiring.employee_type.display_name,
                }
              : undefined,
            category: hiring.category
              ? {
                  display_name: hiring.category.display_name,
                }
              : undefined,
          })) || [],
        job_schedule_employee:
          employeeRequest.employee.job_schedule_employee?.map((jobSchedule) => ({
            start_day: jobSchedule.start_day,
            end_day: jobSchedule.end_day,
            start_hour: jobSchedule.start_hour,
            end_hour: jobSchedule.end_hour,
          })) || [],
        employee_attendance_type: {
          attendance: {
            display_name: employeeRequest.employee.employee_attendance_type?.[0]?.attendance?.display_name ?? "",
          },
        },
      },
      request: {
        name: employeeRequest.request.name,
        display_name: employeeRequest.request.display_name,
      },
      description: employeeRequest.description,
      rhDirector: employeeRequest.rhDirector,
      signatory: employeeRequest.signatory,
      destinationDirector: employeeRequest.destinationDirector,
      changeDate: formatDate(employeeRequest.changeDate, "dd/MM/yyyy"),
      leaveDate: formatDate(employeeRequest.leaveDate, "dd/MM/yyyy"),
      requestDetail: employeeRequest.requestDetail,
    };
    const response = HttpResponse.success(HttpMessages.employeeRequests.pdfDataObtainedSuccess, pdfData);
    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    const response = HttpResponse.internalServerError(HttpMessages.employeeRequests.internalServerError, {
      error: error.message,
      details: "Error al procesar datos para PDF",
    });
    return handleHttpResponse(response);
  }
}
