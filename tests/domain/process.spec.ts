import { Process } from "../../src/domain/process";
import {
  CREATE_PROCESS_WITHOUT_SUBPROCESS_AND_DESCRIPTION,
  CREATE_PROCESS_WITH_SUBPROCESS_AND_SUBPROCESS_WITH_DESCRIPTION,
  DESCRIPTION_WITH_EXCEDED_LENGTH
} from "../mock/mocks";
import { TOO_MANY_CHARACTERS } from "../../src/domain/constants/constants";

describe("process", () => {
  let process: Process;
  describe("create", () => {
    beforeAll(() => {
      process = new Process();
    });

    it("should create a new correct process with empty description and without required documentation", () => {
      expect(
        process.create(CREATE_PROCESS_WITHOUT_SUBPROCESS_AND_DESCRIPTION)
      ).toStrictEqual({
        status: "pending",
        name: "make new relatory",
        responsable: "jose",
        description: "",
        subprocess: []
      });
    });

    it("should return a process with required documentation and sub process", () => {
      const processCreated = process.create(
        CREATE_PROCESS_WITH_SUBPROCESS_AND_SUBPROCESS_WITH_DESCRIPTION
      );

      expect(processCreated).toEqual({
        status: "pending",
        name: "make new relatory",
        responsable: "jose",
        description: "",
        subprocess: expect.arrayContaining([
          {
            name: "get social security",
            responsable: "carlos",
            requiredDocumentation: ["calling protocol"],
            description:
              "call to social security and provide the protocol number",
            status: "pending"
          }
        ])
      });
    });

    it("should throw error if description length exceed 500 characters", () => {
      expect(() =>
        process.create({
          ...CREATE_PROCESS_WITHOUT_SUBPROCESS_AND_DESCRIPTION,
          description: DESCRIPTION_WITH_EXCEDED_LENGTH
        })
      ).toThrowError(TOO_MANY_CHARACTERS);
    });
  });
});
