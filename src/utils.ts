export function toHundredths(str: string) {
  const parts = str.split(".");
  const intPart = parts[0] || "0";
  const decPart = (parts[1] || "0").padEnd(2, "0").slice(0, 2);
  return Number(intPart) * 100 + Number(decPart);
}
