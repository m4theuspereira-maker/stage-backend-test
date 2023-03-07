import { Prisma } from "@prisma/client";
import { IProcessDto } from "../../domain/interfaces/interfaces";

export interface IRepository {
  create(input: any): Promise<any>;

  update(id: string, updatePlayload: any): Promise<any>;

  findMany(input?: any): Promise<any>;

  findOne(input: any): Promise<any>;
}

export interface IFindOneDepartamentDto {
  id?: string;
  chief?: string;
  name?: string;
  team?: Prisma.StringNullableListFilter;
}

export interface ICreateProcessDto extends IProcessDto {
  Subprocess?: Prisma.SubprocessUncheckedCreateNestedManyWithoutProcessInput;
}
