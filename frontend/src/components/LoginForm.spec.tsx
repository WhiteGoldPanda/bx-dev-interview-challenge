/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "../services/auth";
import LoginForm from "./LoginForm";
import "@testing-library/jest-dom";

describe("LoginForm", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
  });

  it("submits and stores token on success", async () => {
    // Minimal stub — avoids using global Response
    const mockFetch = jest.fn().mockImplementation((url: any, init?: any) => {
      if (typeof url === "string" && url.includes("/auth/login")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            accessToken: "mock-token",
            user: { email: "test@example.com" },
          }),
          text: async () => JSON.stringify({ accessToken: "mock-token" }),
        } as any);
      }
      return Promise.reject(new Error("Unexpected fetch: " + url));
    });

    const originalFetch = globalThis.fetch;
    globalThis.fetch = mockFetch;

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("mock-token");
    });

    globalThis.fetch = originalFetch;
  });
});
