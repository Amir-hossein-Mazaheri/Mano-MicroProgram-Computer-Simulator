import { NO_LABEL } from "../constants";
import { CD } from "../types";
import { binOperation } from "../utils/binOperation";
import { incBinary } from "../utils/incBinary";
import { toBin } from "../utils/toBin";
import { toDecimal } from "../utils/toDecimal";
import { AssemblyLine } from "./AssemblyLine";
import { Memory } from "./Memory";
import { MicroProgramMemory } from "./MicroProgramMemory";
import { Signal } from "./Signal";

/**
 * The main part of the computer which executes the instructions
 * also contains every micro operation because each micro operation
 * needs access to registers and its just simpler to be here
 */
export class CPU {
  private _signal = Signal.create();

  private _AR = "00000000000"; //11bit binary address
  private _PC = "00000000000"; //11bit binary address
  private _DR = new AssemblyLine(
    NO_LABEL,
    -1,
    "",
    "",
    false,
    "0000000000000000",
    false,
    true
  ); //16bit number or instruction
  private _AC = "0000000000000000"; //16bit number

  private _AR_SNAPSHOT = this._AR;
  private _PC_SNAPSHOT = this._PC;
  private _DR_SNAPSHOT = this._DR.clone();
  private _AC_SNAPSHOT = this._AC;

  private _AC_WRITE = false;

  private _lastMicroOperation: "F1" | "F2" | "F3" = "F3";

  constructor(
    private _microProgramMemory: MicroProgramMemory,
    private _memory: Memory
  ) {
    if (_memory.start !== -1)
      this._PC = _memory.start.toString(2).padStart(11, "0");
  }

  // This method takes a snapshot of registers before executing any thing.
  // Having this method is a must because we are just simulating the microprogram computer
  // which runs each microprogram line in just ONE CLOCK and it happens instantly
  // but in our simulator each micro operation the get executed ONE BY ONE which makes it different
  // from the original computer so snapshots helps to fix this issue.
  // All of micro operation uses the snap version of registers which is the
  // version of registers before applying any change so this solve our issue and
  // simulation is just like the real micro program computer :)
  private takeSnapshot() {
    this._AR_SNAPSHOT = this._AR;
    this._PC_SNAPSHOT = this._PC;
    this._DR_SNAPSHOT = this._DR.clone();
    this._AC_SNAPSHOT = this._AC;
  }

  // This methods help with stopping user from accessing AC register more than
  // once in a single step
  // we only need to lock AC register because the nature of F1, F2, and F3 stops
  // user from accessing other registers at the same time the only problem they cause
  // is writing AC at the same step
  private lockAC() {
    if (this._AC_WRITE) {
      throw new Error(
        "You simulator just broke ;( because you used two incompatible micro operation at the same line."
      );
    }

    this._AC_WRITE = true;
  }

  micro() {
    if (this._DR.instruction === "HLT") return false;

    const car = this._microProgramMemory.CAR;
    const content = this._microProgramMemory.read(car);

    switch (this._lastMicroOperation) {
      case "F1":
        this[content.F2.code]();

        this._lastMicroOperation = "F2";
        break;
      case "F2":
        this[content.F3.code]();

        if (this.CD(content.CD)) {
          this[content.BR.code](car);
        } else {
          this._microProgramMemory.CAR = incBinary(
            this._microProgramMemory.CAR
          );
        }

        this._lastMicroOperation = "F3";

        break;
      case "F3":
        this.takeSnapshot();
        this._AC_WRITE = false;

        this[content.F1.code]();

        this._lastMicroOperation = "F1";
        break;
    }
  }

  step() {
    if (this._DR.instruction === "HLT") return false;

    this.takeSnapshot();
    this._AC_WRITE = false;

    const car = this._microProgramMemory.CAR;
    const content = this._microProgramMemory.read(car);

    if (this._lastMicroOperation === "F3") {
      this[content.F1.code]();
      this._lastMicroOperation = "F1";
    }

    if (this._lastMicroOperation === "F1") this[content.F2.code]();

    this[content.F3.code]();

    if (this.CD(content.CD)) {
      this[content.BR.code](car);
    } else {
      this._microProgramMemory.CAR = incBinary(this._microProgramMemory.CAR);
    }

    this._lastMicroOperation = "F3";

    this._signal.step();

    return true;
  }

  execute() {
    while (this.step()) {
      //
    }
  }

  get AR() {
    return this._AR;
  }

