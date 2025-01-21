import { PrismaClient } from "@prisma/client";

declare global {
  // Para evitar conflictos con el tipo de prisma en `globalThis`
  var prismaClient: PrismaClient | undefined;
}

export const prisma = global.prismaClient || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
<<<<<<< HEAD
  console.log("Global prisma:", global.prismaClient);
  global.prismaClient = prisma;
=======
  global.prisma = prisma;
>>>>>>> ccb635e (Feature[implement-auth-with-next]: adding library and config to user next auth in this project)
}
