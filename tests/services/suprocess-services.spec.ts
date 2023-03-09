import { PrismaClient } from "@prisma/client";
import { createMockContext } from "../config/client";
import { Process } from "../../src/domain/process";
import { DepartamentRespository } from "../../src/repositories/departament-repository";
import { ProcessRepository } from "../../src/repositories/process-repository";
import { SubprocessRepository } from "../../src/repositories/subprocess-repository";
import Mockdate from "mockdate";
import { SubprocessServices } from "../../src/services/subprocess-service";
import { faker } from "@faker-js/faker";
import {
  PROCESS_STATUS,
  TOO_MANY_CHARACTERS
} from "../../src/domain/constants/constants";
import {
  CREATE_DEPARTAMENT_RETURN_MOCK,
  CREATE_SUBPROCESS_MOCK,
  PROCESS_CREATED_MOCK,
  SUB_PROCESS
} from "../config/mock/mocks";
import { ProcessService } from "./process-service";
import { ObjectId } from "mongodb";

describe("SubprocessServices", () => {
  let prismaClient: PrismaClient;
  let process: Process;
  let processRepository: ProcessRepository;
  let departamentRepository: DepartamentRespository;
  let subprocessService: SubprocessServices;
  let departamentRepositorySpy: any;
  let processRepositorySpy: any;
  let processServiceSpy: any;
  let processSpy: any;
  let subprocessRepositorySpy: any;
  let subprocessRepository: any;

  beforeEach(() => {
    prismaClient = createMockContext().prisma;
    process = new Process();
    processRepository = new ProcessRepository(new PrismaClient());
    departamentRepository = new DepartamentRespository(new PrismaClient());
    subprocessRepository = new SubprocessRepository(new PrismaClient());
    Mockdate.set(new Date());
  });

  function subprocessServiceFactory() {
    return new SubprocessServices(
      process,
      departamentRepository,
      processRepository,
      subprocessRepository
    );
  }

  describe("createSubprocess", () => {
    it("should create a subprocess without subprocessId ", async () => {
      subprocessService = subprocessServiceFactory();

      departamentRepositorySpy = jest.spyOn(departamentRepository, "findOne");
      processRepositorySpy = jest.spyOn(processRepository, "findOne");
      jest
        .spyOn(process, "create")
        .mockReturnValueOnce({ isValid: false, error: TOO_MANY_CHARACTERS });

      await subprocessService.createSubprocess({
        name: faker.name.jobDescriptor(),
        responsables: [faker.name.firstName(), faker.name.firstName()],
        description: faker.name.jobArea(),
        departamentId: "6405ee50958ef4c30eb9d0a0"
      });

      expect(departamentRepositorySpy).not.toHaveBeenCalled();
      expect(processRepositorySpy).not.toHaveBeenCalled();
    });

    it("should create a subprocess with subprocess as null", async () => {
      subprocessService = subprocessServiceFactory();

      subprocessRepositorySpy = jest
        .spyOn(subprocessRepository, "create")
        .mockResolvedValueOnce(SUB_PROCESS);
      departamentRepositorySpy = jest
        .spyOn(departamentRepository, "findOne")
        .mockResolvedValueOnce(CREATE_DEPARTAMENT_RETURN_MOCK as any);
      processRepositorySpy = jest
        .spyOn(processRepository, "findOne")
        .mockResolvedValueOnce(PROCESS_CREATED_MOCK);

      const subprocessCreated = await subprocessService.createSubprocess({
        name: faker.name.jobDescriptor(),
        responsables: [faker.name.firstName(), faker.name.firstName()],
        description: faker.name.jobArea(),
        departamentId: "6405ee50958ef4c30eb9d0a0"
      });

      console.log(subprocessCreated);

      expect(departamentRepositorySpy).toHaveBeenCalled();
      expect(processRepositorySpy).toHaveBeenCalled();
      expect(subprocessRepositorySpy).toHaveBeenCalledWith({
        name: expect.any(String),
        responsables: expect.any(Array),
        description: expect.any(String),
        departamentId: expect.stringMatching(
          /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
        ),
        status: PROCESS_STATUS.pending,
        subprocessId: null
      });
    });

    it("should create a new subprocess with subrpocessId and call subprocessRepository", async () => {
      subprocessService = subprocessServiceFactory();

      subprocessRepositorySpy = jest
        .spyOn(subprocessRepository, "create")
        .mockResolvedValueOnce(SUB_PROCESS);
      departamentRepositorySpy = jest
        .spyOn(departamentRepository, "findOne")
        .mockResolvedValueOnce(CREATE_DEPARTAMENT_RETURN_MOCK as any);
      processRepositorySpy = jest
        .spyOn(processRepository, "findOne")
        .mockResolvedValueOnce(PROCESS_CREATED_MOCK);
      const findOneSubprocessSpy = jest
        .spyOn(subprocessRepository, "findOne")
        .mockResolvedValueOnce(CREATE_SUBPROCESS_MOCK as any);

      await subprocessService.createSubprocess({
        name: faker.name.jobDescriptor(),
        responsables: [faker.name.firstName(), faker.name.firstName()],
        description: faker.name.jobArea(),
        departamentId: "6405ee50958ef4c30eb9d0a0",
        subprocessId: new ObjectId().toString()
      });

      expect(findOneSubprocessSpy).toHaveBeenCalled();
      expect(departamentRepositorySpy).toHaveBeenCalled();
      expect(processRepositorySpy).toHaveBeenCalled();
      expect(subprocessRepositorySpy).toHaveBeenCalledWith({
        name: expect.any(String),
        responsables: expect.any(Array),
        description: expect.any(String),
        departamentId: expect.stringMatching(
          /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
        ),
        subprocessId: expect.stringMatching(
          /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
        ),
        status: PROCESS_STATUS.pending
      });
    });

    it("should return null if subprocessId weren't null and were not found", async () => {
      subprocessService = subprocessServiceFactory();

      subprocessRepositorySpy = jest
        .spyOn(subprocessRepository, "create")
        .mockResolvedValueOnce(SUB_PROCESS);
      departamentRepositorySpy = jest
        .spyOn(departamentRepository, "findOne")
        .mockResolvedValueOnce(CREATE_DEPARTAMENT_RETURN_MOCK as any);
      processRepositorySpy = jest
        .spyOn(processRepository, "findOne")
        .mockResolvedValueOnce(PROCESS_CREATED_MOCK);
      const findOneSubprocessSpy = jest
        .spyOn(subprocessRepository, "findOne")
        .mockResolvedValueOnce(null);

      await subprocessService.createSubprocess({
        name: faker.name.jobDescriptor(),
        responsables: [faker.name.firstName(), faker.name.firstName()],
        description: faker.name.jobArea(),
        departamentId: "6405ee50958ef4c30eb9d0a0",
        subprocessId: new ObjectId().toString()
      });

      expect(findOneSubprocessSpy).toHaveBeenCalled();
      expect(departamentRepositorySpy).toHaveBeenCalled();
      expect(processRepositorySpy).toHaveBeenCalled();
      expect(subprocessRepositorySpy).not.toHaveBeenCalled();
    });
  });
});
