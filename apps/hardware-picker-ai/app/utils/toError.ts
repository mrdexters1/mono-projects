export const toError = (ex: unknown | Error, msg = String(ex)) => (ex instanceof Error ? ex : new Error(msg));
