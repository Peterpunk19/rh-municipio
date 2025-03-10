import { prisma } from "@/lib/prisma";

export const CatalogsService = {
  async getGender() {
    return prisma.gender.findMany();
  },

  async getCategory() {
    return prisma.category.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getSecretarias() {
    return prisma.secretaria.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getDirecciones(secretariaId: number) {
    return prisma.direccion.findMany({
      where: { secretaria_id: secretariaId },
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getEmployeeTypes() {
    return prisma.employeeType.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getLocations() {
    return prisma.location.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getDays() {
    return prisma.day.findMany();
  },

  async getHours() {
    return prisma.hour.findMany();
  },

  async getState() {
    return prisma.state.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getMunicipalities(stateId: number) {
    return prisma.municipality.findMany({
      where: { state_id: stateId },
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getMaritalStatus() {
    return prisma.maritalStatus.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getProfession() {
    return prisma.profession.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getSchooling() {
    return prisma.schooling.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getOccupation() {
    return prisma.occupation.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getIdentificationType() {
    return prisma.identificationType.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getTradeUnion() {
    return prisma.tradeUnion.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getEmployeeStatus() {
    return prisma.statusEmployee.findMany({
      orderBy: { display_name: "asc" },
    });
  },

  async getIncidentStatusByName(name: string) {
    return prisma.incidentStatus.findFirst({
      where: { name },
    });
  },

  async getRoles() {
    return prisma.role.findMany({
      orderBy: { display_name: "asc" },
    });
  },

  async getIncidents() {
    return prisma.incident.findMany({
      orderBy: { display_name: "asc" },
    });
  },

  async getIncidentsStatus(params: any) {
    const {
      employee_attendance_id,
      area_id,
      direccion_id,
      incident_id,
      incident_status_id,
      start_date,
      end_date,
      created_at,
      search,
    } = params;

    let baseQuery = `SELECT
                         parent.id,
                         IFNULL(child.total, 0) AS total,
                         parent.name,
                         parent.display_name       as label,
                         parent.display_name,
                         parent.btn_display_name,
                         parent.btn_icon,
                         parent.btn_color
                     FROM IncidentStatus parent
                              LEFT JOIN (SELECT incidents_status.id,
                                                IFNULL(employee_incidents.total, 0) as total
                 FROM IncidentStatus incidents_status
                          LEFT JOIN (SELECT employee_incidents.incident_status_id,
                                            count(incident_status_id) AS total
                                     FROM EmployeeIncidents employee_incidents
                                              INNER JOIN Employee employee ON employee_incidents.employee_id = employee.id
                                     WHERE 1 
                                     `;

    if (employee_attendance_id) {
      baseQuery += ` AND employee_incidents.employee_attendance_id = ${employee_attendance_id}`;
    }

    if (created_at) {
      baseQuery += ` AND DATE_FORMAT(employee_incidents.created_at, '%Y-%m-%d')  = '${created_at}'`;
    }

    if (incident_id) {
      baseQuery += ` AND employee_incidents.incident_id = ${incident_id}`;
    }

    if (start_date) {
      baseQuery += ` AND DATE_FORMAT(employee_incidents.start_date, '%Y-%m-%d') = ${start_date}`;
    }

    if (start_date) {
      baseQuery += ` AND DATE_FORMAT(employee_incidents.start_date, '%Y-%m-%d') = ${start_date}`;
    }

    if (end_date) {
      baseQuery += ` AND DATE_FORMAT(employee_incidents.start_date, '%Y-%m-%d') = ${start_date}`;
    }

    if (search) {
      baseQuery += ` AND (employee_incidents.oficio LIKE "%${search}%" OR employee_incidents.folio LIKE "%${search}%" OR
                                               ((name LIKE "%${search}%" OR paternal_last_name LIKE "%${search}%" OR maternal_last_name LIKE "%${search}%" OR
                                                 rfc LIKE "%${search}%" OR curp LIKE "%${search}%" OR number_employee LIKE "%${search}%")))`;
    }

    baseQuery += ` GROUP BY incident_status_id
                 ) AS employee_incidents
                                    ON employee_incidents.incident_status_id = incidents_status.id
                 ) AS child ON child.id = parent.id
ORDER BY parent.id `;

    const incidentsStatus = await prisma.$queryRawUnsafe(baseQuery);

    return incidentsStatus.map((status) => ({
      ...status,
      total: Number(status.total),
    }));
  },

  async getAttendance() {
    return prisma.attendance.findMany();
  },
};
