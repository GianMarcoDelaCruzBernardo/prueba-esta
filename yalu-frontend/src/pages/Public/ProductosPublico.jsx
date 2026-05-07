import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion, useInView, AnimatePresence,
  useMotionValue, useSpring
} from "framer-motion";
import api from "../../api/axios";
import "../../styles/Productos.css";

/* ─── DATA ─────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Inicio",      href: "/" },
  { label: "Productos",   href: "/catalogo" },
  { label: "Promociones", href: "/#promos" },
  { label: "Como comprar",href: "/#como" },
  { label: "Nosotros",    href: "/#nosotros" },
];

const CATEGORIAS = [
  { value: "",              label: "Todas las categorias", icon: "grid-3x3-gap-fill" },
  { value: "lapices",       label: "Lapices y plumas",     icon: "pencil-fill"   },
  { value: "cuadernos",     label: "Libros y cuadernos",   icon: "book-fill"     },
  { value: "arte",          label: "Arte y pintura",        icon: "palette-fill"  },
  { value: "geometria",     label: "Geometria",             icon: "rulers"        },
  { value: "manualidades",  label: "Manualidades",          icon: "scissors"      },
  { value: "mochilas",      label: "Mochilas y estuches",   icon: "bag-fill"      },
  { value: "calculadoras",  label: "Calculadoras",          icon: "calculator-fill"},
  { value: "papeleria",     label: "Papeleria fina",        icon: "brush-fill"    },
];

const SORT_OPTIONS = [
  { value: "relevancia",    label: "Relevancia"         },
  { value: "precio_asc",    label: "Precio: menor a mayor" },
  { value: "precio_desc",   label: "Precio: mayor a menor" },
  { value: "nombre_asc",    label: "Nombre A–Z"         },
  { value: "nombre_desc",   label: "Nombre Z–A"         },
];

/* ─── VARIANTS ──────────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease } }),
};

function useReveal(margin = "-60px") {
  const ref = useRef(null);
  const vis = useInView(ref, { once: true, margin });
  return [ref, vis];
}

/* ─── MAGNETIC BUTTON ───────────────────────────────── */
function MagBtn({ children, className, onClick, style }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 25 });
  const sy = useSpring(y, { stiffness: 300, damping: 25 });
  const handle = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  }, [x, y]);
  return (
    <motion.button
      className={className} style={{ ...style, x: sx, y: sy }}
      onMouseMove={handle} onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.95 }} onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

/* ─── HELPER: GET IMAGE URL ─────────────────────────── */
function getImageUrl(producto) {
  if (producto.imagen && producto.imagen.startsWith('http')) {
    return producto.imagen;
  }
  
  if (producto.imagenes && producto.imagenes.length > 0) {
    const principal = producto.imagenes.find(img => img.es_principal);
    if (principal?.imagen_url) {
      return principal.imagen_url;
    }
    if (producto.imagenes[0]?.imagen_url) {
      return producto.imagenes[0].imagen_url;
    }
  }
  
  return null;
}

/* ─── HELPER: GET CATEGORY NAME ─────────────────────── */
function getCategoryName(producto) {
  if (producto.categoria) {
    if (typeof producto.categoria === 'object') {
      return producto.categoria.nombre || producto.categoria.descripcion || '';
    }
    return producto.categoria;
  }
  return '';
}

/* ─── HELPER: GET STOCK ──────────────────────────────── */
function getStock(producto) {
  return producto.stock !== undefined ? producto.stock : 
         producto.stock_disponible !== undefined ? producto.stock_disponible : 
         producto.stock_minimo || 0;
}

