export interface IDepartament {
  chief: string;
  name: string;
  team: string[];
  process?: IProcessDto[];
}

export interface IDepartamentDto {
  id?: string;
  chief?: string;
  name?: string;
  team?: string[];
  process?: IProcessDto[];
  deletedAt?: Date;
  updatedAt?: Date;
  createdAt?: Date;
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
  id?: string;
  requiredDocumentation?: string[];
  name?: string;
  responsables?: string[];
  description?: string;
  subprocess?: IProcess[];
  departamentId?: string;
  status?: string;
  deletedAt?: Date;
}

export interface IParamValidated {
  isValid: boolean;
  error?: string;
}

export interface ISubprocess extends IProcessDto {
  id?: string;
  processId?: string;
  subprocessId?: string;
  Subprocess?: [] | ISubprocess[] ;
}
