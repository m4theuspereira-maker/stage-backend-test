import { PrismaClient } from "@prisma/client";
import { Departament } from "../../src/domain/departament";
import { DepartamentRespository } from "../../src/repositories/departament-repository";
import { TOO_LOWER_CHARACTERS } from "../../src/domain/constants/constants";
import {
  CREATE_DEPARTAMENT,
  CREATE_DEPARTAMENT_RETURN_MOCK,
  DEPARTAMENT_UPDATED_RESPONSE,
  FIND_MANY_DEPARTMENT_MOCKS,
  PROCESS_CREATED_MOCK
} from "../config/mock/mocks";
import { DepartamentService } from "../../src/services/departament-service";
import { ObjectId } from "mongodb";
import { Validators } from "../../src/utils/utils";
import { createMockContext } from "../config/client";
import Mockdate from "mockdate";
import { ProcessRepository } from "../../src/repositories/process-repository";

describe("DepartamentService", () => {
  let prismaClient: PrismaClient;
  let departament: Departament;
  let departamentRepository: DepartamentRespository;
  let departamentService: DepartamentService;
  let departamentSpy: any;
  let departamentRepositorySpy: any;
  let processRepository: ProcessRepository;
  let validators: Validators;

  beforeEach(() => {
    prismaClient = createMockContext().prisma;
    Mockdate.set(new Date());
    departament = new Departament();
    departamentRepository = new DepartamentRespository(prismaClient);
    processRepository = new ProcessRepository(prismaClient);
  });

  function departamentServiceFactory() {
    return new DepartamentService(
      departament,
      departamentRepository,
      processRepository
    );
  }

  describe("createDepartament", () => {
    it("should not call repository if domain return error", async () => {
      departamentRepositorySpy = jest
        .spyOn(departamentRepository, "create")
        .mockResolvedValueOnce(null as any);

      departamentSpy = jest
        .spyOn(departament, "create")
        .mockReturnValueOnce({ isValid: false, error: TOO_LOWER_CHARACTERS });

      departamentService = departamentServiceFactory();

      await departamentService.createdDepartament(CREATE_DEPARTAMENT);

      const { chief, team, name } = CREATE_DEPARTAMENT;

      expect(departamentSpy).toHaveBeenLastCalledWith(chief, name, team);
      expect(departamentRepositorySpy).not.toHaveBeenCalled();
    });

    it("should call domain and repository if any error was returned", async () => {
      departamentRepositorySpy = jest
        .spyOn(departamentRepository, "create")
        .mockResolvedValueOnce(null as any);

      departamentSpy = jest
        .spyOn(departament, "create")
        .mockReturnValueOnce(CREATE_DEPARTAMENT);

      departamentService = new DepartamentService(
        departament,
        departamentRepository,
        processRepository
      );

      await departamentService.createdDepartament(CREATE_DEPARTAMENT);

      const { chief, team, name } = CREATE_DEPARTAMENT;

      expect(departamentSpy).toHaveBeenLastCalledWith(chief, name, team);
      expect(departamentRepositorySpy).toHaveBeenCalledWith(CREATE_DEPARTAMENT);
    });
  });

  describe("findDepartament", () => {
    it("should return not found error if departament was not found", async () => {
      departamentRepositorySpy = jest
        .spyOn(departamentRepository, "findOne")
        .mockResolvedValueOnce(null as any);

      departamentService = departamentServiceFactory();

      const departamentNotFound = await departamentService.findDepartament({
        id: "any_id"
      });

      expect(departamentNotFound).toEqual(null);
    });

    it("shoul return socorro", async () => {
      departamentRepositorySpy = jest
        .spyOn(departamentRepository, "findOne")
        .mockResolvedValueOnce(CREATE_DEPARTAMENT_RETURN_MOCK as any);

      departamentService = departamentServiceFactory();

      await departamentService.findDepartament({
        id: new ObjectId().toString()
      });

      expect(departamentRepositorySpy).toHaveBeenCalledWith({
        id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      });
    });
  });

  describe("updateDepartament", () => {
    it("should return error if objectId was not valid", async () => {
      departamentService = departamentServiceFactory();

      const invalidObjectId = await departamentService.updateDepartament(
        "invalid_id",
        { deletedAt: new Date() }
      );

      expect(invalidObjectId).toStrictEqual(null);
    });

    it("should return departament error if departament was not found", async () => {
      departamentService = departamentServiceFactory();
      jest
        .spyOn(departamentService, "findDepartament")
        .mockResolvedValueOnce(null);

      const departamentNotFound = await departamentService.updateDepartament(
        new ObjectId().toString(),
        { deletedAt: new Date() }
      );

      expect(departamentNotFound).toStrictEqual(null);
    });
  });

  describe("findAll", () => {
    beforeEach(() => {
      jest
        .spyOn(prismaClient.departament, "findMany")
        .mockResolvedValueOnce(FIND_MANY_DEPARTMENT_MOCKS);
    });

    it("should return only departaments that has not deletedAt", async () => {
      departamentService = departamentServiceFactory();

      const departaments = await departamentService.findAllDepartaments();

      expect(departaments).toHaveLength(1);
    });
  });

  describe("deletedDepartament", () => {
    beforeEach(() => {
      validators = new Validators();
    });

    it("should call departament service update with correct params", async () => {
      departamentService = departamentServiceFactory();

      jest.spyOn(processRepository, "findMany").mockResolvedValueOnce([]);

      const departamentServiceSpy = jest
        .spyOn(departamentService, "updateDepartament")
        .mockResolvedValueOnce(DEPARTAMENT_UPDATED_RESPONSE as any);

      await departamentService.deleteDepartament(new ObjectId().toString());

      expect(departamentServiceSpy).toHaveBeenCalledWith(
        expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
        {
          deletedAt: new Date()
        }
      );
    });

    it("should delete all the process if departament had", async () => {
      departamentService = departamentServiceFactory();

      jest
        .spyOn(departamentService, "updateDepartament")
        .mockResolvedValueOnce(DEPARTAMENT_UPDATED_RESPONSE as any);

      jest
        .spyOn(processRepository, "findMany")
        .mockResolvedValueOnce([PROCESS_CREATED_MOCK]);

      const processRepositorySpy = jest
        .spyOn(processRepository, "updateManyByDepartamentId")
        .mockResolvedValueOnce({ count: 1 });

      await departamentService.deleteDepartament(`6405ee50958ef4c30eb9d0a0`);

      expect(processRepositorySpy).toHaveBeenCalledWith(
        expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
        { deletedAt: new Date() }
      );
    });
  });
});
