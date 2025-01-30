import type { NextRequest, NextResponse } from "next/server";
import { HttpResponse } from "@/common/response/model";
import { mapValidationErrors } from "@/utils/validation";
import { handleHttpResponse } from "@/common/response/handler";

type ValidationResult<T> = {
  data: T | null;
  response: NextResponse | null;
};

export async function validateRequest<T>(request: NextRequest, schema?: any): Promise<ValidationResult<T>> {
  try {
    if (schema) {
      let body: any;
      try {
        body = await request.json();
      } catch (error) {
        console.log(error);
        const response = HttpResponse.failure("Invalid JSON format", {});
        return { data: null, response: handleHttpResponse(response) };
      }

      const validatedRequest = schema.safeParse(body);

      if (!validatedRequest.success) {
        const errors = mapValidationErrors(validatedRequest.error.issues);
        const response = HttpResponse.failure("Invalid request", errors);
        return { data: null, response: handleHttpResponse(response) };
      }

      return { data: validatedRequest.data, response: null };
    }

    return { data: null, response: null };
  } catch (error) {
    const response = HttpResponse.internalServerError("Internal server error", {});
    return { data: null, response: handleHttpResponse(response) };
  }
}

export async function validateRequestByUrlParams<T>(urlParams: T, schema?: any): Promise<ValidationResult<T>> {
  try {
    if (schema) {
      const validatedRequest = schema.safeParse(urlParams);
      if (!validatedRequest.success) {
        const errors = mapValidationErrors(validatedRequest.error.issues);
        const response = HttpResponse.failure("Invalid request", errors);
        return { data: null, response: handleHttpResponse(response) };
      }

      return { data: validatedRequest.data, response: null };
    }

    return { data: null, response: null };
  } catch (error) {
    const response = HttpResponse.internalServerError("Internal server error", {});
    return { data: null, response: handleHttpResponse(response) };
  }
}
