import { NextResponse } from "next/server";
import { getHours } from "@/app/api/services/catalog.service";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";

export async function GET() {
  try {
    const hours = await getHours();
    const response = HttpResponse.success(HttpMessages.success, hours);
    return handleHttpResponse(response);
  } catch (error) {
    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
}
