import { NO_LABEL } from "../types";
import { Line } from "./Line";

export class Parser {
  private code = "";
  public parsedLines: Record<number, Line> = {};

  constructor(code?: string) {
    if (code) {
      this.code = code;
    }
  }

  setCode(code: string) {
    this.code = code;
  }

  clearLabel() {
    if (!this.code) {
      throw new Error("No code set in Parser class instance!");
    }

    const lines = this.code.split("\n");

    let lineCounter = 0;

    /*
    This loops through each line of code and try to find the labels and mark lines with
    label with proper line number also jump if find "ORG"
    */
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!line.trim()) continue;

      const withoutComment = line.split("/");
      const withLabel = withoutComment[0].trim().split(",");

      if (withLabel[0] && withLabel.length > 1) {
        const [instruction, ...operands] = withLabel[1].trim().split(" ");

        this.parsedLines[lineCounter] = new Line(
          withLabel[0],
          lineCounter,
          instruction,
          operands
        );
      } else {
        const [instruction, ...operands] = withLabel[0].trim().split(" ");

        if (instruction === "ORG") {
          lineCounter = +operands[0];
          continue;
        }

        if (instruction === "END") {
          break;
        }

        this.parsedLines[lineCounter] = new Line(
          NO_LABEL,
          lineCounter,
          instruction,
          operands
        );
      }

      lineCounter++;
    }

    return this;
  }

  clearOperandsLabel() {
    for (const key in this.parsedLines) {
      const operands = this.parsedLines[key].getOperands;

      for (let i = 0; i < operands.length; i++) {
        if (isNaN(Number(operands[i]))) {
          for (const newKey in this.parsedLines) {
            if (this.parsedLines[newKey].getLabel === operands[i]) {
              operands[i] = this.parsedLines[newKey].getLn.toString();
              break;
            }
          }
        }
      }
    }

    return this;
  }
}
