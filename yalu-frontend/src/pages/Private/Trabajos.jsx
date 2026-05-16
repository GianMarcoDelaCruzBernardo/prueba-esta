import { useEffect, useState } from "react";
import api from "../../services/axios";
import { WHATSAPP_NUMBER } from "../../constants";

export default function Trabajos() {
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/trabajos/")
      .then((res) => setTrabajos(res.data))
      .finally(() => setLoading(false));
  }, []);

  const abrirWhatsApp = (trabajo) => {
    const mensaje = encodeURIComponent(
      `Hola! Me interesa el trabajo: "${trabajo.titulo}". Precio estimado: S/. ${trabajo.precio_estimado}. ¿Podemos coordinar?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`, "_blank");
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>Trabajos Manuales</h2>
        <span style={{ color: "#777", fontSize: "0.85rem" }}>{trabajos.length} proyectos</span>
      </div>

      {loading && <p style={{ color: "#777" }}>Cargando...</p>}

      {!loading && trabajos.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: "3rem" }}>🎨</div>
          <p style={{ color: "#777", marginTop: "12px" }}>No hay trabajos disponibles</p>
        </div>
      )}

      <div className="row g-3">
        {trabajos.map((t) => (
          <div key={t.id} className="col-12 col-md-6">
            <div style={{
              background: "#161616",
              border: "1px solid #2A2A2A",
              borderRadius: "16px",
              overflow: "hidden"
            }}>
              {t.fotos?.length > 0 && (
                <img src={t.fotos[0].imagen} alt={t.titulo}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }} />
              )}
              {!t.fotos?.length && (
                <div style={{ height: "200px", background: "#1F1F1F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>🖼️</div>
              )}
              <div style={{ padding: "20px" }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 style={{ fontWeight: 700, marginBottom: 0 }}>{t.titulo}</h5>
                  <span style={{
                    background: t.estado === "completado" ? "rgba(34,197,94,0.15)" : "rgba(249,115,22,0.15)",
                    color: t.estado === "completado" ? "#22c55e" : "#F97316",
                    fontSize: "0.75rem", padding: "2px 10px", borderRadius: "20px"
                  }}>{t.estado}</span>
                </div>
                <p style={{ color: "#777", fontSize: "0.85rem", marginBottom: "12px" }}>{t.descripcion}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#CFEE3B" }}>
                    S/. {t.precio_estimado}
                  </span>
                  <button onClick={() => abrirWhatsApp(t)} style={{
                    background: "#25D366",
                    color: "#fff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "8px 16px",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}>💬 WhatsApp</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
