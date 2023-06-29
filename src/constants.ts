export const NO_LABEL = "NO LABEL";

export const F1 = [
  { code: "NOP", binary: "000" },
  { code: "ADD", binary: "001" },
  { code: "CLRAC", binary: "010" },
  { code: "INCAC", binary: "011" },
  { code: "DRTAC", binary: "100" },
  { code: "DRTAR", binary: "101" },
  { code: "PCTAR", binary: "110" },
  { code: "WRITE", binary: "111" },
] as const;

export const F2 = [
  { code: "NOP", binary: "000" },
  { code: "SUB", binary: "001" },
  { code: "OR", binary: "010" },
  { code: "AND", binary: "011" },
  { code: "READ", binary: "100" },
  { code: "ACTDR", binary: "101" },
  { code: "INCDR", binary: "110" },
  { code: "PCTDR", binary: "111" },
] as const;

export const F3 = [
  { code: "NOP", binary: "000" },
  { code: "XOR", binary: "001" },
  { code: "COM", binary: "010" },
  { code: "SHL", binary: "011" },
  { code: "SHR", binary: "100" },
  { code: "INCPC", binary: "101" },
  { code: "ARTPC", binary: "110" },
] as const;

export const CD = [
  { code: "U", binary: "00" },
  { code: "I", binary: "01" },
  { code: "S", binary: "10" },
  { code: "Z", binary: "11" },
] as const;

export const BR = [
  { code: "JMP", binary: "00" },
  { code: "CALL", binary: "01" },
  { code: "RET", binary: "10" },
  { code: "MAP", binary: "11" },
] as const;

export const ioRef = [
  { code: "INP", binary: "1111100000000000" },
  { code: "OUT", binary: "1111010000000000" },
  { code: "SKI", binary: "1111001000000000" },
  { code: "SKO", binary: "1111000100000000" },
  { code: "ION", binary: "1111000010000000" },
  { code: "IOF", binary: "1111000001000000" },
  { code: "HLT", binary: "0111000000000001" },
] as const;

export const registers = ["AR", "PC", "DR", "AC"] as const;

export const FAC0 = "0000000000000001";
export const FAC1 = "0000000000000001";
export const FAC2 = "0000000000000010";
export const FAC3 = "0000000000000110";
export const FAC4 = "0000000000011000";
export const FAC5 = "0000000001111000";
export const FAC6 = "0000001011010000";
export const FAC7 = "0001001110110000";
