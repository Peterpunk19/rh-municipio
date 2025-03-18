import type { LoginSchema } from "@/schemas/authentication";
import type * as z from "zod";

export const login = async (authCredentials: z.infer<typeof LoginSchema>) => {
  const { username, password } = authCredentials;
  const baseUrl = "http://localhost:3000/api";
  const body = JSON.stringify({ username, password });

  try {
    const response = await fetch(`${baseUrl}/authentication/login`, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to login");
    }
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error("Error fetching user login data", error);
  }
};
