import { NO_LABEL } from "../types";
import { AssemblyLine } from "./AssemblyLine";

/**
 * This class follows Singleton design patter
 */
export class Memory {
  private static _instance: Memory;
  private _content: AssemblyLine[] = [];
  private _start = -1;

  private constructor(assembledLines: Record<number, AssemblyLine>) {
    for (let i = 0; i < 2048; i++) {
      this._content.push(new AssemblyLine(NO_LABEL, -1, "", "", false));
    }

    this._fillContent(assembledLines);
  }

  static create(assembledLines: Record<number, AssemblyLine>) {
    if (!this._instance) {
      this._instance = new Memory(assembledLines);
    }

    return this._instance;
  }

  private _fillContent(assembledLines: Record<number, AssemblyLine>) {
    this._start = Object.values(assembledLines)[0].ln;

    for (const key in assembledLines) {
      this._content[key] = assembledLines[key];
    }
  }

  read(arr: string) {
    return this._content[parseInt(arr, 2)];
  }

  write(arr: string, content: AssemblyLine) {
    this._content[parseInt(arr, 2)] = content;
  }

  get start() {
    return this._start;
  }
}
