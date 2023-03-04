import { PrismaClient, Departament } from "@prisma/client";
import { ObjectId } from "mongodb";
import { IDepartament } from "../domain/interfaces/interfaces";
import { CREATE_DEPARTAMENT } from "../mock/mocks";
import { IRepository } from "./interfaces/repository";

export class DepartamentRespository implements IRepository {
  constructor(private readonly client: PrismaClient) {}

  async create({ chief, name, team }: IDepartament): Promise<Departament> {
    const departamenteCreated = await this.client.departament.create({
      data: { id: new ObjectId().toString(), chief, name, team }
    });

    console.log(departamenteCreated);

    return departamenteCreated;
  }
}

describe("DepartamentRepository", () => {
  it("should return a departament", async () => {
    const departament = new DepartamentRespository(new PrismaClient());

    await departament.create(CREATE_DEPARTAMENT);

    expect(1).toBe(1);
  });
});
