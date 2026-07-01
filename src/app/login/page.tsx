"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("test@turneus.ro");
  const [password, setPassword] = useState("parola123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      setError(data.error);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main
      style={{
        maxWidth: 420,
        margin: "80px auto",
        fontFamily: "Arial",
      }}
    >
      <h1>Turneus Login</h1>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 15 }}>
          <label>Email</label>

          <input
            style={{ width: "100%", padding: 10 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>Parolă</label>

          <input
            type="password"
            style={{ width: "100%", padding: 10 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Se autentifică..." : "Login"}
        </button>

        {error && (
          <p style={{ color: "red", marginTop: 20 }}>
            {error}
          </p>
        )}
      </form>
    </main>
  );
}
