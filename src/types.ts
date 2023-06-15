import { BR, CD, F1, F2, F3, NO_LABEL, registers } from "./constants";

export type NO_LABEL = typeof NO_LABEL;

export type F1 = (typeof F1)[number];
export type F2 = (typeof F2)[number];
export type F3 = (typeof F3)[number];
export type CD = (typeof CD)[number];
export type BR = (typeof BR)[number];

export type Register = (typeof registers)[number];
