import { PrismaClient } from "@prisma/client";
import { DepartamentService } from "../../tests/services/departaments-services.spec";
import { Departament } from "../domain/departament";
import { DepartamentRespository } from "../repositories/departament-repository";

export const departamentServiceFactory = () =>
  new DepartamentService(
    new Departament(),
    new DepartamentRespository(new PrismaClient())
  );
