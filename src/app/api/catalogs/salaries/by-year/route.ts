import { NextResponse } from "next/server";
import { CategoryEmployeeTypeService } from "@/app/api/services/category-employee-type.service";
import { ConfigYearService } from "@/app/api/services/config-year.service";
import { authMiddleware } from "@/middleware/authMiddleware";
import { HttpMessages } from "@/common/response/messages";
import { ROLES } from "@/common/constants/Roles";
import { logger } from "@/lib/logger";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";

export async function GET(request: Request) {
  try {
    const authData = await authMiddleware();
    if (authData instanceof NextResponse) {
      return authData;
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get("year");

    let configYear;
    if (year) {
      const yearNumber = parseInt(year, 10);
      configYear = await ConfigYearService.getConfigYears().then((years) => years.find((y) => y.year === yearNumber));
    } else {
      configYear = await ConfigYearService.getActiveConfigYear();
    }

    if (!configYear) {
      const currentYear = new Date().getFullYear();
      configYear = await ConfigYearService.createConfigYear(currentYear);

      await ConfigYearService.updateConfigYear(configYear.id, { active: true });
    }

    const result = await CategoryEmployeeTypeService.getSalariesByYear(configYear.id);

    return NextResponse.json({
      success: true,
      message: HttpMessages.salaries.getSuccess,
      responseObject: {
        ...result,
        currentYear: configYear,
      },
      statusCode: 200,
    });
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authData = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    if (authData.roleName !== ROLES.ADMIN) {
      const response = HttpResponse.failure(HttpMessages.error.notAuthorized, {});
      return handleHttpResponse(response);
    }

    const body = await request.json();
    const { id, ...data } = body;

    const result = await CategoryEmployeeTypeService.updateSalary(id || null, data);

    return NextResponse.json({
      success: true,
      message: HttpMessages.salaries.updateSuccess,
      responseObject: result,
      statusCode: 200,
    });
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
