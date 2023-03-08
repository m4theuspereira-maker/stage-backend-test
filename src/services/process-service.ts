import { InternalServerErrorExpection } from "../domain/error/erros";
import {
  IParamValidated,
  IProcess,
  IProcessDto
} from "../domain/interfaces/interfaces";
import { Process } from "../domain/process";
import { DepartamentRespository } from "../repositories/departament-repository";
import { ProcessRepository } from "../repositories/process-repository";
import { Validators } from "../utils/utils";

export class ProcessService {
  constructor(
    private readonly process: Process,
    private readonly processRepository: ProcessRepository,
    private readonly departamentRepository: DepartamentRespository,
    private readonly validators: Validators
  ) {}

  async createProcess(process: IProcessDto): Promise<any> {
    try {
      const processCreated = this.process.create({
        name: process.name!,
        responsables: process.responsables!,
        description: process.description
      }) as IParamValidated;

      if (processCreated.error) {
        return processCreated as any;
      }

      const departamentFound = await this.departamentRepository.findOne({
        id: process.departamentId!
      });

      if (!departamentFound) {
        return { error: "Departament not found" };
      }

      return this.processRepository.create({
        departamentId: process.departamentId,
        ...processCreated
      }) as unknown as IProcess;
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }
}
