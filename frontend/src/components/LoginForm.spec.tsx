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
    const mockFetch = jest.fn().mockImplementation((url: any) => {
      if (typeof url === "string" && url.includes("/auth/login")) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              accessToken: "mock-token",
              user: { email: "test@example.com" },
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          )
        );
      }
      return Promise.reject(new Error("Unexpected fetch: " + url));
    });

    const originalFetch = globalThis.fetch;
    Object.defineProperty(globalThis, "fetch", {
      value: mockFetch,
      writable: true,
    });

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("mock-token");
    });

    // restore
    Object.defineProperty(globalThis, "fetch", {
      value: originalFetch,
      writable: true,
    });
  });
});
