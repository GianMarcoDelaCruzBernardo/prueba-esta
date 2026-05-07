import { useState } from "react";
import { auth, googleProvider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import Spline from "@splinetool/react-spline";
import "../../styles/Login.css";

export default function Login() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [splineReady, setSplineReady] = useState(false);
  const navigate = useNavigate();

  const loginGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const res = await api.post("/usuarios/login/", { firebase_token: token });
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("uid", result.user.uid);
      navigate("/productos");
    } catch (e) {
      setError("Error al iniciar sesion. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lp">

      <div className="lp__left">
        {!splineReady && (
          <div className="lp__spline-loader">
            <div className="lp__spline-spinner" />
            <span>Cargando...</span>
          </div>
        )}
        <div className={`lp__spline-wrap ${splineReady ? "lp__spline-wrap--ready" : ""}`}>
          <Spline
            scene="https://prod.spline.design/Mflm6sMNBvB5-ysK/scene.splinecode"
            onLoad={() => setSplineReady(true)}
          />
        </div>
      </div>

      <div className="lp__right">
        <div className="lp__card">

          {/* Botón volver al inicio */}
          <button
            onClick={() => navigate("/")}
            className="lp__back"
          >
            <i className="bi bi-arrow-left"></i> Volver al inicio
          </button>

          <div className="lp__logo-wrap">
            <img src={logo} alt="Yalu" className="lp__logo" />
          </div>

          <h1 className="lp__title">Bienvenido</h1>
          <p className="lp__sub">Libreria Bazar Yalu &middot; Trujillo</p>

          {error && (
            <div className="lp__error">
              <i className="bi bi-exclamation-circle-fill" />
              {error}
            </div>
          )}

          <button onClick={loginGoogle} disabled={loading} className="lp__btn">
            {loading ? (
              <>
                <span className="lp__btn-spinner" />
                Iniciando sesion...
              </>
            ) : (
              <>
                <svg className="lp__google-svg" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </>
            )}
          </button>

          <p className="lp__terms">
            Al ingresar aceptas los terminos de uso de Yalu
          </p>

        </div>
      </div>

    </div>
  );
}