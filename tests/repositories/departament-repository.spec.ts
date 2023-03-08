import { PrismaClient } from "@prisma/client";
import { DepartamentRespository } from "../../src/repositories/departament-repository";
import {
  CREATE_DEPARTAMENT,
  CREATE_DEPARTAMENT_RETURN_MOCK,
  DEPARTAMENT_UPDATED_RESPONSE,
  FIND_MANY_DEPARTMENT_MOCKS,
  INTERNAL_SERVER_ERROR_MESSAGE
} from "../config/mock/mocks";
import { InternalServerErrorExpection } from "../../src/domain/error/erros";
import MockDate from "mockdate";

describe("DepartamentRepository", () => {
  const prismaclient = new PrismaClient();

  let departamentSpy: any;

  beforeAll(() => {
    MockDate.set(new Date());
  });
  describe("create", () => {
    it("should call prisma client with correct params", async () => {
      departamentSpy = jest
        .spyOn(prismaclient.departament, "create")
        .mockResolvedValueOnce(null as any);

      const departament = new DepartamentRespository(prismaclient);
      await departament.create(CREATE_DEPARTAMENT);

      expect(departamentSpy).toHaveBeenCalledWith({
        data: {
          id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
          ...CREATE_DEPARTAMENT,
          deletedAt: null
        }
      });
    });

    it("should throw an error of prisma client were called with wrong params", async () => {
      jest
        .spyOn(prismaclient.departament, "create")
        .mockRejectedValueOnce(new Error(INTERNAL_SERVER_ERROR_MESSAGE));

      const departamentRepository = new DepartamentRespository(prismaclient);

      await expect(() =>
        departamentRepository.create(CREATE_DEPARTAMENT)
      ).rejects.toThrow(new InternalServerErrorExpection());
    });
  });

  describe("update", () => {
    it("should call primsa client update with correct params", async () => {
      departamentSpy = jest
        .spyOn(prismaclient.departament, "update")
        .mockResolvedValueOnce(null as any);

      const departament = new DepartamentRespository(prismaclient);

      await departament.update(String(DEPARTAMENT_UPDATED_RESPONSE.id), {
        name: "financial"
      });

      expect(departamentSpy).toBeCalledWith({
        where: { id: String(DEPARTAMENT_UPDATED_RESPONSE.id) },
        data: {
          name: "financial",
          updatedAt: new Date()
        }
      });
    });

    it("should throw internal server error if prisma client throws", async () => {
      jest
        .spyOn(prismaclient.departament, "update")
        .mockRejectedValueOnce(new Error(INTERNAL_SERVER_ERROR_MESSAGE));

      const departamentReposiroty = new DepartamentRespository(prismaclient);

      await expect(() =>
        departamentReposiroty.update(String(DEPARTAMENT_UPDATED_RESPONSE.id), {
          name: "financial"
        })
      ).rejects.toThrowError(new InternalServerErrorExpection());
    });
  });

  describe("findMany", () => {
    it("should return only departaments that has not deletedAt", async () => {
      jest
        .spyOn(prismaclient.departament, "findMany")
        .mockResolvedValueOnce(FIND_MANY_DEPARTMENT_MOCKS);

      const departaments = await new DepartamentRespository(
        prismaclient
      ).findMany();

      expect(departaments).toHaveLength(1);
    });

    it("should return an empty array if all elemets had deletedAt defined", async () => {
      jest.spyOn(prismaclient.departament, "findMany").mockResolvedValueOnce(
        FIND_MANY_DEPARTMENT_MOCKS.map((departament) => {
          return { ...departament, deletedAt: new Date() };
        })
      );

      const departaments = await new DepartamentRespository(
        prismaclient
      ).findMany();

      expect(!departaments.length).toBeTruthy();
    });
  });

  describe("findOne", () => {
    it("should call prisma client with correct params", async () => {
      departamentSpy = jest
        .spyOn(prismaclient.departament, "findFirst")
        .mockResolvedValueOnce(null);

      const departament = new DepartamentRespository(prismaclient);

      await departament.findOne({
        id: "6405ee50958ef4c30eb9d0a0"
      });

      expect(departamentSpy).toBeCalledWith({
        where: {
          deletedAt: null,
          id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        },
        select: {
          id: true,
          name: true,
          chief: true,
          team: true,
          createdAt: true,
          process: true
        }
      });
    });

    it("should return only process that was not deleted in departament", async () => {
      departamentSpy = jest
        .spyOn(prismaclient.departament, "findFirst")
        .mockResolvedValueOnce(CREATE_DEPARTAMENT_RETURN_MOCK as any);

      const departament = new DepartamentRespository(prismaclient);

      const departamentFound = await departament.findOne({
        id: "6405ee50958ef4c30eb9d0a0"
      });

      expect(departamentFound?.process).toHaveLength(1);
    });

    it("should return an empty array if it comes empty from database", async () => {
      departamentSpy = jest
        .spyOn(prismaclient.departament, "findFirst")
        .mockResolvedValueOnce({
          ...CREATE_DEPARTAMENT_RETURN_MOCK,
          process: []
        } as any);

      const departament = new DepartamentRespository(prismaclient);

      const departamentFound = await departament.findOne({
        id: "6405ee50958ef4c30eb9d0a0"
      });

      expect(departamentFound?.process).toHaveLength(0);
    });
  });
});
