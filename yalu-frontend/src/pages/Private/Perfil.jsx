import { useEffect, useState } from "react";
import api from "../../services/axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [direcciones, setDirecciones] = useState([]);
  const [error, setError] = useState(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    api.get(`/usuarios/perfil/?uid=${uid}`)
      .then((res) => setPerfil(res.data))
      .catch(() => setError("No se pudo cargar el perfil"));
    api.get(`/usuarios/direcciones/?uid=${uid}`)
      .then((res) => setDirecciones(res.data))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container py-4">
      <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, marginBottom: "24px" }}>Mi Perfil</h2>

      {error && <p style={{ color: "#FF4E4E" }}>{error}</p>}

      {perfil ? (
        <div style={{ background: "#161616", border: "1px solid #2A2A2A", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <p style={{ color: "#aaa", fontSize: "0.8rem", marginBottom: "4px" }}>NOMBRE</p>
          <p style={{ fontWeight: 600, marginBottom: "16px", color: "#fff" }}>{perfil.nombres} {perfil.apellidos}</p>
          <p style={{ color: "#aaa", fontSize: "0.8rem", marginBottom: "4px" }}>EMAIL</p>
          <p style={{ fontWeight: 600, marginBottom: "16px", color: "#fff" }}>{perfil.email}</p>
          <p style={{ color: "#aaa", fontSize: "0.8rem", marginBottom: "4px" }}>TELÉFONO</p>
          <p style={{ fontWeight: 600, color: "#fff" }}>{perfil.telefono || "—"}</p>
        </div>
      ) : (
        !error && <p style={{ color: "#555" }}>Cargando...</p>
      )}

      {direcciones.length > 0 && (
        <>
          <h4 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, marginBottom: "16px" }}>Mis Direcciones</h4>
          {direcciones.map((d, i) => (
            <div key={i} style={{ background: "#161616", border: "1px solid #2A2A2A", borderRadius: "12px", padding: "16px", marginBottom: "12px" }}>
              <p style={{ fontWeight: 600, marginBottom: "4px", color: "#fff" }}>{d.direccion_detallada}</p>
              <p style={{ color: "#aaa", fontSize: "0.85rem" }}>{d.distrito}, {d.provincia}, {d.departamento}</p>
              {d.es_principal && <span style={{ background: "rgba(207,238,59,0.15)", color: "#CFEE3B", fontSize: "0.75rem", padding: "2px 10px", borderRadius: "20px" }}>Principal</span>}
            </div>
          ))}
        </>
      )}

      <button onClick={handleLogout} style={{
        marginTop: "24px",
        background: "rgba(255,78,78,0.1)",
        border: "1px solid rgba(255,78,78,0.3)",
        color: "#FF4E4E",
        borderRadius: "12px",
        padding: "12px 24px",
        cursor: "pointer",
        fontWeight: 600
      }}>Cerrar sesión</button>
    </div>
  );
}