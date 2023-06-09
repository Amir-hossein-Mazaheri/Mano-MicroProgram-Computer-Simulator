import baseAssembly from "../../base_assembly.txt?raw";
import { escapeRegExp } from "./getBMPM";

export function getBA() {
  return baseAssembly.replace(new RegExp(escapeRegExp("\r"), "g"), "");
}
