import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { AssemblyLine } from "../core/AssemblyLine";
import { MicroProgramMemory } from "../core/MicroProgramMemory";

interface InitialState {
  isAssembling: boolean;
  error: string;
  warns: string[];
  assembled: Record<number, AssemblyLine>;
  microProgramMemory: MicroProgramMemory;
}

interface UseAssembler extends InitialState {
  setIsAssembling: (isAssembling: boolean) => void;
  setError: (error: string) => void;
  setWarns: (warns: string[]) => void;
  setAssembled: (assembled: Record<number, AssemblyLine>) => void;
}

const initialState: InitialState = {
  isAssembling: false,
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
