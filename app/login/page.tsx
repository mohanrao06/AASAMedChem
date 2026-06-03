"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Auto-fill seeded test credentials for convenience during development
    if (!role) return;

    if (role === "ADMIN") {
      setEmail("admin@test.com");
      setPassword("admin123");
    }

    if (role === "SELLER") {
      setEmail("seller@test.com");
      setPassword("seller123");
    }

    if (role === "BUYER") {
      setEmail("buyer@test.com");
      setPassword("buyer123");
    }
  }, [role]);

  async function login() {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Login failed");
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));

    if (data.role === "ADMIN") {
      router.push("/admin");
      return;
    }

    if (data.role === "SELLER") {
      router.push("/seller");
      return;
    }

    if (data.role === "BUYER") {
      router.push("/buyer");
      return;
    }
  }

  return (
    <main className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          {role ? `${role.toLowerCase()} login` : "Welcome back"}
        </p>
        <h1 className="text-4xl font-semibold text-slate-950">
          {role ? `Sign in as ${role.toLowerCase()}` : "Login to your account"}
        </h1>
        <p className="text-slate-600">
          {role
            ? `Enter your ${role.toLowerCase()} email and password to continue.`
            : "Use your registered email and password to continue."}
        </p>

        {role && (
          <div className="mt-2 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
            Tip: Using test credentials for <strong>{role}</strong> will auto-fill the form.
          </div>
        )}
      </div>

      <div className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
            placeholder="name@example.com"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-slate-500 focus:outline-none"
            placeholder="Enter your password"
          />
        </label>

        <button
          onClick={login}
          className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-white transition hover:bg-slate-800"
        >
          Login
        </button>
      </div>
    </main>
  );
}
