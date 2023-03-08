import { Departament } from "../domain/departament";
import {
  DEPARTAMENT_NOT_FOUND_ERROR,
  InternalServerErrorExpection
} from "../domain/error/erros";
import {
  IDepartament,
  IDepartamentDto,
  IParamValidated
} from "../domain/interfaces/interfaces";
import { DepartamentRespository } from "../repositories/departament-repository";
import { IFindOneDepartamentDto } from "../repositories/interfaces/repository";

export class DepartamentService {
  constructor(
    private readonly departamentDomain: Departament,
    private readonly departamentRepository: DepartamentRespository
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
  ): Promise<IDepartamentDto | { error: string }> {
    try {
      const departamentFound = await this.departamentRepository.findOne(
        departamentDto
      );

      if (!departamentFound) {
        return { error: DEPARTAMENT_NOT_FOUND_ERROR };
      }

      return departamentFound;
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async updateDepartament(
    id: string,
    updatePayload: IDepartamentDto
  ): Promise<IDepartament> {
    try {
      return await this.departamentRepository.update(id, updatePayload);
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }
}
