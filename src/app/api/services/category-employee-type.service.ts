import { prisma } from "@/lib/prisma";
import { HttpMessages } from "@/common/response/messages";
import { CategoryEmployeeTypeResult } from "@/app/api/catalogs/salaries/types";

export const CategoryEmployeeTypeService = {
  async getSalariesByYear(configYearId: number): Promise<CategoryEmployeeTypeResult> {
    const categories = await prisma.category.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        display_name: true,
      },
    });

    const employeeTypes = await prisma.employeeType.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        display_name: true,
      },
    });

    const existingRelations = await prisma.categoryEmployeeType.findMany({
      where: { config_year_id: configYearId },
      include: {
        category: {
          select: { name: true, display_name: true },
        },
        employee_type: {
          select: { name: true, display_name: true },
        },
      },
    });

    const relationMap = new Map(existingRelations.map((rel) => [`${rel.category_id}-${rel.employee_type_id}`, rel]));

    const data = [];

    for (const category of categories) {
      for (const employeeType of employeeTypes) {
        const key = `${category.id}-${employeeType.id}`;
        const existingRelation = relationMap.get(key);

        data.push({
          id: existingRelation?.id || null,
          category_id: category.id,
          employee_type_id: employeeType.id,
          salary: existingRelation?.salary || null,
          config_year_id: configYearId,
        });
      }
    }

    return {
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        display_name: cat.display_name || cat.name,
      })),
      employeeTypes: employeeTypes.map((et) => ({
        id: et.id,
        name: et.name,
        display_name: et.display_name || et.name,
      })),
      data,
    };
  },

  async updateSalary(
    id: number | null,
    data: { category_id: number; employee_type_id: number; salary: number | null; config_year_id: number },
  ) {
    const salaryValue = data.salary === null ? 0 : data.salary;

    const configYear = await prisma.configYear.findUnique({
      where: { id: data.config_year_id },
    });

    if (!configYear) {
      throw new Error(HttpMessages.configYears.notFound);
    }

    if (id) {
      return prisma.categoryEmployeeType.update({
        where: { id },
        data: {
          salary: salaryValue,
        },
      });
    } else {
      const existingRecord = await prisma.categoryEmployeeType.findFirst({
        where: {
          category_id: data.category_id,
          employee_type_id: data.employee_type_id,
          config_year_id: data.config_year_id,
        },
      });

      if (existingRecord) {
        return prisma.categoryEmployeeType.update({
          where: { id: existingRecord.id },
          data: { salary: salaryValue },
        });
      }

      return prisma.categoryEmployeeType.create({
        data: {
          category_id: data.category_id,
          employee_type_id: data.employee_type_id,
          salary: salaryValue,
          config_year_id: data.config_year_id,
          active: true,
        },
      });
    }
  },

  async copyFromPreviousYear(sourceYearId: number, targetYear: number) {
    const sourceData = await prisma.categoryEmployeeType.findMany({
      where: { config_year_id: sourceYearId },
    });

    const existingYear = await prisma.configYear.findFirst({
      where: { year: targetYear },
    });

    let targetYearId: number;

    if (existingYear) {
      targetYearId = existingYear.id;
      await prisma.categoryEmployeeType.deleteMany({
        where: { config_year_id: targetYearId },
      });
    } else {
      const newYear = await prisma.configYear.create({
        data: {
          year: targetYear,
          display_name: String(targetYear),
          active: false,
        },
      });
      targetYearId = newYear.id;
    }

    const newConfigs = sourceData.map((item) => ({
      category_id: item.category_id,
      employee_type_id: item.employee_type_id,
      salary: item.salary,
      config_year_id: targetYearId,
      active: true,
    }));

    if (newConfigs.length > 0) {
      await prisma.categoryEmployeeType.createMany({
        data: newConfigs,
      });
    }

    return {
      success: true,
      configYearId: targetYearId,
      count: newConfigs.length,
    };
  },
};
