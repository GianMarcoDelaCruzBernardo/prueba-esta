import { useState, useRef } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";

const SITEKEY = "702220f6-72ac-4296-b5c2-cece0b069960";

export default function CheckoutInvitado({ onConfirmar, loading, error }) {
  const [form, setForm] = useState({ nombre: "", dni: "", correo: "" });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [formError, setFormError] = useState(null);
  const captchaRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return setFormError("El nombre es obligatorio.");
    if (!/^\d{8}$/.test(form.dni)) return setFormError("El DNI debe tener 8 dígitos.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo))
      return setFormError("Ingresa un correo válido.");
    if (!captchaToken) return setFormError("Por favor completa el CAPTCHA.");
    onConfirmar({ ...form, captchaToken });
  };

  return (
    <div style={{ background: "#161616", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
      <p style={{ color: "#777", fontSize: "0.8rem", marginBottom: "16px" }}>DATOS DEL CLIENTE INVITADO</p>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Nombre completo</label>
          <input name="nombre" value={form.nombre} onChange={handleChange}
            placeholder="Ej. Juan Pérez" style={inputStyle} />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>DNI</label>
          <input name="dni" value={form.dni} onChange={handleChange}
            placeholder="12345678" maxLength={8} style={inputStyle} />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Correo electrónico</label>
          <input name="correo" type="email" value={form.correo} onChange={handleChange}
            placeholder="tucorreo@ejemplo.com" style={inputStyle} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <HCaptcha
            sitekey={SITEKEY}
            onVerify={(token) => setCaptchaToken(token)}
            onExpire={() => setCaptchaToken(null)}
            ref={captchaRef}
            theme="dark"
          />
        </div>

        {(formError || error) && (
          <p style={{ color: "#FF4E4E", fontSize: "0.85rem", marginBottom: "12px" }}>
            {formError || error}
          </p>
        )}

        <button type="submit" disabled={loading} style={{
          width: "100%", background: loading ? "#555" : "#F97316",
          color: "#fff", border: "none", borderRadius: "12px",
          padding: "14px", fontWeight: 700, fontSize: "1rem",
          cursor: loading ? "not-allowed" : "pointer"
        }}>
          {loading ? "Confirmando..." : "Confirmar pedido"}
        </button>
      </form>
    </div>
  );
}

const labelStyle = {
  display: "block", color: "#aaa", fontSize: "0.8rem",
  marginBottom: "6px", fontWeight: 600,
  textTransform: "uppercase", letterSpacing: "0.05em",
};

const inputStyle = {
  width: "100%", background: "#1F1F1F", border: "1px solid #2A2A2A",
  borderRadius: "10px", padding: "12px 14px", color: "#fff",
  fontSize: "0.95rem", outline: "none",
};