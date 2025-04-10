import { NextResponse } from "next/server";
import { getDays } from "@/app/api/services/catalog.service";
import { handleHttpResponse } from "@/common/response/handler";
import { HttpResponse } from "@/common/response/model";
import { HttpMessages } from "@/common/response/messages";

export async function GET() {
  try {
    const days = await getDays();
    const response = HttpResponse.success(HttpMessages.success, days);
    return handleHttpResponse(response);
  } catch (error) {
    const response = HttpResponse.failure(HttpMessages.error.internalServerError, error);
    return handleHttpResponse(response);
  }
} 