import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ payload: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server Login failed", errorDetail: error }, { status: 500 });
  }
}
