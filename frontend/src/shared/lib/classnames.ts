type ClassNameValue = string | number | null | false | undefined;

export function cx(...values: ClassNameValue[]) {
  return values.filter(Boolean).join(" ");
}
