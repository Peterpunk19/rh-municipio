import jwt from "jsonwebtoken";

export async function generateToken(user: any) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role_id: user.role_id,
    },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: Number.parseInt(process.env.JWT_ACCESS_EXPIRES_IN!, 10) },
  );
}
