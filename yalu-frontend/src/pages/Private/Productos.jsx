import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/catalogo/productos/")
      .then((res) => setProductos(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">

      <div className="d-flex align-items-center justify-content-between mb-3" style={{ paddingTop: "8px" }}>
        <div>
          <p style={{
            color: "#F97316", fontSize: "0.7rem", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px",
            fontFamily: "'Inter', sans-serif"
          }}>
            Librería Bazar Yalu
          </p>
          <h2 style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 800,
            fontSize: "2rem", letterSpacing: "-0.5px", marginBottom: 0, color: "#111"
          }}>
            Catálogo
          </h2>
        </div>
        {filtrados.length > 0 && (
          <span style={{ color: "#bbb", fontSize: "0.78rem", fontFamily: "'Inter', sans-serif" }}>
            {filtrados.length} productos
          </span>
        )}
      </div>

      <div style={{ position: "relative", marginBottom: "28px" }}>
        <span style={{
          position: "absolute", left: "14px", top: "50%",
          transform: "translateY(-50%)", color: "#ccc", fontSize: "0.85rem"
        }}>🔍</span>
        <input
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "11px 16px 11px 40px",
            border: "1px solid #EBEBEB", borderRadius: "10px",
            fontSize: "0.88rem", outline: "none", color: "#1a1a1a",
            background: "#FAFAFA", fontFamily: "'Inter', sans-serif",
            transition: "border-color .2s, background .2s"
          }}
          onFocus={e => { e.target.style.borderColor = "#F97316"; e.target.style.background = "#fff"; }}
          onBlur={e => { e.target.style.borderColor = "#EBEBEB"; e.target.style.background = "#FAFAFA"; }}
        />
      </div>

      {loading && (
        <div className="row g-3">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="col-6 col-md-4 col-lg-3">
              <div style={{ borderRadius: "16px", overflow: "hidden", background: "#F5F5F5" }}>
                <div style={{ height: "180px", background: "#EEEEEE" }} />
                <div style={{ padding: "12px 14px 14px" }}>
                  <div style={{ height: "10px", background: "#E8E8E8", borderRadius: "4px", width: "40%", marginBottom: "8px" }} />
                  <div style={{ height: "14px", background: "#E8E8E8", borderRadius: "4px", width: "80%", marginBottom: "6px" }} />
                  <div style={{ height: "14px", background: "#E8E8E8", borderRadius: "4px", width: "60%" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtrados.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📦</div>
          <p style={{ color: "#bbb", fontSize: "0.9rem", fontFamily: "'Inter', sans-serif" }}>
            {search ? `Sin resultados para "${search}"` : "No hay productos disponibles"}
          </p>
        </div>
      )}

      <div className="row g-3">
        {filtrados.map((p) => (
          <div key={p.id} className="col-6 col-md-4 col-lg-3">
            <div
              onClick={() => navigate(`/productos/${p.id}`)}
              style={{
                background: "#fff",
                border: "1px solid #F0F0F0",
                borderRadius: "16px",
                overflow: "hidden",
                height: "100%",
                cursor: "pointer",
                transition: "transform .15s, box-shadow .15s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)";
                e.currentTarget.style.borderColor = "#E8E8E8";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#F0F0F0";
              }}
            >
              <div style={{
                height: "180px", background: "#F8F8F8",
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden"
              }}>
                {p.imagen_principal
                  ? <img
                      src={p.imagen_principal}
                      alt={p.nombre}
                      style={{ width: "100%", height: "100%", objectFit: "contain", padding: "16px" }}
                    />
                  : <span style={{ fontSize: "2rem", opacity: 0.15 }}>📚</span>
                }
              </div>

              <div style={{ padding: "12px 14px 14px" }}>
                <p style={{
                  fontSize: "0.68rem", color: "#F97316", fontWeight: 600,
                  marginBottom: "4px", textTransform: "uppercase",
                  letterSpacing: "0.06em", fontFamily: "'Inter', sans-serif"
                }}>{p.categoria_nombre}</p>
                <p style={{
                  fontSize: "0.875rem", fontWeight: 600, color: "#111",
                  marginBottom: "10px", lineHeight: 1.35,
                  fontFamily: "'Inter', sans-serif",
                  display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>{p.nombre}</p>
                <div className="d-flex align-items-center justify-content-between">
                  <span style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700, fontSize: "0.95rem", color: "#111"
                  }}>S/. {p.precio}</span>
                  <span style={{
                    fontSize: "0.72rem", color: "#ccc",
                    fontFamily: "'Inter', sans-serif", fontWeight: 500
                  }}>Ver →</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
