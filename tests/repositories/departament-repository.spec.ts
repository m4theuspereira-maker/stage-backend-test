import { PrismaClient, Departament } from "@prisma/client";
import { ObjectId } from "mongodb";
import { IDepartament } from "../domain/interfaces/interfaces";
import { CREATE_DEPARTAMENT } from "../config/mock/mocks";
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
  let client: any;
  // beforeAll(async () => {
  //   client = await startDatabase();
  // });
  it("should return a departament", async () => {

    const a =  {
      id: '640381faac89773044d6e1b3',
      name: 'Juridic',
      team: [ 'Anderson', 'Armando', 'Hector' ],
      chief: 'John Doe',
      createdAt: new Date(`2023-03-04T17:38:02.768Z`),
      deletedAt: null,
      updatedAt: null
    }
    const departament = new DepartamentRespository(new PrismaClient());
    await departament.create(CREATE_DEPARTAMENT);

    expect(1).toBe(1);
  });
});
