import { Request, Response } from "express";
import {
  DEPARTAMENT_NOT_FOUND_ERROR,
  PROCESS_NOT_FOUND_ERROR
} from "../domain/error/erros";
import { SubprocessServices } from "../services/subprocess-service";

export class SubprocessController {
  constructor(private readonly subprocessService: SubprocessServices) {}

  createSubprocess = async (req: Request, res: Response) => {
    try {
      const { departamentId, processId } = req.params;
      const createSubprocessDto = req.body;

      const processCreated = await this.subprocessService.createSubprocess({
        ...createSubprocessDto,
        departamentId,
        processId
      });

      return res.json(processCreated);
    } catch (error) {
      console.log(error);
    }
  };

  findSubprocess = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { processId, departamentId, subprocessId } = req.query;

      const processFound = await this.subprocessService.findOneSubprocess(
        id,
        processId as string,
        departamentId as string
      );

      return processFound != null
        ? res.json(processFound)
        : res
            .status(404)
            .json(
              `${DEPARTAMENT_NOT_FOUND_ERROR.toLocaleLowerCase()} or ${PROCESS_NOT_FOUND_ERROR.toLocaleLowerCase()}`
            );
    } catch (error) {
      console.log(error);
    }
  };

  updateSubprocess = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { processId, departamentId } = req.query;
      const updatePayload = req.body;

      const processFound = await this.subprocessService.updateSubprocess(
        id,
        processId as string,
        departamentId as string,
        updatePayload
      );

      return processFound != null
        ? res.json(processFound)
        : res
            .status(404)
            .json(
              `${DEPARTAMENT_NOT_FOUND_ERROR.toLocaleLowerCase()} or ${PROCESS_NOT_FOUND_ERROR.toLocaleLowerCase()}`
            );
    } catch (error) {
      console.log(error);
    }
  };

  deleteSubprocess = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const processFound = await this.subprocessService.deleteSubprocess(id);

      return processFound != null
        ? res.json(processFound)
        : res
            .status(404)
            .json(
              `${DEPARTAMENT_NOT_FOUND_ERROR.toLocaleLowerCase()} or ${PROCESS_NOT_FOUND_ERROR.toLocaleLowerCase()}`
            );
    } catch (error) {
      console.log(error);
    }
  };
}
