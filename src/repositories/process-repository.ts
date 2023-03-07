import { Prisma, PrismaClient, Process } from "@prisma/client";
import { ObjectId } from "mongodb";
import { InternalServerErrorExpection } from "../domain/error/erros";
import { IProcessDto, ISubprocess } from "../domain/interfaces/interfaces";
import {
  ICreateProcessDto,
  IRepository,
  IUpdatedManyCountDto
} from "./interfaces/repository";

export class ProcessRepository implements IRepository {
  constructor(private readonly client: PrismaClient) {}

  async create(input: ICreateProcessDto): Promise<Process> {
    try {
      return this.client.process.create({
        data: {
          id: new ObjectId().toString(),
          ...input,
          deletedAt: null
        } as Prisma.ProcessCreateInput
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async update(id: string, updatePayload: IProcessDto): Promise<Process> {
    try {
      return this.client.process.update({
        where: { id },
        data: {
          ...updatePayload,
          updatedAt: new Date()
        } as Prisma.ProcessUncheckedUpdateInput
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  findOne(input: IProcessDto): Promise<Process | null> {
    try {
      return this.client.process.findFirst({
        where: { ...input, deletedAt: null } as Prisma.ProcessWhereInput,
        select: {
          id: true,
          name: true,
          status: true,
          requiredDocumentation: true,
          responsables: true,
          description: true,
          departamentId: true,
          processId: true,
          createdAt: true,
          Subprocess: true
        }
      }) as any;
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async updateManyByDepartamentId(
    departamentId: string,
    updatePayload: IProcessDto
  ): Promise<IUpdatedManyCountDto> {
    try {
      return this.client.process.updateMany({
        where: { departamentId },
        data: {
          ...updatePayload,
          updatedAt: new Date()
        } as Prisma.ProcessUncheckedUpdateManyInput
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  findMany(input: IProcessDto): Promise<Process[] | []> {
    try {
      return this.client.process.findMany({
        where: { ...input, deletedAt: null } as Prisma.SubprocessWhereInput
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }
}
