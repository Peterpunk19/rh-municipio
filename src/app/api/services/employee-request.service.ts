import { prisma } from "@/lib/prisma";
import type { IEmployeeRequest } from "@/app/api/employee-requests/types";
import { RequestService } from "@/app/api/services/request.service";

export const EmployeeRequestService = {
  async getFolio() {
    const lastFolio = await prisma.employeeRequest.findFirst({
      orderBy: {
        folio: "desc",
      },
      select: {
        folio: true,
      },
    });

    if (!lastFolio) {
      return "000001";
    }

    const lastNumber = Number.parseInt(lastFolio.folio, 10);
    return (lastNumber + 1).toString().padStart(6, "0");
  },

  async validateEmployeeRequest(params: IEmployeeRequest) {
    return await prisma.employeeRequest.findFirst({
      where: {
        employee_id: Number(params.employeeId),
        request_id: Number(params.requestId),
        request_status_id: Number(params.requestStatusId),
        request_date: params.requestDate,
      },
    });
  },

  async createEmployeeRequest(employeeRequest: IEmployeeRequest) {
    return prisma.$transaction(async (tx) => {
      const createEmployeeRequest = await tx.employeeRequest.create({
        data: {
          folio: employeeRequest.folio,
          oficio: employeeRequest.oficio ?? "",
          description: employeeRequest.description,
          request_date: employeeRequest.requestDate,
          employee: {
            connect: { id: Number(employeeRequest.employeeId) },
          },
          request: {
            connect: { id: Number(employeeRequest.requestId) },
          },
          request_status: {
            connect: { id: Number(employeeRequest.requestStatusId) },
          },
          requested_by: {
            connect: { id: Number(employeeRequest.requestedById) },
          },
          created_at: new Date(),
          active: true,
        },
      });

      const createEmployeeRequestStatus = await tx.employeeRequestStatus.create({
        data: {
          employee_request: {
            connect: { id: Number(createEmployeeRequest.id) },
          },
          request_status: {
            connect: { id: Number(employeeRequest.requestStatusId) },
          },
          created_by: {
            connect: { id: Number(employeeRequest.employeeId) },
          },
          created_at: new Date(),
        },
      });

      const createEmployeeRequestDetails = await tx.employeeRequestDetail.create({
        data: {
          ...(employeeRequest.startDate && {
            start_date: employeeRequest.startDate,
          }),
          ...(employeeRequest.endDate && {
            end_date: employeeRequest.endDate,
          }),
          ...(employeeRequest.attendanceDate && {
            attendance_date: employeeRequest.attendanceDate,
          }),
          employee_request: {
            connect: { id: Number(createEmployeeRequest.id) },
          },
          ...(employeeRequest.locationId && {
            location: {
              connect: { id: Number(employeeRequest.locationId) },
            },
          }),
          ...(employeeRequest.attendanceId && {
            attendance: {
              connect: { id: Number(employeeRequest.attendanceId) },
            },
          }),
        },
      });

      const typeRequest = await RequestService.getRequestById(createEmployeeRequest.request_id);
      let createEmployeeRequestSchedule: Array<any> = [];

      if (typeRequest?.name === "schedule_change_request" && employeeRequest.schedule) {
        createEmployeeRequestSchedule = await Promise.all(
          employeeRequest.schedule.map((schedule) =>
            tx.employeeRequestSchedule.create({
              data: {
                active: true,
                created_at: new Date(),
                employee_request: {
                  connect: { id: createEmployeeRequest.id },
                },
                start_day: {
                  connect: { id: Number(schedule.startDayId) },
                },
                end_day: {
                  connect: { id: Number(schedule.endDayId) },
                },
                start_hour: {
                  connect: { id: Number(schedule.startHourId) },
                },
                end_hour: {
                  connect: { id: Number(schedule.endHourId) },
                },
              },
            }),
          ),
        );
      }

      return [
        createEmployeeRequest,
        createEmployeeRequestStatus,
        createEmployeeRequestDetails,
        ...(typeRequest?.name === "schedule_change_request" ? [createEmployeeRequestSchedule] : []),
      ];
    });
  },
};
