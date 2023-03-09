import {
  PROCESS_STATUS,
  TOO_LOWER_CHARACTERS,
  TOO_MANY_CHARACTERS
} from "./constants/constants";
import { IParamValidated, IProcess } from "./interfaces/interfaces";

export class Process {
  create({
    name,
    responsables,
    description = ""
  }: IProcess): IProcess | IParamValidated {
    const isValidParam = this.validateDescription(description!);
    const isValidName = this.validateName(name!);

    if (!isValidParam.isValid) {
      return isValidParam;
    }

    if (!isValidName.isValid) {
      return isValidName;
    }

    return {
      status: PROCESS_STATUS.pending,
      name: name.toLocaleLowerCase().trim(),
      responsables: responsables.map((responsable) =>
        responsable.toLocaleLowerCase().trim()
      ),
      description: description
    };
  }

  private validateDescription(description: string): IParamValidated {
    if (description.length > 500) {
      return { isValid: false, error: TOO_MANY_CHARACTERS };
    }

    return { isValid: true };
  }

  private validateName(name: string): IParamValidated {
    if (name.length > 30) {
      return { isValid: false, error: TOO_MANY_CHARACTERS };
    }

    if (name.length < 5) {
      return { isValid: false, error: TOO_LOWER_CHARACTERS };
    }

    return { isValid: true };
  }
}
