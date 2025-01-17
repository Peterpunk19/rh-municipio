import type { LoginSchema } from "@/schemas/authentication";
import type * as z from "zod";

export const login = async (authCredentials: z.infer<typeof LoginSchema>) => {
  const { username, password } = authCredentials;
  try {
    const response = await fetch("/api/authentication/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to login");
    }
    if (response.ok) {
      console.log(response.json());
      return response.json();
    }
  } catch (error) {
    console.error("Error fetching event user enrollment", error);
  }
};
