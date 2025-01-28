import { PrismaClient } from "@prisma/client";

declare global {
  // Para evitar conflictos con el tipo de prisma en `globalThis`
  var prismaClient: PrismaClient | undefined;
}

export const prisma = global.prismaClient || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prismaClient = prisma;
}
