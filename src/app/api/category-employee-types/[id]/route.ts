import { NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import { logger } from "@/lib/logger";
import { CategoryEmployeeTypeService } from "@/app/api/services/category-employee-type.service";
import { HttpMessages } from "@/common/response/messages";
import { ROLES } from "@/common/constants/Roles";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authData = await authMiddleware();
    if (authData instanceof NextResponse) {
      return authData;
    }

    if (authData.roleName !== ROLES.ADMIN) {
      const response = HttpResponse.failure(HttpMessages.error.notAuthorized, {});
      return handleHttpResponse(response);
    }

    const { id: idParam } = await params;
    const id = parseInt(idParam, 10);
    const data = await request.json();

    const result = await CategoryEmployeeTypeService.updateSalary(id, data);

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
