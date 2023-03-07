import { Prisma, PrismaClient, Process } from "@prisma/client";
import { ObjectId } from "mongodb";
import { InternalServerErrorExpection } from "../domain/error/erros";
import { IProcessDto } from "../domain/interfaces/interfaces";
import { ICreateProcessDto, IRepository } from "./interfaces/repository";

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

  async findMany(): Promise<Process[] | []> {
    return (await this.client.process.findMany()).filter(
      (process) => !process.deletedAt
    );
  }
  findOne(input: IProcessDto): Promise<Process | null> {
    throw new Error("Method not implemented.");
  }
}
