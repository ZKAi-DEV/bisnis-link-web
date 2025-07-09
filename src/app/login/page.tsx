"use client";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login with Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    let redirectTo = 
      typeof window !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
        : typeof window !== "undefined"
        ? `${window.location.origin}/dashboard`
        : "/dashboard";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo }
    });
    if (error) setError(error.message);
    setLoading(false);
  };
  
  // Login with email/password
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push("/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-white p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-center mb-2">Masuk ke Dashboard</h1>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded transition"
          disabled={loading}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" width={24} height={24} />
          Masuk dengan Google
        </button>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">atau</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="border rounded px-3 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded px-3 py-2"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded transition"
            disabled={loading}
          >
            Masuk dengan Email
          </button>
        </form>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      </div>
    </div>
  );
} 
