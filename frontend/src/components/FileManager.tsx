import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Fade,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LogoutIcon from "@mui/icons-material/Logout";
import DownloadIcon from "@mui/icons-material/Download";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAuth } from "../services/auth";
import * as api from "../services/api";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from "../services/config";
import { FileItem } from "../types";

function prettyBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export default function FileManager() {
  const { token, email, logout } = useAuth();
  const [files, setFiles] = useState<FileItem[] | null>(null);
  const [selected, setSelected] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const allowedText = useMemo(
    () => ALLOWED_MIME_TYPES.map((t) => t.split("/")[1] || t).join(", "),
    []
  );

  async function load() {
    if (!token) return;
    setRefreshing(true);
    try {
      const list = await api.listFiles(token);
      setFiles(list);
    } catch (e: any) {
      setMessage({ type: "error", text: e?.message || "Failed to load files" });
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function onUpload() {
    if (!token || !selected) return;

    // Frontend validation
    if (selected.size > MAX_FILE_SIZE_BYTES) {
      setMessage({
        type: "error",
        text: `File too large. Max ${prettyBytes(MAX_FILE_SIZE_BYTES)}.`,
      });
      return;
    }
    if (
      ALLOWED_MIME_TYPES.length &&
      !ALLOWED_MIME_TYPES.includes(selected.type)
    ) {
      setMessage({
        type: "error",
        text: `Unsupported type. Allowed: ${allowedText}.`,
      });
      return;
    }

    setUploading(true);
    setMessage(null);
    try {
      const { uploadURL, key } = await api.getUploadUrl({
        filename: selected.name,
        contentType: selected.type || "application/octet-stream",
        token,
      });
      await api.putToS3(uploadURL, selected);
      setSelected(null);
      setMessage({ type: "success", text: "Upload complete." });
      // Optimistically update or reload list
      await load();
    } catch (e: any) {
      setMessage({ type: "error", text: e?.message || "Upload failed" });
    } finally {
      setUploading(false);
    }
  }

  async function onDownload(item: FileItem) {
    if (!token) return;
    try {
      const { downloadURL } = await api.getDownloadUrl(token, item.key);
      window.open(downloadURL, "_blank", "noopener,noreferrer");
    } catch (e: any) {
      setMessage({ type: "error", text: e?.message || "Download failed" });
    }
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
      >
        <Typography variant="h4" fontWeight={800}>
          File Storage
        </Typography>
        <Stack direction="row" alignItems="center" gap={1}>
          <Chip label={email ?? "user"} variant="outlined" />
          <Button onClick={logout} startIcon={<LogoutIcon />} variant="text">
            Logout
          </Button>
        </Stack>
      </Stack>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "center" }}
          gap={2}
        >
          <label htmlFor="file-input">
            <input
              id="file-input"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setSelected(e.target.files?.[0] ?? null)}
              accept={ALLOWED_MIME_TYPES.join(",")}
            />
            <Button
              component="span"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              Choose File
            </Button>
          </label>
          <Typography
            variant="body2"
            sx={{ flex: 1, opacity: selected ? 1 : 0.6 }}
          >
            {selected
              ? `${selected.name} — ${prettyBytes(selected.size)}`
              : `Allowed: ${ALLOWED_MIME_TYPES.join(", ")} (max ${prettyBytes(
                  MAX_FILE_SIZE_BYTES
                )})`}
          </Typography>
          <Tooltip
            title={selected ? "Upload selected file" : "Choose a file first"}
          >
            <span>
              <Button
                variant="contained"
                color="secondary"
                disabled={!selected || uploading}
                onClick={onUpload}
              >
                {uploading ? "Uploading…" : "Upload"}
              </Button>
            </span>
          </Tooltip>
        </Stack>
        {uploading && <LinearProgress sx={{ mt: 2 }} />}
      </Paper>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" fontWeight={700}>
          Your Files
        </Typography>
        <Button
          size="small"
          startIcon={<RefreshIcon />}
          onClick={load}
          disabled={refreshing}
        >
          Refresh
        </Button>
      </Stack>

      {message && (
        <Fade in>
          <Alert
            severity={message.type}
            onClose={() => setMessage(null)}
            sx={{ borderRadius: 2 }}
          >
            {message.text}
          </Alert>
        </Fade>
      )}

      <TableContainer component={Paper} elevation={1}>
        <Table size="small" aria-label="files table">
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell width="140">Size</TableCell>
              <TableCell width="220">Last Modified</TableCell>
              <TableCell width="140" align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files === null && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Loading…
                  </Typography>
                  <LinearProgress sx={{ mt: 1 }} />
                </TableCell>
              </TableRow>
            )}
            {files?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" sx={{ opacity: 0.7, py: 2 }}>
                    No files yet. Upload something!
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {files?.map((f) => {
              const idx = f.key.indexOf("/");
              const name = idx >= 0 ? f.key.slice(idx + 1) : f.key;
              const date = new Date(f.lastModified).toLocaleString();
              return (
                <TableRow key={f.key} hover>
                  <TableCell>{name}</TableCell>
                  <TableCell>{prettyBytes(f.size)}</TableCell>
                  <TableCell>{date}</TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => onDownload(f)}
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ opacity: 0.4 }} />
    </Stack>
  );
}
