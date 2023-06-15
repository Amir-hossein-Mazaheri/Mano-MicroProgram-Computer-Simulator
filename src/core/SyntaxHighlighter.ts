import { F1, F2, F3, CD, BR } from "../constants";
import { escapeRegExp } from "../utils/getBMPM";

type Type = "MicroProgram" | "Assembly";

export class SyntaxHighlighter {
  private _colors = {
    label: "rgb(255, 255, 255)",
    name: "rgb(255, 255, 255)",
    org: "rgb(255 242 144)",
    orgOperand: "rgb(255 140 0)",
    end: "rgb(255 242 144)",
    microProgramOperation: "rgb(102,132,225)",
    microProgramCD: "rgb(31,173,131)",
    microProgramBR: "rgb(215,55,55)",
    microProgramADDR: "rgb(184,84,212)",
    indirect: "rgb(96,172,57)",
    comment: "rgb(125,122,104)",
    assemblyOperation: "rgb(102,132,225)",
    assemblyOperand: "rgb(31,173,131)",
    assemblyNumber: "rgb(212,53,82)",
  };

  constructor(private _type: Type) {}

  private _microProgram(lines: string[]) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!line.trim()) {
        lines[i] = `<br />`;
        continue;
      }

      const withName = line.split(":");

      const pLine = [];

      if (withName.length > 1) {
        pLine.push(
          `<span style="color: ${this._colors.name}">${withName[0]}::::</span>`
        );

        withName.shift();
      }

      const withMicroOperations = withName[0].split(",");

      withMicroOperations
        .pop()
        ?.split(" ")
        .map((p) => {
          withMicroOperations.push(p === "" ? " " : p);
        });

      let whiteSpace = "";

      for (let j = 0; j < withMicroOperations.length; j++) {
        const microOperation = withMicroOperations[j];

        if (microOperation === " ") {
          whiteSpace += "&nbsp;";
          continue;
        }

        const f1 = F1.find((f1) => f1.code === microOperation);
        const f2 = F2.find((f2) => f2.code === microOperation);
        const f3 = F3.find((f3) => f3.code === microOperation);
        const cd = CD.find((cd) => cd.code === microOperation);
        const br = BR.find((br) => br.code === microOperation);

        let color = "";

        if (f1 || f2 || f3) {
          color = this._colors.microProgramOperation;
        } else if (cd) {
          color = this._colors.microProgramCD;
        } else if (br) {
          color = this._colors.microProgramBR;
        } else {
          if (microOperation === "ORG") {
            color = this._colors.org;
          } else if (!isNaN(parseInt(microOperation))) {
            color = this._colors.orgOperand;
          } else {
            color = this._colors.microProgramADDR;
          }
        }

        const shouldHaveComma = !![...F2, ...F2, ...F3].find(
          (f) => f.code === withMicroOperations[j + 1]
        );

        pLine.push(
          `<span style="color: ${color}">${whiteSpace + microOperation}${
            shouldHaveComma ? "," : ""
          }</span>`
        );

        whiteSpace = "";
      }

      const hasName = pLine[0].includes("::::");

      lines[i] = `<p>${
        hasName
          ? pLine[0].replace("::::", ":") + pLine.slice(1).join("&nbsp;")
          : pLine.join("&nbsp;")
      }</p>`;
    }

    return lines.join("\n");
  }

  private _assembly(lines: string[]) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      const pLine = [];

      if (!line.trim()) {
        lines[i] = `<br />`;
        continue;
      }

      const withComment = line.split("/");
      let comment = "";

      if (withComment.length > 1) {
        comment = `<span style="display: inline; color: ${
          this._colors.comment
        }">/${withComment
          .slice(1)
          .join("/")
          .replace(new RegExp(escapeRegExp(" "), "g"), "&nbsp;")}</span>`;
      }

      const withLabel = withComment[0].split(",");

      if (withLabel.length > 1) {
        pLine.push(
          `<span style="color: ${this._colors.label}">${withLabel[0]},</span>`
        );

        withLabel.shift();
      }

      const withInstruction = withLabel[0].split(" ");
      const [operation, operand] = withInstruction.filter((i) => !!i.trim());

      let whiteSpace = "";

      for (let j = 0; j < withInstruction.length; j++) {
        const instruction = withInstruction[j];

        if (instruction === "") {
          whiteSpace += "&nbsp;";
          continue;
        }

        pLine.push(whiteSpace + instruction);
        whiteSpace = "";
      }

      if (whiteSpace !== "") {
        pLine[pLine.length - 1] += whiteSpace;
      }

      let operationColor = this._colors.assemblyOperation;
      let operandColor = this._colors.assemblyOperand;

      if (!operand) {
        [operandColor, operationColor] = [operationColor, operandColor];

        if (pLine[pLine.length - 1].includes("END")) {
          operandColor = this._colors.end;
        }
      } else if (operation.includes("ORG")) {
        operationColor = this._colors.org;
        operandColor = this._colors.orgOperand;
      } else if (operation.includes("HEX") || operation.includes("DEC")) {
        operandColor = this._colors.assemblyNumber;
      }

      if (operand) {
        pLine[pLine.length - 1] = `<span style="color: ${operandColor}">&nbsp;${
          pLine[pLine.length - 1]
        }</span>`;
      }

      pLine[pLine.length - (operand ? 2 : 1)] = `<span style="color: ${
        operand ? operationColor : operandColor
      }">${pLine[pLine.length - (operand ? 2 : 1)]}</span>`;

      comment && pLine.push(comment);

      lines[i] = `<p>${pLine.join("")}</p>`;
    }

    return lines.join("\n");
  }

  setType(type: Type) {
    return new SyntaxHighlighter(type);
  }

  public highlight(code: string) {
    const lines = code.split("\n");

    if (this._type === "MicroProgram") {
      return this._microProgram(lines);
    }

    return this._assembly(lines);
  }
}
