import { ioRef } from "../constants";
import { NO_LABEL } from "../types";
import { MicroProgramMemory } from "./MicroProgramMemory";

/**
 * An abstraction of each line of the assembly code also Memory line
 */
export class AssemblyLine {
  constructor(
    private _label: string | NO_LABEL,
    private _ln: number,
    private _instruction: string,
    private _operand: string,
    private _indirect: boolean,
    private _oppCode: string,
    private _ioRef: boolean,
    private _isNumber = false
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
    if (!this._instruction) return "EMPTY";

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

  set oppCode(oppCode: string) {
    this._oppCode = oppCode;
  }

  get oppCode() {
    return this._oppCode;
  }

  get ioRef() {
    return this._ioRef;
  }

  get isNumber() {
    return this._isNumber;
  }

  get binary() {
    if (this._isNumber || this._ioRef || this._oppCode.length > 4)
      return this._oppCode;

    return (this._indirect ? "1" : "0") + this._oppCode + this._operand;
  }

  set binary(binary: string) {
    binary = binary.split("").reverse().join("");

    this._indirect = binary[0] === "1";
    this._oppCode = binary.slice(1, 5);
    this._operand = parseInt(binary.slice(5), 2).toString();
    let instruction = MicroProgramMemory.create().getName(this._oppCode);

    if (!instruction) {
      instruction = ioRef.find((io) => io.binary === binary)?.code;
    }

    if (!instruction) {
      throw new Error("Invalid binary set for assembly line.");
    }

    this._instruction = instruction;
  }

  isEmpty() {
    return !this._instruction;
  }

  // just a simple way to clone the whole class instance
  clone() {
    return new AssemblyLine(
      this._label,
      this._ln,
      this._instruction,
      this._operand,
      this._indirect,
      this._oppCode,
      this._ioRef,
      this._isNumber
    );
  }
}
