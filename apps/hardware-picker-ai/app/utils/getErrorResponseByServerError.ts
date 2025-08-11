import type { HttpError } from "./api/HttpError";

export type ErrorResponse = {
  errorCode: string;
  message: string;
  status: number;
};

const STANDARD_MSG = "Internal Server Error";

export const getErrorResponseByServerError = (serverError: HttpError): ErrorResponse => ({
  errorCode: serverError.code,
  message: serverError.isPublic ? serverError.message : STANDARD_MSG,
  status: serverError.status,
});
