import { Prisma, PrismaClient, Subprocess } from "@prisma/client";
import { ObjectId } from "mongodb";
import { IRepository } from "../../src/repositories/interfaces/repository";
import { InternalServerErrorExpection } from "../../src/domain/error/erros";
import { ISubprocess } from "../domain/interfaces/interfaces";

export class SubprocessRepository implements IRepository {
  constructor(private readonly client: PrismaClient) {}

  create(input: ISubprocess): Promise<Subprocess> {
    try {
      return this.client.subprocess.create({
        data: {
          id: new ObjectId().toString(),
          ...input,
          deletedAt: null
        } as Prisma.SubprocessUncheckedCreateInput
      });
    } catch (error: any) {
      throw new InternalServerErrorExpection(error.message, error);
    }
  }
  update(id: string, updatePlayload: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  findMany(): Promise<any> {
    throw new Error("Method not implemented.");
  }
  findOne(input: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

describe("SubprocessRepository", () => {
  const prismaClient = new PrismaClient();

  describe("create", () => {
    it("should call create prismaClient with correct params", async () => {
      jest
        .spyOn(prismaClient.departament, "create")
        .mockResolvedValueOnce(null as any);
      const subprocessRepository = new SubprocessRepository(prismaClient);

      const subprocessCreated = await subprocessRepository.create({
        name: "get documents to authentication",
        responsables: ["carlos", "romero"],
        description: "it needs to be done as soon as possible",
        departamentId: "6405ee50958ef4c30eb9d0a0",
        processId: "640634318365384217b89203",
        status: "doing"
      });

      console.log(subprocessCreated);

      expect(1).toBe(1);
    });
  });
});
