import { Invariant } from "./invariant";

export const isServer = typeof window === "undefined" || "Deno" in globalThis;

export const onlyServer = () => Invariant.withMessage(isServer, "should be called server-side only");
export const onlyBrowser = () => Invariant.withMessage(!isServer, "should be called client-side only");

export const ifWindow = <T>(dflt: T, fn: (w: Window) => T) => (typeof window === "undefined" ? dflt : fn(window));
