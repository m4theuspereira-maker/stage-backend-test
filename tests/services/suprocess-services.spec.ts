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
  PROCESS_WITH_SUBPROCESS,
  SUB_PROCESS
} from "../config/mock/mocks";
import { ObjectId } from "mongodb";

describe("SubprocessServices", () => {
  let prismaClient: PrismaClient;
  let process: Process;
  let processRepository: ProcessRepository;
  let departamentRepository: DepartamentRespository;
  let subprocessService: SubprocessServices;
  let departamentRepositorySpy: any;
  let processRepositorySpy: any;
  let subprocessRepositorySpy: any;
  let subprocessRepository: SubprocessRepository;

  beforeEach(() => {
    prismaClient = createMockContext().prisma;
    process = new Process();
    processRepository = new ProcessRepository(prismaClient);
    departamentRepository = new DepartamentRespository(prismaClient);
    subprocessRepository = new SubprocessRepository(prismaClient);
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
        .mockResolvedValueOnce(SUB_PROCESS as any);
      departamentRepositorySpy = jest
        .spyOn(departamentRepository, "findOne")
        .mockResolvedValueOnce(CREATE_DEPARTAMENT_RETURN_MOCK as any);
      processRepositorySpy = jest
        .spyOn(processRepository, "findOne")
        .mockResolvedValueOnce(PROCESS_CREATED_MOCK);

      await subprocessService.createSubprocess({
        name: faker.name.jobDescriptor(),
        responsables: [faker.name.firstName(), faker.name.firstName()],
        description: faker.name.jobArea(),
        departamentId: "6405ee50958ef4c30eb9d0a0"
      });

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
        .mockResolvedValueOnce(SUB_PROCESS as any);
      departamentRepositorySpy = jest
        .spyOn(departamentRepository, "findOne")
        .mockResolvedValueOnce(CREATE_DEPARTAMENT_RETURN_MOCK as any);
      processRepositorySpy = jest
        .spyOn(processRepository, "findOne")
        .mockResolvedValueOnce(PROCESS_CREATED_MOCK);
      jest
        .spyOn(subprocessRepository, "findOne")
        .mockResolvedValueOnce(CREATE_SUBPROCESS_MOCK as any);

      await subprocessService.createSubprocess({
        name: faker.name.jobDescriptor(),
        responsables: [faker.name.firstName(), faker.name.firstName()],
        description: faker.name.jobArea(),
        departamentId: "6405ee50958ef4c30eb9d0a0",
        subprocessId: new ObjectId().toString()
      });

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
        .mockResolvedValueOnce(SUB_PROCESS as any);
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

      expect(departamentRepositorySpy).toHaveBeenCalled();
      expect(processRepositorySpy).toHaveBeenCalled();
      expect(subprocessRepositorySpy).not.toHaveBeenCalled();
    });
  });

  describe("findOneSubprocess", () => {
    it("should return null if departament or process were not found", async () => {
      jest.spyOn(departamentRepository, "findOne").mockResolvedValueOnce(null);

      jest
        .spyOn(processRepository, "findOne")
        .mockResolvedValueOnce(PROCESS_WITH_SUBPROCESS);

      subprocessService = subprocessServiceFactory();

      const subprocessNotFound = await subprocessService.findOneSubprocess(
        new ObjectId().toString(),
        new ObjectId().toString(),
        new ObjectId().toString()
      );

      expect(subprocessNotFound).toBeNull();
    });

    it("should call findOne departament and process were found", async () => {
      jest
        .spyOn(departamentRepository, "findOne")
        .mockResolvedValueOnce(CREATE_DEPARTAMENT_RETURN_MOCK as any);

      jest
        .spyOn(processRepository, "findOne")
        .mockResolvedValueOnce(PROCESS_WITH_SUBPROCESS);

      subprocessRepositorySpy = jest
        .spyOn(subprocessRepository, "findOne")
        .mockResolvedValueOnce(null);

      subprocessService = subprocessServiceFactory();

      await subprocessService.findOneSubprocess(
        new ObjectId().toString(),
        new ObjectId().toString(),
        new ObjectId().toString()
      );

      expect(subprocessRepositorySpy).toHaveBeenCalledWith({
        id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
        processId: expect.stringMatching(
          /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
        ),
        departamentId: expect.stringMatching(
          /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
        )
      });
    });
  });

  describe("updateSubprocess", () => {
    it("should not call subprocessRepository process or departament were not found", async () => {
      subprocessService = subprocessServiceFactory();

      subprocessRepositorySpy = jest.spyOn(subprocessRepository, "update");
      jest
        .spyOn(subprocessService, "findOneSubprocess")
        .mockResolvedValueOnce(null);

      await subprocessService.updateSubprocess(
        new ObjectId().toString(),
        new ObjectId().toString(),
        new ObjectId().toString(),
        {
          name: "antedeguemon"
        }
      );

      expect(subprocessRepositorySpy).not.toHaveBeenCalled();
    });

    it("should not call subprocessRepository process or departament were not found", async () => {
      subprocessService = subprocessServiceFactory();

      subprocessRepositorySpy = jest
        .spyOn(subprocessRepository, "update")
        .mockResolvedValueOnce(null as any);

      jest
        .spyOn(subprocessService, "findOneSubprocess")
        .mockResolvedValueOnce(CREATE_SUBPROCESS_MOCK as any);

      await subprocessService.updateSubprocess(
        "6407832ab70cdc8dfb6f01f7",
        "640633ae24a1029226009769",
        "6405ee50958ef4c30eb9d0a0",
        {
          name: "antedeguemon",
          description: "miseraaaaaa"
        }
      );

      expect(subprocessRepositorySpy).toHaveBeenCalledWith(
        "6407832ab70cdc8dfb6f01f7",
        {
          name: "antedeguemon",
          description: "miseraaaaaa"
        }
      );
    });
  });

  describe("deleteSubprocess", () => {
    it("should not call update subprocess if it were not found", async () => {
      subprocessService = subprocessServiceFactory();

      jest.spyOn(subprocessRepository, "findOne").mockResolvedValueOnce(null);

      subprocessRepositorySpy = jest.spyOn(subprocessRepository, "update");
      jest.spyOn(subprocessRepository, "findMany").mockResolvedValueOnce([]);

      await subprocessService.deleteSubprocess("640633ae24a1029226009769");

      expect(subprocessRepositorySpy).not.toHaveBeenCalled();
    });

    it("should not call find many subprocess if it the subprocess hadn't subprocess associated", async () => {
      subprocessService = subprocessServiceFactory();

      jest
        .spyOn(subprocessRepository, "findOne")
        .mockResolvedValueOnce(SUB_PROCESS as any);

      jest.spyOn(subprocessRepository, "findMany").mockResolvedValueOnce([]);
      const updateManySpy = jest.spyOn(
        processRepository,
        "updateManyByDepartamentId"
      );
      subprocessRepositorySpy = jest
        .spyOn(subprocessRepository, "update")
        .mockResolvedValueOnce(null as any);

      await subprocessService.deleteSubprocess("640633ae24a1029226009769");

      expect(subprocessRepositorySpy).toHaveBeenCalled();
      expect(updateManySpy).not.toHaveBeenCalled();
    });

    it("should not call find many subprocess if it the subprocess hadn't subprocess associated", async () => {
      subprocessService = subprocessServiceFactory();

      jest
        .spyOn(subprocessRepository, "findOne")
        .mockResolvedValueOnce(SUB_PROCESS as any);

      jest.spyOn(subprocessRepository, "findMany").mockResolvedValueOnce([]);
      const updateManySpy = jest.spyOn(
        subprocessRepository,
        "updateManyByProcessOrSubprocessId"
      );
      subprocessRepositorySpy = jest
        .spyOn(subprocessRepository, "update")
        .mockResolvedValueOnce(null as any);

      await subprocessService.deleteSubprocess("640633ae24a1029226009769");

      expect(subprocessRepositorySpy).toHaveBeenCalled();
      expect(updateManySpy).not.toHaveBeenCalled();
    });

    it("should all update and updateManyByDepartamentId if subprocess were found", async () => {
      subprocessService = subprocessServiceFactory();

      jest
        .spyOn(subprocessRepository, "findOne")
        .mockResolvedValueOnce(SUB_PROCESS as any);

      jest
        .spyOn(subprocessRepository, "findMany")
        .mockResolvedValueOnce(PROCESS_WITH_SUBPROCESS.Subprocess as any);
      const updateManySpy = jest
        .spyOn(subprocessRepository, "updateManyByProcessOrSubprocessId")
        .mockResolvedValueOnce({ count: 1 });
      subprocessRepositorySpy = jest
        .spyOn(subprocessRepository, "update")
        .mockResolvedValueOnce(null as any);

      await subprocessService.deleteSubprocess("640633ae24a1029226009769");

      expect(subprocessRepositorySpy).toHaveBeenCalled();
      expect(updateManySpy).toHaveBeenCalled();
    });
  });
});
