import type { BR, CD, F1, F2, F3 } from "../types";

export class MicroProgramLine {
  private _name: string | null = null;
  private _F1: F1 = "NOP";
  private _F2: F2 = "NOP";
  private _F3: F3 = "NOP";
  private _CD: CD = "U";
  private _BR: BR = "JMP";
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
    if (addr.length !== 7)
      throw new Error("You must set 7bit long address for MicroProgramLine.");

    this._ADDR = addr;
  }

  get ADDR() {
    return this._ADDR;
  }
}
