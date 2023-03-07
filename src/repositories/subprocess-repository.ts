import { Prisma, PrismaClient, Subprocess } from "@prisma/client";
import { ObjectId } from "mongodb";
import { InternalServerErrorExpection } from "../domain/error/erros";
import { ISubprocess } from "../domain/interfaces/interfaces";
import { IRepository } from "./interfaces/repository";

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
      } catch (error: any) {
        throw new InternalServerErrorExpection(error.message, error);
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
      } catch (error: any) {
        throw new InternalServerErrorExpection(error.message, error);
      }
    }
  
    async findMany(input: ISubprocess): Promise<Subprocess[] | []> {
      try {
        return this.client.subprocess.findMany({
          where: { ...input, deletedAt: null } as Prisma.SubprocessWhereInput
        });
      } catch (error: any) {
        throw new InternalServerErrorExpection(error.message, error);
      }
    }
    findOne(input: ISubprocess): Promise<Subprocess | null> {
      try {
        return this.client.subprocess.findFirst({
          where: { ...input, deletedAt: null } as Prisma.SubprocessWhereInput
        });
      } catch (error: any) {
        throw new InternalServerErrorExpection(error.message, error);
      }
    }
  }