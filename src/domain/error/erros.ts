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

  constructor(message: string, stack: any) {
    this.name = "InternalServerErrorExpection";
    this.message = message;

    console.log(stack);
  }
}
