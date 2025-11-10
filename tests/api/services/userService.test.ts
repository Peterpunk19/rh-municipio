import { prisma } from "@/lib/prisma";
import { UserService } from "@/app/api/services/user.service";
import type { IDeactivatedUser } from "@/app/api/users/types";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}));

describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("changeStatusUser", () => {
    it("should deactivate an active user", async () => {
      const mockUserId = 1;
      const mockPerformedById = 2;
      const mockUsername = "carloszh";
      const mockDeactivatedUser: IDeactivatedUser = {
        id: mockUserId,
        uuid: "62ba4b61-8a93-4b40-9f7c-b25d1c2c5bf9",
        username: mockUsername,
        active: false,
        updated_at: "2025-02-25T13:21:53.510Z",
      };

      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback({
          user: {
            update: jest.fn().mockResolvedValue(mockDeactivatedUser),
          },
          systemLogs: {
            create: jest.fn().mockResolvedValue({}),
          },
        });
      });

      const result = await UserService.changeStatusUser(mockUserId, false, mockPerformedById, mockUsername);
      expect(result).toEqual(mockDeactivatedUser);
    });
  });
});
