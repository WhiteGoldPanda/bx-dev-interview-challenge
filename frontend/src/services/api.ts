import { API_URL } from "./config";
import { FileItem, LoginResponse } from "../types";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return json<LoginResponse>(res);
}

export async function getUploadUrl(params: {
  filename: string;
  contentType: string;
  token: string;
}): Promise<{ uploadURL: string; key: string }> {
  const res = await fetch(`${API_URL}/files/upload-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify({
      filename: params.filename,
      contentType: params.contentType,
    }),
  });
  return json(res);
}

export async function listFiles(token: string): Promise<FileItem[]> {
  const res = await fetch(`${API_URL}/files`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return json(res);
}

export async function getDownloadUrl(
  token: string,
  key: string
): Promise<{ downloadURL: string }> {
  const res = await fetch(
    `${API_URL}/files/download-url?key=${encodeURIComponent(key)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return json(res);
}

// PUT directly to S3 pre-signed URL
export async function putToS3(uploadURL: string, file: File): Promise<void> {
  const res = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || res.statusText);
  }
}