/* ─── PRODUCT CARD ──────────────────────────────────── */
function ProductCard({ producto, onVer }) {
  const imageUrl = getImageUrl(producto);
  const categoryName = getCategoryName(producto);
  const stock = getStock(producto);
  
  return (
    <motion.div
      className="ypc__card"
      variants={fadeUp}
      whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="ypc__img-wrap">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={producto.nombre} 
            className="ypc__img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<div class="ypc__img-ph"><i class="bi bi-box-seam"></i></div>';
            }}
          />
        ) : (
          <div className="ypc__img-ph">
            <i className="bi bi-box-seam"></i>
          </div>
        )}
        {producto.descuento > 0 && (
          <span className="ypc__badge">-{producto.descuento}%</span>
        )}
      </div>

      <div className="ypc__body">
        {categoryName && (
          <span className="ypc__cat">{categoryName}</span>
        )}
        <h3 className="ypc__name">{producto.nombre}</h3>
        {producto.descripcion && (
          <p className="ypc__desc">{producto.descripcion}</p>
        )}
        <div className="ypc__foot">
          <div className="ypc__prices">
            <span className="ypc__price">
              S/. {parseFloat(producto.precio).toFixed(2)}
            </span>
            {producto.precio_original && producto.precio_original > producto.precio && (
              <span className="ypc__old">
                S/. {parseFloat(producto.precio_original).toFixed(2)}
              </span>
            )}
          </div>
          <div className="ypc__stock">
            {stock > 0 ? (
              <span className="ypc__in-stock">
                <i className="bi bi-circle-fill"></i> Disponible
              </span>
            ) : (
              <span className="ypc__no-stock">Sin stock</span>
            )}
          </div>
        </div>

        <div className="ypc__actions">
          <button className="ypc__btn-ver" onClick={() => onVer(producto.id)}>
            Ver detalle <i className="bi bi-arrow-right"></i>
          </button>
          <button className="ypc__btn-cart" onClick={() => onVer(producto.id)}>
            <i className="bi bi-cart-plus"></i>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── SKELETON ──────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="ypc__card ypc__card--skel">
      <div className="ypc__img-wrap yskel"></div>
      <div className="ypc__body">
        <div className="yskel yskel--sm" style={{ width: "60%", marginBottom: 8 }}></div>
        <div className="yskel yskel--md" style={{ width: "90%", marginBottom: 6 }}></div>
        <div className="yskel yskel--sm" style={{ width: "75%" }}></div>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ────────────────────────────────── */
