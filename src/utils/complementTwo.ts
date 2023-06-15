export function complementTwo(binary: string) {
  let hasReachedFirstOne = false;

  const bin = binary.split("");

  for (let i = bin.length - 1; i >= 0; i--) {
    if (!hasReachedFirstOne) {
      if (bin[i] === "1") {
        hasReachedFirstOne = true;
      }

      continue;
    }

    bin[i] = bin[i] === "0" ? "1" : "0";
  }

  return bin.join("");
}
