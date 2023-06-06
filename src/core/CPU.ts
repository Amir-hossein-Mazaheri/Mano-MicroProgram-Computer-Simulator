import { CD, NO_LABEL } from "../types";
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

  private constructor(
    private _microProgramMemory: MicroProgramMemory,
    private _memory: Memory,
    pc?: string
  ) {
    this._PC = pc ?? _memory.start.toString(2).padStart(11, "0");
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
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (this._DR.instruction === "HLT") {
        break;
      }

      const car = this._microProgramMemory.CAR;
      const content = this._microProgramMemory.read(car);

      this[content.F1.code]();
      this[content.F2.code]();
      this[content.F3.code]();

      if (this.CD(content.CD)) {
        this[content.BR.code](car);
      } else {
        this._microProgramMemory.CAR = incBinary(this._microProgramMemory.CAR);
      }
    }
  }

  private NOP() {
    console.log("Im doing nothing...");
  }

  // START F1
  private ADD() {
    this._AC = (parseInt(this._AC, 2) + parseInt(this._DR.binary, 2))
      .toString(2)
      .padStart(16, "0");
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
    if (this._DR.isNumber) {
      this._DR.oppCode = incBinary(this._DR.oppCode);
    }
  }

  private PCTDR() {
    this._DR.binary = `${this._DR.binary.slice(11)}${this._PC}`;
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

  private CD(cd: CD) {
    switch (cd.code) {
      case "U":
        return true;
      case "I":
        return this._DR.indirect;
      case "S":
        return this._AC[0] === "1";
      case "Z":
        return parseInt(this._AC, 2) === 0;
      default:
        return false;
    }
  }

  private JMP(car: string) {
    this._microProgramMemory.CAR = this._microProgramMemory.read(car).ADDR;
  }

  private CALL(car: string) {
    this._microProgramMemory.SBR = incBinary(this._microProgramMemory.CAR);
    this._microProgramMemory.CAR = this._microProgramMemory.read(car).ADDR;
  }

  private RET() {
    this._microProgramMemory.CAR = this._microProgramMemory.SBR;
  }

  private MAP() {
    this._AR = this._DR.operand;
    this._microProgramMemory.CAR = `0${this._DR.oppCode}00`;
  }
}
