import type { TS } from ".";

export class Invariant extends Error {
  public static readonly is = (ex: unknown): ex is Invariant => ex instanceof Invariant;

  public static withError: TS.AssertsWith<Error> = (condition, error) => {
    if (condition) {
      return;
    }
    throw error;
  };

  public static notImplemented = (theThing: string) => Invariant.withMessage(false, `${theThing} is not implemented`);

  public static withMessage: TS.AssertsWith<string> = (condition, message) =>
    Invariant.withError(condition, new Invariant(message));

  public static never = (x: never, eName: string): never => {
    throw Invariant.withMessage(false, `Unexpected value of ${eName} ${x}`);
  };

  constructor(message: string) {
    super(["Invariant:", message].join(" "));
  }
}

/**
 * @deprecated Use `Invariant.withMessage` or `Invariant.withError` instead
 */
export const invariant: TS.AssertsWith<string> = Invariant.withMessage;

export const ensureValue = <T>(value: T | null | undefined, message: string): T => {
  Invariant.withMessage(value !== null && value !== undefined, message);
  return value;
};
