import type { BR, CD, F1, F2, F3 } from "../types";

/**
 * An abstraction of each line of the micro program
 */
export class MicroProgramLine {
  private _name: string | null = null;
  private _F1: F1 = { code: "NOP", binary: "000" };
  private _F2: F2 = { code: "NOP", binary: "000" };
  private _F3: F3 = { code: "NOP", binary: "000" };
  private _CD: CD = { code: "U", binary: "00" };
  private _BR: BR = { code: "JMP", binary: "00" };
  private _ADDR = "0000000";

  set name(name: string | null) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set F1(f1: F1) {
    this._F1 = f1;
  }

  get F1() {
    return this._F1;
  }

  set F2(f2: F2) {
    this._F2 = f2;
  }

  get F2() {
    return this._F2;
  }

  set F3(f3: F3) {
    this._F3 = f3;
  }

  get F3() {
    return this._F3;
  }

  set CD(cd: CD) {
    this._CD = cd;
  }

  get CD() {
    return this._CD;
  }

  set BR(br: BR) {
    this._BR = br;
  }

  get BR() {
    return this._BR;
  }

  set ADDR(addr: string) {
    this._ADDR = addr;
  }

  get ADDR() {
    return this._ADDR;
  }

  get binary() {
    return (
      this.F1.binary +
      this.F2.binary +
      this.F3.binary +
      this.CD.binary +
      this.BR.binary +
      this.ADDR
    );
  }

  isEmpty() {
    return this.binary === "00000000000000000000";
  }
}
