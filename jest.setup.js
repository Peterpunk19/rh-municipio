const dotenv = require("dotenv");
dotenv.config();

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
