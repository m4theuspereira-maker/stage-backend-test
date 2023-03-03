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

    it("shoud throw error too lower characters if name was short", () => {
      expect(() => departament.create("ema", "a", ["edmond", "bosco"])).toThrowError(
        TOO_LOWER_CHARACTERS
      );
    });

    it("should throw too many characters of name has more than 10 characters", () => {
      expect(() =>
        departament.create("ema", "super departament super idol", ["charles"])
      ).toThrowError(TOO_MANY_CHARACTERS);
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
        departament["validateName"]("super departament super idol")
      ).toEqual({
        isValid: false,
        error: TOO_MANY_CHARACTERS
      });
    });
  });
});