export default function ProductosPublico() {
  const navigate = useNavigate();
  const [loaded,     setLoaded]     = useState(false);
  const [productos,  setProductos]  = useState([]);
  const [cargando,   setCargando]   = useState(true);
  const [busqueda,   setBusqueda]   = useState("");
  const [categoria,  setCategoria]  = useState("");
  const [orden,      setOrden]      = useState("relevancia");
  const [precioMin,  setPrecioMin]  = useState("");
  const [precioMax,  setPrecioMax]  = useState("");
  const [mobileNav,  setMobileNav]  = useState(false);
  const [sidebarOpen,setSidebarOpen]= useState(false);

  const [headerRef, headerVis] = useReveal("-20px");

  useEffect(() => {
    setTimeout(() => setLoaded(true), 60);
    
    const params = {};
    if (categoria) {
      params.categoria = categoria;
    }
    
    api.get("/catalogo/productos/", { params })
      .then(r => {
        console.log("Productos cargados:", r.data);
        setProductos(r.data);
      })
      .catch(err => {
        console.error("Error al cargar productos:", err);
        setProductos([]);
      })
      .finally(() => setCargando(false));
  }, [categoria]);

  const filtrados = productos
    .filter(p => {
      const matchNombre = p.nombre?.toLowerCase().includes(busqueda.toLowerCase());
      const precio = parseFloat(p.precio);
      const matchMin = precioMin !== "" ? precio >= parseFloat(precioMin) : true;
      const matchMax = precioMax !== "" ? precio <= parseFloat(precioMax) : true;
      return matchNombre && matchMin && matchMax;
    })
    .sort((a, b) => {
      if (orden === "precio_asc")   return parseFloat(a.precio) - parseFloat(b.precio);
      if (orden === "precio_desc")  return parseFloat(b.precio) - parseFloat(a.precio);
      if (orden === "nombre_asc")   return a.nombre.localeCompare(b.nombre);
      if (orden === "nombre_desc")  return b.nombre.localeCompare(a.nombre);
      return 0;
    });

  const limpiarFiltros = () => {
    setBusqueda(""); setCategoria(""); setOrden("relevancia");
    setPrecioMin(""); setPrecioMax("");
  };

  const hayFiltros = busqueda || categoria || precioMin || precioMax || orden !== "relevancia";

  return (
    <div className={`ycat ${loaded ? "ycat--on" : ""}`}>

      <motion.nav
        className="yn"
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease }}
      >
        <a href="/" className="yn__logo">
          <img src="/src/assets/logo.png" alt="Yalu" className="yn__logo-img" />
          <div>
            <b>Yalu</b>
            <small>Libreria Bazar · Trujillo</small>
          </div>
        </a>

        <ul className="yn__links">
          {NAV_LINKS.map((l, i) => (
            <motion.li key={l.href}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.45, ease }}
            >
              <a
                href={l.href}
                className={l.href === "/catalogo" ? "yn__link--active" : ""}
                onClick={e => {
                  if (l.href.startsWith("/") && !l.href.startsWith("/#")) {
                    e.preventDefault();
                    navigate(l.href);
                  }
                }}
              >
                {l.label}
              </a>
            </motion.li>
          ))}
        </ul>

        <div className="yn__actions">
          <motion.button
            className="yn__login yn__login--pill"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
          >
            <i className="bi bi-person-circle"></i> Ingresar
          </motion.button>
        </div>

        <button className="yn__burger" onClick={() => setMobileNav(v => !v)}>
          <i className={`bi bi-${mobileNav ? "x-lg" : "list"}`}></i>
        </button>
      </motion.nav>

      <AnimatePresence>
        {mobileNav && (
          <motion.div className="yn__drawer"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease }}
          >
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href}
                onClick={e => {
                  if (l.href.startsWith("/") && !l.href.startsWith("/#")) {
                    e.preventDefault();
                    navigate(l.href);
                  }
                  setMobileNav(false);
                }}
              >
                {l.label}
              </a>
            ))}
            <button className="yn__cta" onClick={() => navigate("/login")}>
              Ingresar <i className="bi bi-person-circle"></i>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section
        className="ycat__header"
        ref={headerRef}
        initial="hidden"
        animate={headerVis ? "visible" : "hidden"}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="ycat__header-bg" />
        <div className="ycat__header-grid" />
        <motion.div className="ycat__header-inner" variants={fadeUp}>
          <p className="yi-lbl">
            <i className="bi bi-grid-3x3-gap-fill"></i> Libreria Bazar Yalu
          </p>
          <h1 className="yi-h2" style={{ fontSize: "clamp(2rem,4vw,2.8rem)" }}>
            Nuestro <em>catalogo</em> completo
          </h1>
          <p className="yi-sub">
            Explora todos nuestros productos. Inicia sesion para agregar al carrito.
          </p>
        </motion.div>
      </motion.section>

      <div className="ycat__search-bar">
        <div className="ycat__search-wrap">
          <i className="bi bi-search ycat__search-icon"></i>
          <input
            className="ycat__search-input"
            type="text"
            placeholder="Buscar productos... ej: Faber-Castell, cuaderno, mochila"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button className="ycat__search-clear" onClick={() => setBusqueda("")}>
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>

        <select
          className="ycat__sort"
          value={orden}
          onChange={e => setOrden(e.target.value)}
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <button
          className={`ycat__filter-toggle ${sidebarOpen ? "ycat__filter-toggle--on" : ""}`}
          onClick={() => setSidebarOpen(v => !v)}
        >
          <i className="bi bi-sliders"></i>
          Filtros
          {hayFiltros && <span className="ycat__filter-dot"></span>}
        </button>
      </div>

      <div className="ycat__layout">

        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              className="ycat__sidebar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease }}
            >
              <div className="ycat__sidebar-head">
                <span><i className="bi bi-funnel-fill"></i> Filtros</span>
                {hayFiltros && (
                  <button className="ycat__limpiar" onClick={limpiarFiltros}>
                    Limpiar todo
                  </button>
                )}
              </div>

              <div className="ycat__filter-group">
                <h4 className="ycat__filter-title">Categoria</h4>
                <div className="ycat__cats">
                  {CATEGORIAS.map(c => (
                    <button
                      key={c.value}
                      className={`ycat__cat-btn ${categoria === c.value ? "ycat__cat-btn--on" : ""}`}
                      onClick={() => {
                        setCategoria(c.value);
                        setCargando(true);
                      }}
                    >
                      <i className={`bi bi-${c.icon}`}></i>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ycat__filter-group">
                <h4 className="ycat__filter-title">Rango de precio</h4>
                <div className="ycat__precio-row">
                  <div className="ycat__precio-field">
                    <label>Min (S/.)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={precioMin}
                      onChange={e => setPrecioMin(e.target.value)}
                    />
                  </div>
                  <span className="ycat__precio-sep">—</span>
                  <div className="ycat__precio-field">
                    <label>Max (S/.)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="999"
                      value={precioMax}
                      onChange={e => setPrecioMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="ycat__sidebar-cta">
                <i className="bi bi-bag-check-fill"></i>
                <p>Inicia sesion para comprar y guardar tu carrito</p>
                <button
                  className="yi-btn yi-btn--primary ycat__sidebar-login"
                  onClick={() => navigate("/login")}
                >
                  Ingresar con Google
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="ycat__main">

          <div className="ycat__results-bar">
            <span className="ycat__count">
              {cargando ? "Cargando..." : `${filtrados.length} producto${filtrados.length !== 1 ? "s" : ""}`}
              {hayFiltros && !cargando && (
                <button className="ycat__limpiar ycat__limpiar--inline" onClick={limpiarFiltros}>
                  · Limpiar filtros
                </button>
              )}
            </span>

            <div className="ycat__chips">
              {categoria && (
                <span className="ycat__chip">
                  {CATEGORIAS.find(c => c.value === categoria)?.label}
                  <button onClick={() => setCategoria("")}>
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {(precioMin || precioMax) && (
                <span className="ycat__chip">
                  S/. {precioMin || "0"} – {precioMax || "∞"}
                  <button onClick={() => { setPrecioMin(""); setPrecioMax(""); }}>
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
              {busqueda && (
                <span className="ycat__chip">
                  "{busqueda}"
                  <button onClick={() => setBusqueda("")}>
                    <i className="bi bi-x"></i>
                  </button>
                </span>
              )}
            </div>
          </div>

          {cargando ? (
            <motion.div
              className="ycat__grid"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            >
              {Array(8).fill(0).map((_, i) => <Skeleton key={i} />)}
            </motion.div>
          ) : filtrados.length === 0 ? (
            <motion.div
              className="ycat__empty"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <i className="bi bi-box-seam"></i>
              <h3>No se encontraron productos</h3>
              <p>Intenta con otros terminos o limpia los filtros.</p>
              {hayFiltros && (
                <button className="yi-btn yi-btn--outline" onClick={limpiarFiltros}>
                  Limpiar filtros
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="ycat__grid"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
            >
              {filtrados.map(p => (
                <ProductCard
                  key={p.id}
                  producto={p}
                  onVer={id => navigate(`/catalogo/${id}`)}
                />
              ))}
            </motion.div>
          )}

          {!cargando && filtrados.length > 0 && (
            <motion.div
              className="ycat__login-banner"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="ycat__login-banner-ico">
                <i className="bi bi-bag-heart-fill"></i>
              </div>
              <div>
                <strong>¿Listo para comprar?</strong>
                <p>Inicia sesion con Google para agregar productos a tu carrito.</p>
              </div>
              <MagBtn className="yi-btn yi-btn--primary" onClick={() => navigate("/login")}>
                Ingresar <i className="bi bi-arrow-right"></i>
              </MagBtn>
            </motion.div>
          )}
        </div>
      </div>

      <footer className="yf">
        <div className="yf__top">
          <div className="yf__brand">
            <img src="/src/assets/logo.png" alt="Yalu" className="yn__logo-img" />
            <div>
              <b>Yalu</b>
              <small>Libreria Bazar · Trujillo</small>
            </div>
          </div>
          <div className="yf__cols">
            <div className="yf__col">
              <h4>Productos</h4>
              <a href="/catalogo">Lapices y plumas</a>
              <a href="/catalogo">Libros y cuadernos</a>
              <a href="/catalogo">Arte y pintura</a>
              <a href="/catalogo">Manualidades</a>
            </div>
            <div className="yf__col">
              <h4>Empresa</h4>
              <a href="/#nosotros">Nosotros</a>
              <a href="/#como">Como funciona</a>
              <a href="/#promos">Promociones</a>
            </div>
            <div className="yf__col">
              <h4>Contacto</h4>
              <a href="tel:+51944000000">
                <i className="bi bi-telephone-fill"></i> +51 944 000 000
              </a>
              <a href="mailto:hola@yalu.pe">
                <i className="bi bi-envelope-fill"></i> hola@yalu.pe
              </a>
              <a href="/">
                <i className="bi bi-geo-alt-fill"></i> Trujillo, La Libertad
              </a>
            </div>
          </div>
        </div>
        <div className="yf__bottom">
          <span>© 2025 Yalu Libreria Bazar · Todos los derechos reservados</span>
          <div className="yf__socials">
            <a href="#"><i className="bi bi-instagram"></i></a>
            <a href="#"><i className="bi bi-facebook"></i></a>
            <a href="#"><i className="bi bi-whatsapp"></i></a>
          </div>
        </div>
      </footer>

    </div>
  );
}
