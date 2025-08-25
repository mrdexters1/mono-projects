import { asPipe } from "./asPipe";
import { Invariant } from "./invariant";
import { isDate, isKeyof, isNullish, isNumber, isString, isValueOf } from "./isType";

export type AsType<Ret = unknown, Arg = unknown> = (data: Arg, k: string) => Ret;
export type TestFnResp = string | undefined | void | null;
export type TestFn<T> = AsType<TestFnResp, T>;

const assertByTestFn = <T>(data: T, varName: string, fn: TestFn<T>) => {
  const msg = fn(data, varName);
  Invariant.withMessage(!msg, [varName, msg].join(", "));
  return data;
};

export const asCustom =
  <T>(fn: TestFn<T>) =>
  (data: T, varName: string) =>
    assertByTestFn(data, varName, fn);

export const asCustomGuard =
  <A, T extends A>(msg: string, fn: (a: A) => a is T) =>
  (data: A, varName: string) => {
    Invariant.withMessage(fn(data), [varName, msg].join(", "));
    return data;
  };

//
// asString
//
export const asString: AsType<string> = (data, varName) => {
  Invariant.withMessage(isString(data), `${varName}, must be a string, got ${typeof data}, "${String(data)}"`);
  return data;
};

export const asStringNonEmpty: AsType<string> = (data, varName) => {
  Invariant.withMessage(
    isString(data) && Boolean(data.trim()),
    `${varName}, must be a non-empty string, got ${typeof data}, "${String(data)}"`,
  );
  return data;
};

export const asStringCustom =
  (fn: TestFn<string>): AsType<string> =>
  (data, varName) =>
    assertByTestFn(asString(data, varName), varName, fn);

export const asStringRegex = (rx: RegExp, msg = `must match regex ${rx}`): AsType<string> =>
  asStringCustom((str) => (rx.test(str) ? undefined : [msg, ", got ", str].join("")));

export const asStringEnum = <V extends string>(vals: Set<V> | V[] | Record<V, unknown>): AsType<V> => {
  const set = Array.isArray(vals) ? new Set(vals) : vals instanceof Set ? vals : new Set(Object.keys(vals));
  const valid = Array.from(set).join(", ");
  return asStringCustom((s) => (set.has(s) ? undefined : `must be one of ${valid}, got ${s}`)) as AsType<V>;
};

const toValues = <T extends Record<string, string>>(obj: T) => Object.values(obj) as Array<T[keyof T]>;
export const asStringByEnumRecord = <V extends string, T extends Record<string, V>>(vals: T): AsType<V> =>
  asStringEnum(toValues(vals));

export const asValueOf =
  <V>(obj: Record<string | number, V>): AsType<V> =>
  (v: unknown) => {
    Invariant.withMessage(isValueOf(obj, v), `must be one of ${Object.keys(obj).join(", ")}, got ${v}`);
    return v;
  };

//
// asNumber
//
export const asNumber: AsType<number> = (data, varName) => {
  const n = Number(data);
  Invariant.withMessage(isNumber(n), `${varName}, must be a number, got ${typeof data}, "${String(data)}"`);
  return n;
};

export const asNumberCustom =
  (fn: TestFn<number>): AsType<number> =>
  (data, varName) =>
    assertByTestFn(asNumber(data, varName), varName, fn);

export const asNumberInBounds = ({
  minExclusive,
  min,
  maxExclusive,
  max,
  float = false,
}: Partial<
  { float: boolean } & ({ minExclusive: number; min: never } | { minExclusive: never; min: number }) &
    ({ maxExclusive: number; max: never } | { maxExclusive: never; max: number })
>) =>
  asNumberCustom((n) => {
    if (minExclusive !== undefined && n <= minExclusive) {
      return `must be greater than ${minExclusive}`;
    }
    if (maxExclusive !== undefined && n >= maxExclusive) {
      return `must be less than ${maxExclusive}`;
    }
    if (min !== undefined && n < min) {
      return `must be greater than or equal to ${min}`;
    }
    if (max !== undefined && n > max) {
      return `must be less than or equal to ${max}`;
    }
    if (!float && Math.floor(n) !== n) {
      return `must be an integer`;
    }
  });

//
// asDate
//
export const asDate: AsType<Date> = (data, varName): Date => {
  const n = Number(data);
  const dn = isNumber(n) ? n : isString(data) ? Date.parse(data) : NaN;
  const d = new Date(dn);
  Invariant.withMessage(isDate(d), `${varName}, must be a valid date`);
  return d;
};

export const asDateCustom =
  (fn: TestFn<Date>): AsType<Date> =>
  (data, varName): Date =>
    assertByTestFn(asDate(data, varName), varName, fn);

//
// asBoolean
//
const BOOL_MAP = {
  true: true,
  on: true,
  "1": true,
  yes: true,
  enabled: true,
  false: false,
  off: false,
  "0": false,
  no: false,
  disabled: false,
};
export const asBooleanStrict: AsType<boolean> = asPipe(asStringEnum(BOOL_MAP)).pipe((k) => BOOL_MAP[k]).run;

export const asBooleanLoose: AsType<boolean> = (data) =>
  isString(data) && isKeyof(data, BOOL_MAP) ? BOOL_MAP[data] : false;

//
// asOptional
//
export const asOptional: {
  <T>(fn: AsType<T>): AsType<T | undefined>;
  <T>(fn: AsType<T>, param: { default: T }): AsType<T>;
} =
  (fn, param: { default?: unknown } = {}) =>
  (data, varName) => {
    if (isNullish(data)) {
      return param.default;
    }
    try {
      return fn(data, varName);
    } catch {
      return param.default;
    }
  };
