import { client } from "../client/client";
import { DepartamentController } from "../controllers/departament-controllers";
import { ProcessController } from "../controllers/process-controller";
import { SubprocessController } from "../controllers/subprocess-controllers";
import { Departament } from "../domain/departament";
import { Process } from "../domain/process";
import { DepartamentRespository } from "../repositories/departament-repository";
import { ProcessRepository } from "../repositories/process-repository";
import { SubprocessRepository } from "../repositories/subprocess-repository";
import { DepartamentService } from "../services/departament-service";
import { ProcessService } from "../services/process-service";
import { SubprocessServices } from "../services/subprocess-service";
import { Validators } from "../utils/utils";

export function departamentControllerFactory() {
  const departamentService = new DepartamentService(
    new Departament(),
    new DepartamentRespository(client),
    new ProcessRepository(client)
  );
  const departamentController = new DepartamentController(
    departamentService,
    new Validators()
  );
  return departamentController;
}

export function processControllerFactory() {
  const processService = new ProcessService(
    new Process(),
    new ProcessRepository(client),
    new DepartamentRespository(client),
    new SubprocessRepository(client)
  );

  const departamentController = new ProcessController(
    processService,
    new Validators()
  );

  return departamentController;
}

export function subprocessControllerFactory() {
  const subprocessService = new SubprocessServices(
    new Process(),
    new DepartamentRespository(client),
    new ProcessRepository(client),
    new SubprocessRepository(client)
  );

  const subprocessController = new SubprocessController(subprocessService);

  return subprocessController;
}
