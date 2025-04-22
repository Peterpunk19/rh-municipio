import { prisma } from "@/lib/prisma";
import type { IEmployeeRequest, IEmployeeRequestsFilters } from "@/app/api/employee-requests/types";
import { RequestService } from "@/app/api/services/request.service";
import { buildWhereClause, getPaginationData } from "@/common/utils";

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
  async getEmployeeRequestsByParams(employeeRequestsFilters: IEmployeeRequestsFilters) {
    const limit = Number(employeeRequestsFilters.limit);
    const page = Number(employeeRequestsFilters.page);
    const offset = (page - 1) * limit;

    const filterMappings = {
      request_id: "request_id",
      request_status_id: "request_status_id",
    };

    const searchMappings = [
      { path: ["employee", "name"], operators: ["is", "contains"] },
      { path: ["employee", "paternal_last_name"], operators: ["is", "contains"] },
      { path: ["employee", "maternal_last_name"], operators: ["is", "contains"] },
      { path: ["employee", "rfc"], operators: ["is", "contains"] },
      { path: ["employee", "curp"], operators: ["is", "contains"] },
      { path: ["employee", "number_employee"], operators: ["is", "contains"] },
    ];

    const whereClause: any = await buildWhereClause(filterMappings, employeeRequestsFilters, searchMappings);

    if (employeeRequestsFilters.created_at) {
      whereClause.created_at = {
        gte: new Date(employeeRequestsFilters.created_at),
      };
    }

    const data = await prisma.employeeRequest.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      orderBy: {
        id: "desc",
      },
      include: {
        employee: {
          select: {
            id: true,
            number_employee: true,
            name: true,
            paternal_last_name: true,
            maternal_last_name: true,
            rfc: true,
            curp: true,
          },
        },
        request: {
          select: {
            id: true,
            name: true,
            display_name: true,
          },
        },
        request_status: {
          select: {
            id: true,
            name: true,
            display_name: true,
          },
        },
        requested_by: {
          select: {
            id: true,
            username: true,
          },
        },
        resolved_by: {
          select: {
            id: true,
            name: true,
            paternal_last_name: true,
            maternal_last_name: true,
          },
        },
      },
    });

    const requests = data.map((item: any) => ({
      id: item.id,
      folio: item.folio,
      oficio: item.oficio,
      description: item.description,
      requestDate: item.request_date,
      resolvedAt: item.resolved_at,
      active: item.active,
      employee: {
        id: item.employee.id,
        numberEmployee: item.employee.number_employee,
        name: item.employee.name,
        paternalLastName: item.employee.paternal_last_name,
        maternalLastName: item.employee.maternal_last_name,
        fullName: `${item.employee.name} ${item.employee.paternal_last_name} ${item.employee.maternal_last_name}`,
        rfc: item.employee.rfc,
        curp: item.employee.curp,
      },
      request: {
        id: item.request.id,
        name: item.request.name,
        displayName: item.request.display_name,
      },
      requestStatus: {
        id: item.request_status.id,
        name: item.request_status.name,
        displayName: item.request_status.display_name,
      },
      requestedBy: {
        id: item.requested_by.id,
        username: item.requested_by.username,
      },
      resolvedBy: item.resolved_by ? {
        id: item.resolved_by.id,
        name: item.resolved_by.name,
        paternalLastName: item.resolved_by.paternal_last_name,
        maternalLastName: item.resolved_by.maternal_last_name,
        fullName: `${item.resolved_by.name} ${item.resolved_by.paternal_last_name} ${item.resolved_by.maternal_last_name}`,
      } : null,
    }));

    const total = await prisma.employeeRequest.count({ where: whereClause });
    const pagination = await getPaginationData(total, limit, page);

    return { ...pagination, requests };
  },
};
