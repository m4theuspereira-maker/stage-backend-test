import { Departament } from "../../src/domain/departament";
import { IDepartament } from "../../src/domain/interfaces/interfaces";

export class DepartamentService {
  constructor(private readonly departament: Departament) {}

  async createdDepartament({ chief, name, team }: IDepartament) {
    const departamentCreated = this.departament.create(chief, name, team);

    console.log(departamentCreated);
  }
}

describe("DepartamentService", () => {
  it("shoould return 2", () => {
    const aa = new DepartamentService(new Departament());

    aa.createdDepartament({
      chief: "JuBEleu",
      name: "JUrIdiC",
      team: ["Roberto", "Evandro", "carlos"]
    });

    expect(1 + 1).toBe(2);
  });
});
