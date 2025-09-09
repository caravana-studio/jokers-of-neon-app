export function snakeToCamel(str: string): string {
  return str.replace(/_([a-zA-Z0-9])/g, (_, char) => char.toUpperCase());
}
