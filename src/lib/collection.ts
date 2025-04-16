export const excludeNull = <T>(array: (T | null | undefined)[]): T[] => {
  return array.filter((item): item is T => item !== null && item !== undefined);
};
