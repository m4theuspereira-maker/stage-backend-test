import { PrismaClient } from "@prisma/client";
import { ProcessRepository } from "../../src/repositories/process-repository";
import {
  CREATE_PROCESS_WITHOUT_SUBPROCESS_AND_DESCRIPTION,
  INTERNAL_SERVER_ERROR_MESSAGE,
  PROCESS_CREATED_MOCK,
  UPDATED_MANY_COUNT_MOCK
} from "../config/mock/mocks";
import { InternalServerErrorExpection } from "../../src/domain/error/erros";
import Mockdate from "mockdate";

describe("ProcessRepository", () => {
  const prismaClient = new PrismaClient();
  let processSpy: any;
  let processRepository: ProcessRepository;

  beforeAll(() => {
    processRepository = new ProcessRepository(prismaClient);
    Mockdate.set(new Date());
  });

  describe("create", () => {
    it("should call client create with correct params", async () => {
      processSpy = jest
        .spyOn(prismaClient.process, "create")
        .mockResolvedValueOnce(PROCESS_CREATED_MOCK);

      await processRepository.create({
        name: "make new relatory",
        responsables: ["armando", "john"],
        description: "call to social security office",
        departamentId: "6405ee50958ef4c30eb9d0a0",
        status: "pending"
      });

      expect(processSpy).toHaveBeenCalledWith({
        data: {
          id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
          name: "make new relatory",
          responsables: ["armando", "john"],
          description: "call to social security office",
          departamentId: "6405ee50958ef4c30eb9d0a0",
          status: "pending",
          deletedAt: null
        }
      });
    });

    it("should throws if prisma client throws", async () => {
      jest
        .spyOn(prismaClient.process, "create")
        .mockRejectedValueOnce(new Error(INTERNAL_SERVER_ERROR_MESSAGE));

      await expect(() =>
        new ProcessRepository(prismaClient).create(
          CREATE_PROCESS_WITHOUT_SUBPROCESS_AND_DESCRIPTION
        )
      ).rejects.toThrow(
        new InternalServerErrorExpection(
          INTERNAL_SERVER_ERROR_MESSAGE,
          expect.anything()
        )
      );
    });
  });

  describe("update", () => {
    it("should call update with correct params", async () => {
      processSpy = jest
        .spyOn(prismaClient.process, "update")
        .mockResolvedValueOnce(PROCESS_CREATED_MOCK);

      await processRepository.update("64062ba0ec8747ecfc348ccc", {
        responsables: ["Jota", "jotinha", "jotão"],
        description: "esqueça tudo"
      });

      expect(processSpy).toHaveBeenCalledWith({
        where: {
          id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        },
        data: {
          responsables: ["Jota", "jotinha", "jotão"],
          description: "esqueça tudo",
          updatedAt: new Date()
        }
      });
    });

    it("should throw if update client throws", async () => {
      jest
        .spyOn(prismaClient.process, "update")
        .mockRejectedValueOnce(new Error(INTERNAL_SERVER_ERROR_MESSAGE));

      await expect(() =>
        new ProcessRepository(prismaClient).update("6405ee50958ef4c30eb9d0a0", {
          responsables: ["Jota", "jotinha", "jotão"],
          description: "esqueça tudo"
        })
      ).rejects.toThrow(
        new InternalServerErrorExpection(
          INTERNAL_SERVER_ERROR_MESSAGE,
          expect.anything()
        )
      );
    });
  });

  describe("findOne", () => {
    it("should return a found organization", async () => {
      processSpy = jest
        .spyOn(prismaClient.process, "findFirst")
        .mockResolvedValueOnce(null as any);

      await processRepository.findOne({
        id: `64062ba0ec8747ecfc348ccc`
      });

      expect(processSpy).toHaveBeenCalledWith({
        where: {
          id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
          deletedAt: null
        },
        select: {
          id: true,
          name: true,
          status: true,
          requiredDocumentation: true,
          responsables: true,
          description: true,
          departamentId: true,
          processId: true,
          createdAt: true,
          Subprocess: true
        }
      });
    });

    it("should throw if client throws", async () => {
      jest
        .spyOn(prismaClient.process, "findFirst")
        .mockRejectedValueOnce(new Error(INTERNAL_SERVER_ERROR_MESSAGE));

      await expect(() =>
        new ProcessRepository(prismaClient).findOne({
          id: "6405ee50958ef4c30eb9d0a0"
        })
      ).rejects.toThrow(
        new InternalServerErrorExpection(
          INTERNAL_SERVER_ERROR_MESSAGE,
          expect.anything()
        )
      );
    });
  });

  describe("updateManyByDepartamentId", () => {
    it("should call update many with correct params", async () => {
      processSpy = jest
        .spyOn(prismaClient.process, "updateMany")
        .mockResolvedValueOnce(UPDATED_MANY_COUNT_MOCK);

      await processRepository.updateManyByDepartamentId(
        "6405ee50958ef4c30eb9d0a0",
        { deletedAt: new Date() }
      );

      expect(processSpy).toHaveBeenCalledWith({
        where: {
          departamentId: expect.stringMatching(
            /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
          )
        },
        data: {
          deletedAt: new Date(),
          updatedAt: new Date()
        }
      });
    });

    it("should throw if prisma client throws", async () => {
      jest
        .spyOn(prismaClient.process, "updateMany")
        .mockRejectedValueOnce(new Error(INTERNAL_SERVER_ERROR_MESSAGE));

      await expect(() =>
        new ProcessRepository(prismaClient).updateManyByDepartamentId(
          "6405ee50958ef4c30eb9d0a0",
          { deletedAt: new Date() }
        )
      ).rejects.toThrow(
        new InternalServerErrorExpection(
          INTERNAL_SERVER_ERROR_MESSAGE,
          expect.anything()
        )
      );
    });
  });
});