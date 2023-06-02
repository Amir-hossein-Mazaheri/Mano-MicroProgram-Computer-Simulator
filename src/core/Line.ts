import { NO_LABEL } from "../types";

export class Line {
  constructor(
    private label: string | NO_LABEL,
    private ln: number,
    private instruction: string,
    private operands: string[]
  ) {}

  get getLabel() {
    return this.label;
  }

  get getLn() {
    return this.ln;
  }

  get getInstruction() {
    return this.instruction;
  }

  get getOperands() {
    return this.operands;
  }

  set setLabel(label: string) {
    this.label = label;
  }

  set setOperands(operands: string[]) {
    this.operands = operands;
  }
}
