import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { auth } from "@/auth";
import { EmployeeService } from "@/app/api/services/employee.service";
import { getRoleValueById } from "@/common/utils";

export async function authMiddleware() {
  const session = await auth();

  if (!session?.user?.id) {
    return handleHttpResponse(HttpResponse.failure(HttpMessages.error.notAuthorized, {}));
  }

  const userId = Number(session.user.id);
  const roleId = Number(session.user.role);

  const employee = await EmployeeService.getEmployeeByUserId(userId);

  return {
    userId,
    employeeId: employee ? employee.employee_id : null,
    roleId,
    roleName: getRoleValueById(roleId),
    session,
  };
}
