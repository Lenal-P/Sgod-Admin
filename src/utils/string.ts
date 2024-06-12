export function isEmptyString(inputString: string) {
  return inputString.length === 0;
}

export function capitalize(inputString: string): string {
  const array = inputString.trim().toLowerCase().split(" ");
  const result = array.map(x => x.charAt(0).toUpperCase() + x.slice(1)
  )

  return result.join(" ");
};
