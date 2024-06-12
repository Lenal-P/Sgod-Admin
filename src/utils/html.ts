export function sanitizeHTML(inputString: string): string {
  const div = document.createElement("div");
  div.textContent = inputString;

  return div.innerHTML;
};
