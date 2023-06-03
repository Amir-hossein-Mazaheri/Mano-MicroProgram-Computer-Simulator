export function incBinary(binary: string) {
  const splitted = binary.split("").reverse();

  for (let i = 0; i < splitted.length; i++) {
    if (splitted[i] === "0") {
      splitted[i] = "1";
      break;
    }

    splitted[i] = "0";
  }

  return splitted.reverse().join("");
}
