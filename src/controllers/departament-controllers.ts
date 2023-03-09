import { IDepartament, IDepartamentDto } from "../domain/interfaces/interfaces";
import { DepartamentService } from "../services/departament-service";
import { Validators } from "../utils/utils";
import { Request, Response } from "express";
import { DEPARTAMENT_NOT_FOUND_ERROR } from "../domain/error/erros";

export class DepartamentController {
  constructor(
    private readonly departamentService: DepartamentService,
    private readonly _validators: Validators
  ) {}

  createDepartament = async (req: Request, res: Response) => {
    try {
      const { name, chief, team } = req.body as unknown as IDepartament;

      const departamentCreated =
        await this.departamentService.createdDepartament({ name, chief, team });

      return res.json(departamentCreated);
    } catch (error) {
      console.log(error);
    }
  };

  findAllDepartaments = async (req: Request, res: Response) => {
    try {
      const departamentsFound =
        await this.departamentService.findAllDepartaments();

      return res.json(departamentsFound);
    } catch (error) {
      console.log(error);
    }
  };

  findDepartamentById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const departamentFound = await this.departamentService.findDepartament({
        id
      });

      return departamentFound
        ? res.json(departamentFound)
        : res.status(404).json(DEPARTAMENT_NOT_FOUND_ERROR);
    } catch (error) {
      console.log(error);
    }
  };

  updateDepartament = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const departmentDto = req.body as unknown as IDepartamentDto;

      const departamentFound = await this.departamentService.updateDepartament(
        id,
        { ...departmentDto }
      );

      return departamentFound
        ? res.json(departamentFound)
        : res.status(404).json(DEPARTAMENT_NOT_FOUND_ERROR);
    } catch (error) {
      console.log(error);
    }
  };

  deleteDepartament = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const deleted = await this.departamentService.deleteDepartament(
        id
      );
      return deleted == null
        ? res.json(deleted)
        : res.status(404).json(DEPARTAMENT_NOT_FOUND_ERROR);
    } catch (error) {
      console.log(error);
    }
  };
}
