import { PrismaClient, Departament, Prisma } from "@prisma/client";
import { ObjectId } from "mongodb";
import { IDepartament, IDepartamentDto } from "../domain/interfaces/interfaces";
import {
  CREATE_DEPARTAMENT,
  DEPARTAMENT_UPDATED_RESPONSE,
  FIND_MANY_DEPARTMENT_MOCKS,
  INTERNAL_SERVER_ERROR_MESSAGE
} from "../config/mock/mocks";
import { IRepository } from "./interfaces/repository";
import { InternalServerErrorExpection } from "../../src/domain/error/erros";
import MockDate from "mockdate";

const prismaclient = new PrismaClient();

export class DepartamentRespository implements IRepository {
  constructor(private readonly client: PrismaClient) {}

  findOne(input: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async create({ chief, name, team }: IDepartament): Promise<Departament> {
    try {
      return this.client.departament.create({
        data: { id: new ObjectId().toString(), chief, name, team }
      });
    } catch (error: any) {
      throw new InternalServerErrorExpection(error.message, error);
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
    } catch (error: any) {
      throw new InternalServerErrorExpection(error.message, error);
    }
  }

  async findMany(): Promise<Departament[] | []> {
    try {
      return (await this.client.departament.findMany()).filter(
        (departament) => !departament.deletedAt
      );
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorExpection(error.message, error);
    }
  }
}

describe("DepartamentRepository", () => {
  let departamentSpy: any;

  beforeAll(() => {
    MockDate.set(new Date());
  });
  describe("create", () => {
    it("should call prisma client with correct params", async () => {
      departamentSpy = jest
        .spyOn(prismaclient.departament, "create")
        .mockResolvedValueOnce(null as any);

      const departament = new DepartamentRespository(prismaclient);
      await departament.create(CREATE_DEPARTAMENT);

      expect(departamentSpy).toHaveBeenCalledWith({
        data: {
          id: expect.stringMatching(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
          ...CREATE_DEPARTAMENT
        }
      });
    });

    it("should throw an error of prisma client were called with wrong params", async () => {
      jest
        .spyOn(prismaclient.departament, "create")
        .mockRejectedValueOnce(new Error(INTERNAL_SERVER_ERROR_MESSAGE));

      await expect(() =>
        new DepartamentRespository(prismaclient).create(CREATE_DEPARTAMENT)
      ).rejects.toThrow(
        new InternalServerErrorExpection(
          INTERNAL_SERVER_ERROR_MESSAGE,
          expect.anything()
        )
      );
    });
  });

  describe("update", () => {
    it("should call primsa client update with correct params", async () => {
      departamentSpy = jest
        .spyOn(prismaclient.departament, "update")
        .mockResolvedValueOnce(null as any);

      const departament = new DepartamentRespository(prismaclient);

      await departament.update(String(DEPARTAMENT_UPDATED_RESPONSE.id), {
        name: "financial"
      });

      expect(departamentSpy).toBeCalledWith({
        where: { id: String(DEPARTAMENT_UPDATED_RESPONSE.id) },
        data: {
          name: "financial",
          updatedAt: new Date()
        }
      });
    });

    it("should throw internal server error if prisma client throws", async () => {
      jest
        .spyOn(prismaclient.departament, "update")
        .mockRejectedValueOnce(new Error(INTERNAL_SERVER_ERROR_MESSAGE));

      await expect(() =>
        new DepartamentRespository(prismaclient).update(
          String(DEPARTAMENT_UPDATED_RESPONSE.id),
          {
            name: "financial"
          }
        )
      ).rejects.toThrowError(
        new InternalServerErrorExpection(
          INTERNAL_SERVER_ERROR_MESSAGE,
          expect.anything()
        )
      );
    });
  });

  describe("findMany", () => {
    // it("show throw if prisma client throws", async () => {
    //   jest
    //     .spyOn(prismaclient.departament, "findMany")
    //     .mockImplementationOnce(() =>new Error(INTERNAL_SERVER_ERROR_MESSAGE));

    //   await expect(() =>
    //     new DepartamentRespository(prismaclient).findMany()
    //   ).rejects.toThrow(
    //     new InternalServerErrorExpection(
    //       INTERNAL_SERVER_ERROR_MESSAGE,
    //       expect.anything()
    //     )
    //   );
    // });
    it("should return only departaments that has not deletedAt", async () => {
      jest
        .spyOn(prismaclient.departament, "findMany")
        .mockResolvedValueOnce(FIND_MANY_DEPARTMENT_MOCKS);

      const departaments = await new DepartamentRespository(
        prismaclient
      ).findMany();

      expect(departaments).toHaveLength(1);
    });

    it("should return an empty array if all elemets had deletedAt defined", async () => {
      jest.spyOn(prismaclient.departament, "findMany").mockResolvedValueOnce(
        FIND_MANY_DEPARTMENT_MOCKS.map((departament) => {
          return { ...departament, deletedAt: new Date() };
        })
      );

      const departaments = await new DepartamentRespository(
        prismaclient
      ).findMany();

      expect(!departaments.length).toBeTruthy();
    });
  });
});
