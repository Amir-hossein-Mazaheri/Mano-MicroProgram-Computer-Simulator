export type NO_LABEL = null;

export const NO_LABEL = null;

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

export type F1 = (typeof F1)[number];
export type F2 = (typeof F2)[number];
export type F3 = (typeof F3)[number];
export type CD = (typeof CD)[number];
export type BR = (typeof BR)[number];
