import { PrismaClient } from "@prisma/client";
import { Departament } from "../../src/domain/departament";
import { DepartamentRespository } from "../../src/repositories/departament-repository";
import { TOO_LOWER_CHARACTERS } from "../../src/domain/constants/constants";
import {
  CREATE_DEPARTAMENT,
  CREATE_DEPARTAMENT_RETURN_MOCK
} from "../config/mock/mocks";
import { DepartamentService } from "../../src/services/departament-service";
import { faker } from "@faker-js/faker";
import { ObjectId } from "mongodb";

describe("DepartamentService", () => {
  let prismaClient: PrismaClient;
  let departament: Departament;
  let departamentRepository: DepartamentRespository;
  let departamentService: DepartamentService;
  let departamentSpy: any;
  let departamentRepositorySpy: any;

  beforeEach(() => {
    prismaClient = new PrismaClient();
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
        departamentRepository
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
        departamentRepository
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
        departamentRepository
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
        departamentRepository
      );

      await departamentService.findDepartament({
        id: new ObjectId().toString()
      });

      expect(departamentRepositorySpy).toHaveBeenCalledWith({
        id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      });
    });

    
  });
});
