import {
  PROCESS_STATUS,
  TOO_LOWER_CHARACTERS,
  TOO_MANY_CHARACTERS
} from "./constants/constants";
import {
  InvalidProcessDescriptionLength,
  InvalidProcessNameExpection
} from "./error/erros";
import {
  IParamValidated,
  IProcess,
} from "./interfaces/interfaces";

export class Process {
  create({
    name,
    responsables,
    description = "",
    subprocess = []
  }: IProcess): IProcess {
    const isValidParam = this.validateDescription(description!);
    const isValidName = this.validateName(name!);

    if (!isValidParam.isValid) {
      throw new InvalidProcessDescriptionLength(isValidParam.error!);
    }

    if (!isValidName.isValid) {
      throw new InvalidProcessNameExpection(isValidName.error!);
    }

    if (subprocess.length) {
      subprocess.map(
        (subprocess) => (subprocess.status = PROCESS_STATUS.pending)
      );
    }

    return {
      status: PROCESS_STATUS.pending,
      name: name.toLocaleLowerCase().trim(),
      responsables: responsables.map((responsable) =>
        responsable.toLocaleLowerCase().trim()
      ),
      description: description,
      subprocess
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
