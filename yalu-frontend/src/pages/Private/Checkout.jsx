import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import CheckoutInvitado from "../../components/CheckoutInvitado";

export default function Checkout() {
  const [carrito, setCarrito] = useState([]);
  const [direcciones, setDirecciones] = useState([]);
  const [direccionId, setDireccionId] = useState(null);
  const [metodoEntrega, setMetodoEntrega] = useState("courier");
  const [esInvitado, setEsInvitado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCarrito(JSON.parse(localStorage.getItem("carrito") || "[]"));
    const uid = localStorage.getItem("uid");
    api.get(`/usuarios/direcciones/?uid=${uid}`).then((res) => {
      setDirecciones(res.data);
      const principal = res.data.find((d) => d.es_principal);
      if (principal) setDireccionId(principal.id);
      else if (res.data.length > 0) setDireccionId(res.data[0].id);
    });
  }, []);

  const subtotal = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const costoEnvio = metodoEntrega === "courier" ? 10 : 0;
  const total = subtotal + costoEnvio;

  const items = carrito.map((i) => ({
    producto_id: i.id,
    variante_id: i.variante_id || null,
    cantidad: i.cantidad,
  }));

  const confirmar = async () => {
    if (carrito.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const uid = localStorage.getItem("uid") || "";
      const res = await api.post("/ventas/pedidos/crear/", {
        uid,
        metodo_entrega: metodoEntrega,
        costo_envio: costoEnvio,
        tipo_comprobante: "boleta",
        observacion: "",
        items,
      });
      if (res.status !== 201) throw new Error("Error al confirmar");
      localStorage.removeItem("carrito");
      navigate("/pedidos");
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Error al confirmar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  const confirmarInvitado = async ({ nombre, dni, correo, captchaToken }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/ventas/pedidos/crear-invitado/", {
        nombre,
        dni,
        correo,
        captcha_token: captchaToken,
        metodo_entrega: metodoEntrega,
        costo_envio: costoEnvio,
        tipo_comprobante: "boleta",
        items,
      });
      if (res.status !== 201) throw new Error("Error al confirmar");
      localStorage.removeItem("carrito");
      navigate("/pedidos");
    } catch (e) {
      setError(e.response?.data?.error || e.message || "Error al confirmar el pedido.");
    } finally {
      setLoading(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="container py-4 text-center">
        <div style={{ fontSize: "3rem" }}>🛒</div>
        <p style={{ color: "#555", marginTop: "12px" }}>No hay productos en el carrito</p>
        <button onClick={() => navigate("/productos")} style={{
          background: "#F97316", color: "#fff", border: "none",
          borderRadius: "12px", padding: "10px 24px", cursor: "pointer", fontWeight: 600, marginTop: "12px"
        }}>Ver productos</button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <button onClick={() => navigate("/carrito")} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", marginBottom: "20px" }}>
        ← Volver al carrito
      </button>
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, marginBottom: "24px" }}>Checkout</h2>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <button onClick={() => setEsInvitado(false)} style={{
          padding: "8px 20px", borderRadius: "10px", fontWeight: 600, cursor: "pointer", border: "none",
          background: !esInvitado ? "#F97316" : "#E5E5E5",
          color: !esInvitado ? "#fff" : "#333",
        }}>Con mi cuenta</button>
        <button onClick={() => setEsInvitado(true)} style={{
          padding: "8px 20px", borderRadius: "10px", fontWeight: 600, cursor: "pointer", border: "none",
          background: esInvitado ? "#F97316" : "#E5E5E5",
          color: esInvitado ? "#fff" : "#333",
        }}>Como invitado</button>
      </div>

      <div className="row g-4">
        <div className="col-12 col-md-7">
          <div style={{ background: "#161616", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
            <p style={{ color: "#aaa", fontSize: "0.8rem", marginBottom: "12px" }}>MÉTODO DE ENTREGA</p>
            <div className="d-flex gap-3">
              {[
                { value: "courier", label: "🚚 Courier", sub: "+S/. 10.00" },
                { value: "recojo", label: "🏪 Recojo en tienda", sub: "Gratis" },
              ].map((m) => (
                <div key={m.value} onClick={() => setMetodoEntrega(m.value)} style={{
                  flex: 1, padding: "14px", borderRadius: "12px", cursor: "pointer",
                  background: metodoEntrega === m.value ? "rgba(249,115,22,0.15)" : "#2A2A2A",
                  border: metodoEntrega === m.value ? "1px solid #F97316" : "1px solid #3A3A3A"
                }}>
                  <p style={{ fontWeight: 600, marginBottom: "2px", color: "#fff" }}>{m.label}</p>
                  <p style={{ color: "#aaa", fontSize: "0.8rem", marginBottom: 0 }}>{m.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {!esInvitado && metodoEntrega === "courier" && (
            <div style={{ background: "#161616", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
              <p style={{ color: "#aaa", fontSize: "0.8rem", marginBottom: "12px" }}>DIRECCIÓN DE ENTREGA</p>
              {direcciones.length === 0 && (
                <p style={{ color: "#FF4E4E", fontSize: "0.85rem" }}>No tienes direcciones guardadas. Agrega una en tu perfil.</p>
              )}
              <div className="d-flex flex-column gap-2">
                {direcciones.map((d) => (
                  <div key={d.id} onClick={() => setDireccionId(d.id)} style={{
                    padding: "14px", borderRadius: "12px", cursor: "pointer",
                    background: direccionId === d.id ? "rgba(207,238,59,0.08)" : "#2A2A2A",
                    border: direccionId === d.id ? "1px solid #CFEE3B" : "1px solid #3A3A3A"
                  }}>
                    <p style={{ fontWeight: 600, marginBottom: "2px", color: "#fff" }}>{d.direccion_detallada}</p>
                    <p style={{ color: "#aaa", fontSize: "0.8rem", marginBottom: 0 }}>{d.distrito}, {d.provincia}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {esInvitado && (
            <CheckoutInvitado
              onConfirmar={confirmarInvitado}
              loading={loading}
              error={error}
            />
          )}
        </div>

        <div className="col-12 col-md-5">
          <div style={{ background: "#161616", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "20px" }}>
            <p style={{ color: "#aaa", fontSize: "0.8rem", marginBottom: "16px" }}>RESUMEN</p>
            <div className="d-flex flex-column gap-2 mb-3">
              {carrito.map((i, idx) => (
                <div key={idx} className="d-flex justify-content-between" style={{ fontSize: "0.85rem" }}>
                  <span style={{ color: "#ccc" }}>{i.nombre} x{i.cantidad}</span>
                  <span style={{ color: "#fff" }}>S/. {(i.precio * i.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #2A2A2A", paddingTop: "12px" }} className="d-flex flex-column gap-2">
              <div className="d-flex justify-content-between">
                <span style={{ color: "#aaa" }}>Subtotal</span>
                <span style={{ color: "#fff" }}>S/. {subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span style={{ color: "#aaa" }}>Envío</span>
                <span style={{ color: "#fff" }}>S/. {costoEnvio.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between" style={{ borderTop: "1px solid #2A2A2A", paddingTop: "12px" }}>
                <span style={{ fontWeight: 700, color: "#fff" }}>Total</span>
                <span style={{ fontWeight: 700, color: "#CFEE3B", fontSize: "1.1rem" }}>S/. {total.toFixed(2)}</span>
              </div>
            </div>

            {error && <p style={{ color: "#FF4E4E", fontSize: "0.85rem", marginTop: "12px" }}>{error}</p>}

            {!esInvitado && (
              <button onClick={confirmar} disabled={loading} style={{
                width: "100%", background: loading ? "#555" : "#F97316",
                color: "#fff", border: "none", borderRadius: "12px",
                padding: "14px", fontWeight: 700, fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer", marginTop: "16px"
              }}>
                {loading ? "Confirmando..." : "Confirmar pedido"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
