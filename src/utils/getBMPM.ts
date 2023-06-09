import microProgramMemory from "../../microprogram_memory.txt?raw";

export function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getBMPM() {
  return microProgramMemory.replace(new RegExp(escapeRegExp("\r"), "g"), "");
}
