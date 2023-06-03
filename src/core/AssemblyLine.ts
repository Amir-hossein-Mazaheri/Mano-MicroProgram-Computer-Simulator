import { NO_LABEL } from "../types";

export class AssemblyLine {
  constructor(
    private _label: string | NO_LABEL,
    private _ln: number,
    private _instruction: string,
    private _operand: string,
    private _indirect: boolean,
    private _binary: string = "0000000000000000"
  ) {}

  get label() {
    return this._label;
  }

  set label(label: string | NO_LABEL) {
    this._label = label;
  }

  get ln() {
    return this._ln;
  }

  get instruction() {
    return this._instruction;
  }

  get operand() {
    return this._operand;
  }

  set operand(operand: string) {
    this._operand = operand;
  }

  get indirect() {
    return this._indirect;
  }

  set indirect(indirect: boolean) {
    this._indirect = indirect;
  }

  get binary() {
    return this._binary;
  }

  set binary(binary: string) {
    this._binary = binary;
  }
}
