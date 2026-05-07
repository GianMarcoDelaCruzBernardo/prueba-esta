import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

// Public
import Index from "./pages/Public/Index";
import Login from "./pages/Public/Login";
import ProductosPublico from "./pages/Public/ProductosPublico";
import TrabajosPublico from "./pages/Public/TrabajosPublico";

// Private
import Carrito from "./pages/Private/Carrito";
import Checkout from "./pages/Private/Checkout";
import DetalleProducto from "./pages/Private/DetalleProducto";
import Pedidos from "./pages/Private/Pedidos";
import Perfil from "./pages/Private/Perfil";
import Productos from "./pages/Private/Productos";
import Trabajos from "./pages/Private/Trabajos";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<ProductosPublico />} />
        <Route path="/trabajos" element={<TrabajosPublico />} />   {/* pública ✅ */}
          
        {/* Rutas privadas */}
        <Route path="/productos"     element={<PrivateRoute><Layout><Productos /></Layout></PrivateRoute>} />
        <Route path="/productos/:id" element={<PrivateRoute><Layout><DetalleProducto /></Layout></PrivateRoute>} />
        <Route path="/carrito"       element={<PrivateRoute><Layout><Carrito /></Layout></PrivateRoute>} />
        <Route path="/checkout"      element={<PrivateRoute><Layout><Checkout /></Layout></PrivateRoute>} />
        <Route path="/pedidos"       element={<PrivateRoute><Layout><Pedidos /></Layout></PrivateRoute>} />
        <Route path="/mis-trabajos"  element={<PrivateRoute><Layout><Trabajos /></Layout></PrivateRoute>} />  {/* ← cambiado */}
        <Route path="/perfil"        element={<PrivateRoute><Layout><Perfil /></Layout></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;