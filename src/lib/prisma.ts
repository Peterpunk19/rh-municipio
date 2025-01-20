import { PrismaClient } from "@prisma/client";

declare global {
  // Para evitar conflictos con el tipo de prisma en `globalThis`
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  if (!global.prisma) {
    console.log("Initializing global Prisma...");
  }
  global.prisma = prisma;
}
