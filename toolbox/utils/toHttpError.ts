import { FetchError } from "./api/FetchError";
import { HttpBadGateway, HttpError, HttpInternalServerError, HttpInvalidParam, HttpNeedAuth } from "./api/HttpError";
import { isValidatorError } from "./createParamsValidator";

export const toHttpError = (ex: unknown): HttpError => {
  if (HttpError.is(ex)) {
    return ex;
  }

  // Bad parameter
  if (isValidatorError(ex)) {
    return HttpError.create(HttpInvalidParam.code, HttpInvalidParam.status, ex);
  }

  // Inter-service communication error
  if (FetchError.is(ex)) {
    if (FetchError.isLogout(ex.status)) {
      return HttpError.create(HttpNeedAuth.code, HttpNeedAuth.status, ex);
    }
    // Get last segment of the url
    // GET https://example.com/api/v1/coins/my-coins?chain=ethereum => 'get my-coins' => GET_MY_COINS
    const errCode = [ex.method, ex.url.split("?")[0].split("/").pop()].join(" ");
    return HttpError.create(errCode, HttpBadGateway.status, ex);
  }

  // Other Invariant or Unexpected error
  return HttpError.create(HttpInternalServerError.code, HttpInternalServerError.status, ex);
};
