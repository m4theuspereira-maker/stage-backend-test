import { Process } from "../../src/domain/process";
import {
  CREATE_PROCESS_WITHOUT_SUBPROCESS_AND_DESCRIPTION,
  CREATE_PROCESS_WITH_SUBPROCESS_AND_SUBPROCESS_WITH_DESCRIPTION,
  DESCRIPTION_WITH_EXCEDED_LENGTH
} from "../config/mock/mocks";
import {
  TOO_LOWER_CHARACTERS,
  TOO_MANY_CHARACTERS
} from "../../src/domain/constants/constants";
import { InvalidProcessNameExpection } from "../../src/domain/error/erros";

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
        responsables: ["jose"],
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
        responsables: ["jose"],
        description: "",
        subprocess: expect.arrayContaining([
          {
            name: "get social security",
            requiredDocumentation: ["calling protocol"],
            description:
              "call to social security and provide the protocol number",
            status: "pending",
            responsables: ["carlos", "romero"]
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

    it("should throw to invalid name expection if name were short", () => {
      expect(() =>
        process.create({
          ...CREATE_PROCESS_WITHOUT_SUBPROCESS_AND_DESCRIPTION,
          name: "inv"
        })
      ).toThrow(new InvalidProcessNameExpection(TOO_LOWER_CHARACTERS));
    });
  });

  describe("validateDescription", () => {
    beforeAll(() => {
      process = new Process();
    });

    it("should return error message if description exceed 500 characters", () => {
      const processValidated = process["validateDescription"](
        DESCRIPTION_WITH_EXCEDED_LENGTH
      );

      expect(processValidated).toStrictEqual({
        isValid: false,
        error: TOO_MANY_CHARACTERS
      });
    });

    it("should return isValid as true if description was valid", () => {
      const processValidated =
        process["validateDescription"]("valid description");

      expect(processValidated.isValid).toBeTruthy();
    });
  });

  describe("validateName", () => {
    beforeAll(() => {
      process = new Process();
    });

    it("should return too lower characters message if the name was invalid", () => {
      const invalidProcessName = process["validateName"]("inv");

      expect(invalidProcessName).toStrictEqual({
        isValid: false,
        error: TOO_LOWER_CHARACTERS
      });
    });

    it("should return too lower characters message if the name was invalid", () => {
      const invalidProcessName = process["validateName"](
        "invaaaliiidddddddd naammmeeeee proceeeeeeessssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss"
      );

      expect(invalidProcessName).toStrictEqual({
        isValid: false,
        error: TOO_MANY_CHARACTERS
      });
    });

    it("should return isValid as true if the name format as valid", () => {
      const invalidProcessName = process["validateName"]("valid name");

      expect(invalidProcessName.isValid).toBeTruthy();
    });
  });
});
