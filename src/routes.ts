import express, { Router } from "express";
import {
  departamentControllerFactory,
  processControllerFactory,
  subprocessControllerFactory
} from "./factories/factories";

const departamentController = departamentControllerFactory();
const processController = processControllerFactory();
const subprocessController = subprocessControllerFactory();
const routes = Router();

routes.use(express.json());
routes.use(express.urlencoded({ extended: true }));

routes.get("/departament/:id", departamentController.findDepartamentById);
routes.post("/departament", departamentController.createDepartament);
routes.get("/departament", departamentController.findAllDepartaments);
routes.put("/departament/:id", departamentController.updateDepartament);
routes.delete("/departament/:id", departamentController.deleteDepartament);

routes.get("/process/:departamentId/", processController.findProcessByStatus);
routes.put("/process/:id/:departamentId", processController.updateProcess);
routes.get("/process/:id/:departamentId", processController.findProcesById);
routes.delete("/process/:id/:departamentId", processController.deleteProcess);
routes.get(
  "/process/:id/:departamentId",
  processController.findByDepartamentId
);
routes.post("/process/:departamentId", processController.createProcess);

routes.post(
  "/subprocess/:processId/:departamentId",
  subprocessController.createSubprocess
);
routes.get(
  "/subprocess/:subprocessId",
  subprocessController.findBySubprocessId
);
routes.get("/subprocess/:id", subprocessController.findSubprocess);
routes.put("/subprocess/:id", subprocessController.updateSubprocess);
routes.delete("/subprocess/:id", subprocessController.deleteSubprocess);

export { routes };
