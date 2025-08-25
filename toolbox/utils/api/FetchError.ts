export const HTTPStatus = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
};

export const isHTTPAuthRequired = (status: number) =>
  status === HTTPStatus.UNAUTHORIZED || status === HTTPStatus.FORBIDDEN;

export class FetchError extends Error {
  public static readonly BAD_GATEWAY = 502;

  static fromResponse = (method: string, response: Response) => new FetchError(method, response);
  static is = (error: unknown): error is FetchError => error instanceof FetchError;
  static isLogout = (error: unknown): error is FetchError => FetchError.is(error) && isHTTPAuthRequired(error.status);

  public readonly response: Response;
  public readonly method: string;
  public readonly url: string;
  public readonly status: number;
  public readonly statusText: string;

  constructor(method: string, response: Response) {
    super(`Bad response. ${response.status} ${response.statusText}. Failed to ${method} "${response.url}"`);
    this.response = response;
    this.method = method;
    this.url = response.url;
    this.status = response.status;
    this.statusText = response.statusText;
  }
}
