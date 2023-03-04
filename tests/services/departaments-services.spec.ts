import { Departament } from "../../src/domain/departament";
import { IDepartament } from "../../src/domain/interfaces/interfaces";
import { Process as ProcessDomain } from "../domain/process";

export class DepartamentService {
  constructor(private readonly departamentDomain: Departament) {}

  async createdDepartament({ chief, name, team }: IDepartament) {
    try {
      const departamentCreated = this.departamentDomain.create(
        chief,
        name,
        team
      );

      console.log(departamentCreated);
    } catch (error) {
      console.log(error);
    }
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
