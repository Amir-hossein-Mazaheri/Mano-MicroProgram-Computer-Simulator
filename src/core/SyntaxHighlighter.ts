import { BR, CD, F1, F2, F3 } from "../types";

export class SyntaxHighlighter {
  private _colors = {
    label: "rgb(255, 255, 255)",
    name: "rgb(255, 255, 255)",
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

  constructor(private _type: "MicroProgram" | "Assembly") {}

  private _microProgram(lines: string[]) {
    const parsedLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!line.trim()) {
        parsedLines.push(`<br />`);
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
          color = this._colors.microProgramADDR;
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

      console.log("Pline: ", pLine);

      parsedLines.push(
        `<p>${
          hasName
            ? pLine[0].replace("::::", ":") + pLine.slice(1).join("&nbsp;")
            : pLine.join("&nbsp;")
        }</p>`
      );
    }

    return parsedLines.join("\n");
  }

  private _assembly(lines: string[]) {
    return lines.join("\n");
  }

  public highlight(code: string) {
    const lines = code.split("\n");

    if (this._type === "MicroProgram") {
      return this._microProgram(lines);
    }

    return this._assembly(lines);
  }
}
