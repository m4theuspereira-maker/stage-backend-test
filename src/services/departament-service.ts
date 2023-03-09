import { Departament } from "../domain/departament";
import {
  InternalServerErrorExpection
} from "../domain/error/erros";
import {
  IDepartament,
  IDepartamentDto,
  IParamValidated
} from "../domain/interfaces/interfaces";
import { DepartamentRespository } from "../repositories/departament-repository";
import { IFindOneDepartamentDto } from "../repositories/interfaces/repository";
import { ProcessRepository } from "../repositories/process-repository";

export class DepartamentService {
  constructor(
    private readonly departamentDomain: Departament,
    private readonly departamentRepository: DepartamentRespository,
    private readonly processRepository: ProcessRepository,
  ) {}

  async createdDepartament({
    chief,
    name,
    team
  }: IDepartament): Promise<IParamValidated | IDepartament> {
    try {
      let departamentValidated: IParamValidated | IDepartament;

      departamentValidated = this.departamentDomain.create(
        chief,
        name,
        team
      ) as IParamValidated;

      if (departamentValidated.error) {
        return departamentValidated;
      }

      return await this.departamentRepository.create(
        departamentValidated as unknown as IDepartament
      );
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async findDepartament(
    departamentDto: IFindOneDepartamentDto
  ): Promise<IDepartamentDto | null> {
    try {
      const departamentFound = await this.departamentRepository.findOne(
        departamentDto
      );

      if (!departamentFound) {
        return null;
      }

      return departamentFound;
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async updateDepartament(
    id: string,
    updatePayload: IDepartamentDto
  ): Promise<IDepartament | null> {
    try {
      const departmentNotFound = (await this.findDepartament({ id })) as any;

      if (!departmentNotFound) {
        return null;
      }

      return await this.departamentRepository.update(id, updatePayload);
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async findAllDepartaments() {
    try {
      return await this.departamentRepository.findMany();
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async deleteDepartament(id: string): Promise<void> {
    try {
      await this.updateDepartament(id, {
        deletedAt: new Date()
      });

      const hasDepartamentProcess =
        (await this.processRepository.findMany({ departamentId: id })).length >
        0;

      if (hasDepartamentProcess) {
        await this.processRepository.updateManyByDepartamentId(id, {
          deletedAt: new Date()
        });
      }
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }
}
