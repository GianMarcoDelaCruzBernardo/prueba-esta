import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setCarrito(JSON.parse(localStorage.getItem("carrito") || "[]"));
  }, []);

  const actualizar = (index, cantidad) => {
    const nuevo = [...carrito];
    if (cantidad <= 0) nuevo.splice(index, 1);
    else nuevo[index].cantidad = cantidad;
    setCarrito(nuevo);
    localStorage.setItem("carrito", JSON.stringify(nuevo));
  };

  const subtotal = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  return (
    <div className="container py-4">
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, marginBottom: "24px" }}>Carrito</h2>

      {carrito.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: "3rem" }}>🛒</div>
          <p style={{ color: "#555", marginTop: "12px" }}>Tu carrito está vacío</p>
          <button onClick={() => navigate("/productos")} style={{
            background: "#F97316", color: "#fff", border: "none",
            borderRadius: "12px", padding: "10px 24px", cursor: "pointer", fontWeight: 600, marginTop: "12px"
          }}>Ver productos</button>
        </div>
      )}

      {carrito.length > 0 && (
        <>
          <div className="d-flex flex-column gap-3 mb-4">
            {carrito.map((item, i) => (
              <div key={i} style={{ background: "#161616", border: "1px solid #2A2A2A", borderRadius: "14px", padding: "16px" }}
                className="d-flex justify-content-between align-items-center">
                <div>
                  <p style={{ fontWeight: 600, marginBottom: "2px", color: "#fff" }}>{item.nombre}</p>
                  {item.variante_nombre && <p style={{ color: "#aaa", fontSize: "0.8rem", marginBottom: "4px" }}>{item.variante_nombre}</p>}
                  <p style={{ color: "#CFEE3B", fontWeight: 700, marginBottom: 0 }}>S/. {item.precio}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", background: "#2A2A2A", borderRadius: "10px", overflow: "hidden" }}>
                  <button onClick={() => actualizar(i, item.cantidad - 1)} style={{ background: "none", border: "none", color: "#fff", padding: "6px 12px", cursor: "pointer" }}>−</button>
                  <span style={{ padding: "0 10px", fontWeight: 600, color: "#fff" }}>{item.cantidad}</span>
                  <button onClick={() => actualizar(i, item.cantidad + 1)} style={{ background: "none", border: "none", color: "#fff", padding: "6px 12px", cursor: "pointer" }}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#161616", border: "1px solid #2A2A2A", borderRadius: "14px", padding: "20px" }}>
            <div className="d-flex justify-content-between mb-2">
              <span style={{ color: "#aaa" }}>Subtotal</span>
              <span style={{ fontWeight: 600, color: "#fff" }}>S/. {subtotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span style={{ color: "#aaa" }}>Envío</span>
              <span style={{ color: "#aaa" }}>Se calcula en checkout</span>
            </div>
            <button onClick={() => navigate("/checkout")} style={{
              width: "100%", background: "#F97316", color: "#fff",
              border: "none", borderRadius: "12px", padding: "14px",
              fontWeight: 700, fontSize: "1rem", cursor: "pointer"
            }}>Proceder al Checkout →</button>
          </div>
        </>
      )}
    </div>
  );
}