import { PrismaClient } from "@prisma/client";
import { InternalServerErrorExpection } from "../../src/domain/error/erros";
import MockDate from "mockdate";
import {
  CREATE_SUBPROCESS_MOCK,
  INTERNAL_SERVER_ERROR_MESSAGE,
  UPDATED_MANY_COUNT_MOCK
} from "../config/mock/mocks";
import { SubprocessRepository } from "../../src/repositories/subprocess-repository";
import { createMockContext } from "../config/client";
describe("SubprocessRepository", () => {
  let subprocessSpy: any;
  let prismaClient: PrismaClient;
  let subprocessRepository: SubprocessRepository;
  beforeEach(() => {
    prismaClient = createMockContext().prisma;
    MockDate.set(new Date());
  });

  describe("create", () => {
    it("should call create prismaClient with correct params", async () => {
      subprocessSpy = jest
        .spyOn(prismaClient.subprocess, "create")
        .mockResolvedValueOnce(null as any);

      subprocessRepository = new SubprocessRepository(prismaClient);

      await subprocessRepository.create(CREATE_SUBPROCESS_MOCK);

      expect(subprocessSpy).toHaveBeenCalledWith({
        data: {
          ...CREATE_SUBPROCESS_MOCK,
          id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
          departamentId: expect.stringMatching(
            /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
          ),
          createdAt: new Date(),
          deletedAt: null
        }
      });
    });

    it("should throw if prisma client throws", async () => {
      jest
        .spyOn(prismaClient.subprocess, "create")
        .mockRejectedValueOnce(new Error(INTERNAL_SERVER_ERROR_MESSAGE));

      await expect(() =>
        new SubprocessRepository(prismaClient).create(CREATE_SUBPROCESS_MOCK)
      ).rejects.toThrow(new InternalServerErrorExpection());
    });
  });

  describe("update", () => {
    it("should call update client with correct params", async () => {
      subprocessSpy = jest
        .spyOn(prismaClient.subprocess, "update")
        .mockResolvedValue(null as any);

      new SubprocessRepository(prismaClient).update(
        "6406a00f10ba2d58b4eaad3b",
        { status: "done" }
      );

      expect(subprocessSpy).toHaveBeenCalledWith({
        where: {
          id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        },
        data: { status: "done", updatedAt: new Date() }
      });
    });

    it("should throw if  client throws", async () => {
      jest
        .spyOn(prismaClient.subprocess, "update")
        .mockRejectedValueOnce(new Error(INTERNAL_SERVER_ERROR_MESSAGE));

      await expect(() =>
        new SubprocessRepository(prismaClient).update(
          "6406a00f10ba2d58b4eaad3b",
          { status: "done" }
        )
      ).rejects.toThrow(new InternalServerErrorExpection());
    });
  });

  describe("findMany", () => {
    it("should call findMany with correct params", async () => {
      subprocessSpy = jest
        .spyOn(prismaClient.subprocess, "findMany")
        .mockResolvedValueOnce(null as any);

      await new SubprocessRepository(prismaClient).findMany({
        processId: "640634318365384217b89203",
        departamentId: "6405ee50958ef4c30eb9d0a0"
      });

      expect(subprocessSpy).toHaveBeenCalledWith({
        where: {
          processId: expect.stringMatching(
            /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
          ),
          departamentId: expect.stringMatching(
            /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
          ),
          deletedAt: null
        }
      });
    });

    it("should throw if findMany throws", async () => {
      jest
        .spyOn(prismaClient.subprocess, "findMany")
        .mockRejectedValueOnce(new Error(INTERNAL_SERVER_ERROR_MESSAGE));

      await expect(() =>
        new SubprocessRepository(prismaClient).findMany({
          processId: "640634318365384217b89203",
          departamentId: "6405ee50958ef4c30eb9d0a0"
        })
      ).rejects.toThrow(new InternalServerErrorExpection());
    });
  });

  describe("findOne", () => {
    it("should call findfirst with correct params", async () => {
      subprocessSpy = jest
        .spyOn(prismaClient.subprocess, "findFirst")
        .mockResolvedValueOnce(null);

      await new SubprocessRepository(prismaClient).findOne({
        id: "6406a00f10ba2d58b4eaad3b"
      });

      expect(subprocessSpy).toHaveBeenCalledWith({
        where: {
          id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
          deletedAt: null
        }
      });
    });

    it("should throw if client throws", async () => {
      jest
        .spyOn(prismaClient.subprocess, "findFirst")
        .mockRejectedValueOnce(new Error(INTERNAL_SERVER_ERROR_MESSAGE));

      await expect(() =>
        new SubprocessRepository(prismaClient).findOne({
          id: "6406a00f10ba2d58b4eaad3b"
        })
      ).rejects.toThrow(new InternalServerErrorExpection());
    });
  });

  describe("updateManyByProcessOrSubprocessId", () => {
    it("should call updateMany with correct params", async () => {
      subprocessSpy = jest
        .spyOn(prismaClient.subprocess, "updateMany")
        .mockResolvedValueOnce(UPDATED_MANY_COUNT_MOCK);

      subprocessRepository = new SubprocessRepository(prismaClient);

      await subprocessRepository.updateManyByProcessOrSubprocessId(
        { subprocessId: "64078fd1f3e5f6dd3417d1b2" },
        { deletedAt: new Date() }
      );

      expect(subprocessSpy).toHaveBeenCalledWith({
        where: { subprocessId: "64078fd1f3e5f6dd3417d1b2" },
        data: { deletedAt: new Date(), updatedAt: new Date() }
      });
    });

    it("should throw if client throws", async () => {
      jest
        .spyOn(prismaClient.subprocess, "updateMany")
        .mockRejectedValueOnce(new Error(INTERNAL_SERVER_ERROR_MESSAGE));

      await expect(() =>
        new SubprocessRepository(
          prismaClient
        ).updateManyByProcessOrSubprocessId(
          { subprocessId: "64078fd1f3e5f6dd3417d1b2" },
          { deletedAt: new Date() }
        )
      ).rejects.toThrow(new InternalServerErrorExpection());
    });
  });
});
