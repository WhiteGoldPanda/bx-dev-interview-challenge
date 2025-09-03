import React from "react";
import { CssBaseline, ThemeProvider, Container, Box } from "@mui/material";
import theme from "./theme";
import { AuthProvider, useAuth } from "./services/auth";
import FileManager from "./components/FileManager";
import LoginForm from "./components/LoginForm";

function AppContent() {
  const { token } = useAuth();
  return (
    <Container maxWidth="md" sx={{ minHeight: "100vh", py: 6 }}>
      {token ? (
        <FileManager />
      ) : (
        <Box sx={{ display: "grid", placeItems: "center", height: "80vh" }}>
          <LoginForm />
        </Box>
      )}
    </Container>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
