import { Departament, Prisma, PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";
import { InternalServerErrorExpection } from "../domain/error/erros";
import {
  IDepartament,
  IDepartamentDto,
  IProcessDto
} from "../domain/interfaces/interfaces";
import { IFindOneDepartamentDto, IRepository } from "./interfaces/repository";

export class DepartamentRespository implements IRepository {
  constructor(private readonly client: PrismaClient) {}

  async create({ chief, name, team }: IDepartament): Promise<Departament> {
    try {
      return this.client.departament.create({
        data: {
          id: new ObjectId().toString(),
          chief,
          name,
          team,
          deletedAt: null
        }
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async update(
    id: string,
    updatePlayload: IDepartamentDto
  ): Promise<Departament> {
    try {
      delete updatePlayload.process;
      return this.client.departament.update({
        where: { id },
        data: {
          ...updatePlayload,
          updatedAt: new Date()
        } as Prisma.ProcessUncheckedUpdateInput
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async findMany(): Promise<Departament[] | []> {
    try {
      return (await this.client.departament.findMany()).filter(
        (departament) => !departament.deletedAt
      );
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async findOne(
    input: IFindOneDepartamentDto
  ): Promise<IDepartamentDto | null> {
    try {
      const departamentFound = (await this.client.departament.findFirst({
        where: {
          ...input,
          deletedAt: null
        },
        select: {
          id: true,
          name: true,
          chief: true,
          team: true,
          createdAt: true,
          process: true
        }
      })) as any;

      if (!departamentFound) {
        return departamentFound;
      }

      return {
        ...departamentFound,
        process: departamentFound.process.filter(
          (process: IProcessDto) => !process.deletedAt
        )
      };
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }
}
