import { PrismaClient } from "@prisma/client";
import { Departament } from "../../src/domain/departament";
import { DepartamentRespository } from "../../src/repositories/departament-repository";
import { TOO_LOWER_CHARACTERS } from "../../src/domain/constants/constants";
import {
  CREATE_DEPARTAMENT,
  CREATE_DEPARTAMENT_RETURN_MOCK,
  FIND_MANY_DEPARTMENT_MOCKS
} from "../config/mock/mocks";
import { DepartamentService } from "../../src/services/departament-service";
import { ObjectId } from "mongodb";
import { Validators } from "../../src/utils/utils";
import { createMockContext } from "../config/client";

describe("DepartamentService", () => {
  let prismaClient: PrismaClient;
  let departament: Departament;
  let departamentRepository: DepartamentRespository;
  let departamentService: DepartamentService;
  let departamentSpy: any;
  let departamentRepositorySpy: any;
  let validators: Validators;
  let validatorsSpy: any;

  beforeEach(() => {
    prismaClient = createMockContext().prisma;
  });

  describe("createDepartament", () => {
    beforeAll(() => {
      departament = new Departament();
      departamentRepository = new DepartamentRespository(prismaClient);
    });

    it("should not call repository if domain return error", async () => {
      departamentRepositorySpy = jest
        .spyOn(departamentRepository, "create")
        .mockResolvedValueOnce(null as any);

      departamentSpy = jest
        .spyOn(departament, "create")
        .mockReturnValueOnce({ isValid: false, error: TOO_LOWER_CHARACTERS });

      departamentService = new DepartamentService(
        departament,
        departamentRepository,
        new Validators()
      );

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
        new Validators()
      );

      await departamentService.createdDepartament(CREATE_DEPARTAMENT);

      const { chief, team, name } = CREATE_DEPARTAMENT;

      expect(departamentSpy).toHaveBeenLastCalledWith(chief, name, team);
      expect(departamentRepositorySpy).toHaveBeenCalledWith(CREATE_DEPARTAMENT);
    });
  });

  describe("findDepartament", () => {
    beforeEach(() => {
      departament = new Departament();
      departamentRepository = new DepartamentRespository(prismaClient);
    });

    it("should return not found error if departament was not found", async () => {
      departamentRepositorySpy = jest
        .spyOn(departamentRepository, "findOne")
        .mockResolvedValueOnce(null as any);

      departamentService = new DepartamentService(
        departament,
        departamentRepository,
        new Validators()
      );

      const departamentNotFound = await departamentService.findDepartament({
        id: "any_id"
      });

      expect(departamentNotFound).toEqual({ error: "Departament not found" });
    });

    it("shoul return socorro", async () => {
      departamentRepositorySpy = jest
        .spyOn(departamentRepository, "findOne")
        .mockResolvedValueOnce(CREATE_DEPARTAMENT_RETURN_MOCK as any);

      departamentService = new DepartamentService(
        departament,
        departamentRepository,
        new Validators()
      );

      await departamentService.findDepartament({
        id: new ObjectId().toString()
      });

      expect(departamentRepositorySpy).toHaveBeenCalledWith({
        id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      });
    });
  });

  describe("updateDepartament", () => {
    beforeEach(() => {
      departament = new Departament();
      departamentRepository = new DepartamentRespository(prismaClient);
      validators = new Validators();
    });
    it("should return error if objectId was not valid", async () => {
      jest.spyOn(validators, "isValidObjectId").mockReturnValueOnce(false);

      departamentService = new DepartamentService(
        departament,
        departamentRepository,
        validators
      );

      const invalidObjectId = await departamentService.updateDepartament(
        "invalid_id",
        { deletedAt: new Date() }
      );

      expect(invalidObjectId).toStrictEqual({ error: "Invalid objectId" });
    });

    it("should return departament error if departament was not found", async () => {
      departamentService = new DepartamentService(
        departament,
        departamentRepository,
        validators
      );
      jest
        .spyOn(departamentService, "findDepartament")
        .mockResolvedValueOnce({ error: "Departament not found" });

      const departamentNotFound = await departamentService.updateDepartament(
        "6405ee50958ef4c30eb9d0a1",
        { deletedAt: new Date() }
      );

      expect(departamentNotFound).toStrictEqual({
        error: "Departament not found"
      });
    });
  });

  describe("findAll", () => {
    beforeEach(() => {
      jest
        .spyOn(prismaClient.departament, "findMany")
        .mockResolvedValueOnce(FIND_MANY_DEPARTMENT_MOCKS);

      departament = new Departament();
      departamentRepository = new DepartamentRespository(prismaClient);
      validators = new Validators();
    });

    it("should return only departaments that has not deletedAt", async () => {
      departamentService = new DepartamentService(
        departament,
        departamentRepository,
        validators
      );

      const departaments = await departamentService.findAllDepartaments();

      expect(departaments).toHaveLength(1);
    });
  });
});
