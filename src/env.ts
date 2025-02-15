export function env(key: string): string | undefined {
  return process.env[key];
}

export function envOrThrow(key: string): string {
  const value = env(key);
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}
