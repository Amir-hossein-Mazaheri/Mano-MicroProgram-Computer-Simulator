import {
  FAC0,
  FAC1,
  FAC2,
  FAC3,
  FAC4,
  FAC5,
  FAC6,
  FAC7,
  NO_LABEL,
} from "../constants";
import { AssemblyLine } from "./AssemblyLine";
import { Signal } from "./Signal";

/**
 * Simple representation of the memory with methods like read and write.
 */
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

    // Precalculated factorial of 0 to 7 itself
    this._content.push(
      ...[
        new AssemblyLine(NO_LABEL, 0, "DEC", "", false, FAC0, false, true),
        new AssemblyLine(NO_LABEL, 1, "DEC", "", false, FAC1, false, true),
        new AssemblyLine(NO_LABEL, 2, "DEC", "", false, FAC2, false, true),
        new AssemblyLine(NO_LABEL, 3, "DEC", "", false, FAC3, false, true),
        new AssemblyLine(NO_LABEL, 4, "DEC", "", false, FAC4, false, true),
        new AssemblyLine(NO_LABEL, 5, "DEC", "", false, FAC5, false, true),
        new AssemblyLine(NO_LABEL, 6, "DEC", "", false, FAC6, false, true),
        new AssemblyLine(NO_LABEL, 7, "DEC", "", false, FAC7, false, true),
      ]
    );

    for (let i = 8; i < this._memorySize; i++) {
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
