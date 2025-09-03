export type FileItem = {
  key: string;
  size: number;
  lastModified: string | number | Date;
};

export type LoginResponse = {
  accessToken: string;
  user: { sub?: string; email: string };
};
