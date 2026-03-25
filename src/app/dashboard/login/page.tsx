"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      setError("Contraseña incorrecta");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight:"100vh", background:"#06080f", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"system-ui,sans-serif" }}>
      <div style={{ background:"#0d1117", border:"1px solid #1e2535", borderRadius:"16px", padding:"40px", width:"100%", maxWidth:"380px" }}>
        <h1 style={{ color:"#14C9B8", fontWeight:800, fontSize:"1.4rem", marginBottom:"8px" }}>Dashboard SEED</h1>
        <p style={{ color:"#7a8299", fontSize:"15px", marginBottom:"24px" }}>Introduce la contraseña para continuar</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width:"100%", background:"#111827", border:"1px solid #1e2535", color:"#fff",
              borderRadius:"10px", padding:"14px 16px", fontSize:"16px", boxSizing:"border-box" }}
          />
          {error && <p style={{ color:"#f87171", fontSize:"14px", marginTop:"8px" }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ marginTop:"16px", width:"100%", background:"#14C9B8", color:"#06080f",
              border:"none", borderRadius:"10px", padding:"14px", fontSize:"16px", fontWeight:800, cursor:"pointer" }}>
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
