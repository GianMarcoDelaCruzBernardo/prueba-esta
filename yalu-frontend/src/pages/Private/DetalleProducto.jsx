import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/axios";

export default function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null);
  const [fotoActual, setFotoActual] = useState(0);
  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);

  useEffect(() => {
    api.get(`/catalogo/productos/${id}/`).then((res) => {
      setProducto(res.data);
      if (res.data.variantes?.length > 0) setVarianteSeleccionada(res.data.variantes[0]);
    });
  }, [id]);

  const agregarAlCarrito = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    const item = {
      id: producto.id,
      nombre: producto.nombre,
      precio: varianteSeleccionada ? varianteSeleccionada.precio : producto.precio,
      variante_id: varianteSeleccionada?.id || null,
      variante_nombre: varianteSeleccionada?.nombre_variante || null,
      cantidad,
    };
    const existente = carrito.findIndex((c) => c.id === item.id && c.variante_id === item.variante_id);
    if (existente >= 0) carrito[existente].cantidad += cantidad;
    else carrito.push(item);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  if (!producto) return <div className="container py-4"><p style={{ color: "#999" }}>Cargando...</p></div>;

  const precio = varianteSeleccionada ? varianteSeleccionada.precio : producto.precio;
  const imagenUrl = producto.imagenes?.[fotoActual]?.imagen_url || producto.imagenes?.[fotoActual]?.imagen;

  return (
    <div className="container py-4">
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#999", cursor: "pointer", marginBottom: "20px", fontSize: "0.9rem" }}>
        ← Volver
      </button>
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "center", height: "360px" }}>
            {producto.imagenes?.length > 0
              ? <img src={imagenUrl} alt={producto.nombre} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "16px" }} />
              : <div style={{ fontSize: "4rem", opacity: 0.2 }}>📚</div>
            }
          </div>
          {producto.imagenes?.length > 1 && (
            <div className="d-flex gap-2">
              {producto.imagenes.map((img, i) => (
                <img key={i} src={img.imagen_url || img.imagen} alt="" onClick={() => setFotoActual(i)}
                  style={{ width: "60px", height: "60px", objectFit: "contain", borderRadius: "8px", cursor: "pointer", border: fotoActual === i ? "2px solid #F97316" : "2px solid #E8E8E8", background: "#F8F8F8", padding: "4px" }} />
              ))}
            </div>
          )}
        </div>

        <div className="col-12 col-md-6">
          <p style={{ color: "#F97316", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px", fontFamily: "'Inter', sans-serif" }}>
            {producto.categoria_nombre} · {producto.marca_nombre}
          </p>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: "1.5rem", marginBottom: "8px", color: "#1a1a1a", lineHeight: 1.3 }}>{producto.nombre}</h2>
          <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "24px", lineHeight: 1.6, fontFamily: "'Inter', sans-serif" }}>{producto.descripcion}</p>

          {producto.variantes?.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <p style={{ color: "#999", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", marginBottom: "8px", fontFamily: "'Inter', sans-serif" }}>Variante</p>
              <div className="d-flex flex-wrap gap-2">
                {producto.variantes.map((v) => (
                  <button key={v.id} onClick={() => setVarianteSeleccionada(v)} style={{
                    background: varianteSeleccionada?.id === v.id ? "#F97316" : "#F5F5F5",
                    border: "none",
                    color: varianteSeleccionada?.id === v.id ? "#fff" : "#333",
                    borderRadius: "8px", padding: "6px 14px", cursor: "pointer",
                    fontSize: "0.85rem", fontWeight: 500, fontFamily: "'Inter', sans-serif"
                  }}>{v.nombre_variante}</button>
                ))}
              </div>
            </div>
          )}

          <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#1a1a1a", marginBottom: "24px" }}>
            S/. {precio}
          </p>

          <div className="d-flex align-items-center gap-3 mb-4">
            <div style={{ display: "flex", alignItems: "center", background: "#F5F5F5", borderRadius: "10px", overflow: "hidden" }}>
              <button onClick={() => setCantidad(Math.max(1, cantidad - 1))} style={{ background: "none", border: "none", color: "#1a1a1a", padding: "8px 16px", cursor: "pointer", fontSize: "1.1rem" }}>−</button>
              <span style={{ padding: "0 12px", fontWeight: 600, color: "#1a1a1a", fontFamily: "'Inter', sans-serif" }}>{cantidad}</span>
              <button onClick={() => setCantidad(cantidad + 1)} style={{ background: "none", border: "none", color: "#1a1a1a", padding: "8px 16px", cursor: "pointer", fontSize: "1.1rem" }}>+</button>
            </div>
          </div>

          <button onClick={agregarAlCarrito} style={{
            width: "100%", background: agregado ? "#22C55E" : "#F97316",
            color: "#fff", border: "none", borderRadius: "12px",
            padding: "14px", fontWeight: 700, fontSize: "1rem", cursor: "pointer",
            fontFamily: "'Inter', sans-serif", transition: "background 0.3s"
          }}>
            {agregado ? "✓ Agregado al carrito" : "+ Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}
