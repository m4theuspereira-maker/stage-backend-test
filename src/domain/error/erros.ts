import { INTERNAL_SERVER_ERROR_MESSAGE } from "../../../tests/config/mock/mocks";

export class InvalidDepartamentNameExeption implements Error {
  name: string;
  message: string;

  constructor(message: string) {
    this.name = "InvalidDepartamentNameExeption";
    this.message = message;
  }
}

export class InvalidProcessDescriptionLength implements Error {
  name: string;
  message: string;
  stack?: string | undefined;

  constructor(message: string) {
    this.name = "InvalidProcessDescriptionLength";
    this.message = message;
  }
}

export class InvalidProcessNameExpection implements Error {
  name: string;
  message: string;

  constructor(message: string) {
    this.name = "InvalidProcessNameExpection";
    this.message = message;
  }
}

export class InternalServerErrorExpection implements Error {
  name: string;
  message: string;

  constructor() {
    this.name = "InternalServerErrorExpection";
    this.message = INTERNAL_SERVER_ERROR_MESSAGE;
  }
}


export const DEPARTAMENT_NOT_FOUND_ERROR = "Departament not found"
export const PROCESS_NOT_FOUND_ERROR = "Process not found"