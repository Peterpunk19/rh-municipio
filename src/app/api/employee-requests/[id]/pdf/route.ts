import { NextRequest } from "next/server";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { EmployeeRequestService } from "@/app/api/services/employee-request.service";
import { formatDate } from "@/utils/formatter";
import type { RequestChangeData } from "@/components/shared/pdfs/templates/requests/types";
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

    if (!employeeRequest.rhDirector || !employeeRequest.destinationDirector || !employeeRequest.requestDetail) {
      const response = HttpResponse.notFound(HttpMessages.employeeRequests.incompleteDataForPDF, {});
      return handleHttpResponse(response);
    }

    const pdfData: RequestChangeData = {
      folio: employeeRequest.folio,
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
          })) || [],
      },
      request: {
        display_name: employeeRequest.request.display_name,
      },
      description: employeeRequest.description,
      rhDirector: employeeRequest.rhDirector,
      destinationDirector: employeeRequest.destinationDirector,
      changeDate: formatDate(employeeRequest.changeDate, "dd/MM/yyyy"),
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
