export interface IDepartament {
  cheif: string;
  name: string;
  team: Array<string>;
  process?: Array<IProcessDto>;
}

export interface IProcess {
  requiredDocumentation?: string[];
  name: string;
  responsables: string[];
  status?: string;
  description?: string;
  subprocess?: Array<IProcessDto>;
}

export interface IProcessDto {
  requiredDocumentation?: string[];
  name: string;
  responsables: string[];
  description?: string;
  subprocess?: Array<IProcess>;
}

export interface IParamValidated {
  isValid: boolean;
  error?: string;
}
