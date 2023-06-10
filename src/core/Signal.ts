export class Signal {
  private static _instance: Signal;

  private _assemble = () => {
    //
  };
  private _memoryWrite = (arr: string) => {
    //
  };
  private _memoryRead = (arr: string) => {
    //
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
