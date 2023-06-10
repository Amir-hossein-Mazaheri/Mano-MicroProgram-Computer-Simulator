import { BR, CD, F1, F2, F3 } from "../types";
import { MicroProgramLine } from "./MicroProgramLine";

/**
 * This class follows Singleton design patter
 */
export class MicroProgramMemory {
  private static _instance: MicroProgramMemory;
  private _SBR = "0000000";
  private _CAR = "0000000";
  private _instructions = "";
  private _content: Record<number, MicroProgramLine> = {};

  private constructor(instructions?: string) {
    if (instructions) this.instructions = instructions;

    for (let i = 0; i < 128; i++) {
      this._content[i] = new MicroProgramLine();
    }
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
    this._instructions =
      instructions +
      "\nORG 64\nFETCH: PCTAR U JMP NEXT\nREAD INCPC U JMP NEXT\nDRTAR U MAP\nINDRCT: READ U JMP NEXT\nDRTAR U RET";
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

  getName(oppCode: string) {
    let k = 0;

    for (const key in this._content) {
      const content = this._content[key];

      if (content.name === oppCode) {
        let oppCode = k.toString(2);

        if (oppCode.length < 4) {
          oppCode = oppCode.padStart(4, "0");
        }

        return oppCode;
      }

      if (content.name) k++;
    }
  }

  load() {
    const lines = this._instructions.split("\n");
    let fetchAddr = "";
    let lc = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // skip empty lines
      if (!line.trim()) continue;

      const microCodes = line.split(" ").filter((l) => !!l.trim());

      if (microCodes[0] === "ORG") {
        const orgOperand = +microCodes[1];

        if (isNaN(orgOperand)) throw new Error(`Invalid "ORG" operand`);

        if (orgOperand < 0)
          throw new Error(`"ORG" operand cannot be negative number.`);

        if (orgOperand > 64)
          throw new Error(`"ORG" operand must be smaller that "64"`);

        lc = orgOperand;

        continue;
      }

      const pl = new MicroProgramLine();

      const withName = line.split(":").map((part) => part.trim());

      if (withName.length > 1) {
        pl.name = withName[0];
        microCodes.shift();

        if (withName[0] === "FETCH")
          fetchAddr = lc.toString(2).padStart(7, "0");
      }

      for (let i = 0; i < microCodes.length - 1; i++) {
        const microCode = microCodes[i];

        const f1 = F1.find((f1) => f1.code === microCode);
        const f2 = F2.find((f2) => f2.code === microCode);
        const f3 = F3.find((f3) => f3.code === microCode);
        const cd = CD.find((cd) => cd.code === microCode);
        const br = BR.find((br) => br.code === microCode);

        const gathered = [
          { F1: f1 },
          { F2: f2 },
          { F3: f3 },
          { CD: cd },
          { BR: br },
        ].filter((m) => !!Object.values(m)[0]);

        if (gathered.length !== 1 && gathered.length !== 3) {
          throw new Error(
            `Invalid MicroProgram instructions at line ${i + 1} fix it.`
          );
        }

        if (gathered.length === 3) {
          if (
            gathered[0].F1?.code !== "NOP" ||
            gathered[1].F2?.code !== "NOP" ||
            gathered[2].F3?.code !== "NOP"
          )
            throw new Error(
              `Invalid MicroProgram instructions for "NOP" at line ${
                i + 1
              } fix it.`
            );
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        pl[Object.keys(gathered[0])[0]] = Object.values(gathered[0])[0];
      }

      const lastElement = microCodes[microCodes.length - 1];
      const isBR = BR.find((br) => br.code === lastElement);

      if (isBR) {
        pl.BR = isBR;
      }

      if (lastElement === "NEXT") {
        pl.ADDR = (lc + 1).toString(2).padStart(7, "0");
      } else if (!isBR) {
        pl.ADDR = lastElement;
      }

      this._content[lc] = pl;

      lc++;
    }

    this._CAR = fetchAddr;

    for (const key in this._content) {
      if (isNaN(parseInt(this._content[key].ADDR, 2))) {
        for (const newKey in this._content) {
          if (this._content[newKey].name === this._content[key].ADDR) {
            this._content[key].ADDR = (+newKey).toString(2).padStart(7, "0");
            break;
          }
        }
      }
    }

    console.log("microprogram loaded content: ", this._CAR, this._content);
  }

  read(arr: string) {
    return this._content[parseInt(arr, 2)];
  }
}
