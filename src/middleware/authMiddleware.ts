import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";
import { auth } from "@/auth";

export async function authMiddleware() {
  const session = await auth();

  if (!session?.user?.id) {
    return handleHttpResponse(HttpResponse.failure(HttpMessages.error.notAuthorized, {}));
  }

  return { userId: Number(session.user.id), session };
}
