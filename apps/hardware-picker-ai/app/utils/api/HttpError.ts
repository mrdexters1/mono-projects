import { HttpStatus, toScreamingSnakeCase } from "@/toolbox";
import { toError } from "../toError";

export namespace HttpError {
  export type Params = {
    /**
     * Error code
     * @example 'BAD_INPUT' | 'CANNOT_FETCH_TRENDING_TOKENS'
     */
    code: string;
    status?: number;
    exception?: unknown;
  };
}

export class HttpError extends Error {
  static is = (error: unknown): error is HttpError => Boolean(error) && error instanceof HttpError;

  static create = (
    code: HttpError.Params["code"],
    status?: HttpError.Params["status"],
    exception?: HttpError.Params["exception"],
  ) => (HttpError.is(exception) ? exception : new HttpError({ code, status, exception }));

  public readonly code: string = "UNKNOWN";
  public readonly status: number = HttpStatus.INTERNAL_SERVER_ERROR;
  public readonly originalException: unknown;
  public readonly isPublic: boolean;

  constructor({ code, status: httpCode = HttpStatus.INTERNAL_SERVER_ERROR, exception }: HttpError.Params) {
    const msg =
      exception instanceof Error
        ? exception.message
        : typeof exception === "string"
          ? exception
          : [typeof exception, String(exception)].join(": ");
    super(msg);

    this.code = toScreamingSnakeCase(code);
    this.status = httpCode;
    this.originalException = exception;
    this.isPublic = httpCode < HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception) {
      this.stack = toError(exception).stack;
    }
  }

  toJSON = () => ({
    code: this.code,
    isPublic: this.isPublic,
    status: this.status,
    message: this.message,
    stack: this.stack,
  });
}

export const HttpMethodNotAllowed = HttpError.create("METHOD_NOT_ALLOWED", HttpStatus.METHOD_NOT_ALLOWED);
export const HttpInvalidParam = HttpError.create("INVALID_PARAM", HttpStatus.UNPROCESSABLE_CONTENT);
export const HttpNotFound = HttpError.create("NOT_FOUND", HttpStatus.NOT_FOUND);
export const HttpInternalServerError = HttpError.create("INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR);
export const HttpNeedAuth = HttpError.create("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
export const HttpBadGateway = HttpError.create("BAD_GATEWAY", HttpStatus.BAD_GATEWAY);
