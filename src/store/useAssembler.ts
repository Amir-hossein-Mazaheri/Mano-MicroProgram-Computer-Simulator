import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { getBMPM } from "../utils/getBMPM";
import { AssemblyLine } from "../core/AssemblyLine";
import { MicroProgramMemory } from "../core/MicroProgramMemory";

interface InitialState {
  isAssembling: boolean;
  assembly: string;
  microProgram: string;
  error: string;
  warns: string[];
  assembled: Record<number, AssemblyLine>;
  microProgramMemory: MicroProgramMemory;
}

interface UseAssembler extends InitialState {
  setIsAssembling: (isAssembling: boolean) => void;
  setAssembly: (assembly: string) => void;
  setMicroProgram: (microProgram: string) => void;
  setError: (error: string) => void;
  setWarns: (warns: string[]) => void;
  setAssembled: (assembled: Record<number, AssemblyLine>) => void;
}

const initialState: InitialState = {
  isAssembling: false,
  assembly: "",
  microProgram: getBMPM(),
  error: "",
  warns: [],
  assembled: {},
  microProgramMemory: MicroProgramMemory.create(),
};

export const useAssembler = create(
  immer<UseAssembler>((set) => ({
    ...initialState,

    setIsAssembling(isAssembling) {
      set((state) => {
        state.isAssembling = isAssembling;
      });
    },

    setAssembly(assembly) {
      set((state) => {
        state.assembly = assembly;
      });
    },

    setMicroProgram(microProgram) {
      set((state) => {
        state.microProgram = microProgram;
      });
    },

    setError(error) {
      set((state) => {
        state.error = error;
      });
    },

    setWarns(warns) {
      set((state) => {
        state.warns = warns;
      });
    },

    setAssembled(assembled) {
      set((state) => {
        state.assembled = assembled;
      });
    },
  }))
);
