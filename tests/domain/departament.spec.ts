import { Departament } from "../../src/domain/departament";
import {
  TOO_LOWER_CHARACTERS,
  TOO_MANY_CHARACTERS
} from "../../src/domain/constants/constants";

describe("Departament", () => {
  let departament: Departament;

  describe("create", () => {
    beforeEach(() => {
      departament = new Departament();
    });

    it("shoud return error too lower characters if name was short", () => {
      const departamentValidated = departament.create("ema", "a", [
        "edmond",
        "bosco"
      ]) as any;

      expect(departamentValidated.error).toStrictEqual(TOO_LOWER_CHARACTERS);
    });

    it("should throw too many characters of name has more than 10 characters", () => {
      const departamentValidated = departament.create(
        "ema",
        `super departament super idol de xiàoróng
        dōu méi nǐ de tián bā yuè zhèngwǔ de yángguāng`,
        ["charles"]
      ) as any;

      expect(departamentValidated.error).toStrictEqual(TOO_MANY_CHARACTERS);
    });
  });

  describe("validateName", () => {
    beforeEach(() => {
      departament = new Departament();
    });
    it("should return false and error too lower characters name", () => {
      expect(departament["validateName"]("a")).toEqual({
        isValid: false,
        error: TOO_LOWER_CHARACTERS
      });
    });

    it("should return false and error too lower characters name", () => {
      expect(
        departament["validateName"](`super departament super idol de xiàoróng
        dōu méi nǐ de tián bā yuè zhèngwǔ de yángguāng`)
      ).toEqual({
        isValid: false,
        error: TOO_MANY_CHARACTERS
      });
    });
  });
});
