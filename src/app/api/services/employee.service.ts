import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { encryptPassword, endOfDay, startOfDay } from "@/common/utils";
import type { IEmployee, IEmployeeFilters, IEmployeeHiring } from "@/app/api/employees/interface";
import { ROLES } from "@/common/constants/Roles";
import { STATUS_EMPLOYEE } from "@/common/constants/StatusEmployee";
import { HttpMessages } from "@/common/response/messages";

export const EmployeeService = {
  async getEmployeeByRfcCurp(rfc: string, curp: string, employeeId?: number) {
    const orConditions: any[] = [{ rfc }];

    if (curp && curp.trim() !== "") {
      orConditions.push({ curp });
    }

    return prisma.employee.findFirst({
      where: {
        OR: orConditions,
        NOT: employeeId ? { id: employeeId } : undefined,
      },
    });
  },

  async getNumberEmployee() {
    const lastEmployee = await prisma.employee.findFirst({
      orderBy: {
        number_employee: "desc",
      },
      select: {
        number_employee: true,
      },
    });

    if (!lastEmployee) {
      return "1";
    }

    return (Number.parseInt(lastEmployee.number_employee, 10) + 1).toString();
  },

  async getByNumberEmployee(numberEmployee: string) {
    const employee = await prisma.employee.findFirst({
      where: {
        number_employee: numberEmployee,
      },
    });

    return !!employee;
  },

  async getEmployeeById(id: number) {
    return prisma.employee.findFirst({
      include: {
        employee_ascriptions: {
          where: {
            active: true,
          },
          take: 1,
          orderBy: {
            created_at: "desc",
          },
          include: {
            direccion: {
              include: {
                secretaria: true,
              },
            },
          },
        },
        employee_hiring: {
          where: {
            active: true,
          },
          take: 1,
          orderBy: {
            created_at: "desc",
          },
          include: {
            category: true,
            employee_type: true,
            direccion: {
              include: {
                secretaria: true,
              },
            },
          },
        },
        employee_location: {
          where: {
            active: true,
          },
          take: 1,
          orderBy: {
            created_at: "desc",
          },
          include: {
            location: true,
          },
        },
        identification_type: true,
        employee_attendance_type: {
          where: {
            active: true,
          },
          take: 1,
          orderBy: {
            created_at: "desc",
          },
          include: {
            attendance: true,
          },
        },
        gender: true,
        status_employee: true,
        profession: true,
        occupation: true,
        marital_status: true,
        schooling: true,
        employee_trade_union: {
          where: {
            active: true,
          },
          take: 1,
          orderBy: {
            created_at: "desc",
          },
          include: {
            trade_union: true,
          },
        },
        employee_address: {
          include: {
            municipality: {
              include: {
                state: true,
              },
            },
          },
        },
        job_schedule_employee: {
          where: {
            active: true,
          },
          select: {
            id: true,
            start_day: true,
            end_day: true,
            start_hour: true,
            end_hour: true,
          },
        },
        job_schedule_calendar: {
          where: {
            active: true,
          },
        },
      },
      where: {
        id,
      },
    });
  },

  async getEmployeeByUserId(id: number) {
    return prisma.user.findFirst({
      select: {
        employee_id: true,
      },
      where: {
        id: id,
      },
    });
  },

  async createEmployee(employee: IEmployee) {
    return prisma.$transaction(async (tx) => {
      const createUser = await tx.user.create({
        data: {
          uuid: uuidv4(),
          username: employee.rfc,
          password: await encryptPassword(employee.numberEmployee),
          role: {
            connect: { name: ROLES.EMPLEADO },
          },
        },
      });

      const createEmployee = await tx.employee.create({
        data: {
          number_employee: employee.numberEmployee,
          name: employee.name,
          paternal_last_name: employee.paternalLastName,
          maternal_last_name: employee.maternalLastName,
          birthday: employee.birthday,
          rfc: employee.rfc,
          curp: employee.curp,
          status_employee: {
            connect: { name: STATUS_EMPLOYEE.ACTIVO },
          },
          ...(employee.genderId ? { gender: { connect: { id: Number(employee.genderId) } } } : {}),
          user: {
            connect: {
              id: createUser.id,
            },
          },
          ...(employee.maritalStatusId
            ? { marital_status: { connect: { id: Number(employee.maritalStatusId) } } }
            : {}),
          ...(employee.schoolingId ? { schooling: { connect: { id: Number(employee.schoolingId) } } } : {}),
          ...(employee.professionId ? { profession: { connect: { id: Number(employee.professionId) } } } : {}),
          ...(employee.occupationId ? { occupation: { connect: { id: Number(employee.occupationId) } } } : {}),
          ...(employee.identificationTypeId
            ? { identification_type: { connect: { id: Number(employee.identificationTypeId) } } }
            : {}),
          identification_folio: employee.identificationFolio,
        },
      });

      const createEmployeeAddress = await tx.employeeAddress.create({
        data: {
          employee_id: createEmployee.id,
          address_line_1: employee.addressLine1,
          address_line_2: employee.addressLine2,
          address_line_3: employee.addressLine3 ?? "",
          address_line_4: employee.addressLine4,
          postal_code: employee.postalCode,
          postal_code_sat: employee.postalCodeSat,
          municipality_id: employee.municipalityId ? Number(employee.municipalityId) : null,
          created_at: new Date(),
        },
      });

      const createEmployeeHiring = await tx.employeeHiring.create({
        data: {
          employee_id: createEmployee.id,
          start_job_date: employee.startJobDate,
          end_job_date: employee.endJobDate,
          category_id: employee.categoryId ? Number(employee.categoryId) : null,
          employee_type_id: employee.employeeTypeId ? Number(employee.employeeTypeId) : null,
          direccion_id: employee.direccionId ? Number(employee.direccionId) : null,
          created_at: new Date(),
        },
      });

      const createEmployeeAscriptions = await tx.employeeAscriptions.create({
        data: {
          employee_id: createEmployee.id,
          start_date: employee.startJobDate,
          end_date: employee.endJobDate,
          direccion_id: employee.direccionId ? Number(employee.direccionId) : null,
          created_by_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      let createdEmployeeLocation;
      if (employee.locationId) {
        createdEmployeeLocation = await tx.employeeLocation.create({
          data: {
            employee: {
              connect: { id: Number(createEmployee.id) },
            },
            location: {
              connect: { id: Number(employee.locationId) },
            },
            active: employee.active,
            created_at: new Date(),
          },
        });
      }

      let createdEmployeeAttendanceType;
      if (employee.attendanceId) {
        createdEmployeeAttendanceType = await tx.employeeAttendanceType.create({
          data: {
            employee: {
              connect: { id: Number(createEmployee.id) },
            },
            attendance: {
              connect: { id: Number(employee.attendanceId) },
            },
            active: employee.active,
            created_at: new Date(),
          },
        });
      }

      await tx.user.update({
        where: { id: createUser.id },
        data: { employee_id: createEmployee.id },
      });

      return [
        createUser,
        createEmployee,
        createEmployeeHiring,
        createEmployeeAddress,
        createdEmployeeLocation,
        createdEmployeeAttendanceType,
        createEmployeeAscriptions,
      ];
    });
  },

  async getEmployeesByParams(employeeFilters: IEmployeeFilters) {
    const pageSize = employeeFilters.limit;
    const pageNumber = employeeFilters.page;
    const offset = (pageNumber - 1) * pageSize;
    const whereClause: any = {};

    if (employeeFilters.active) {
      whereClause.active = employeeFilters.active;
    }

    if (employeeFilters.employee_id) {
      whereClause.id = employeeFilters.employee_id;
    }

    if (employeeFilters.employee_status) {
      whereClause.status_employee_id = employeeFilters.employee_status;
    }

    if (employeeFilters.gender) {
      whereClause.gender_id = employeeFilters.gender;
    }

    if (employeeFilters.trade_union) {
      whereClause.trade_union_id = employeeFilters.trade_union;
    }

    const employeeHiringConditions: any[] = [];
    const employeeAscriptionsConditions: any[] = [];

    if (employeeFilters.employee_type) {
      employeeHiringConditions.push({
        employee_type_id: employeeFilters.employee_type,
        active: true,
      });
    }

    if (employeeFilters.category) {
      employeeHiringConditions.push({
        category_id: employeeFilters.category,
        active: true,
      });
    }

    if (employeeFilters.direccion) {
      employeeAscriptionsConditions.push({
        direccion_id: Array.isArray(employeeFilters.direccion)
          ? { in: employeeFilters.direccion }
          : employeeFilters.direccion,
        active: true,
      });
    }

    if (employeeFilters.secretaria) {
      employeeHiringConditions.push({
        direccion: {
          secretaria_id: employeeFilters.secretaria,
          active: true,
        },
        active: true,
      });
    }

    if (
      employeeFilters.start_job_date_start ||
      employeeFilters.start_job_date_end ||
      employeeFilters.end_job_date_start ||
      employeeFilters.end_job_date_end
    ) {
      const rangeCondition: any = {};

      if (employeeFilters.start_job_date_start || employeeFilters.start_job_date_end) {
        rangeCondition.start_job_date = {};

        if (employeeFilters.start_job_date_start) {
          rangeCondition.start_job_date.gte = startOfDay(new Date(employeeFilters.start_job_date_start));
        }

        if (employeeFilters.start_job_date_end) {
          rangeCondition.start_job_date.lte = endOfDay(new Date(employeeFilters.start_job_date_end));
        }
      }

      if (employeeFilters.end_job_date_start || employeeFilters.end_job_date_end) {
        rangeCondition.end_job_date = {};

        if (employeeFilters.end_job_date_start) {
          rangeCondition.end_job_date.gte = startOfDay(new Date(employeeFilters.end_job_date_start));
        }

        if (employeeFilters.end_job_date_end) {
          rangeCondition.end_job_date.lte = endOfDay(new Date(employeeFilters.end_job_date_end));
        }
      }

      if (Object.keys(rangeCondition).length > 0) {
        employeeHiringConditions.push(rangeCondition);
      }
    }

    if (employeeHiringConditions.length > 0) {
      whereClause.employee_hiring = {
        some: {
          AND: employeeHiringConditions,
        },
      };
    }

    if (employeeAscriptionsConditions.length > 0) {
      whereClause.employee_ascriptions = {
        some: {
          AND: employeeAscriptionsConditions,
        },
      };
    }

    if (employeeFilters.location) {
      whereClause.employee_location = {
        some: {
          location_id: employeeFilters.location,
          active: true,
        },
      };
    }

    if (employeeFilters.attendance) {
      whereClause.employee_attendance_type = {
        some: {
          attendance_id: employeeFilters.attendance,
          active: true,
        },
      };
    }

    if (employeeFilters.search) {
      const terms = employeeFilters.search.split(" ").filter(Boolean);

      whereClause.AND = terms.map((term) => ({
        OR: [
          { name: { contains: term } },
          { paternal_last_name: { contains: term } },
          { maternal_last_name: { contains: term } },
          { rfc: { contains: term } },
          { curp: { contains: term } },
          { number_employee: { contains: term } },
        ],
      }));
    }

    const data = await prisma.employee.findMany({
      where: whereClause,
      skip: offset,
      take: pageSize,
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
        name: true,
        paternal_last_name: true,
        maternal_last_name: true,
        number_employee: true,
        birthday: true,
        rfc: true,
        curp: true,
        gender_id: true,
        status_employee_id: true,
        active: true,
        created_at: true,
        updated_at: true,
        status_employee: true,
        user: false,
        user_id: false,
        gender: true,
        employee_hiring: {
          where: {
            active: true,
          },
          take: 1,
          select: {
            id: true,
            category: true,
            active: true,
            start_job_date: true,
            end_job_date: true,
            employee_type_id: true,
            employee_type: {
              select: {
                id: true,
                name: true,
                display_name: true,
              },
            },
            direccion: {
              select: {
                id: true,
                display_name: true,
                secretaria: true,
                secretaria_id: true,
              },
            },
          },
        },
        employee_location: {
          select: {
            id: true,
            location_id: true,
            active: true,
            created_at: true,
            updated_at: true,
            location: {
              select: {
                id: true,
                display_name: true,
              },
            },
          },
        },
        employee_attendance_type: {
          select: {
            id: true,
            attendance_id: true,
            active: true,
            created_at: true,
            updated_at: true,
            attendance: {
              select: {
                id: true,
                display_name: true,
              },
            },
          },
        },
        employee_trade_union: {
          where: {
            active: true,
          },
          take: 1,
          orderBy: {
            created_at: "desc",
          },
          include: {
            trade_union: true,
          },
        },
        employee_ascriptions: {
          where: {
            active: true,
          },
          take: 1,
          orderBy: {
            created_at: "desc",
          },
          select: {
            id: true,
            direccion_id: true,
            start_date: true,
            end_date: true,
            active: true,
            direccion: {
              select: {
                id: true,
                display_name: true,
                secretaria: {
                  select: {
                    id: true,
                    display_name: true,
                  },
                },
              },
            },
          },
        },
        director_id: true,
        director: true,
        sustitute_id: true,
        sustitute: true,
        employee_created_by: false,
      },
    });

    const total = await prisma.employee.count({ where: whereClause });
    const totalPages = Math.ceil(total / pageSize);

    return {
      data,
      total,
      totalPages,
      currentPage: pageNumber,
    };
  },

  async getEmployeesForBulkAttendance(employeeNumbers: string[], dateRange?: { from: Date; to: Date }) {
    const calendarWhere: any = {
      active: true,
    };

    if (dateRange) {
      calendarWhere.date = {
        gte: dateRange.from,
        lte: dateRange.to,
      };
    }

    return await prisma.employee.findMany({
      where: {
        number_employee: { in: employeeNumbers },
      },
      select: {
        id: true,
        number_employee: true,
        name: true,
        paternal_last_name: true,
        maternal_last_name: true,
        employee_ascriptions: {
          where: {
            active: true,
          },
          take: 1,
          select: {
            id: true,
            direccion_id: true,
            active: true,
            direccion: {
              select: {
                id: true,
                name: true,
                display_name: true,
              },
            },
          },
        },
        employee_attendance_type: {
          where: {
            active: true,
          },
          take: 1,
          select: {
            id: true,
            attendance_id: true,
            active: true,
            attendance: {
              select: {
                id: true,
                name: true,
                display_name: true,
              },
            },
          },
        },
        employee_location: {
          where: {
            active: true,
          },
          take: 1,
          select: {
            id: true,
            location_id: true,
            active: true,
            location: {
              select: {
                id: true,
                name: true,
                display_name: true,
              },
            },
          },
        },
        job_schedule_employee: {
          where: {
            active: true,
          },
          select: {
            id: true,
            start_day: {
              select: {
                id: true,
                name: true,
                display_name: true,
              },
            },
            end_day: {
              select: {
                id: true,
                name: true,
                display_name: true,
              },
            },
            start_hour: {
              select: {
                id: true,
                name: true,
                display_name: true,
              },
            },
            end_hour: {
              select: {
                id: true,
                name: true,
                display_name: true,
              },
            },
          },
        },
        job_schedule_calendar: {
          where: calendarWhere,
          select: {
            id: true,
            date: true,
            check_in: true,
            check_out: true,
            start_hour_id: true,
            end_hour_id: true,
            start_hour: {
              select: { id: true, name: true, display_name: true },
            },
            end_hour: {
              select: { id: true, name: true, display_name: true },
            },
          },
        },
      },
    });
  },

  async getEmployeesAutocomplete(search: string | null, direccionIds?: number[], attendanceType?: string | null) {
    let baseQuery = `
        SELECT e.id,
               e.name,
               e.paternal_last_name,
               e.maternal_last_name,
               e.number_employee,
               e.birthday,
               e.rfc,
               e.curp,
               d.display_name  AS direccion_display_name,
               s.display_name  AS secretaria_display_name,
               c.display_name  AS category_display_name,
               et.display_name AS employee_type_display_name,
               tu.display_name AS trade_union_display_name,
               l.display_name AS location_display_name,
               at.display_name AS attendance_type_display_name,
               g.name AS gender_name
        FROM Employee AS e
                 JOIN EmployeeHiring AS eh ON eh.employee_id = e.id AND eh.active = 1
                 JOIN EmployeeAscriptions AS ea ON ea.employee_id = e.id AND ea.active = 1
                 JOIN Direccion AS d ON ea.direccion_id = d.id
                 JOIN Secretaria AS s ON d.secretaria_id = s.id
                 JOIN Category AS c ON eh.category_id = c.id
                 JOIN EmployeeType AS et ON eh.employee_type_id = et.id AND et.name != 'pensionado'
                 LEFT JOIN EmployeeTradeUnion AS etu ON e.id = etu.employee_id
                 LEFT JOIN TradeUnion AS tu ON etu.trade_union_id = tu.id
                 LEFT JOIN EmployeeLocation AS el ON e.id = el.employee_id AND el.active = 1
                 LEFT JOIN EmployeeAttendanceType AS eat ON e.id = eat.employee_id AND eat.active = 1
                 LEFT JOIN Location AS l ON el.location_id = l.id
                 LEFT JOIN Attendance AS at ON eat.attendance_id = at.id
                 LEFT JOIN Gender AS g ON e.gender_id = g.id
    `;

    const conditions: string[] = [];
    const baseParams: (string | number)[] = [];

    if (direccionIds && direccionIds.length > 0) {
      conditions.push(`ea.direccion_id IN (${direccionIds.map(() => "?").join(",")})`);
      baseParams.push(...direccionIds);
    }

    if (attendanceType) {
      conditions.push(`at.name = ?`);
      baseParams.push(attendanceType);
    }

    if (conditions.length > 0) {
      baseQuery += ` WHERE ${conditions.join(" AND ")}`;
    }

    let employees: {
      id: number;
      name: string;
      paternal_last_name: string;
      maternal_last_name: string;
      number_employee: string;
      birthday: string;
      rfc: string;
      curp: string;
      direccion_display_name: string;
      secretaria_display_name: string;
      category_display_name: string;
      employee_type_display_name: string;
      trade_union_display_name: string | null;
      location_display_name: string | null;
      attendance_type_display_name: string | null;
      gender_name: string | null;
    }[];

    if (search) {
      const searchCondition = `
            ${conditions.length > 0 ? "AND" : "WHERE"} (LOWER(e.name) LIKE LOWER(CONCAT('%', ?, '%'))
               OR LOWER(e.paternal_last_name) LIKE LOWER(CONCAT('%', ?, '%'))
               OR LOWER(e.maternal_last_name) LIKE LOWER(CONCAT('%', ?, '%'))
               OR LOWER(e.number_employee) LIKE LOWER(CONCAT('%', ?, '%'))
               OR LOWER(e.rfc) LIKE LOWER(CONCAT('%', ?, '%'))
               OR LOWER(e.curp) LIKE LOWER(CONCAT('%', ?, '%')))
        `;
      baseQuery += searchCondition;

      const params = [...baseParams, search, search, search, search, search, search];
      employees = await prisma.$queryRawUnsafe(`${baseQuery} ORDER BY e.id DESC`, ...params);
    } else {
      employees = await prisma.$queryRawUnsafe(`${baseQuery} ORDER BY e.id DESC`, ...baseParams);
    }

    return employees.map((emp: any) => ({
      id: emp.id,
      label: `${emp.name} ${emp.paternal_last_name} ${emp.maternal_last_name} - ${emp.number_employee}`,
      number_employee: emp.number_employee,
      birthday: emp.birthday,
      rfc: emp.rfc,
      curp: emp.curp,
      direccion_display_name: emp.direccion_display_name,
      secretaria_display_name: emp.secretaria_display_name,
      category_display_name: emp.category_display_name,
      employee_type_display_name: emp.employee_type_display_name,
      trade_union_display_name: emp.trade_union_display_name,
      location_display_name: emp.location_display_name,
      attendance_type_display_name: emp.attendance_type_display_name,
      gender_name: emp.gender_name,
    }));
  },

  async getEmployeeByIdTest(): Promise<{ id: number } | null> {
    return await prisma.employee.findFirst({
      select: {
        id: true,
      },
      where: {
        employee_hiring: {
          some: { active: true },
        },
        employee_location: {
          some: { active: true },
        },
        employee_attendance_type: {
          some: { active: true },
        },
      },
    });
  },

  async updateEmployee(employee: IEmployee, currentEmployee: any) {
    return prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        data: {
          username: employee.rfc,
        },
        where: {
          id: currentEmployee?.user_id,
        },
      });

      const updatedEmployee = await tx.employee.update({
        data: {
          number_employee: employee.numberEmployee,
          name: employee.name,
          paternal_last_name: employee.paternalLastName,
          maternal_last_name: employee.maternalLastName,
          birthday: employee.birthday,
          rfc: employee.rfc,
          curp: employee.curp,
          status_employee: {
            connect: { name: STATUS_EMPLOYEE.ACTIVO },
          },
          ...(employee.genderId ? { gender: { connect: { id: Number(employee.genderId) } } } : {}),
          user: {
            connect: {
              id: updatedUser.id,
            },
          },
          ...(employee.maritalStatusId
            ? { marital_status: { connect: { id: Number(employee.maritalStatusId) } } }
            : {}),
          ...(employee.schoolingId ? { schooling: { connect: { id: Number(employee.schoolingId) } } } : {}),
          ...(employee.professionId ? { profession: { connect: { id: Number(employee.professionId) } } } : {}),
          ...(employee.occupationId ? { occupation: { connect: { id: Number(employee.occupationId) } } } : {}),
          ...(employee.identificationTypeId
            ? { identification_type: { connect: { id: Number(employee.identificationTypeId) } } }
            : {}),
          identification_folio: employee.identificationFolio,
        },
        where: {
          id: currentEmployee?.id,
        },
      });

      const updatedEmployeeAddress = await tx.employeeAddress.update({
        data: {
          address_line_1: employee.addressLine1,
          address_line_2: employee.addressLine2,
          address_line_3: employee.addressLine3 ?? "",
          address_line_4: employee.addressLine4,
          postal_code: employee.postalCode,
          postal_code_sat: employee.postalCodeSat,
          municipality_id: Number(employee.municipalityId),
          created_at: new Date(),
        },
        where: {
          id: currentEmployee?.employee_address[0]?.id,
        },
      });

      const updatedEmployeeHiring = await tx.employeeHiring.update({
        data: {
          start_job_date: employee.startJobDate,
          end_job_date: employee.endJobDate,
          category_id: employee.categoryId ? Number(employee.categoryId) : null,
          employee_type_id: employee.employeeTypeId ? Number(employee.employeeTypeId) : null,
          direccion_id: employee.direccionId ? Number(employee.direccionId) : null,
          created_at: new Date(),
        },
        where: {
          id: currentEmployee?.employee_hiring[0]?.id,
        },
      });

      return [updatedUser, updatedEmployee, updatedEmployeeHiring, updatedEmployeeAddress];
    });
  },

  async createEmployeeHiring(employeeHiring: IEmployeeHiring) {
    return prisma.employeeHiring.create({
      data: {
        employee_id: employeeHiring.employeeId,
        start_job_date: employeeHiring.startJobDate,
        end_job_date: employeeHiring.endJobDate,
        category_id: Number(employeeHiring.categoryId),
        employee_type_id: Number(employeeHiring.employeeTypeId),
        direccion_id: Number(employeeHiring.direccionId),
      },
    });
  },

  async getCurrentJobSchedule(employeeId: number) {
    try {
      return await prisma.jobScheduleEmployee.findMany({
        where: {
          employee_id: employeeId,
          active: true,
        },
        include: {
          start_day: true,
          end_day: true,
          start_hour: true,
          end_hour: true,
        },
        orderBy: {
          id: "desc",
        },
      });
    } catch (error) {
      throw error;
    }
  },

  async getCurrentJobScheduleCalendar(employeeId: number, from: string, to: string) {
    try {
      return await prisma.jobScheduleCalendar.findMany({
        where: {
          employee_id: employeeId,
          date: { gte: new Date(from), lte: new Date(to) },
          active: true,
        },
        include: { start_hour: true, end_hour: true },
      });
    } catch (error) {
      throw error;
    }
  },

  async validateDireccionAccessService(
    userId: number,
    employeeId: number,
    enlaceRoleIds: number[],
  ): Promise<{ allowed: boolean; errorMessage?: string; direccionId?: number }> {
    const match = await prisma.employeeAscriptions.findFirst({
      where: {
        employee_id: employeeId,
        active: true,
        direccion: {
          user_direcciones: {
            some: {
              user_id: userId,
              active: true,
              user: {
                role_id: { in: enlaceRoleIds },
                active: true,
              },
            },
          },
        },
      },
      select: {
        direccion_id: true,
      },
    });

    if (!match || !match.direccion_id) {
      return {
        allowed: false,
        errorMessage: HttpMessages.error.notAllowedToCreateForDifferentDireccion,
      };
    }

    return { allowed: true, direccionId: match.direccion_id };
  },

  async getEmployeesWithAttendanceType(employeesId: number[]): Promise<
    {
      id: number | string;
      employee_attendance_type: any;
    }[]
  > {
    if (!Array.isArray(employeesId) || employeesId.length === 0) {
      return [];
    }

    return await prisma.employee.findMany({
      where: {
        id: { in: employeesId },
      },
      select: {
        id: true,
        employee_attendance_type: {
          select: {
            attendance_id: true,
            active: true,
            attendance: {
              select: {
                id: true,
                name: true,
                display_name: true,
              },
            },
          },
        },
      },
    });
  },
};
