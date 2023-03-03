import {
  TOO_LOWER_CHARACTERS,
  TOO_MANY_CHARACTERS
} from "./constants/constants";
import { InvalidDepartamentNameExeption } from "./error/erros";
import { IDepartament, IParamValidated } from "./interfaces/interfaces";

export class Departament {
  create(chief: string, name: string, team: string[]): IDepartament {
    const nameValidated = this.validateName(name);

    if (!nameValidated.isValid) {
      throw new InvalidDepartamentNameExeption(nameValidated.error!);
    }

    return {
      chief: chief.toLocaleLowerCase().trim(),
      name: name.toLocaleLowerCase().trim(),
      team: team.map((member) => member.toLocaleLowerCase().trim())
    };
  }

  private validateName(name: string): IParamValidated {
    if (name.length > 30) {
      return { isValid: false, error: TOO_MANY_CHARACTERS };
    }

    if (name.length < 2) {
      return { isValid: false, error: TOO_LOWER_CHARACTERS };
    }

    return { isValid: true };
  }
}
