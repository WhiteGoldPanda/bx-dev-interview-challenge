declare global {
  interface Window {
    __API_URL__?: string;
  }
}

const fromWindow =
  (typeof window !== "undefined" && window.__API_URL__) || undefined;

// In Jest/node these may be undefined – that's fine
const fromEnv =
  (process.env as any)?.VITE_API_URL ||
  (process.env as any)?.API_URL ||
  undefined;

export const API_URL: string =
  (fromWindow as string) || (fromEnv as string) || "http://localhost:3000";

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
];
