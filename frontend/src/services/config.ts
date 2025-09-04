declare global {
  interface Window {
    __API_URL__?: string;
  }
}
declare const __API_BASE__: string | undefined;

const runtimeOrigin =
  typeof window !== "undefined" ? `${window.location.origin}/api` : "";

const fromWindow = (typeof window !== "undefined" && window.__API_URL__) || "";
const fromDefine = (typeof __API_BASE__ !== "undefined" && __API_BASE__) || "";

export const API_URL =
  fromWindow || fromDefine || runtimeOrigin || "http://localhost:3000/api";

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
];
