export interface IDepartament {
  cheif: string;
  name: string;
  team: Array<string>;
  process?: Array<IProcess>;
}

export interface IProcess {
  requiredDocumentation?: string[];
  name: string;
  responsable: string;
  status: string;
  description?: string;
  subprocess?: Array<IProcess>;
}

export interface IProcessDto {
  requiredDocumentation?: string[];
  name: string;
  responsable: string;
  description?: string;
  subprocess?: Array<IProcess>;
}

export interface IParamValidated {
  isValid: boolean;
  error?: string;
}
