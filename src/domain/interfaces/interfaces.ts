export interface IDepartament {
  chief: string;
  name: string;
  team: string[];
  process?: Array<IProcessDto>;
}

export interface IDepartamentDto {
  id?: string;
  chief?: string;
  name?: string;
  team?: string[];
  process?: Array<IProcessDto>;
}

export interface IProcess {
  requiredDocumentation?: string[];
  name: string;
  responsables: string[];
  status?: string;
  description?: string;
  subprocess?: IProcessDto[];
}

export interface IProcessDto {
  requiredDocumentation?: string[];
  name: string;
  responsables: string[];
  description?: string;
  subprocess?: IProcess[];
}

export interface IParamValidated {
  isValid: boolean;
  error?: string;
}
