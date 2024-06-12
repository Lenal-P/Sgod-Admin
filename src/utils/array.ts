
export function removeDuplicates<T>(data: T[]): T[] {
  const uniqueArray = [];
  const stringifiedElements = [];
  for (let i = 0; i < data.length; i++) {
    const stringified = JSON.stringify(data[i]);
    if (stringifiedElements.indexOf(stringified) === -1) {
      uniqueArray.push(data[i]);
      stringifiedElements.push(stringified);
    }
  }

  return uniqueArray;
}

