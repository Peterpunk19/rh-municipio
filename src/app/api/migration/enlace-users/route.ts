import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middleware/authMiddleware";
import { MigrationService } from "@/app/api/services/migration.service";
import { logger } from "@/lib/logger";
import { ROLES } from "@/common/constants/Roles";

export async function POST(request: NextRequest) {
  const authResponse = await authMiddleware();
  if (authResponse instanceof NextResponse) {
    return authResponse;
  }

  if (authResponse.roleName !== ROLES.ADMIN) {
    const response = HttpResponse.failure(HttpMessages.error.notAuthorized, {});
    return handleHttpResponse(response);
  }

  try {
    logger.info(`Migration started by user ${authResponse.userId}`);

    const result = await MigrationService.importEnlaceUsers(authResponse);

    logger.info(
      { imported: result.imported, skipped: result.skipped, errors: result.errors.length },
      "Migration completed",
    );

    const response = HttpResponse.success(HttpMessages.migration.enlaceUsersImportSuccess, {
      imported: result.imported,
      skipped: result.skipped,
      total: result.total,
      errors: result.errors,
    });

    return handleHttpResponse(response);
  } catch (error: any) {
    logger.error({ error: error.message, stack: error.stack, userId: authResponse.userId }, "Migration failed");
    const response = HttpResponse.internalServerError(HttpMessages.error.internalServerError, { error: error.message });
    return handleHttpResponse(response);
  }
}
