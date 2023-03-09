import { PrismaClient } from "@prisma/client";
import { Process } from "../../src/domain/process";
import { ProcessRepository } from "../../src/repositories/process-repository";
import { Validators } from "../../src/utils/utils";
import { createMockContext } from "../config/client";
import Mockdate from "mockdate";
import { IDepartamentDto } from "../../src/domain/interfaces/interfaces";
import {
  CREATE_DEPARTAMENT_RETURN_MOCK,
  DEPARTAMENT_UPDATED_RESPONSE,
  PROCESS_WITH_SUBPROCESS,
  SUB_PROCESS
} from "../config/mock/mocks";
import { DepartamentRespository } from "../../src/repositories/departament-repository";
import { faker } from "@faker-js/faker";
import {
  PROCESS_STATUS,
  TOO_MANY_CHARACTERS
} from "../../src/domain/constants/constants";
import { ProcessService } from "../../src/services/process-service";
import { ObjectId } from "mongodb";
import { SubprocessRepository } from "../../src/repositories/subprocess-repository";

describe("ProcessService", () => {
  let prismaClient: PrismaClient;
  let validators: Validators;
  let process: Process;
  let processRepository: ProcessRepository;
  let departamentRepository: DepartamentRespository;
  let processService: ProcessService;
  let departamentRepositorySpy: any;
  let processRepositorySpy: any;
  let processServiceSpy: any;
  let processSpy: any;
  let subprocessRepository: any;

  beforeEach(() => {
    prismaClient = createMockContext().prisma;
    Mockdate.set(new Date());
  });

  describe("createProcess", () => {
    beforeEach(() => {
      process = new Process();
      processRepository = new ProcessRepository(prismaClient);
      departamentRepository = new DepartamentRespository(prismaClient);
      subprocessRepository = new SubprocessRepository(prismaClient);
      validators = new Validators();
    });

    it("should not call departament repository if process created was not valid", async () => {
      departamentRepositorySpy = jest.spyOn(departamentRepository, "findOne");
      jest
        .spyOn(process, "create")
        .mockReturnValueOnce({ isValid: false, error: TOO_MANY_CHARACTERS });

      processService = new ProcessService(
        process,
        processRepository,
        departamentRepository,
        subprocessRepository,
        validators
      );

      await processService.createProcess({
        name: faker.name.jobDescriptor(),
        responsables: [faker.name.firstName(), faker.name.firstName()],
        description: faker.name.jobArea(),
        departamentId: "6405ee50958ef4c30eb9d0a0"
      });

      expect(departamentRepositorySpy).not.toHaveBeenCalled();
    });

    it("should call departament repository with correct params if process was valid according domain", async () => {
      departamentRepositorySpy = jest
        .spyOn(departamentRepository, "findOne")
        .mockResolvedValue(null);
      processRepositorySpy = jest.spyOn(departamentRepository, "create");

      processService = new ProcessService(
        process,
        processRepository,
        departamentRepository,
        subprocessRepository,
        validators
      );

      await processService.createProcess({
        name: faker.name.jobDescriptor(),
        responsables: [faker.name.firstName(), faker.name.firstName()],
        description: faker.name.jobArea(),
        departamentId: "6405ee50958ef4c30eb9d0a0"
      });

      expect(departamentRepositorySpy).toHaveBeenCalledWith({
        id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      });
      expect(processRepositorySpy).not.toHaveBeenCalled();
    });

    it("should call process repository with correct params", async () => {
      departamentRepositorySpy = jest
        .spyOn(departamentRepository, "findOne")
        .mockResolvedValueOnce({
          ...DEPARTAMENT_UPDATED_RESPONSE
        } as unknown as IDepartamentDto);
      processRepositorySpy = jest
        .spyOn(processRepository, "create")
        .mockResolvedValueOnce(null as any);
      processSpy = jest.spyOn(process, "create");

      processService = new ProcessService(
        process,
        processRepository,
        departamentRepository,
        subprocessRepository,
        validators
      );

      await processService.createProcess({
        name: faker.name.jobDescriptor(),
        responsables: [faker.name.firstName(), faker.name.firstName()],
        description: faker.name.jobArea(),
        departamentId: "6405ee50958ef4c30eb9d0a0"
      });

      expect(processSpy).toHaveBeenCalledTimes(1);
      expect(departamentRepositorySpy).toHaveBeenCalledTimes(1);
      expect(processRepositorySpy).toHaveBeenCalledWith({
        name: expect.any(String),
        responsables: expect.any(Array),
        description: expect.any(String),
        departamentId: expect.stringMatching(
          /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
        ),
        status: PROCESS_STATUS.pending
      });
    });
  });

  describe("findOneProcess", () => {
    beforeEach(() => {
      process = new Process();
      processRepository = new ProcessRepository(prismaClient);
      departamentRepository = new DepartamentRespository(prismaClient);
      subprocessRepository = new SubprocessRepository(prismaClient);
      validators = new Validators();
    });
    it("should not call process repository if departament was not found and return null", async () => {
      jest.spyOn(departamentRepository, "findOne").mockResolvedValueOnce(null);

      processRepositorySpy = jest
        .spyOn(processRepository, "findOne")
        .mockResolvedValueOnce(null);

      processService = new ProcessService(
        process,
        processRepository,
        departamentRepository,
        subprocessRepository,
        validators
      );

      const processFound = await processService.findOneProcess(
        new ObjectId().toString(),
        new ObjectId().toString()
      );

      expect(processFound).toBeNull();
      expect(processRepositorySpy).not.toHaveBeenCalled();
    });

    it("should call process repository if ", async () => {
      jest
        .spyOn(departamentRepository, "findOne")
        .mockResolvedValueOnce(CREATE_DEPARTAMENT_RETURN_MOCK as any);

      processRepositorySpy = jest
        .spyOn(processRepository, "findOne")
        .mockResolvedValueOnce(null);

      processService = new ProcessService(
        process,
        processRepository,
        departamentRepository,
        subprocessRepository,
        validators
      );

      await processService.findOneProcess(
        new ObjectId().toString(),
        new ObjectId().toString()
      );

      expect(processRepositorySpy).toHaveBeenCalledWith({
        id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      });
    });
  });

  describe("updateProcess", () => {
    beforeEach(() => {
      process = new Process();
      processRepository = new ProcessRepository(prismaClient);
      departamentRepository = new DepartamentRespository(prismaClient);
      subprocessRepository = new SubprocessRepository(prismaClient);
      validators = new Validators();
    });

    it("should not call findProcess and update if departament werer not found", async () => {
      jest.spyOn(departamentRepository, "findOne").mockResolvedValueOnce(null);

      processRepositorySpy = jest.spyOn(processRepository, "update");

      processService = new ProcessService(
        process,
        processRepository,
        departamentRepository,
        subprocessRepository,
        validators
      );

      processServiceSpy = jest
        .spyOn(processService, "findOneProcess")
        .mockResolvedValueOnce(null);

      await processService.updateProcess(
        new ObjectId().toString(),
        new ObjectId().toString(),
        { name: "antedeguemon" }
      );

      expect(processServiceSpy).not.toHaveBeenCalled();
      expect(processRepositorySpy).not.toHaveBeenCalled();
    });

    it("should not call update if process was not found", async () => {
      jest
        .spyOn(departamentRepository, "findOne")
        .mockResolvedValueOnce(CREATE_DEPARTAMENT_RETURN_MOCK as any);

      processRepositorySpy = jest.spyOn(processRepository, "update");

      processService = new ProcessService(
        process,
        processRepository,
        departamentRepository,
        subprocessRepository,
        validators
      );

      processServiceSpy = jest
        .spyOn(processService, "findOneProcess")
        .mockResolvedValueOnce(null);

      await processService.updateProcess(
        new ObjectId().toString(),
        new ObjectId().toString(),
        { name: "antedeguemon" }
      );

      expect(processServiceSpy).toHaveBeenCalledTimes(1);
      expect(processRepositorySpy).not.toHaveBeenCalled();
    });

    it("should call update with correct params if departament and process were found", async () => {
      jest
        .spyOn(departamentRepository, "findOne")
        .mockResolvedValueOnce(CREATE_DEPARTAMENT_RETURN_MOCK as any);
      processRepositorySpy = jest
        .spyOn(processRepository, "update")
        .mockResolvedValueOnce(null as any);

      processService = new ProcessService(
        process,
        processRepository,
        departamentRepository,
        subprocessRepository,
        validators
      );

      processServiceSpy = jest
        .spyOn(processService, "findOneProcess")
        .mockResolvedValueOnce(PROCESS_WITH_SUBPROCESS);

      await processService.updateProcess(
        new ObjectId().toString(),
        new ObjectId().toString(),
        { name: "antedeguemon" }
      );

      expect(processServiceSpy).toHaveBeenCalledTimes(1);
      expect(processRepositorySpy).toHaveBeenCalledWith(
        expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
        { name: "antedeguemon" }
      );
    });
  });

  describe("deleteProcess", () => {
    beforeEach(() => {
      process = new Process();
      processRepository = new ProcessRepository(new PrismaClient());
      departamentRepository = new DepartamentRespository(prismaClient);
      subprocessRepository = new SubprocessRepository(new PrismaClient());
      validators = new Validators();
    });

    it("shoul not call subprocessRepository if process had not subprocess associated", async () => {
      processService = new ProcessService(
        process,
        processRepository,
        departamentRepository,
        subprocessRepository,
        validators
      );
      jest
        .spyOn(processService, "updateProcess")
        .mockResolvedValueOnce(null as any);
      jest.spyOn(subprocessRepository, "findMany").mockResolvedValueOnce([]);
      const subprocessRepositorySpy = jest
        .spyOn(subprocessRepository, "updateManyByProcessOrSubprocessId")
        .mockResolvedValueOnce({ count: null });

      await processService.deleteProcess(
        new ObjectId().toString(),
        new ObjectId().toString()
      );
      expect(subprocessRepositorySpy).not.toHaveBeenCalled();
    });

    it("should call subprocess if process had subprocess associated", async () => {
      processService = new ProcessService(
        process,
        processRepository,
        departamentRepository,
        subprocessRepository,
        validators
      );
      jest
        .spyOn(processService, "updateProcess")
        .mockResolvedValueOnce(null as any);
      jest
        .spyOn(subprocessRepository, "findMany")
        .mockResolvedValueOnce([SUB_PROCESS]);
      const subprocessRepositorySpy = jest
        .spyOn(subprocessRepository, "updateManyByProcessOrSubprocessId")
        .mockResolvedValueOnce({ count: 10 });

      await processService.deleteProcess(
        new ObjectId().toString(),
        new ObjectId().toString()
      );
      expect(subprocessRepositorySpy).toHaveBeenCalled();
    });
  });
});
