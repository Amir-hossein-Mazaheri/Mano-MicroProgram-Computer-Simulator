/**
 * Super useful utility function to convert a number to binary string
 * and fixing its length to the specified length without worrying about
 * the sign of the number.
 */
export function toBin(n: number | string, l: number | null = null) {
  const number = typeof n === "string" ? parseInt(n, 16) : n;
  let bin = (number >= 0 ? number : number >>> 0).toString(2);

  if (l) {
    const isNegative = number < 0;

    if (isNegative) {
      if (bin.length > l) {
        bin = bin.slice(bin.length - l);
      } else {
        bin = bin.padStart(l, "1");
      }
    } else {
      if (bin.length < l) {
        bin = bin.padStart(l, "0");
      } else {
        bin = bin.slice(bin.length - l);
      }
    }
  }

  return bin;
}
