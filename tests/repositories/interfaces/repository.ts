export interface IRepository {
  create(input: any): Promise<any>;

  update(id: string, updatePlayload: any): Promise<any>;

  findMany(): Promise<any>;

  findOne(input: any): Promise<any>;
}
