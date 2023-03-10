import { server } from "../../src/index";
import supertest from "supertest";
import { client } from "../../src/config/client/client";
import Mockdate from "mockdate";
import {
  DEPARTAMENT_WITH_PROCESS_MOCK,
  PROCESS_CREATED_MOCK
} from "../config/mock/mocks";

describe("ProcessController", () => {
  beforeEach(() => {
    Mockdate.set(new Date());
  });

  afterAll(async () => {
    server.close();
    await client.$disconnect();
  });

  describe("findManyProcessByStatus", () => {
    test(`
    should find many process by departamentId and status
    status:200
    GET route:/process/:departamentId
    `, async () => {
      jest
        .spyOn(client.process, "findMany")
        .mockResolvedValueOnce([PROCESS_CREATED_MOCK] as any);

      jest
        .spyOn(client.departament, "findFirst")
        .mockResolvedValueOnce(DEPARTAMENT_WITH_PROCESS_MOCK as any);

      const response = await supertest(server)
        .get("/process/640a90c261cb3cbd7062e7f8")
        .query({ status: "doing" });

      expect({
        status: response.status,
        body: response.body.body
      }).toStrictEqual({
        status: 200,
        body: {
          data: expect.any(Array),
          count: expect.any(Number)
        }
      });
    });
  });

  describe("findProcessById", () => {
    test(`
    should find a process by id and departamentId
    status:200
    GET route:/process/:departamentId
    `, async () => {
      jest.spyOn(client.process, "findFirst").mockResolvedValueOnce({
        ...PROCESS_CREATED_MOCK,
        Subprocess: [] as any
      });

      jest
        .spyOn(client.departament, "findFirst")
        .mockResolvedValueOnce(DEPARTAMENT_WITH_PROCESS_MOCK as any);

      const response = await supertest(server)
        .get("/process/640a90c261cb3cbd7062e7f8/640a90c261cb3cbd7062e7f0")
        .send();

      expect({
        status: response.status,
        body: response.body.body
      }).toStrictEqual({
        status: 200,
        body: {
          ...PROCESS_CREATED_MOCK,
          Subprocess: [],
          createdAt: expect.stringMatching(
            /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i
          )
        }
      });
    });

    test(`
    should  return not found error if departament or process was not found
    status:404
    GET route:/process/:departamentId
    `, async () => {
      jest.spyOn(client.process, "findFirst").mockResolvedValueOnce(null);

      jest
        .spyOn(client.departament, "findFirst")
        .mockResolvedValueOnce(DEPARTAMENT_WITH_PROCESS_MOCK as any);

      const response = await supertest(server)
        .get("/process/640a90c261cb3cbd7062e7f8/640a90c261cb3cbd7062e7f0")
        .send();

      expect({
        status: response.status,
        text: response.text
      }).toStrictEqual({
        status: 404,
        text: '{"error":"departament not found or process not found"}'
      });
    });
  });

  describe("findProcessByDepartamentId", () => {
    test(`
    should find many process by departamentId
    status:200
    GET route:/process/:departamentId
    `, async () => {
      jest
        .spyOn(client.process, "findMany")
        .mockResolvedValueOnce([PROCESS_CREATED_MOCK] as any);

      jest
        .spyOn(client.departament, "findFirst")
        .mockResolvedValueOnce(DEPARTAMENT_WITH_PROCESS_MOCK as any);

      const response = await supertest(server)
        .get("/process/640a90c261cb3cbd7062e7f8")
        .send();

      expect({
        status: response.status,
        body: response.body.body
      }).toStrictEqual({
        status: 200,
        body: {
          data: expect.any(Array),
          count: expect.any(Number)
        }
      });
    });
  });

  describe("createProcess", () => {
    test(`
    should create a process
    status:200
    POST route:/process/:departamentId
    `, async () => {
      jest
        .spyOn(client.process, "create")
        .mockResolvedValueOnce(PROCESS_CREATED_MOCK);

      jest
        .spyOn(client.departament, "findFirst")
        .mockResolvedValueOnce(DEPARTAMENT_WITH_PROCESS_MOCK as any);

      const response = await supertest(server)
        .post("/process/640a90c261cb3cbd7062e7f8")
        .send({
          name: "talk to witness",
          responsables: ["dilian"],
          description: "make calls "
        });

      expect({
        status: response.status,
        body: response.body.body
      }).toStrictEqual({
        status: 200,
        body: {
          ...PROCESS_CREATED_MOCK,
          createdAt: expect.stringMatching(
            /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i
          )
        }
      });
    });

    test(`
    should return not found error
    status:404
    POST route:/process/:departamentId
    `, async () => {
      jest
        .spyOn(client.process, "create")
        .mockResolvedValueOnce(PROCESS_CREATED_MOCK);

      jest.spyOn(client.departament, "findFirst").mockResolvedValueOnce(null);

      const response = await supertest(server)
        .post("/process/640a90c261cb3cbd7062e7f8")
        .send({
          name: "talk to witness",
          responsables: ["dilian"],
          description: "make calls "
        });

      expect({
        status: response.status,
        text: response.text
      }).toStrictEqual({
        status: 404,
        text: '{"error":"departament not found or process not found"}'
      });
    });

    test(`
    should should reutrn an error of param was invalid
    status:400
    POST route:/process/:departamentId
    `, async () => {
      jest
        .spyOn(client.process, "create")
        .mockResolvedValueOnce(PROCESS_CREATED_MOCK);

      jest.spyOn(client.departament, "findFirst").mockResolvedValueOnce(null);

      const response = await supertest(server)
        .post("/process/234567")
        .send({
          name: "talk to witness",
          responsables: ["dilian"],
          description: "make calls "
        });

      expect({
        status: response.status,
        text: response.text
      }).toStrictEqual({
        status: 400,
        text: '{"error":"Invalid param 234567"}'
      });
    });
  });
});
