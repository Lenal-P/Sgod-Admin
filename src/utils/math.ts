export function randomNumbers(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


export function generateRandom(length = 1, includeNumbers = true, includeString = false, includeSymbols = false): string {
  let result = '';
  let characters = '';

  if (includeString) {
    characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  }

  if (includeNumbers) {
    characters += '0123456789';
  }

  if (includeSymbols) {
    characters += '!@#$%^&*()_+[]{}|;:,.<>?';
  }

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}