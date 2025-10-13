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
    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to login");
    }
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error("Error fetching user login data", error);
  }
};
