import { useEffect, useState } from "react";
import api from "../../services/axios";

const ESTADO_COLOR = {
  pendiente: { bg: "rgba(249,115,22,0.15)", color: "#F97316" },
  en_preparacion: { bg: "rgba(234,179,8,0.15)", color: "#EAB308" },
  enviado: { bg: "rgba(59,130,246,0.15)", color: "#3B82F6" },
  completado: { bg: "rgba(34,197,94,0.15)", color: "#22C55E" },
  cancelado: { bg: "rgba(255,78,78,0.15)", color: "#FF4E4E" },
};

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abierto, setAbierto] = useState(null);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    api.get(`/ventas/pedidos/?uid=${uid}`)
      .then((res) => setPedidos(res.data))
      .finally(() => setLoading(false));
  }, []);

  const toggleDetalle = (id) => setAbierto(abierto === id ? null : id);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>Mis Pedidos</h2>
        <span style={{ color: "#555", fontSize: "0.85rem" }}>{pedidos.length} pedidos</span>
      </div>

      {loading && <p style={{ color: "#555" }}>Cargando...</p>}

      {!loading && pedidos.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: "3rem" }}>📦</div>
          <p style={{ color: "#555", marginTop: "12px" }}>No tienes pedidos aún</p>
        </div>
      )}

      <div className="d-flex flex-column gap-3">
        {pedidos.map((p) => {
          const estilo = ESTADO_COLOR[p.estado] || { bg: "#2A2A2A", color: "#777" };
          const isOpen = abierto === p.id;
          return (
            <div key={p.id} style={{ background: "#161616", border: "1px solid #2A2A2A", borderRadius: "16px", overflow: "hidden" }}>
              <div onClick={() => toggleDetalle(p.id)} style={{ padding: "20px", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#1e1e1e"}
                onMouseLeave={e => e.currentTarget.style.background = "#161616"}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p style={{ fontWeight: 700, marginBottom: "4px", color: "#fff" }}>Pedido #{p.codigo}</p>
                    <p style={{ color: "#aaa", fontSize: "0.8rem", marginBottom: 0 }}>
                      {new Date(p.fecha).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                      {" · "}{p.metodo_entrega}
                    </p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#CFEE3B" }}>
                      S/. {p.total}
                    </span>
                    <span style={{ background: estilo.bg, color: estilo.color, fontSize: "0.75rem", padding: "4px 12px", borderRadius: "20px" }}>
                      {p.estado.replace("_", " ")}
                    </span>
                    <span style={{ color: "#aaa" }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>
              </div>

              {isOpen && (
                <div style={{ borderTop: "1px solid #2A2A2A", padding: "20px" }}>
                  {p.detalles?.length > 0 ? (
                    <div className="d-flex flex-column gap-2">
                      {p.detalles.map((d, i) => (
                        <div key={i} className="d-flex justify-content-between" style={{ fontSize: "0.85rem" }}>
                          <span style={{ color: "#ccc" }}>{d.producto_nombre} {d.variante_nombre ? `(${d.variante_nombre})` : ""} x{d.cantidad}</span>
                          <span style={{ color: "#CFEE3B" }}>S/. {d.subtotal}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: "1px solid #2A2A2A", marginTop: "8px", paddingTop: "8px" }} className="d-flex justify-content-between">
                        <span style={{ color: "#aaa", fontSize: "0.8rem" }}>Envío</span>
                        <span style={{ fontSize: "0.85rem", color: "#fff" }}>S/. {p.costo_envio}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span style={{ fontWeight: 700, color: "#fff" }}>Total</span>
                        <span style={{ fontWeight: 700, color: "#CFEE3B" }}>S/. {p.total}</span>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: "#aaa", fontSize: "0.85rem", marginBottom: 0 }}>Sin detalles disponibles</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
