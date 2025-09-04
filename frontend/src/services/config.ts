declare const __API_BASE__: string | undefined;
declare global {
  interface Window {
    __API_URL__?: string;
  }
}

const fromDefine = (typeof __API_BASE__ !== "undefined" && __API_BASE__) || "";

const fromWindow = (typeof window !== "undefined" && window.__API_URL__) || "";

const runtimeOrigin =
  typeof window !== "undefined" ? `${window.location.origin}/api` : "";

export const API_URL = fromWindow || fromDefine || runtimeOrigin;

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
];