  get AC() {
    return this._AC;
  }

  get PC() {
    return this._PC;
  }

  get DR() {
    return this._DR?.binary;
  }

  private NOP() {
    //
  }

  // START F1
  private ADD() {
    this.lockAC();

    this._AC = toBin(
      toDecimal(this._AC_SNAPSHOT) + toDecimal(this._DR_SNAPSHOT.binary),
      16
    );

    this._signal.registerRead("AC");
    this._signal.registerWrite("AC");
    this._signal.registerRead("DR");
  }

  private CLRAC() {
    this.lockAC();

    this._AC = "0000000000000000";

    this._signal.registerWrite("AC");
  }

  private INCAC() {
    this.lockAC();

    this._AC = incBinary(this._AC_SNAPSHOT);

    this._signal.registerWrite("AC");
  }

  private DRTAC() {
    this.lockAC();

    this._AC = this._DR_SNAPSHOT.binary;

    this._signal.registerWrite("AC");
    this._signal.registerRead("DR");
  }

  private DRTAR() {
    this._AR = this._DR_SNAPSHOT.isNumber
      ? this._DR_SNAPSHOT.oppCode
          .split("")
          .reverse()
          .slice(0, 11)
          .reverse()
          .join("")
      : this._DR_SNAPSHOT.operand;

    this._signal.registerWrite("AR");
    this._signal.registerRead("DR");
  }

  private PCTAR() {
    this._AR = this._PC_SNAPSHOT;

    this._signal.registerWrite("AR");
    this._signal.registerRead("PC");
  }

  private WRITE() {
    this._memory.write(this._AR_SNAPSHOT, this._DR_SNAPSHOT);
  }

  // START F2
  private SUB() {
    this.lockAC();

    this._AC = toBin(
      toDecimal(this._AC_SNAPSHOT) - toDecimal(this._DR_SNAPSHOT.binary),
      16
    );

    this._signal.registerRead("AC");
    this._signal.registerWrite("AC");
    this._signal.registerRead("DR");
  }

  private OR() {
    this.lockAC();

    this._AC = binOperation(this._AC_SNAPSHOT, this._DR_SNAPSHOT.binary, "OR");

    this._signal.registerRead("AC");
    this._signal.registerWrite("AC");
    this._signal.registerRead("DR");
  }

  private AND() {
    this.lockAC();

    this._AC = binOperation(this._AC_SNAPSHOT, this._DR_SNAPSHOT.binary, "AND");

    this._signal.registerRead("AC");
    this._signal.registerWrite("AC");
    this._signal.registerRead("DR");
  }

  private READ() {
    this._DR = this._memory.read(this._AR_SNAPSHOT);

    this._signal.registerWrite("DR");
  }

  private ACTDR() {
    this._DR.oppCode = this._AC_SNAPSHOT;

    this._signal.registerWrite("AC");
    this._signal.registerRead("DR");
  }

  private INCDR() {
    this._DR.oppCode = incBinary(this._DR_SNAPSHOT.oppCode);

    this._signal.registerWrite("DR");
  }

  private PCTDR() {
    this._DR.operand = this._PC_SNAPSHOT;

    this._signal.registerRead("PC");
    this._signal.registerWrite("DR");
  }

  // START F3
  private XOR() {
    this.lockAC();

    this._AC = binOperation(this._AC_SNAPSHOT, this._DR_SNAPSHOT.binary, "XOR");

    this._signal.registerRead("AC");
    this._signal.registerRead("DR");
    this._signal.registerWrite("AC");
  }

  private COM() {
    this.lockAC();

    this._AC = binOperation(this._AC_SNAPSHOT, "", "COM");

    this._signal.registerWrite("AC");
  }

  private SHL() {
    this.lockAC();

    const ac = this._AC_SNAPSHOT.split("");

    ac.pop();
    ac.push("0");

    this._AC = ac.join("");

    this._signal.registerWrite("AC");
  }

  private SHR() {
    this.lockAC();

    const ac = this._AC_SNAPSHOT.split("");

    ac.shift();
    ac.unshift("0");

    this._AC = ac.join("");

    this._signal.registerWrite("AC");
  }

  private INCPC() {
    this._PC = incBinary(this._PC_SNAPSHOT);

    this._signal.registerWrite("PC");
  }

  private ARTPC() {
    this._PC = this._AR_SNAPSHOT;

    this._signal.registerWrite("AR");
    this._signal.registerWrite("PC");
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
