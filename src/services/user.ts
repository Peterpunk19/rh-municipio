export const getUserById = async (id: number) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/user/getById`, {
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
      return response.json();
    }
  } catch (error) {
    console.error("Error fetching user information", error);
  }
};
