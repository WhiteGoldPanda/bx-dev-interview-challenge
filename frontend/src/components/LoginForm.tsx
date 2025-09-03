import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../services/auth";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("test@example.com"); // demo default
  const [password, setPassword] = useState("Pass123"); // demo default
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErr(e.message);
      } else {
        setErr("Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card elevation={6} sx={{ width: 420 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Sign in to continue
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <TextField
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {err && <Alert severity="error">{err}</Alert>}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              endIcon={loading ? <CircularProgress size={18} /> : null}
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
