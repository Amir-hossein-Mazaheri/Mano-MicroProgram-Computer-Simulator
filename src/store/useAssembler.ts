import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { AssemblyLine } from "../core/AssemblyLine";
import { MicroProgramMemory } from "../core/MicroProgramMemory";
import { Memory } from "../core/Memory";
import { getBMPM } from "../utils/getBMPM";

interface InitialState {
  assembly: string;
  microProgram: string;
  isAssembling: boolean;
  error: string;
  warns: string[];
  assembled: Record<number, AssemblyLine>;
  microProgramMemory: MicroProgramMemory;
  memory: Memory;
  restart: () => void;
  showCodePanel: boolean;
}

interface UseAssembler extends InitialState {
  setAssembly: (assembly: string) => void;
  setMicroProgram: (microProgram: string) => void;
  setIsAssembling: (isAssembling: boolean) => void;
  setError: (error: string) => void;
  setWarns: (warns: string[]) => void;
  setAssembled: (assembled: Record<number, AssemblyLine>) => void;
  setMemory: (memory: Memory) => void;
  setRestart: (restart: () => void) => void;
  toggleShowCodePanel: () => void;
}

const initialState: InitialState = {
  assembly: "",
  microProgram: getBMPM(),
  isAssembling: false,
  error: "",
  warns: [],
  assembled: {},
  microProgramMemory: MicroProgramMemory.create(),
  memory: new Memory({}),
  restart: () => ({}),
  showCodePanel: true,
};

export const useAssembler = create(
  immer<UseAssembler>((set) => ({
    ...initialState,

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

    setIsAssembling(isAssembling) {
      set((state) => {
        state.isAssembling = isAssembling;
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

    setMemory(memory) {
      set((state) => {
        state.memory = memory;
      });
    },

    setRestart(restart) {
      set((state) => {
        state.restart = restart;
      });
    },

    toggleShowCodePanel() {
      set((state) => {
        state.showCodePanel = !state.showCodePanel;
      });
    },
  }))
);
