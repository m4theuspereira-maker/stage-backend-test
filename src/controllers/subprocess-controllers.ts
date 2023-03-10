import { Request, Response } from "express";
import {
  DEPARTAMENT_NOT_FOUND_ERROR,
  PROCESS_NOT_FOUND_ERROR
} from "../domain/error/erros";
import { SubprocessServices } from "../services/subprocess-service";
import { Validators } from "../utils/utils";
import {
  badrequestError,
  notFoundError,
  ok,
  responseError
} from "./adapters/handlers";

export class SubprocessController {
  constructor(
    private readonly subprocessService: SubprocessServices,
    private readonly validators: Validators
  ) {}

  createSubprocess = async (req: Request, res: Response) => {
    try {
      const { departamentId, processId } = req.params;

      [processId, departamentId].forEach((param) => {
        if (!this.validators.isValidObjectId(param)) {
          return badrequestError(res, param);
        }
      });

      const createSubprocessDto = req.body;

      const processCreated = await this.subprocessService.createSubprocess({
        ...createSubprocessDto,
        departamentId,
        processId
      });

      return res.json(processCreated);
    } catch (error) {
      return responseError(res, error);
    }
  };

  findSubprocess = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { processId, departamentId } = req.query as unknown as {
        processId: string;
        departamentId: string;
      };

      [id, processId, departamentId].forEach((param) => {
        if (!this.validators.isValidObjectId(param)) {
          return badrequestError(res, param);
        }
      });

      const processFound = await this.subprocessService.findOneSubprocess(
        id,
        processId as string,
        departamentId as string
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

  updateSubprocess = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { processId, departamentId } = req.query as unknown as {
        processId: string;
        departamentId: string;
      };

      [id, processId, departamentId].forEach((param) => {
        if (!this.validators.isValidObjectId(param)) {
          return badrequestError(res, param);
        }
      });

      const updatePayload = req.body;

      const subprocessUpdated = await this.subprocessService.updateSubprocess(
        id,
        processId as string,
        departamentId as string,
        updatePayload
      );

      if (!subprocessUpdated) {
        return notFoundError(
          res,
          `${DEPARTAMENT_NOT_FOUND_ERROR.toLocaleLowerCase()} or ${PROCESS_NOT_FOUND_ERROR.toLocaleLowerCase()}`
        );
      }

      return ok(res, subprocessUpdated);
    } catch (error) {
      return responseError(res, error);
    }
  };

  deleteSubprocess = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!this.validators.isValidObjectId(id)) {
        return badrequestError(res, id);
      }


      await this.subprocessService.deleteSubprocess(id);

      return ok(res, { message: "deleted with success" });
    } catch (error) {
      return responseError(res, error);
    }
  };

  findBySubprocessId = async (req: Request, res: Response) => {
    try {
      const { subprocessId } = req.params;

      if (!this.validators.isValidObjectId(subprocessId)) {
        return badrequestError(res, subprocessId);
      }

      const processFound = await this.subprocessService.findBySubprocessId(
        subprocessId
      );
      return ok(res, processFound);
    } catch (error) {
      return responseError(res, error);
    }
  };
}
