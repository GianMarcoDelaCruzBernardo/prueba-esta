import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const isActive = (path) => location.pathname === path;
  return (
    <nav className="navbar navbar-expand-lg" style={{
      background: "#161616",
      borderBottom: "1px solid #2A2A2A",
      padding: "12px 24px"
    }}>
      <div className="container-fluid">
        <Link to="/productos" className="navbar-brand">
          <img src={logo} alt="Yalu" style={{ height: "48px", objectFit: "contain" }} />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu"
          style={{ borderColor: "#2A2A2A" }}>
          <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {[
              { path: "/productos", label: "Catalogo",  icon: "house-fill" },
              { path: "/carrito",   label: "Carrito",   icon: "cart-fill" },
              { path: "/pedidos",   label: "Pedidos",   icon: "box-fill" },
              { path: "/trabajos",  label: "Trabajos",  icon: "palette-fill" },
              { path: "/perfil",    label: "Perfil",    icon: "person-fill" },
            ].map(({ path, label, icon }) => (
              <li className="nav-item" key={path}>
                <Link to={path} className="nav-link px-3 py-2 rounded-3 d-flex align-items-center gap-2" style={{
                  color: isActive(path) ? "#CFEE3B" : "#F0F0F0",
                  background: isActive(path) ? "rgba(207,238,59,0.1)" : "transparent",
                  fontWeight: isActive(path) ? 600 : 400,
                  fontSize: "0.9rem",
                  transition: "all .2s"
                }}>
                  <i className={`bi bi-${icon}`}></i>
                  {label}
                </Link>
              </li>
            ))}
            <li className="nav-item">
              <button onClick={handleLogout}
                className="btn btn-sm px-3 py-2 rounded-3 d-flex align-items-center gap-2"
                style={{
                  background: "rgba(255,78,78,0.1)",
                  border: "1px solid rgba(255,78,78,0.3)",
                  color: "#FF4E4E",
                  fontSize: "0.9rem"
                }}>
                <i className="bi bi-box-arrow-right"></i>
                Salir
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
