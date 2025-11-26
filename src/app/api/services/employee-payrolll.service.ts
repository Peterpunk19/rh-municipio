import { prisma } from "@/lib/prisma";
import { buildWhereClause, getPaginationData } from "@/common/utils";
import { IEmployeePayrollFilters } from "@/app/api/employee-payroll/types";

import { Decimal } from "@prisma/client/runtime/library";

export function normalizePrismaResult(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(normalizePrismaResult);
  }

  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (typeof value === "bigint") {
          return [key, Number(value)];
        } else if (value instanceof Decimal) {
          return [key, Number(value.toString())];
        } else if (Array.isArray(value) || typeof value === "object") {
          return [key, normalizePrismaResult(value)];
        } else {
          return [key, value];
        }
      }),
    );
  }

  if (typeof obj === "bigint") {
    return Number(obj);
  }

  return obj;
}

export const EmployeePayrollService = {
  async getEmployeesPayrollByParams(filters: IEmployeePayrollFilters) {
    const limit = Number(filters.limit);
    const page = Number(filters.page);
    const offset = (page - 1) * limit;

    const whereConditions = [];

    if (filters.search && filters.search.trim() !== "") {
      const search = filters.search.trim().replace(/'/g, "''");
      whereConditions.push(`(
        e.name LIKE '%${search}%' OR
        e.paternal_last_name LIKE '%${search}%' OR
        e.maternal_last_name LIKE '%${search}%' OR
        CONCAT(e.name, ' ', e.paternal_last_name, ' ', e.maternal_last_name) LIKE '%${search}%' OR
        e.number_employee LIKE '%${search}%' OR
        e.curp LIKE '%${search}%' OR
        e.rfc LIKE '%${search}%'
      )`);
    }

    if (filters.employeeId !== null) {
      whereConditions.push(`e.id = ${filters.employeeId}`);
    }

    if (filters.direccionId !== null) {
      whereConditions.push(`d.id = ${filters.direccionId}`);
    }

    if (filters.from !== null && filters.to !== null) {
      whereConditions.push(
        `DATE(ea.check_in) BETWEEN '${new Date(filters.from).toISOString().slice(0, 10)}' AND '${new Date(filters.to).toISOString().slice(0, 10)}'`,
      );
    }

    const whereSQL = whereConditions.length > 0 ? ` WHERE ${whereConditions.join(" AND ")}` : "";

    const query = `
        SELECT
            e.id AS employee_id,
            e.number_employee AS number_employee,
            CONCAT(e.name, ' ', e.paternal_last_name, ' ', e.maternal_last_name) AS fullname,
            c.display_name AS category_display_name,
            s.display_name                                                       as secretaria_display_name,
            d.id                                                       as direccion_id,
            d.display_name                                                       as direccion_display_name,
            et.display_name AS employee_type_display_name,
            ROUND(cet.salary, 2) AS salary,
            CAST(COUNT(DISTINCT CASE
                                    WHEN ea.check_in IS NOT NULL AND ea.check_out IS NOT NULL
                                        THEN DATE(ea.check_in)
                       END) AS SIGNED) AS dias_trabajados,
            CAST(COUNT(DISTINCT CASE
                                    WHEN ea.check_in IS NOT NULL AND ea.check_out IS NOT NULL
                                        THEN DATE(ea.check_in)
                       END) AS SIGNED) - CAST((
                IFNULL(registro_incidencias.permiso_sin_goce, 0) +
                IFNULL(registro_incidencias.total_retardos, 0) +
                IFNULL(registro_incidencias.falta, 0)
                ) AS SIGNED) AS dias_a_pagar,
            CAST(COUNT(DISTINCT CASE
                                    WHEN ea.check_in IS NOT NULL AND ea.check_out IS NULL
                                        THEN DATE(ea.check_in)
                       END) AS SIGNED) AS omision_salida,
            CAST(COUNT(DISTINCT CASE
                                    WHEN ea.check_in IS NULL AND ea.check_out IS NOT NULL
                                        THEN DATE(ea.check_out)
                       END) AS SIGNED) AS omision_entrada,
            CAST(COUNT(DISTINCT CASE
                                    WHEN (ea.check_in IS NOT NULL OR ea.check_out IS NOT NULL)
                                        THEN COALESCE(DATE(ea.check_in), DATE(ea.check_out))
                END) AS SIGNED) AS total_dias_con_registro,
            CAST((
                IFNULL(registro_incidencias.permiso_sin_goce, 0) +
                IFNULL(registro_incidencias.total_retardos, 0) +
                IFNULL(registro_incidencias.falta, 0)
                ) AS SIGNED) AS total_incidencias,

            IFNULL(registro_incidencias.incapacidad, 0) AS incapacidad,
            IFNULL(registro_incidencias.justificacion_entrada, 0) AS justificacion_entrada,
            IFNULL(registro_incidencias.justificacion_salida, 0) AS justificacion_salida,
            IFNULL(registro_incidencias.justificacion_entrada_salida, 0) AS justificacion_entrada_salida,
            IFNULL(registro_incidencias.lactancia, 0) AS lactancia,
            IFNULL(registro_incidencias.paternidad, 0) AS paternidad,
            IFNULL(registro_incidencias.permiso_especial, 0) AS permiso_especial,
            IFNULL(registro_incidencias.permiso_economico, 0) AS permiso_economico,
            IFNULL(registro_incidencias.permiso_sin_goce, 0) AS permiso_sin_goce,
            IFNULL(registro_incidencias.vacaciones, 0) AS vacaciones,
            IFNULL(registro_incidencias.comision, 0) AS comision,
            IFNULL(registro_incidencias.retardo, 0) AS retardo,
            IFNULL(registro_incidencias.retardo_mayor, 0) AS retardo_mayor,
            IFNULL(registro_incidencias.total_retardos, 0) AS total_retardos,
            IFNULL(registro_incidencias.falta, 0) AS falta,
            IFNULL(registro_incidencias.licencia_medica, 0) AS licencia_medica
        FROM Employee e
                 INNER JOIN EmployeeHiring eh ON eh.employee_id = e.id AND eh.active = 1
                 INNER JOIN EmployeeAscriptions eas ON eas.employee_id = e.id AND eas.active = 1
                 INNER JOIN Direccion d ON d.id = eas.direccion_id
                 INNER JOIN Secretaria s ON s.id = d.secretaria_id
                 INNER JOIN EmployeeType et ON et.id = eh.employee_type_id
                 INNER JOIN Category c
                            ON c.id = eh.category_id
                 INNER JOIN CategoryEmployeeType cet
                            ON cet.category_id = c.id AND cet.employee_type_id = et.id
                 LEFT JOIN EmployeeAttendance ea
                           ON ea.employee_id = e.id AND ea.active = 1
                 LEFT JOIN (
            SELECT
                ei.employee_id,
                CAST(COUNT(DISTINCT CASE WHEN i.name = 'incapacidad' THEN eid.id END) AS SIGNED) AS incapacidad,
                CAST(COUNT(DISTINCT CASE WHEN i.name = 'justificacion_entrada' THEN eid.id END) AS SIGNED) AS justificacion_entrada,
                CAST(COUNT(DISTINCT CASE WHEN i.name = 'justificacion_salida' THEN eid.id END) AS SIGNED) AS justificacion_salida,
                CAST(COUNT(DISTINCT CASE WHEN i.name = 'justificacion_entrada_salida' THEN eid.id END) AS SIGNED) AS justificacion_entrada_salida,
                CAST(COUNT(DISTINCT CASE WHEN i.name = 'lactancia' THEN eid.id END) AS SIGNED) AS lactancia,
                CAST(COUNT(DISTINCT CASE WHEN i.name = 'paternidad' THEN eid.id END) AS SIGNED) AS paternidad,
                CAST(COUNT(DISTINCT CASE WHEN i.name = 'permiso_especial' THEN eid.id END) AS SIGNED) AS permiso_especial,
                CAST(COUNT(DISTINCT CASE WHEN i.name = 'permiso_economico' THEN eid.id END) AS SIGNED) AS permiso_economico,
                CAST(COUNT(DISTINCT CASE WHEN i.name = 'permiso_sin_goce' THEN eid.id END) AS SIGNED) AS permiso_sin_goce,
                CAST(COUNT(DISTINCT CASE WHEN i.name = 'vacaciones' THEN eid.id END) AS SIGNED) AS vacaciones,
                CAST(COUNT(DISTINCT CASE WHEN i.name = 'comision' THEN eid.id END) AS SIGNED) AS comision,
                CAST(COUNT(DISTINCT CASE WHEN i.name = 'retardo' THEN eid.id END) AS SIGNED) AS retardo,
                CAST(COUNT(DISTINCT CASE WHEN i.name = 'retardo_mayor' THEN eid.id END) AS SIGNED) AS retardo_mayor,
                CAST(FLOOR(SUM(IF(i.name = 'retardo', 1, 0)) / 3) AS SIGNED) AS total_retardos,
                CAST(COUNT(DISTINCT CASE WHEN i.name = 'falta' THEN eid.id END) * 2 AS SIGNED) AS falta,
                CAST(COUNT(DISTINCT CASE WHEN i.name = 'licencia_medica' THEN eid.id END) AS SIGNED) AS licencia_medica
            FROM EmployeeIncidents ei
                     LEFT JOIN Incident i ON i.id = ei.incident_id
                     LEFT JOIN EmployeeIncidentDays eid
                               ON eid.employee_incident_id = ei.id AND ei.active = 1
            WHERE ei.incident_status_id = 2
            GROUP BY ei.employee_id
        ) AS registro_incidencias ON registro_incidencias.employee_id = e.id
        ${whereSQL}
        GROUP BY e.id
    `;

    const total = await prisma.$queryRawUnsafe(query);

    const result = await prisma.$queryRawUnsafe(`${query} LIMIT ${limit} OFFSET ${offset};`);

    const pagination = await getPaginationData(total.length, limit, page);

    return {
      ...pagination,
      data: normalizePrismaResult(result),
    };
  },
};
