export type NO_LABEL = null;

export const NO_LABEL = null;

export const F1 = [
  "NOP",
  "ADD",
  "CLRAC",
  "INCAC",
  "DRTAC",
  "DRTAR",
  "PCTAR",
  "WRITE",
] as const;

export const F2 = [
  "NOP",
  "SUB",
  "OR",
  "AND",
  "READ",
  "ACTDR",
  "INCDR",
  "PCTDR",
] as const;

export const F3 = [
  "NOP",
  "XOR",
  "COM",
  "SHL",
  "SHR",
  "INCPC",
  "ARTPC",
] as const;

export const CD = ["U", "I", "S", "Z"] as const;

export const BR = ["JMP", "CALL", "RET", "MAP"] as const;

export type F1 = (typeof F1)[number];
export type F2 = (typeof F2)[number];
export type F3 = (typeof F3)[number];
export type CD = (typeof CD)[number];
export type BR = (typeof BR)[number];
