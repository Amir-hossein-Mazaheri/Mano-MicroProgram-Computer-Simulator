import { NO_LABEL } from "../types";
import { binOperation } from "../utils/binOperation";
import { incBinary } from "../utils/incBinary";
import { AssemblyLine } from "./AssemblyLine";
import { Memory } from "./Memory";
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
    "0000000000000000",
    false,
    true
  ); //16bit
  private _AC = "0000000000000000"; //16bit
  private _lookUpTable = {
    NOP: () => ({}),
    ADD: this.ADD,
    CLRAC: this.CLRAC,
    INCAC: this.INCAC,
    DRTAC: this.DRTAC,
    DRTAR: this.DRTAR,
    PCTAR: this.PCTAR,
    WRITE: this.WRITE,
    SUB: this.SUB,
    OR: this.OR,
    AND: this.AND,
    READ: this.READ,
    ACTDR: this.ACTDR,
    INCDR: this.INCDR,
    PCTDR: this.PCTDR,
    XOR: this.XOR,
    COM: this.COM,
    SHL: this.SHL,
    SHR: this.SHR,
    INCPC: this.INCPC,
    ARTPC: this.ARTPC,
    CD: this.CD,
    JMP: this.JMP,
    CALL: this.CALL,
    RET: this.RET,
    MAP: this.MAP,
  };

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
    //
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
    const ac = this._AC.split("");

    ac.pop();
    ac.push("0");

    this._AC = ac.join("");
  }

  private SHR() {
    const ac = this._AC.split("");

    ac.shift();
    ac.unshift("0");

    this._AC = ac.join("");
  }

  private INCPC() {
    this._PC = incBinary(this._PC);
  }

  private ARTPC() {
    this._PC = this._AR;
  }

  private CD(cd: string) {
    if (cd === "00") {
      return true;
    } else if (cd === "01") {
      return this._DR.indirect;
    } else if (cd === "10") {
      return this._AC[15] === "1";
    } else if (cd === "11") {
      return parseInt(this._AC, 2) === 0;
    }

    return false;
  }

  private JMP(i: number) {
    this._microProgramMemory.CAR = this._microProgramMemory.content[i].ADDR;
  }

  private CALL(i: number) {
    this._microProgramMemory.SBR = incBinary(this._microProgramMemory.CAR);
    this._microProgramMemory.CAR = this._microProgramMemory.content[i].ADDR;
  }

  private RET() {
    this._microProgramMemory.CAR = this._microProgramMemory.SBR;
  }

  private MAP() {
    this._microProgramMemory.CAR = `0${this._DR.binary.slice(11, 15)}00`;
  }
}
