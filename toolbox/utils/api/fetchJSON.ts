import type { APILib } from "../../helpers";
import { HttpStatus } from "../../helpers";
import { FetchError } from "./FetchError";

const throwError = (resp: Response, params: { method: string; json: unknown }) => {
  throw FetchError.fromResponse(params.method, resp);
};

const dummyType = <T>(_resp: unknown): _resp is T => true;

export const fetchJSON = async <T>({
  url,
  body,
  authToken,
  headers,
  initParams,
  method = body ? "POST" : "GET",
  handleBadResponse = throwError,
  response,
  ignoreResponse = false,
}: {
  url: string;
  response: (arg: unknown) => arg is T;
  // (string & { kind?: never }) is to help inverence to suggest GET, POST, etc
  // any other string will be allowed too (e.g. get, pOsT)
  method?: APILib.HTTPMethods | (string & { kind?: never });
  handleBadResponse?: (response: Response, params: { method: string; json: unknown }) => T | Promise<T>;
  authToken?: string;
  headers?: Partial<Record<string, string>>;
  body?: unknown;
  initParams?: Omit<RequestInit, "body" | "method" | "headers">;
  ignoreResponse?: boolean;
}): Promise<T> => {
  const isMultipartFormData = body instanceof FormData;

  const resp = await fetch(url, {
    ...initParams,
    method,
    headers: {
      Authorization: !authToken ? "" : `Bearer ${authToken}`,
      // note that we're sending undefined as the content-type for multipart form data
      // so that the browser can set the Form Boundary automatically
      // e.g. "multipart/form-data; boundary=----WebKitFormBoundaryXv69Ab9VnAAZqnlG"
      ...(isMultipartFormData ? undefined : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: isMultipartFormData ? body : body && method !== "GET" ? JSON.stringify(body) : undefined,
    window: null,
  });

  if (!resp.ok) {
    if (resp.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      void Promise.resolve().then((responseText) => {
        console.error(["fetchJSON", "NOT_OK"], {
          method,
          url,
          status: resp.status,
          statusText: resp.statusText,
          responseText,
        });
      });
    }

    return await handleBadResponse(resp, { method, json: undefined });
  }

  if (ignoreResponse) {
    return undefined as T;
  }

  const json = (await resp.json()) as unknown;
  if (!response(json)) {
    console.error(["fetchJSON", "BAD_TYPE"], {
      method,
      url,
      status: resp.status,
      statusText: resp.statusText,
      resp,
      body,
    });
    return await handleBadResponse(resp, { method, json });
  }
  return json;
};

fetchJSON.error = FetchError.fromResponse;
fetchJSON.as = dummyType;
