import { IParamValidated, ISubprocess } from "../domain/interfaces/interfaces";
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
  }
}
