declare global {
  interface Window {
    __API_URL__?: string;
  }
}

const fromWindow =
  (typeof window !== "undefined" && window.__API_URL__) || undefined;

const fromProcess =
  typeof process !== "undefined" && (process as NodeJS.Process)?.env
    ? (process as NodeJS.Process).env.VITE_API_URL || (process as NodeJS.Process).env.API_URL
    : undefined;

export const API_URL: string =
  (fromWindow as string) || (fromProcess as string) || "http://localhost:3000";

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
];
