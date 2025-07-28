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

  async getIncidentsByRoleCanCreate(roleId: number) {
    return prisma.incident.findMany({
      where: {
        incidents_roles_permissions: {
          some: {
            role_id: roleId,
            can_create: true,
          },
        },
      },
      orderBy: { display_name: "asc" },
    });
  },

  async getIncidentsStatus(params: any) {
    const {
      employee_attendance_id,
      area_id,
      direccion_id,
      employee_id,
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

    if (employee_id) {
      baseQuery += ` AND employee_incidents.employee_id = ${employee_id}`;
    }

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
WHERE parent.active = 1 ORDER BY parent.id `;

    const incidentsStatus = await prisma.$queryRawUnsafe<any[]>(baseQuery);

    if (!Array.isArray(incidentsStatus)) {
      throw new Error("Query did not return an array");
    }

    return incidentsStatus.map((status: any) => ({
      ...status,
      total: Number(status.total),
    }));
  },

  async getRequestsStatus(params: any) {
    const { employee_id, request_id, search } = params;

    let baseQuery = `SELECT
                         parent.id,
                         IFNULL(child.total, 0) AS total,
                         parent.name,
                         parent.display_name       as label,
                         parent.display_name,
                         'Ver solicitudes' as btn_display_name,
                         'eye' as btn_icon,
                         'primary' as btn_color
                     FROM RequestStatus parent
                              LEFT JOIN (SELECT requests_status.id,
                                                IFNULL(employee_requests.total, 0) as total
                 FROM RequestStatus requests_status
                          LEFT JOIN (SELECT employee_requests.request_status_id,
                                            count(request_status_id) AS total
                                     FROM EmployeeRequest employee_requests
                                              INNER JOIN Employee employee ON employee_requests.employee_id = employee.id
                                     WHERE 1=1 
                                     AND (employee_requests.active = 1 OR (employee_requests.request_status_id = 5 AND employee_requests.active = 0))`;

    if (employee_id) {
      baseQuery += ` AND employee_requests.employee_id = ${employee_id}`;
    }

    if (request_id) {
      baseQuery += ` AND employee_requests.request_id = ${request_id}`;
    }

    if (search) {
      baseQuery += ` AND (employee_requests.oficio LIKE "%${search}%" OR employee_requests.folio LIKE "%${search}%" OR
                         employee.name LIKE "%${search}%" OR employee.paternal_last_name LIKE "%${search}%" OR 
                         employee.maternal_last_name LIKE "%${search}%" OR employee.rfc LIKE "%${search}%" OR 
                         employee.curp LIKE "%${search}%" OR employee.number_employee LIKE "%${search}%")`;
    }

    baseQuery += ` GROUP BY request_status_id
                 ) AS employee_requests
                                    ON employee_requests.request_status_id = requests_status.id
                 ) AS child ON child.id = parent.id
WHERE parent.active = 1 ORDER BY parent.id`;

    const requestsStatus = await prisma.$queryRawUnsafe<any[]>(baseQuery);

    if (!Array.isArray(requestsStatus)) {
      throw new Error("Query did not return an array");
    }

    return requestsStatus.map((status: any) => ({
      ...status,
      total: Number(status.total),
    }));
  },

  async getAttendance() {
    return prisma.attendance.findMany();
  },

  async getRequestStatusByName(name: string) {
    return prisma.requestStatus.findFirst({
      where: { name },
    });
  },

  async getRequestsTypes() {
    return prisma.request.findMany({
      orderBy: {
        display_name: "asc",
      },
    });
  },

  async getCatalogById(catalogName: string, catalogId: number | string) {
    const model = (prisma as any)[catalogName];

    if (!model) {
      throw new Error(`El modelo ${catalogName} no existe en Prisma`);
    }

    return model.findUnique({
      where: {
        id: catalogId,
      },
    });
  },
};
