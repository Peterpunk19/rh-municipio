import { prisma } from "@/lib/prisma";
import type {
  IEmployeeRequest,
  IEmployeeRequestsFilters,
  IEmployeeRequestUpdateService,
  IEmployeeRequestResponse,
} from "@/app/api/employee-requests/types";
import { RequestService } from "@/app/api/services/request.service";
import { buildWhereClause, getPaginationData } from "@/common/utils";
import { REQUEST_STATUS_ID } from "@/common/constants/RequestStatus";
import REQUEST_TYPES from "@/common/constants/RequestTypes";

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
      const currentEmployeeLocation = await tx.employeeLocation.findFirst({
        where: {
          employee_id: Number(employeeRequest.employeeId),
          active: true,
        },
        select: {
          location: {
            select: {
              id: true,
            },
          },
        },
      });

      const currentEmployeeAscriptions = await tx.employeeAdscriptions.findFirst({
        where: {
          employee_id: Number(employeeRequest.employeeId),
          active: true,
        },
      });

      const currentEmployeeAttendanceType = await tx.employeeAttendanceType.findFirst({
        where: {
          employee_id: Number(employeeRequest.employeeId),
          active: true,
        },
        select: {
          attendance: {
            select: {
              id: true,
            },
          },
        },
      });

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
          ...(currentEmployeeLocation?.location?.id && {
            location: {
              connect: { id: currentEmployeeLocation.location.id },
            },
          }),
          ...(currentEmployeeAttendanceType?.attendance?.id && {
            attendance: {
              connect: { id: currentEmployeeAttendanceType.attendance.id },
            },
          }),
          ...(currentEmployeeAscriptions?.id && {
            direccion: {
              connect: { id: currentEmployeeAscriptions.direccion_id },
            },
          }),
          ...(employeeRequest.locationId && {
            new_location: {
              connect: { id: Number(employeeRequest.locationId) },
            },
          }),
          ...(employeeRequest.attendanceId && {
            new_attendance: {
              connect: { id: Number(employeeRequest.attendanceId) },
            },
          }),
          ...(employeeRequest.direccionId && {
            new_direccion: {
              connect: { id: Number(employeeRequest.direccionId) },
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
      employee_id: "employee_id",
      request_id: "request_id",
      request_status_id: "request_status_id",
      request_date: "request_date",
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
    if (employeeRequestsFilters.request_date) {
      try {
        const dateStr =
          typeof employeeRequestsFilters.request_date === "string"
            ? employeeRequestsFilters.request_date
            : new Date(employeeRequestsFilters.request_date).toISOString().split("T")[0];
        const parts = dateStr.split("-");

        if (parts.length === 3) {
          const year = Number.parseInt(parts[0], 10);
          const month = Number.parseInt(parts[1], 10);
          const day = Number.parseInt(parts[2], 10);

          if (!Number.isNaN(year) && !Number.isNaN(month) && !Number.isNaN(day)) {
            const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
            const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
            whereClause.request_date = {
              gte: startDate,
              lte: endDate,
            };
          }
        }
      } catch (error) {
        console.error("Error al procesar request_date:", error);
      }
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
      createdAt: item.created_at,
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
      resolvedBy: item.resolved_by
        ? {
            id: item.resolved_by.id,
            name: item.resolved_by.name,
            paternalLastName: item.resolved_by.paternal_last_name,
            maternalLastName: item.resolved_by.maternal_last_name,
            fullName: `${item.resolved_by.name} ${item.resolved_by.paternal_last_name} ${item.resolved_by.maternal_last_name}`,
          }
        : null,
    }));

    const total = await prisma.employeeRequest.count({ where: whereClause });
    const pagination = await getPaginationData(total, limit, page);

    return { ...pagination, requests };
  },

  async getEmployeeRequestById(id: number) {
    const employeeRequest = await prisma.employeeRequest.findFirst({
      where: { id },
      select: {
        id: true,
        folio: true,
        oficio: true,
        description: true,
        request_date: true,
        created_at: true,
        request_id: true,
        request_status: {
          select: {
            id: true,
            name: true,
            display_name: true,
            btn_display_name: true,
            btn_icon: true,
            btn_color: true,
            type: true,
            active: true,
          },
        },
        employee: {
          select: {
            id: true,
            name: true,
            maternal_last_name: true,
            paternal_last_name: true,
            number_employee: true,
            rfc: true,
            curp: true,
            employee_location: {
              where: {
                active: true,
              },
              select: {
                location: {
                  select: {
                    id: true,
                    name: true,
                    display_name: true,
                    active: true,
                  },
                },
              },
            },
            employee_attendance_type: {
              where: {
                active: true,
              },
              select: {
                attendance: {
                  select: {
                    id: true,
                    name: true,
                    display_name: true,
                  },
                },
              },
            },
            employee_adscriptions: {
              where: {
                active: true,
              },
              select: {
                id: true,
                start_date: true,
                end_date: true,
                direccion: {
                  select: {
                    id: true,
                    name: true,
                    display_name: true,
                    secretaria: {
                      select: {
                        id: true,
                        name: true,
                        display_name: true,
                      },
                    },
                  },
                },
              },
            },
            employee_hiring: {
              select: {
                direccion: {
                  select: {
                    id: true,
                    name: true,
                    display_name: true,
                    secretaria: {
                      select: {
                        id: true,
                        name: true,
                        display_name: true,
                      },
                    },
                  },
                },
                category: {
                  select: {
                    id: true,
                    name: true,
                    display_name: true,
                  },
                },
              },
            },
          },
        },
        request: {
          select: {
            id: true,
            name: true,
            display_name: true,
            active: true,
          },
        },
        employee_request_detail: {
          select: {
            id: true,
            start_date: true,
            end_date: true,
            attendance_date: true,
            direccion: {
              select: {
                id: true,
                name: true,
                display_name: true,
                active: true,
              },
            },
            location: {
              select: {
                id: true,
                name: true,
                display_name: true,
                active: true,
              },
            },
            attendance: {
              select: {
                id: true,
                name: true,
                display_name: true,
                active: true,
              },
            },
            new_location: {
              select: {
                id: true,
                name: true,
                display_name: true,
                active: true,
              },
            },
            new_attendance: {
              select: {
                id: true,
                name: true,
                display_name: true,
                active: true,
              },
            },
            new_direccion: {
              select: {
                id: true,
                name: true,
                display_name: true,
                active: true,
                secretaria: {
                  select: {
                    id: true,
                    name: true,
                    display_name: true,
                  },
                },
              },
            },
          },
        },
        EmployeeRequestSchedule: {
          select: {
            id: true,
            start_day: true,
            end_day: true,
            start_hour: true,
            end_hour: true,
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
        EmployeeRequestStatus: {
          select: {
            id: true,
            created_at: true,
            request_status: {
              select: {
                id: true,
                name: true,
                display_name: true,
                btn_color: true,
                btn_icon: true,
                btn_display_name: true,
              },
            },
            created_by: {
              select: {
                id: true,
                name: true,
                paternal_last_name: true,
                maternal_last_name: true,
              },
            },
          },
        },
      },
    });

    if (!employeeRequest) return null;

    return {
      id: employeeRequest.id,
      folio: employeeRequest.folio,
      oficio: employeeRequest.oficio,
      justification: employeeRequest.description,
      created_at: employeeRequest.created_at,
      request_id: employeeRequest.request_id,
      request_status: {
        ...employeeRequest.request_status,
      },
      employee: {
        id: employeeRequest.employee.id,
        name: `${employeeRequest.employee.name} ${employeeRequest.employee.paternal_last_name} ${employeeRequest.employee.maternal_last_name}`,
        employeeNumber: employeeRequest.employee.number_employee,
        rfc: employeeRequest.employee.rfc,
        curp: employeeRequest.employee.curp,
        publicOrganization: employeeRequest.employee.employee_hiring[0].direccion.secretaria.display_name,
        administrativeOrganization: employeeRequest.employee.employee_hiring[0].direccion.display_name,
        category: employeeRequest.employee.employee_hiring[0].category?.display_name,
        employee_adscriptions: employeeRequest.employee.employee_adscriptions[0],
      },
      request: {
        ...employeeRequest.request,
      },
      request_details: {
        ...(["schedule_change_request", "location_change_request"].includes(employeeRequest.request.name) && {
          start_at: employeeRequest.employee_request_detail[0].start_date,
          end_at: employeeRequest.employee_request_detail[0].end_date,
        }),
        ...(employeeRequest.request.name === "schedule_change_request" && {
          schedule: Object.values(employeeRequest.EmployeeRequestSchedule),
        }),
        ...(employeeRequest.request.name === "checker_change_request" && {
          attendance_date: employeeRequest.employee_request_detail[0].attendance_date,
          current_attendance: employeeRequest.employee_request_detail[0].attendance
            ? { ...employeeRequest.employee_request_detail[0].attendance }
            : null,
          new_attendance: employeeRequest.employee_request_detail[0].new_attendance
            ? { ...employeeRequest.employee_request_detail[0].new_attendance }
            : null,
        }),
        ...(employeeRequest.request.name === "location_change_request" && {
          current_location: employeeRequest.employee_request_detail[0].location
            ? { ...employeeRequest.employee_request_detail[0].location }
            : null,
          new_location: employeeRequest.employee_request_detail[0].new_location
            ? { ...employeeRequest.employee_request_detail[0].new_location }
            : null,
        }),
        ...(employeeRequest.request.name === "fingerprint_registration_request" && {
          location: {
            ...employeeRequest.employee_request_detail[0].location,
          },
        }),
        ...(employeeRequest.request.name === "adscription_change_request" && {
          current_direccion: employeeRequest.employee_request_detail[0].direccion
            ? { ...employeeRequest.employee_request_detail[0].direccion }
            : null,
          new_direccion: employeeRequest.employee_request_detail[0].new_direccion
            ? { ...employeeRequest.employee_request_detail[0].new_direccion }
            : null,
          current_location: employeeRequest.employee_request_detail[0].location
            ? { ...employeeRequest.employee_request_detail[0].location }
            : null,
          new_location: employeeRequest.employee_request_detail[0].new_location
            ? { ...employeeRequest.employee_request_detail[0].new_location }
            : null,
          attendance: employeeRequest.employee_request_detail[0].attendance
            ? { ...employeeRequest.employee_request_detail[0].attendance }
            : null,
        }),
        request_date: employeeRequest.request_date,
      },
      requestedBy: {
        ...employeeRequest.requested_by,
      },
      approvedBy: {
        ...employeeRequest.resolved_by,
      },
      employee_attendance_status: employeeRequest.EmployeeRequestStatus,
    } as IEmployeeRequestResponse;
  },
  async updateEmployeeRequests(employeeRequest: IEmployeeRequestUpdateService) {
    return prisma.$transaction(async (tx) => {
      const { employeeRequestFound, requestId, statusId, approvedBy } = employeeRequest;
      await tx.employeeRequest.update({
        data: {
          request_status: {
            connect: { id: statusId },
          },
          resolved_at: statusId === REQUEST_STATUS_ID.APROBADA ? new Date() : null,
          resolved_by: {
            connect: { id: approvedBy },
          },
        },
        where: {
          id: Number(requestId),
        },
      });

      const createEmployeeRequestStatus = await tx.employeeRequestStatus.create({
        data: {
          employee_request: {
            connect: { id: requestId },
          },
          request_status: {
            connect: { id: statusId },
          },
          created_by: {
            connect: { id: approvedBy },
          },
          created_at: new Date(),
        },
      });

      if (statusId === REQUEST_STATUS_ID.APROBADA) {
        const requestTypeId = employeeRequestFound.request.id;
        const employeeId = employeeRequestFound.employee.id;

        switch (requestTypeId) {
          case REQUEST_TYPES.SCHEDULE:
            await tx.jobScheduleEmployee.updateMany({
              where: {
                employee_id: employeeId,
                active: true,
              },
              data: {
                active: false,
                updated_at: new Date(),
              },
            });
            if (
              employeeRequestFound.request_details.schedule &&
              employeeRequestFound.request_details.schedule.length > 0
            ) {
              await Promise.all(
                employeeRequestFound.request_details.schedule.map((schedule) => {
                  if (
                    !schedule.start_day.id ||
                    !schedule.end_day.id ||
                    !schedule.start_hour.id ||
                    !schedule.end_hour.id
                  ) {
                    return Promise.resolve();
                  }

                  return tx.jobScheduleEmployee.create({
                    data: {
                      employee: {
                        connect: { id: employeeId },
                      },
                      name: "Horario asignado por solicitud",
                      description: "Creado automáticamente por aprobación de solicitud",
                      start_day: {
                        connect: { id: schedule.start_day.id },
                      },
                      end_day: {
                        connect: { id: schedule.end_day.id },
                      },
                      start_hour: {
                        connect: { id: schedule.start_hour.id },
                      },
                      end_hour: {
                        connect: { id: schedule.end_hour.id },
                      },
                      active: true,
                      created_at: new Date(),
                    },
                  });
                }),
              );
            }
            break;

          case REQUEST_TYPES.LOCATION:
            if (employeeRequestFound.request_details) {
              const requestDetail = employeeRequestFound.request_details;

              await tx.employeeLocation.updateMany({
                where: {
                  employee_id: employeeId,
                  active: true,
                },
                data: {
                  active: false,
                  updated_at: new Date(),
                },
              });

              if (requestDetail.new_location) {
                const locationData: any = {
                  employee: {
                    connect: { id: employeeId },
                  },
                  location: {
                    connect: { id: requestDetail.new_location?.id },
                  },
                  active: true,
                  created_at: new Date(),
                };

                if (requestDetail.start_at && requestDetail.end_at) {
                  const createdCommission = await tx.employeeCommission.create({
                    data: {
                      employee_location_id: requestDetail.new_location.id,
                      start_date: requestDetail.start_at,
                      end_date: requestDetail.end_at,
                      active: true,
                      created_at: new Date(),
                      employee_request: {
                        connect: { id: requestId },
                      },
                    },
                  });

                  await tx.employeeRequest.update({
                    where: {
                      id: requestId,
                    },
                    data: {
                      employee_commission_id: createdCommission.id,
                    },
                  });

                  locationData.employee_commission = {
                    connect: { id: createdCommission.id },
                  };

                  await tx.employeeLocation.create({
                    data: locationData,
                  });
                }
              }
            }
            break;

          case REQUEST_TYPES.ATTENDANCE:
            if (employeeRequestFound.request_details) {
              await tx.employeeAttendanceType.updateMany({
                where: {
                  employee_id: employeeId,
                  active: true,
                },
                data: {
                  active: false,
                  updated_at: new Date(),
                },
              });

              const requestDetail = employeeRequestFound.request_details;
              if (requestDetail.new_attendance) {
                const attendanceTypeData: any = {
                  employee: {
                    connect: { id: employeeId },
                  },
                  attendance: {
                    connect: { id: requestDetail.new_attendance.id },
                  },
                  active: true,
                  created_by: {
                    connect: { id: approvedBy },
                  },
                  applied_at: requestDetail.attendance_date,
                  created_at: new Date(),
                };

                await tx.employeeAttendanceType.create({
                  data: attendanceTypeData,
                });
              }
            }
            break;
        }
      }

      return [createEmployeeRequestStatus];
    });
  },
};
