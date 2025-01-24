import { NextResponse } from "next/server";
import { HttpResponse } from "@/common/response/model";

export const handleHttpResponse = (httpResponse: HttpResponse<any>) => {
  return NextResponse.json(httpResponse, { status: httpResponse.statusCode });
};
