/**
 * Performs a binary operation on two\one binary numbers.
 * e.g. "or", "and", "xor", and "one's complement"
 */
export function binOperation(
  op1: string,
  op2: string,
  operation: "OR" | "AND" | "XOR" | "COM"
) {
  if (operation !== "COM" && op1.length !== op2.length)
    throw new Error("Invalid operands.");

  const operandOne = op1.split("");
  const operandTwo = op2.split("");

  for (let i = 0; i < operandOne.length; i++) {
    switch (operation) {
      case "OR":
        operandOne[i] = (+operandOne[i] | +operandTwo[i]).toString();
        break;
      case "AND":
        operandOne[i] = (+operandOne[i] & +operandTwo[i]).toString();
        break;
      case "XOR":
        operandOne[i] = (+operandOne[i] ^ +operandTwo[i]).toString();
        break;
      case "COM":
        operandOne[i] = (~+operandOne).toString();
        break;
    }
  }

  return operandOne.join("");
}
