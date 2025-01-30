import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LoginSchema } from "@/schemas/authentication";
import { UserSchema } from "@/schemas/user";
import bcryptjs from "bcryptjs";

export async function POST(request: Request) {
  try {
    const validatedRequest = LoginSchema.parse(await request.json());
    const { username, password } = validatedRequest;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(await bcryptjs.hash(password, 10));
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "User password wrong" }, { status: 401 });
    }
    const validatedUser = UserSchema.parse(user);
    return NextResponse.json({ payload: validatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Login failed", errorDetail: error }, { status: 500 });
  }
}
