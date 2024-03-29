import { Register } from "../types";

/**
 * This class provide a nice way for the CPU and Memory classes to
 * signal the UI that something has changed e.g. a register has been written or read,
 * also the same for memory slut read or write
 */
export class Signal {
  private static _instance: Signal;

  private _assemble = () => {
    //
  };
  private _memoryWrite = (arr: string) => {
    arr;
  };
  private _memoryRead = (arr: string) => {
    arr;
  };
  private _microProgramRead = (arr: string) => {
    arr;
  };
  private _registerWrite = (register: Register) => {
    register;
  };
  private _registerRead = (register: Register) => {
    register;
  };
  private _step = () => {
    //
  };
  private _microOperation = () => {
    //
  };

  private constructor() {
    //
  }

  static create() {
    if (!this._instance) {
      this._instance = new Signal();
    }

    return this._instance;
  }

  get assemble() {
    return this._assemble;
  }

  set assemble(assemble: () => void) {
    this._assemble = assemble;
  }

  get memoryWrite() {
    return this._memoryWrite;
  }

  set memoryWrite(memoryWrite: (arr: string) => void) {
    this._memoryWrite = memoryWrite;
  }

  get memoryRead() {
    return this._memoryRead;
  }

  set memoryRead(memoryRead: (arr: string) => void) {
    this._memoryRead = memoryRead;
  }

  set microProgramRead(microProgramRead: (arr: string) => void) {
    this._microProgramRead = microProgramRead;
  }

  get microProgramRead() {
    return this._microProgramRead;
  }

  get registerWrite() {
    return this._registerWrite;
  }

  set registerWrite(registerWrite: (register: Register) => void) {
    this._registerWrite = registerWrite;
  }

  get registerRead() {
    return this._registerRead;
  }

  set registerRead(registerRead: (register: Register) => void) {
    this._registerRead = registerRead;
  }

  get step() {
    return this._step;
  }

  set step(step: () => void) {
    this._step = step;
  }

  get microOperation() {
    return this._microOperation;
  }

  set microOperation(microOperation: () => void) {
    this._microOperation = microOperation;
  }
}
