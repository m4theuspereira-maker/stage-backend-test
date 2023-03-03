import { PROCESS_STATUS, TOO_MANY_CHARACTERS } from "./constants/constants";
import { InvalidProcessDescriptionLength } from "./error/erros";
import {
  IParamValidated,
  IProcess,
  IProcessDto
} from "./interfaces/interfaces";

export class Process {
  create({
    name,
    responsable,
    description = "",
    subprocess = []
  }: IProcessDto): IProcess {
    const isValidParam = this.validateDescription(description!);

    if (!isValidParam.isValid) {
      throw new InvalidProcessDescriptionLength(isValidParam.error!);
    }

    if (subprocess.length) {
      subprocess.map(
        (subprocess) => (subprocess.status = PROCESS_STATUS.pending)
      );
    }

    return {
      status: PROCESS_STATUS.pending,
      name: name.toLocaleLowerCase().trim(),
      responsable: responsable.toLocaleLowerCase().trim(),
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
}
