import { BR, CD, F1, F2, F3 } from "../types";
import { incBinary } from "../utils/incBinary";
import { MicroProgramLine } from "./MicroProgramLine";

/**
 * This class follows Singleton design patter
 */
export class MicroProgramMemory {
  private static _instance: MicroProgramMemory;
  private _SBR = "0000000";
  private _CAR = "0000000";
  private _instructions = "";
  private _content: MicroProgramLine[] = [];

  private constructor(instructions?: string) {
    if (instructions) this._instructions = instructions;
  }

  static create(instructions?: string) {
    if (!this._instance) {
      this._instance = new MicroProgramMemory(instructions);
    }

    return this._instance;
  }

  get instructions() {
    return this._instructions;
  }

  set instructions(instructions: string) {
    this._instructions = instructions;
  }

  get SBR() {
    return this._SBR;
  }

  set SBR(sbr: string) {
    if (sbr.length !== 7) throw new Error("Invalid SBR, SBR must be 7bit.");

    this._SBR = sbr;
  }

  get CAR() {
    return this._CAR;
  }

  set CAR(car: string) {
    if (car.length !== 7) throw new Error("Invalid CAR, CAR must be 7bit.");

    this._CAR = car;
  }

  get content() {
    return this._content;
  }

  load() {
    this._content = [];
    const lines = this._instructions.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      const microCodes = line.split(" ").filter((l) => !!l.trim());

      if (microCodes[0] === "ORG") {
        const orgOperand = +microCodes[1];

        if (isNaN(orgOperand)) throw new Error(`Invalid "ORG" operand`);

        if (orgOperand < 0)
          throw new Error(`"ORG" operand cannot be negative number.`);

        if (orgOperand < 64)
          throw new Error(`"ORG" operand must be greater that "64"`);

        this._CAR = orgOperand.toString(2);

        continue;
      }

      const pl = new MicroProgramLine();

      const withName = line.split(":").map((part) => part.trim());

      if (withName.length > 1) {
        pl.name = withName[0];
        microCodes.shift();
      }

      for (const microCode of microCodes) {
        if (microCode === "NEXT") {
          pl.ADDR = this._CAR;
          this._CAR = incBinary(this._CAR);

          continue;
        }

        const f1 = F1.find((f1) => f1 === microCode);
        const f2 = F2.find((f2) => f2 === microCode);
        const f3 = F3.find((f3) => f3 === microCode);
        const cd = CD.find((cd) => cd === microCode);
        const br = BR.find((br) => br === microCode);

        const gathered = [
          { F1: f1 },
          { F2: f2 },
          { F3: f3 },
          { CD: cd },
          { BR: br },
        ].filter((m) => !!Object.values(m)[0]);

        if (gathered.length !== 1) {
          throw new Error(
            `Invalid MicroProgram instructions at line ${i + 1} fix it.`
          );
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        pl[Object.keys(gathered[0])[0]] = Object.values(gathered[0])[0];
      }

      this._content.push(pl);
    }
  }
}
