
export function allPropertiesExist(obj: any): boolean {
  return !JSON.stringify(obj).includes("null");
}

export function validateEmail(email: string): boolean {
  const regex = /^\S+@\S+\.\S+$/;

  return regex.test(email);
};
