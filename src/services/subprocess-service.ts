import { InternalServerErrorExpection } from "../domain/error/erros";
import {
  IParamValidated,
  IProcessDto,
  ISubprocess
} from "../domain/interfaces/interfaces";
import { Process } from "../domain/process";
import { DepartamentRespository } from "../repositories/departament-repository";
import { ProcessRepository } from "../repositories/process-repository";
import { SubprocessRepository } from "../repositories/subprocess-repository";

export class SubprocessServices {
  constructor(
    private readonly process: Process,
    private readonly departamentRepository: DepartamentRespository,
    private readonly processRepository: ProcessRepository,
    private readonly subprocessRepository: SubprocessRepository
  ) {}

  async createSubprocess(subprocessDto: ISubprocess) {
    try {
      const subprocessCreated = this.process.create({
        name: subprocessDto.name!,
        responsables: subprocessDto.responsables!,
        description: subprocessDto.description
      }) as IParamValidated;

      if (subprocessCreated.error) {
        return subprocessCreated as any;
      }

      const hasProcessPromise = this.processRepository.findOne({
        id: subprocessDto.processId,
        departamentId: subprocessDto.departamentId
      });
      const hasDepartamentPromise = this.departamentRepository.findOne({
        id: subprocessDto.departamentId
      });

      const [hasProcess, hasDepartament] = await Promise.all([
        hasProcessPromise,
        hasDepartamentPromise
      ]);

      const hasProcessAndDepartament = hasDepartament && hasProcess;

      if (!hasProcessAndDepartament) {
        return null;
      }

      if (subprocessDto.subprocessId) {
        const hasSubprocess = await this.subprocessRepository.findOne({
          id: subprocessDto.subprocessId
        });

        if (!hasSubprocess) {
          return null;
        }
      }

      return await this.subprocessRepository.create({
        departamentId: subprocessDto.departamentId,
        subprocessId: subprocessDto.subprocessId ?? null!,
        processId: subprocessDto.processId,
        ...subprocessCreated
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async findOneSubprocess(
    id: string,
    processId: string,
    departamentId: string,
    subprocessId?: string
  ) {
    try {
      const departamentPromise = this.departamentRepository.findOne({
        id: departamentId
      });

      const processPromise = this.processRepository.findOne({
        id: processId,
        departamentId
      });

      const [processFound, departamentFound] = await Promise.all([
        processPromise,
        departamentPromise
      ]);

      if (!processFound || !departamentFound) {
        return null;
      }

      const subprocessFound = await this.subprocessRepository.findOne({
        id,
        processId,
        departamentId,
        subprocessId
      });

      if (!subprocessFound) {
        return null;
      }

      const subprocessAssocieated = await this.subprocessRepository.findMany({
        subprocessId: id
      });

      return { ...subprocessFound, Subprocess: subprocessAssocieated ?? [] };
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async updateSubprocess(
    id: string,
    processId: string,
    depatamentId: string,
    updatePayload: ISubprocess
  ) {
    try {
      const subprocessFound = await this.findOneSubprocess(
        id,
        processId,
        depatamentId
      );

      if (!subprocessFound) {
        return null;
      }

      return await this.subprocessRepository.update(id, updatePayload);
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async deleteSubprocess(id: string): Promise<void> {
    const findOneSubprocess = await this.subprocessRepository.findOne({ id });

    if (findOneSubprocess) {
      await this.subprocessRepository.update(id, { deletedAt: new Date() });
    }

    const subprocessFound =
      (await this.subprocessRepository.findMany({ subprocessId: id })).length >
      0;

    if (subprocessFound) {
      await this.subprocessRepository.updateManyByProcessOrSubprocessId(
        { subprocessId: id },
        { deletedAt: new Date() }
      );
    }
  }
}
