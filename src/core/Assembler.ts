import { NO_LABEL } from "../constants";
import { toBin } from "../utils/toBin";
import { AssemblyLine } from "./AssemblyLine";
import { MicroProgramMemory } from "./MicroProgramMemory";
import { Signal } from "./Signal";

export const ioRef = [
  { code: "INP", binary: "1111100000000000" },
  { code: "OUT", binary: "1111010000000000" },
  { code: "SKI", binary: "1111001000000000" },
  { code: "SKO", binary: "1111000100000000" },
  { code: "ION", binary: "1111000010000000" },
  { code: "IOF", binary: "1111000001000000" },
  { code: "HLT", binary: "0111000000000001" },
] as const;

export class Assembler {
  private _signal = Signal.create();
  private _code = "";
  private _assembledLines: Record<number, AssemblyLine> = {};
  private _warns: string[] = [];

  constructor(private _microProgramMemory: MicroProgramMemory, code?: string) {
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
      let foundInstruction = false;
      let lastInstruction = "";

      if (!line.trim()) {
        this._warns.push(`Line ${i + 1} is empty!`);
        continue;
      }

      const withoutComment = line.split("/");
      const withLabel = withoutComment[0].trim().split(",");

      let label: string | null = NO_LABEL;

      if (withLabel[0] && withLabel.length > 1) {
        const lb = withLabel.shift();

        if (lb) {
          label = lb;
        }
      }

      if (label && withLabel[0].toUpperCase() !== withLabel[0]) {
        this._warns.push(
          `Label at line ${
            i + 1
          } should be replace with fully uppercase characters.`
        );
      }

      const [instruction, operand, indirect] = withLabel[0].trim().split(" ");

      if (instruction === "ORG") {
        lineCounter = +operand;
        continue;
      }

      if (instruction === "END") {
        hasEnd = true;
        break;
      }

      let k = 0;
      lastInstruction = instruction;

      const io = ioRef.find((io) => io.code === instruction);

      if (instruction === "HEX" || instruction === "DEC") {
        foundInstruction = true;

        const binaryNumber = toBin(
          instruction === "HEX" ? operand : +operand,
          16
        );

        this._assembledLines[lineCounter] = new AssemblyLine(
          label,
          lineCounter,
          instruction,
          operand,
          !!indirect,
          binaryNumber,
          false,
          true
        );
      } else if (io) {
        foundInstruction = true;

        this._assembledLines[lineCounter] = new AssemblyLine(
          label,
          lineCounter,
          instruction,
          operand,
          !!indirect,
          io.binary,
          true
        );
      } else {
        for (const key in this._microProgramMemory.content) {
          const content = this._microProgramMemory.content[key];

          if (content.name === instruction) {
            foundInstruction = true;
            let oppCode = k.toString(2);

            if (oppCode.length < 4) {
              oppCode = oppCode.padStart(4, "0");
            }

            this._assembledLines[lineCounter] = new AssemblyLine(
              label,
              lineCounter,
              instruction,
              operand,
              !!indirect,
              oppCode,
              false
            );

            break;
          }

          if (content.name) k++;
        }
      }

      if (!foundInstruction)
        throw new Error(
          `Couldn't find the "${lastInstruction}" at line ${i + 1}.`
        );

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
            this._assembledLines[key].operand = (+newKey)
              .toString(2)
              .padStart(11, "0");
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

    this._signal.assemble();

    return [this._assembledLines, this._warns];
  }

  get warns() {
    return this._warns;
  }
}
