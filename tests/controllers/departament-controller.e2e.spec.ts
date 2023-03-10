import { server } from "../../src/index";
import supertest from "supertest";
import { client } from "../../src/config/client/client";
import Mockdate from "mockdate";
import {
  CREATE_DEPARTAMENT_RETURN_MOCK,
  DEPARTAMENT_WITH_PROCESS_MOCK,
  FIND_MANY_DEPARTMENT_MOCKS,
  RESPONSE_BODY_MOCK
} from "../config/mock/mocks";
describe("DepartamentController", () => {
  beforeEach(() => {
    Mockdate.set(new Date());
    jest.resetAllMocks();
  });

  afterAll(async () => {
    server.close();
    await client.$disconnect();
  });

  describe("createDepartament", () => {
    test(`
    should return a departament created if params were respected
    status:200
    POST route:/departament
    `, async () => {
      jest
        .spyOn(client.departament, "create")
        .mockResolvedValueOnce(RESPONSE_BODY_MOCK);

      const { status, body } = await supertest(server)
        .post("/departament")
        .send({
          name: "Anti Fraud",
          chief: "thomas",
          team: ["maria", "jose"]
        });
      expect({ status, body: body.body }).toStrictEqual({
        status: 200,
        body: {
          ...RESPONSE_BODY_MOCK,
          createdAt: expect.stringMatching(
            /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i
          )
        }
      });
    });

    test(`
    should return error if params were not respected
    status:400
    POST route:/departament
    `, async () => {
      jest
        .spyOn(client.departament, "create")
        .mockResolvedValueOnce(RESPONSE_BODY_MOCK);

      const { status, text } = await supertest(server)
        .post("/departament")
        .send({
          name: "a",
          chief: "thomas",
          team: ["maria", "jose"]
        });
      expect({ status, text }).toEqual(
        expect.objectContaining({
          status: 400,
          text: '{"error":"Invalid param too lower characters"}'
        })
      );
    });
  });

  describe("findAllDepartaments", () => {
    test(`
    should return all departaments
    status:200
    GET route:/departament
    `, async () => {
      jest
        .spyOn(client.departament, "findMany")
        .mockResolvedValueOnce(FIND_MANY_DEPARTMENT_MOCKS);

      const { body } = await supertest(server).get("/departament").send();
      expect({ ...body.body }).toEqual({
        data: expect.any(Array),
        count: expect.any(Number)
      });
    });
  });

  describe("findDepartamentById", () => {
    test(`
    should find departament in its process
    status:200
    GET route:/departament
    `, async () => {
      jest
        .spyOn(client.departament, "findFirst")
        .mockResolvedValueOnce(DEPARTAMENT_WITH_PROCESS_MOCK as any);

      const response = await supertest(server)
        .get("/departament/640a90c261cb3cbd7062e7f8")
        .send();

      expect({ status: response.status, body: response.body.body }).toEqual(
        expect.objectContaining({
          status: 200,
          body: DEPARTAMENT_WITH_PROCESS_MOCK
        })
      );
    });

    test(`
    should return not found error if departament were not found
    status:404
    GET route:/departament
    `, async () => {
      jest.spyOn(client.departament, "findFirst").mockResolvedValueOnce(null);

      const response = await supertest(server)
        .get("/departament/640a90c261cb3cbd7062e7f8")
        .send();

      expect({ status: response.status, text: response.text }).toEqual(
        expect.objectContaining({
          status: 404,
          text: '{"error":"Departament not found"}'
        })
      );
    });
  });

  describe("updateDepartament", () => {
    test(`
    should return error if departament were not found
    status:404
    PUT route:/departament/:id
    `, async () => {
      jest.spyOn(client.departament, "findFirst").mockResolvedValueOnce(null);

      const response = await supertest(server)
        .put("/departament/640a90c261cb3cbd7062e7f8")
        .send({ chief: "carlinhos" });

      expect({ status: response.status, text: response.text }).toEqual(
        expect.objectContaining({
          status: 404,
          text: '{"error":"Departament not found"}'
        })
      );
    });

    test(`
    should should return a departament updated
    status:200
    PUT route:/departament/:id
    `, async () => {
      jest
        .spyOn(client.departament, "findFirst")
        .mockResolvedValueOnce(CREATE_DEPARTAMENT_RETURN_MOCK as any);

      const { id, name, team, chief, createdAt } =
        CREATE_DEPARTAMENT_RETURN_MOCK;

      jest.spyOn(client.departament, "update").mockResolvedValueOnce({
        id,
        name,
        team,
        chief,
        createdAt,
        updatedAt: new Date()
      } as any);

      const response = await supertest(server)
        .put("/departament/640a90c261cb3cbd7062e7f8")
        .send({ chief: "carlos" });

      expect({ status: response.status, body: response.body.body }).toEqual({
        status: 200,
        body: {
          id,
          name,
          team,
          chief,
          createdAt: expect.stringMatching(
            /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i
          ),
          updatedAt: expect.stringMatching(
            /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i
          )
        }
      });
    });
  });

  describe("deleteDepartament", () => {
    test(`
    should return success message
    status:200
    DELETE route:/departament/:id
    `, async () => {
      jest
        .spyOn(client.departament, "update")
        .mockResolvedValueOnce(null as any);
      jest.spyOn(client.process, "findMany").mockResolvedValueOnce([]);

      const response = await supertest(server)
        .delete("/departament/640a90c261cb3cbd7062e7f8")
        .send();

      expect({ status: response.status, body: response.body.body }).toEqual(
        expect.objectContaining({
          status: 200,
          body: {
            message: "deleted with success"
          }
        })
      );
    });
  });
});
