"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function SignInForm() {
  const { login } = useAuth();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isEmail = credential.includes("@");
      await login(
        isEmail
          ? { email: credential, password }
          : { username: credential, password }
      );
      toast.success("Signed in successfully!");
      navigate("/home");
    } catch (err: any) {
      console.error("Login failed:", err);

      let message = "Invalid username/email or password";
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === "object") {
          message = Object.entries(data)
            .map(([key, value]) => `${key}: ${(value as string[]).join(", ")}`)
            .join("\n");
        } else {
          message = data;
        }
      }

      setError(message);
      toast.error(`${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-gradient-maroon">
          Sign In
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="pb-2" htmlFor="credential">
              Username
            </Label>
            <Input
              id="credential"
              type="text"
              placeholder="username"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              disabled={loading}
              required
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <Label className="pb-2" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center whitespace-pre-line">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold rounded-md bg-linear-to-r from-[#800000] via-[#b22222] to-[#800000] text-white hover:opacity-90 transition hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
