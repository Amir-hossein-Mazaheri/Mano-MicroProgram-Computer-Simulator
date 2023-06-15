import { complementTwo } from "./complementTwo";

/**
 * Converts a binary number to decimal with respecting to the sign of the number
 * which at this computer is two's complement.
 */
export function toDecimal(binary: string) {
  let number: string | number = binary;
  let negative = 1;

  if (number[0] === "1") {
    number = complementTwo(number);
    negative = -1;
  }

  return parseInt(number, 2) * negative;
}
