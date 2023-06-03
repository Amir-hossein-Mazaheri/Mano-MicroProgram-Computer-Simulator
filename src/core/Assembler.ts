import { NO_LABEL } from "../types";
import { AssemblyLine } from "./AssemblyLine";

export class Assembler {
  private _code = "";
  private _assembledLines: Record<number, AssemblyLine> = {};
  private _warns: string[] = [];

  constructor(code?: string) {
    if (code) {
      this._code = code;
    }
  }

  get code() {
    return this._code;
  }

  set code(code: string) {
    if (this._code) {
      this.warns.push(
        `Code has been already set, makes sure you are not ignoring the previous code.`
      );
    }

    this._code = code;
  }

  // One of the util function to check wether a label is really a label or a hex number
  private _isHex(hex: string) {
    return /([0-9A-F]{3}){1,2}/g.test(hex);
  }

  /**
   * This function try to convert the input code into list of "Line" objects
   * which has some properties that makes it easy for other parts of core
   * to execute such as memory address, instruction, operand, and indirect
   * also throw an error if it finds anything wrong with the code and gather all
   * of warns in code which includes empty line, incorrect label instruction, and missing "END"
   */
  private _stageOne() {
    if (!this._code) {
      throw new Error("No code set in Parser class instance!");
    }

    const lines = this._code.split("\n");

    let lineCounter = 0;
    let hasEnd = false;

    /*
    This loops through each line of code and try to find the labels and mark lines with
    label with proper line number also jump if find "ORG"
    */
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!line.trim()) {
        this._warns.push(`Line ${i + 1} is empty!`);
        continue;
      }

      const withoutComment = line.split("/");
      const withLabel = withoutComment[0].trim().split(",");

      if (withLabel[0] && withLabel.length > 1) {
        if (withLabel[0].toUpperCase() !== withLabel[0]) {
          this._warns.push(
            `Label at line ${
              i + 1
            } should be replace with fully uppercase characters.`
          );
        }

        const [instruction, operand, indirect] = withLabel[1].trim().split(" ");

        this._assembledLines[lineCounter] = new AssemblyLine(
          withLabel[0],
          lineCounter,
          instruction,
          operand,
          !!indirect
        );
      } else {
        const [instruction, operand, indirect] = withLabel[0].trim().split(" ");

        if (instruction === "ORG") {
          lineCounter = +operand;
          continue;
        }

        if (instruction === "END") {
          hasEnd = true;
          break;
        }

        this._assembledLines[lineCounter] = new AssemblyLine(
          NO_LABEL,
          lineCounter,
          instruction,
          operand,
          !!indirect
        );
      }

      lineCounter++;
    }

    if (!hasEnd) {
      this._warns.push(`You should put "END" at the end of your code.`);
    }
  }

  /**
   * In this stage assembler tries to replace labels in instruction operands with
   * their correct memory address also ignores hex operands
   */
  private _stageTwo() {
    for (const key in this._assembledLines) {
      const operand = this._assembledLines[key].operand;

      if (operand && isNaN(Number(operand)) && !this._isHex(operand)) {
        for (const newKey in this._assembledLines) {
          if (this._assembledLines[newKey].label === operand) {
            this._assembledLines[key].operand =
              this._assembledLines[newKey].ln.toString();
            break;
          }
        }

        if (operand === this._assembledLines[key].operand) {
          throw new Error(
            `Cannot find label "${operand}" please check your code!`
          );
        }
      }
    }
  }

  assemble(): [Record<number, AssemblyLine>, string[]] {
    this._stageOne();
    this._stageTwo();

    return [this._assembledLines, this._warns];
  }

  get warns() {
    return this._warns;
  }
}
