/* eslint-disable @typescript-eslint/no-explicit-any */
const fromImportMeta =
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_API_URL) ||
  undefined;

const fromProcess =
  (typeof process !== "undefined" && (process as any).env?.VITE_API_URL) ||
  (typeof process !== "undefined" && (process as any).env?.API_URL) ||
  undefined;

const fromWindow =
  typeof window !== "undefined" ? window.__API_URL__ : undefined;

export const API_URL: string =
  (fromImportMeta as string) ||
  (fromProcess as string) ||
  (fromWindow as string) ||
  "http://localhost:3000/api";

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
];
