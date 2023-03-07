import { Prisma, PrismaClient, Subprocess } from "@prisma/client";
import { ObjectId } from "mongodb";
import { InternalServerErrorExpection } from "../domain/error/erros";
import { ISubprocess } from "../domain/interfaces/interfaces";
import { IRepository, IUpdatedManyCountDto } from "./interfaces/repository";

export class SubprocessRepository implements IRepository {
  constructor(private readonly client: PrismaClient) {}

  async create(input: ISubprocess): Promise<Subprocess> {
    try {
      return this.client.subprocess.create({
        data: {
          id: new ObjectId().toString(),
          ...input,
          createdAt: new Date(),
          deletedAt: null
        } as Prisma.SubprocessUncheckedCreateInput
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async update(id: string, updatePlayload: ISubprocess): Promise<Subprocess> {
    try {
      return this.client.subprocess.update({
        where: { id },
        data: {
          ...updatePlayload,
          updatedAt: new Date()
        } as Prisma.SubprocessUncheckedUpdateInput
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async findMany(input: ISubprocess): Promise<Subprocess[] | []> {
    try {
      return this.client.subprocess.findMany({
        where: { ...input, deletedAt: null } as Prisma.SubprocessWhereInput
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }
  findOne(input: ISubprocess): Promise<Subprocess | null> {
    try {
      return this.client.subprocess.findFirst({
        where: { ...input, deletedAt: null } as Prisma.SubprocessWhereInput
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }

  async updateManyByProcessOrSubprocessId(
    updateQuery: { processId?: string; subprocessId?: string },
    updatePayload: ISubprocess
  ): Promise<IUpdatedManyCountDto> {
    try {
      return this.client.subprocess.updateMany({
        where: { ...updateQuery },
        data: {
          ...updatePayload,
          updatedAt: new Date()
        } as Prisma.ProcessUncheckedUpdateManyInput
      });
    } catch (error) {
      throw new InternalServerErrorExpection();
    }
  }
}
