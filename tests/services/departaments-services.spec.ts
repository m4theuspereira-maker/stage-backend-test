import { PrismaClient } from "@prisma/client";
import { Departament } from "../../src/domain/departament";
import { IDepartament } from "../../src/domain/interfaces/interfaces";
import { DepartamentRespository } from "../../src/repositories/departament-repository";
import { InternalServerErrorExpection } from "../../src/domain/error/erros";

export class DepartamentService {
  constructor(
    private readonly departamentDomain: Departament,
    private readonly departamentRepository: DepartamentRespository
  ) {}

  async createdDepartament({ chief, name, team }: IDepartament) {
    try {
      const departament = this.departamentDomain.create(chief, name, team);

      return await this.departamentRepository.create(departament);
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

describe("DepartamentService", () => {
  let prismaClient: PrismaClient;

  beforeEach(() => {
    prismaClient = new PrismaClient();
  });

  const departamentServiceFactory = async (client: PrismaClient) => {
    return new DepartamentService(
      new Departament(),
      new DepartamentRespository(client)
    );
  };

  it("shoould return 2", async () => {
    await (
      await departamentServiceFactory(prismaClient)
    ).createdDepartament({
      chief: "JuBEleu",
      name: "H",
      team: ["Roberto", "Evandro", "carlos"]
    });

    expect(1 + 1).toBe(2);
  });
});
