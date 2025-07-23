import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSendCode = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStep(2);
      } else {
        setError("Failed to send code");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verificationCode: code }),
      });
      const data = await res.json();
      if (res.ok) {
        login(data.accessToken);
        navigate("/");
      } else {
        setError("Invalid code");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGithubLogin = () => {
    window.location.href = "/auth/github/start";
  };

  return (
    <div>
      <h2>Login</h2>

      <button onClick={handleGithubLogin} style={{ marginBottom: "1rem", background: "#333", color: "#fff", padding: "8px", border: "none", borderRadius: "4px", cursor: "pointer" }}>
        🔗 Login with GitHub
      </button>

      {step === 1 ? (
        <>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <button onClick={handleSendCode} disabled={loading}>
            {loading ? "Sending…" : "Send verification code"}
          </button>
        </>
      ) : (
        <>
          <p>Code sent to {email}</p>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Verification Code" />
          <button onClick={handleVerifyCode} disabled={loading}>
            {loading ? "Verifying…" : "Verify & Login"}
          </button>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
