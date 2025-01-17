import type { UserSchema } from "@/schemas/user";
import type * as z from "zod";

export const getUserById = async (id: number) => {
  try {
    const response = await fetch("/api/user/getById", {
      method: "POST",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to get user information");
    }
    if (response.ok) {
      console.log(response.json());
      return response.json();
    }
  } catch (error) {
    console.error("Error fetching event user information", error);
  }
};