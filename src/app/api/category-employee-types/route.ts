import { NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import { logger } from "@/lib/logger";
import { CategoryEmployeeTypeService } from "@/app/api/services/category-employee-type.service";
import { HttpMessages } from "@/common/response/messages";

export async function POST(request: Request) {
  try {
    const authData = await authMiddleware();
    if (authData instanceof NextResponse) {
      return authData;
    }

    const data = await request.json();
    const result = await CategoryEmployeeTypeService.updateSalary(null, data);

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
