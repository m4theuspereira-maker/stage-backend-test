import {
  IDepartament,
  IDepartamentDto,
  IParamValidated
} from "../domain/interfaces/interfaces";
import { DepartamentService } from "../services/departament-service";
import { Validators } from "../utils/utils";
import { Request, Response } from "express";
import { DEPARTAMENT_NOT_FOUND_ERROR } from "../domain/error/erros";
import {
  badrequestError,
  notFoundError,
  ok,
  serverError
} from "./adapters/handlers";

export class DepartamentController {
  constructor(
    private readonly departamentService: DepartamentService,
    private readonly validators: Validators
  ) {}

  createDepartament = async (req: Request, res: Response) => {
    try {
      const { name, chief, team } = req.body as unknown as IDepartament;

      const departamentCreated =
        (await this.departamentService.createdDepartament({
          name,
          chief,
          team
        })) as IParamValidated;

      if (departamentCreated.error) {
        return badrequestError(res, departamentCreated.error);
      }

      return ok(res, departamentCreated);
    } catch (error) {
      return serverError(res, error);
    }
  };

  findAllDepartaments = async (_req: Request, res: Response) => {
    try {
      const departamentsFound =
        await this.departamentService.findAllDepartaments();

      return ok(res, departamentsFound);
    } catch (error) {
      return serverError(res, error);
    }
  };

  findDepartamentById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const departamentFound = await this.departamentService.findDepartament({
        id
      });

      return departamentFound
        ? ok(res, departamentFound)
        : notFoundError(res, DEPARTAMENT_NOT_FOUND_ERROR);
    } catch (error) {
      return serverError(res, error);
    }
  };

  updateDepartament = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!this.validators.isValidObjectId(id)) {
        return badrequestError(res, id);
      }

      const departmentDto = req.body as unknown as IDepartamentDto;

      const departamentFound = await this.departamentService.updateDepartament(
        id,
        { ...departmentDto }
      );

      return departamentFound
        ? ok(res, departamentFound)
        : notFoundError(res, DEPARTAMENT_NOT_FOUND_ERROR);
    } catch (error) {
      return serverError(res, error);
    }
  };

  deleteDepartament = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!this.validators.isValidObjectId(id)) {
        return badrequestError(res, id);
      }
      await this.departamentService.deleteDepartament(id);

      return ok(res, { message: "deleted with success" });
    } catch (error) {
      return serverError(res, error);
    }
  };
}
