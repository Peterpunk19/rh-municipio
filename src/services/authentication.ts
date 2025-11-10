import type { LoginSchema } from "@/schemas/authentication";
import type * as z from "zod";

export const login = async (authCredentials: z.infer<typeof LoginSchema>) => {
  const { username, password } = authCredentials;
  const body = JSON.stringify({ username, password });

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_AUTH}/login`, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to login",
        responseObject: null,
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching user login data", error);
    return {
      success: false,
      message: "Error de conexión al servidor",
      responseObject: null,
    };
  }
};
