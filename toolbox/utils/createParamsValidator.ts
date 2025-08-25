import type { AsType } from "../helpers";
import { Invariant } from "../helpers";

type ValidParams<V extends Record<string, AsType>> = {
  [K in keyof V]: V[K] extends AsType ? ReturnType<V[K]> : never;
};

export const INVALID_PARAM = "Invalid request parameter";
export const isValidatorError = (ex: unknown): ex is Invariant =>
  Invariant.is(ex) && ex.message.includes(INVALID_PARAM);

export const createParamsValidator =
  <V extends Record<string, AsType>>(type: string, validators: V) =>
  (params: Record<string, unknown>) =>
    Object.fromEntries(
      Object.entries(validators).map(([key, asType]) => [
        key,
        asType(params[key], [INVALID_PARAM, `in ${type}:`, key].join(" ")),
      ]),
    ) as ValidParams<V>;
