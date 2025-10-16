import { prisma } from "@/lib/prisma";
import { ISalariesFilters } from "@/app/api/catalogs/salaries/types";
import { getPaginationData } from "@/common/utils";

export const SalariesService = {
  async getSalariesByParams(filters: ISalariesFilters) {
    const { limit, page } = filters;
    const offset = (Number(page) - 1) * Number(limit);

    const whereConditions = [];

    if (filters.categoryId !== null) {
      whereConditions.push(`CategoryEmployeeType.category_id = ${filters.categoryId}`);
    }
    if (filters.employeeTypeId !== null) {
      whereConditions.push(`CategoryEmployeeType.employee_type_id = ${filters.employeeTypeId}`);
    }

    if (filters.search) {
      const searchConditions = [
        `Category.display_name LIKE '%${filters.search}%'`,
        `EmployeeType.display_name LIKE '%${filters.search}%'`,
      ];
      whereConditions.push(`(${searchConditions.join(" OR ")})`);
    }

    const whereSQL = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

    const pivotQuery = `
      SELECT 
        Category.id,
        Category.display_name as category,
        MAX(CASE WHEN EmployeeType.name = 'base_sindicalizado' THEN CategoryEmployeeType.salary END) as base_sindicalizado,
        MAX(CASE WHEN EmployeeType.name = 'base_no_sindicalizado' THEN CategoryEmployeeType.salary END) as base_no_sindicalizado,
        MAX(CASE WHEN EmployeeType.name = 'confianza' THEN CategoryEmployeeType.salary END) as confianza,
        MAX(CASE WHEN EmployeeType.name = 'contrato_gasto_corriente' THEN CategoryEmployeeType.salary END) as contrato_gasto_corriente,
        MAX(CASE WHEN EmployeeType.name = 'contrato_por_laudo' THEN CategoryEmployeeType.salary END) as contrato_por_laudo,
        MAX(CASE WHEN EmployeeType.name = 'eventual' THEN CategoryEmployeeType.salary END) as eventual,
        MAX(CASE WHEN EmployeeType.name = 'base_por_laudo' THEN CategoryEmployeeType.salary END) as base_por_laudo,
        MAX(CASE WHEN EmployeeType.name = 'confianza_fondo_iv' THEN CategoryEmployeeType.salary END) as confianza_fondo_iv,
        MAX(CASE WHEN EmployeeType.name = 'pensionado' THEN CategoryEmployeeType.salary END) as pensionado
      FROM CategoryEmployeeType
      INNER JOIN Category ON CategoryEmployeeType.category_id = Category.id
      INNER JOIN EmployeeType ON CategoryEmployeeType.employee_type_id = EmployeeType.id
      ${whereSQL}
      GROUP BY Category.id, Category.display_name
      ORDER BY Category.id ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT Category.id) as total
      FROM CategoryEmployeeType
      INNER JOIN Category ON CategoryEmployeeType.category_id = Category.id
      INNER JOIN EmployeeType ON CategoryEmployeeType.employee_type_id = EmployeeType.id
      ${whereSQL}
    `;

    const [salariesResult, countResult] = await Promise.all([
      prisma.$queryRawUnsafe(pivotQuery),
      prisma.$queryRawUnsafe(countQuery),
    ]);

    const salaries = salariesResult as any[];
    const total = Number((countResult as any[])[0]?.total || 0);
    const pagination = await getPaginationData(total, limit, page);

    return { ...pagination, salaries };
  },

  async getSalariesByCategoryAndEmployeeType(categoryId: number, employeeTypeId: number) {
    const salaries = await prisma.categoryEmployeeType.findFirst({
      where: {
        category_id: categoryId,
        employee_type_id: employeeTypeId,
        active: true,
      },
      select: {
        id: true,
        salary: true,
        active: true,
      },
    });

    return salaries;
  },
};
