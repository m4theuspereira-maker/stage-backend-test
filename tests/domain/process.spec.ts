import { Process } from "../../src/domain/process";

describe("process", () => {
  let process: Process;
  describe("create", () => {
    beforeAll(() => {
      process = new Process();
    });

    it("should create", () => {
      expect(
        process.create({ name: "Make new relatory", responsable: "Jose" })
      ).toStrictEqual({
        status: "pending",
        name: "make new relatory",
        responsable: "jose",
        description: ""
      });
    });
  });
});
