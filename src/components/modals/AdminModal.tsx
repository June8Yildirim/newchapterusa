import { useState, type FormEvent } from "react";
import { Modal } from "../../Modal";
import { Button } from "../Button/Button";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "ncwenusa@gmail.com";
const ADMIN_PASSWORD_12 = import.meta.env.VITE_ADMIN_PASSWORD || "Ncwen2026!Ad";

export function AdminModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  lang?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const enteredEmail = email.trim().toLowerCase();
    const enteredPass = password.trim();
    const expectedEmail = ADMIN_EMAIL.trim().toLowerCase();
    const expectedPass = ADMIN_PASSWORD_12.trim();

    if (enteredEmail === expectedEmail && enteredPass === expectedPass) {
      localStorage.setItem("ncwen_admin_authenticated", "true");
      localStorage.setItem("ncwen_admin_email", enteredEmail);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.href = "/admin";
      }, 700);
    } else {
      setError("Invalid admin email or password.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Admin Sign In"
      style={{ maxWidth: "440px" }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <p style={{ margin: 0, fontSize: "14px", color: "var(--ink-soft)" }}>
          Please sign in with your admin credentials to access content editing.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>
            Email
          </label>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              fontSize: "14px",
              width: "100%",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>
            Password
          </label>
          <input
            type="password"
            placeholder="12-character password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "10px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              fontSize: "14px",
              width: "100%",
            }}
          />
        </div>

        {error && (
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "6px",
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#991b1b",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {isSuccess && (
          <div
            style={{
              padding: "10px 12px",
              borderRadius: "6px",
              background: "#dcfce7",
              border: "1px solid #86efac",
              color: "#166534",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            ✅ Authenticated successfully! Opening Editor…
          </div>
        )}

        <Button variant="gold" block type="submit">
          Sign In &amp; Edit Content
        </Button>
      </form>
    </Modal>
  );
}
