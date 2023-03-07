import { Prisma, PrismaClient, Process } from "@prisma/client";
import { ObjectId } from "mongodb";
import { InternalServerErrorExpection } from "../domain/error/erros";
import { IProcessDto } from "../domain/interfaces/interfaces";
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
    } catch (error: any) {
      throw new InternalServerErrorExpection(error.message, error);
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
    } catch (error: any) {
      throw new InternalServerErrorExpection(error.message, error);
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
    } catch (error: any) {
      throw new InternalServerErrorExpection(error.message, error);
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
    } catch (error: any) {
      throw new InternalServerErrorExpection(error.message, error);
    }
  }

  findMany(input?: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
