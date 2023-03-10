import { Request, Response } from "express";
import {
  DEPARTAMENT_NOT_FOUND_ERROR,
  PROCESS_NOT_FOUND_ERROR
} from "../domain/error/erros";
import { IProcessDto } from "../domain/interfaces/interfaces";
import { ProcessService } from "../services/process-service";
import { Validators } from "../utils/utils";
import {
  badrequestError,
  notFoundError,
  ok,
  responseError
} from "./adapters/handlers";

export class ProcessController {
  constructor(
    private readonly processService: ProcessService,
    private readonly validators: Validators
  ) {}

  createProcess = async (req: Request, res: Response) => {
    try {
      const { departamentId } = req.params;

      if (!this.validators.isValidObjectId(departamentId)) {
        return badrequestError(res, departamentId);
      }

      const { name, responsables, description } = req.body;

      const processCreated = await this.processService.createProcess({
        name,
        responsables,
        description,
        departamentId
      });

      if (!processCreated) {
        return notFoundError(
          res,
          `${DEPARTAMENT_NOT_FOUND_ERROR.toLocaleLowerCase()} or ${PROCESS_NOT_FOUND_ERROR.toLocaleLowerCase()}`
        );
      }

      return ok(res, processCreated);
    } catch (error) {
      return responseError(res, error);
    }
  };

  updateProcess = async (req: Request, res: Response) => {
    try {
      const { id, departamentId } = req.params;

      [id, departamentId].forEach((param) => {
        if (!this.validators.isValidObjectId(param)) {
          return badrequestError(res, param);
        }
      });

      const processUpdatePayload = req.body as unknown as IProcessDto;

      const processUpdated = await this.processService.updateProcess(
        id,
        departamentId,
        processUpdatePayload
      );

      if (!processUpdated) {
        return notFoundError(
          res,
          `${DEPARTAMENT_NOT_FOUND_ERROR.toLocaleLowerCase()} or ${PROCESS_NOT_FOUND_ERROR.toLocaleLowerCase()}`
        );
      }

      return ok(res, processUpdated);
    } catch (error) {
      return responseError(res, error);
    }
  };

  findProcesById = async (req: Request, res: Response) => {
    try {
      const { id, departamentId } = req.params;

      [id, departamentId].forEach((param) => {
        if (!this.validators.isValidObjectId(param)) {
          return badrequestError(res, param);
        }
      });

      const processFound = await this.processService.findOneProcess(
        id,
        departamentId
      );

      if (!processFound) {
        return notFoundError(
          res,
          `${DEPARTAMENT_NOT_FOUND_ERROR.toLocaleLowerCase()} or ${PROCESS_NOT_FOUND_ERROR.toLocaleLowerCase()}`
        );
      }

      return ok(res, processFound);
    } catch (error) {
      return responseError(res, error);
    }
  };

  findProcessByStatus = async (req: Request, res: Response) => {
    try {
      const { departamentId } = req.params;
      const { status } = req.query;

      if (!this.validators.isValidObjectId(departamentId)) {
        return badrequestError(res, departamentId);
      }

      const processFound = await this.processService.findManyProcessByStatus(
        departamentId,
        status as string
      );

      if (!processFound) {
        return notFoundError(
          res,
          `${DEPARTAMENT_NOT_FOUND_ERROR.toLocaleLowerCase()} or ${PROCESS_NOT_FOUND_ERROR.toLocaleLowerCase()}`
        );
      }

      return ok(res, processFound);
    } catch (error) {
      return responseError(res, error);
    }
  };

  deleteProcess = async (req: Request, res: Response) => {
    try {
      const { departamentId, id } = req.params;

      [id, departamentId].forEach((param) => {
        if (!this.validators.isValidObjectId(param)) {
          return badrequestError(res, param);
        }
      });

      await this.processService.deleteProcess(id, departamentId);

      return ok(res, { message: "deleted with success" });
    } catch (error) {
      return responseError(res, error);
    }
  };

  findByDepartamentId = async (req: Request, res: Response) => {
    try {
      const { departamentId } = req.params;
      const { status } = req.query;

      const processFound = await this.processService.findManyProcessByStatus(
        departamentId,
        status as string
      );

      if (!processFound) {
        return notFoundError(
          res,
          `${DEPARTAMENT_NOT_FOUND_ERROR.toLocaleLowerCase()} or ${PROCESS_NOT_FOUND_ERROR.toLocaleLowerCase()}`
        );
      }

      return ok(res, processFound);
    } catch (error) {
      return responseError(res, error);
    }
  };
}
