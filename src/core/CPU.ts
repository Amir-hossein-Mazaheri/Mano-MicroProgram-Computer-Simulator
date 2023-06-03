import { NO_LABEL } from "../types";
import { binOperation } from "../utils/binOperation";
import { incBinary } from "../utils/incBinary";
import { AssemblyLine } from "./AssemblyLine";
import { Memory } from "./Memory";
import { MicroProgramLine } from "./MicroProgramLine";
import { MicroProgramMemory } from "./MicroProgramMemory";

/**
 * This class follows Singleton design patter
 */
export class CPU {
  private static _instance: CPU;

  private _AR = "00000000000"; //11bit
  private _PC = "00000000000"; //11bit;
  private _DR = new AssemblyLine(
    NO_LABEL,
    -1,
    "",
    "",
    false,
    "0000000000000000"
  ); //16bit
  private _AC = "0000000000000000"; //16bit

  private constructor(
    private _microProgramMemory: MicroProgramMemory,
    private _memory: Memory,
    pc?: string
  ) {
    this._PC = pc ?? _memory.start.toString(2);
  }

  static create(
    microProgramMemory: MicroProgramMemory,
    memory: Memory,
    pc?: string
  ) {
    if (!this._instance) {
      this._instance = new CPU(microProgramMemory, memory, pc);
    }

    return this._instance;
  }

  execute() {
    const MAR = this._memory.read(this._PC);

    while (MAR.instruction !== "HLT") {
      const instruction = MAR.instruction;

      let microProgramLine: MicroProgramLine | null = null;

      this._AR = this._PC;

      for (
        let i = 0;
        i < this._microProgramMemory.content.length && i < 64;
        i++
      ) {
        if (this._microProgramMemory.content[i].name === instruction) {
          microProgramLine = this._microProgramMemory.content[i];
          break;
        }
      }

      if (!microProgramLine)
        throw new Error(`Invalid instruction ${instruction}.`);

      this._PC = incBinary(this._PC);
    }
  }

  // START F1
  private ADD() {
    this._AC = (parseInt(this._AC, 2) + parseInt(this._DR.binary, 2)).toString(
      2
    );
  }

  private CLRAC() {
    this._AC = "0000000000000000";
  }

  private INCAC() {
    this._AC = incBinary(this._AC);
  }

  private DRTAC() {
    this._AC = this._DR.binary;
  }

  private DRTAR() {
    this._AR = this._DR.binary.slice(0, 10);
  }

  private PCTAR() {
    this._AR = this._PC;
  }

  private WRITE() {
    this._memory.write(this._AR, this._DR);
  }

  // START F2
  private SUB() {
    this._AC = (parseInt(this._AC, 2) - parseInt(this._DR.binary, 2)).toString(
      2
    );
  }

  private OR() {
    this._AC = binOperation(this._AC, this._DR.binary, "OR");
  }

  private AND() {
    this._AC = binOperation(this._AC, this._DR.binary, "AND");
  }

  private READ() {
    this._DR = this._memory.read(this._AR);
  }

  private ACTDR() {
    this._DR.binary = this._AC;
  }

  private INCDR() {
    this._DR.binary = incBinary(this._DR.binary);
  }

  private PCTDR() {
    //
  }

  // START F3
  private XOR() {
    this._AC = binOperation(this._AC, this._DR.binary, "XOR");
  }

  private COM() {
    this._AC = binOperation(this._AC, "", "COM");
  }

  private SHL() {
    //
  }

  private SHR() {
    //
  }

  private INCPC() {
    this._PC = incBinary(this._PC);
  }

  private ARTPC() {
    this._PC = this._AR;
  }
}
