import { InternalServerErrorExpection } from "../domain/error/erros";
import {
  IParamValidated,
  IProcess,
  IProcessDto
} from "../domain/interfaces/interfaces";
import { Process } from "../domain/process";
import { DepartamentRespository } from "../repositories/departament-repository";
import { ProcessRepository } from "../repositories/process-repository";
import { SubprocessRepository } from "../repositories/subprocess-repository";
import { Validators } from "../utils/utils";

export class ProcessService {
  constructor(
    private readonly process: Process,
    private readonly processRepository: ProcessRepository,
    private readonly departamentRepository: DepartamentRespository,
    private readonly subprocessRepository: SubprocessRepository,
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
        return null;
      }

      return this.processRepository.create({
        departamentId: process.departamentId,
        ...processCreated
      }) as unknown as IProcess;
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async findOneProcess(id: string, departamentId: string) {
    try {
      const departamentFound = await this.departamentRepository.findOne({
        id: departamentId
      });

      if (!departamentFound) {
        return null;
      }

      return await this.processRepository.findOne({ id });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async updateProcess(
    id: string,
    departamentId: string,
    updatePayload: IProcessDto
  ) {
    try {
      const departamentFound = await this.departamentRepository.findOne({
        id: departamentId
      });

      if (!departamentFound) {
        return null;
      }

      const processFound = await this.findOneProcess(id, departamentId);

      if (!processFound) {
        return null;
      }

      return await this.processRepository.update(id, updatePayload);
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async deleteProcess(id: string, departamentId: string) {
    try {
      await this.updateProcess(id, departamentId, {
        deletedAt: new Date()
      });

      const hasSubprocessAssociated =
        (
          await this.subprocessRepository.findMany({
            processId: id,
            departamentId
          })
        ).length > 0;

      if (hasSubprocessAssociated) {
        await this.subprocessRepository.updateManyByProcessOrSubprocessId(
          { processId: id },
          { deletedAt: new Date() }
        );
      }
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }
}
