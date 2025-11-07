import { NextResponse } from "next/server";
import { ConfigYearService } from "@/app/api/services/config-year.service";
import { authMiddleware } from "@/middleware/authMiddleware";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const years = await ConfigYearService.getConfigYears();
    return NextResponse.json({
      success: true,
      message: HttpMessages.catalog.success,
      responseObject: years,
      statusCode: 200,
    });
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authData = await authMiddleware();

    if (authData instanceof NextResponse) {
      return authData;
    }

    const { year, displayName } = await request.json();

    const existingYear = await ConfigYearService.getConfigYears().then((years) => years.find((y) => y.year === year));

    if (existingYear) {
      return NextResponse.json({ success: false, error: "Ya existe un año con ese valor" }, { status: 400 });
    }

    const newYear = await ConfigYearService.createConfigYear(year, displayName);

    return NextResponse.json({
      success: true,
      message: HttpMessages.catalog.success,
      responseObject: newYear,
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

    const { id, ...data } = await request.json();

    const updatedYear = await ConfigYearService.updateConfigYear(id, data);

    return NextResponse.json({
      success: true,
      message: HttpMessages.catalog.success,
      responseObject: updatedYear,
      statusCode: 200,
    });
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
