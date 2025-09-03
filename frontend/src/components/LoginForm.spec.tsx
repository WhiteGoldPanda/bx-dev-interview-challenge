import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm";
import { AuthProvider } from "../services/auth";

describe("LoginForm", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("submits and stores token on success", async () => {
    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/auth/login")) {
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
      return Promise.reject(new Error("Unexpected fetch"));
    });
    (global as any).fetch = mockFetch;

    render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("mock-token");
    });
  });
});
