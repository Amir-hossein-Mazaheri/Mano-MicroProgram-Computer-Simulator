/**
 * Increment input binary without the need of converting it to decimal
 */
export function incBinary(binary: string) {
  const splitted = binary.split("");

  for (let i = splitted.length - 1; i >= 0; i--) {
    if (splitted[i] === "0") {
      splitted[i] = "1";
      break;
    }

    splitted[i] = "0";
  }

  return splitted.join("");
}
