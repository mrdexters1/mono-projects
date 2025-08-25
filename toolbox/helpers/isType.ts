export const isRecord = (data: unknown): data is Record<string, unknown> => typeof data === "object" && data !== null;

export const isArray = <T>(data: unknown): data is T[] => Array.isArray(data);

export const isKeyof = <O extends Record<string, unknown>>(k: string, obj: O): k is keyof O & string => k in obj;

export const isString = (data: unknown): data is string => typeof data === "string";

export const isNumericString = (data: unknown): data is string => isNumber(Number(data));

export const isNumber = (data: unknown): data is number => typeof data === "number" && !Number.isNaN(data);

export const isDate = (data: unknown): data is Date => data instanceof Date && !Number.isNaN(data.getTime());

export const isBoolean = (data: unknown): data is boolean => typeof data === "boolean";

/**
 * Checks if a value is one of the values of an object.
 */
export const isValueOf = <O extends Record<string, unknown>>(obj: O, value: unknown): value is O[keyof O] => {
  for (const k of Object.keys(obj)) {
    if (obj[k] === value) {
      return true;
    }
  }
  return false;
};

/**
 * Checks if a value is an array of a minimum length.
 * @example
 * isArrayOfMinLength([1, 2, 3], 2); // true
 */
export const isArrayOfMinLength = <T>(data: unknown, minLength: number): data is T[] =>
  isArray(data) && data.length >= minLength;

export const hasKeys = <K extends string>(obj: Record<K, unknown>, keys: K[]): obj is Record<K, unknown> =>
  keys.every((key) => key in obj);

export const hasKeysByUnknown = <K extends string>(obj: unknown, keys: K[]): obj is Record<K, unknown> =>
  isRecord(obj) && hasKeys<K>(obj, keys);

export const isNullish = (value: unknown): value is null | undefined => value == null;
export const isNotNullish = <T>(value: T | null | undefined): value is T => !isNullish(value);
