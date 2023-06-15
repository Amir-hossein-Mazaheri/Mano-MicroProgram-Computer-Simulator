import { NO_LABEL } from "../constants";
import { AssemblyLine } from "./AssemblyLine";
import { Signal } from "./Signal";

export class Memory {
  private _memorySize = 2048;
  private _signal = Signal.create();
  private _content: AssemblyLine[] = [];
  private _start = -1;
  private _end = -1;

  constructor(assembledLines: Record<number, AssemblyLine>) {
    const values = Object.values(assembledLines);

    if (!values.length) {
      return;
    }

    this._start = values[0].ln;
    this._end = this._start + values.length;

    for (let i = 0; i < this._memorySize; i++) {
      if (assembledLines[i]) {
        this._content.push(assembledLines[i]);
      } else {
        this._content.push(
          new AssemblyLine(
            NO_LABEL,
            i,
            "",
            "",
            false,
            "0000000000000000",
            false
          )
        );
      }
    }
  }

  read(arr: string) {
    this._signal.memoryRead(arr);

    return this._content[parseInt(arr, 2)];
  }

  write(arr: string, content: AssemblyLine) {
    this._content[parseInt(arr, 2)] = content;

    this._signal.memoryWrite(arr);
  }

  get start() {
    return this._start;
  }

  get end() {
    return this._end;
  }

  get content() {
    return this._content;
  }

  get size() {
    if (!this._content.length) return 0;

    return this._memorySize;
  }
}
