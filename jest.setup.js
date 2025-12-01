const dotenv = require("dotenv");
dotenv.config();

// Mock @prisma/client to prevent initialization errors
jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    employee: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    systemLogs: {
      create: jest.fn(),
    },
    $transaction: jest.fn((fn) => fn({
      user: { update: jest.fn() },
      systemLogs: { create: jest.fn() },
    })),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    employee: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    systemLogs: {
      create: jest.fn(),
    },
    $transaction: jest.fn((fn) => fn({
      user: {
        update: jest.fn(),
      },
      systemLogs: {
        create: jest.fn(),
      },
    })),
  },
}));

// Mock next-auth
jest.mock("next-auth", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    handlers: {
      GET: jest.fn(),
      POST: jest.fn(),
    },
    auth: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  })),
}));

// Mock next-auth/jwt
jest.mock("next-auth/jwt", () => ({
  getToken: jest.fn(),
  encode: jest.fn(),
  decode: jest.fn(),
}));

// Mock auth config
jest.mock("@/auth.config", () => ({
  __esModule: true,
  default: {
    providers: [],
    callbacks: {},
  },
}));

// Mock auth
jest.mock("@/auth", () => ({
  __esModule: true,
  default: jest.fn(),
  auth: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));
