import { prisma } from "@/lib/prisma";
import { buildWhereClause, getPaginationData } from "@/common/utils";
import { IIncidentsRulesFilters } from "@/app/api/catalogs/incidents-rules/types";

export const IncidentsRulesService = {
  async getIncidentsRulesByParams(filters: IIncidentsRulesFilters) {
    const limit = filters.limit;
    const page = filters.page;
    const offset = (page - 1) * limit;

    const filterMappings = {
      incidentId: {
        path: "incident_id",
      },
      employeeTypeId: {
        path: "employee_type_id",
      },
    };

    const searchMappings = [
      { path: ["incident", "name"], operators: ["is", "contains"] },
      { path: ["employee_type", "name"], operators: ["is", "contains"] },
    ];

    const whereClause: any = await buildWhereClause(filterMappings, filters, searchMappings);

    const data = await prisma.incidentRules.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        employee_type_id: true,
        employee_type: {
          select: {
            id: true,
            name: true,
            display_name: true,
          },
        },
        incident_id: true,
        incident: {
          select: {
            id: true,
            name: true,
            display_name: true,
          },
        },
        min_days: true,
        max_days: true,
        start_date: true,
        end_date: true,
        min_years: true,
        max_years: true,
        active: true,
      },
    });

    const total = await prisma.incidentRules.count({ where: whereClause });
    const pagination = await getPaginationData(total, limit, page);

    return { ...pagination, data };
  },
};
