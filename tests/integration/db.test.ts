import { prisma } from "@/lib/prisma";

describe("DB real test", () => {
  it("should connect to test database", async () => {
    const result = await prisma.$queryRaw`SELECT 1`;
    expect(result).toBeDefined();
  });
});
