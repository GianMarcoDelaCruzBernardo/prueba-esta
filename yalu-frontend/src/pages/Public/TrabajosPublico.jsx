import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion, useInView, AnimatePresence,
  useMotionValue, useSpring
} from "framer-motion";
import api from "../../services/axios";
import { WHATSAPP_NUMBER } from "../../constants";
import "../../styles/Trabajos.css";

const NAV_LINKS = [
  { label: "Inicio",    href: "/" },
  { label: "Productos", href: "/catalogo" },
  { label: "Trabajos",  href: "/trabajos" },
  { label: "Nosotros",  href: "/#nosotros" },
];

const TIPOS = [
  { icon: "image-fill",    label: "Gigantografías",      desc: "Banners, lonas e impresiones de gran formato" },
  { icon: "box-fill",      label: "Maquetas",            desc: "Escolares, arquitectónicas y personalizadas" },
  { icon: "ticket-fill",   label: "Papeletas y tickets", desc: "Para eventos, rifas y sorteos" },
  { icon: "scissors",      label: "Manualidades",        desc: "Trabajos escolares creativos y únicos" },
  { icon: "pencil-square", label: "Dibujo y diseño",     desc: "Ilustraciones, logotipos y arte digital" },
  { icon: "stars",         label: "Personalizaciones",   desc: "Cualquier idea hecha realidad a tu medida" },
];

const ESTADOS_COLOR = {
  consulta:   { bg: "#FFF3E0", color: "#F97316", label: "Consulta" },
  cotizado:   { bg: "#DBEAFE", color: "#1D4ED8", label: "Cotizado" },
  en_proceso: { bg: "#EDE9FE", color: "#7C3AED", label: "En proceso" },
  entregado:  { bg: "#E8F5E9", color: "#16A34A", label: "Entregado" },
};

const WA_NUMBER = WHATSAPP_NUMBER;

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

function MagBtn({ children, className, onClick, style, href }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 25 });
  const sy = useSpring(y, { stiffness: 300, damping: 25 });
  const handle = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.3);
    y.set((e.clientY - r.top - r.height / 2) * 0.3);
  }, [x, y]);

  if (href) {
    return (
      <motion.a className={className} style={{ ...style, x: sx, y: sy }}
        onMouseMove={handle} onMouseLeave={() => { x.set(0); y.set(0); }}
        whileTap={{ scale: 0.95 }} href={href} target="_blank" rel="noopener noreferrer"
      >{children}</motion.a>
    );
  }
  return (
    <motion.button className={className} style={{ ...style, x: sx, y: sy }}
      onMouseMove={handle} onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.95 }} onClick={onClick}
    >{children}</motion.button>
  );
}

function WorkCard({ trabajo }) {
  const estadoInfo = ESTADOS_COLOR[trabajo.estado] || ESTADOS_COLOR.consulta;
  const fotos = trabajo.fotos || [];
  const mainImg = fotos.length > 0 ? (fotos.find(f => f.orden === 0) || fotos[0])?.imagen_url : null;
  const waMsg = encodeURIComponent(`Hola! Vi el trabajo "${trabajo.titulo}" en su web y quisiera cotizar algo similar 👋`);
  const waLink = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

  return (
    <motion.div className="ytw__card" variants={fadeUp}
      whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
    >
      <div className="ytw__card-img">
        {mainImg ? (
          <img src={mainImg} alt={trabajo.titulo}
            onError={(e) => { e.target.style.display = "none"; e.target.parentElement.classList.add("ytw__card-img--ph"); }}
          />
        ) : (
          <div className="ytw__card-img-ph"><i className="bi bi-image"></i></div>
        )}
        <span className="ytw__estado" style={{ background: estadoInfo.bg, color: estadoInfo.color }}>
          {estadoInfo.label}
        </span>
        {fotos.length > 1 && (
          <span className="ytw__foto-count"><i className="bi bi-images"></i> {fotos.length}</span>
        )}
      </div>
      <div className="ytw__card-body">
        <h3 className="ytw__card-title">{trabajo.titulo}</h3>
        {trabajo.descripcion && <p className="ytw__card-desc">{trabajo.descripcion}</p>}
        <div className="ytw__card-foot">
          {trabajo.precio_final && (
            <span className="ytw__price">S/. {parseFloat(trabajo.precio_final).toFixed(2)}</span>
          )}
          <a className="ytw__btn-wa" href={waLink} target="_blank" rel="noopener noreferrer">
            <i className="bi bi-whatsapp"></i> Quiero uno igual
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function Skeleton() {
  return (
    <div className="ytw__card ytw__card--skel">
      <div className="ytw__card-img yskel"></div>
      <div className="ytw__card-body">
        <div className="yskel yskel--sm" style={{ width: "70%", marginBottom: 8 }}></div>
        <div className="yskel yskel--sm" style={{ width: "90%", marginBottom: 6 }}></div>
        <div className="yskel yskel--sm" style={{ width: "50%" }}></div>
      </div>
    </div>
  );
}

export default function TrabajosPublico() {
  const navigate = useNavigate();
  const [loaded,    setLoaded]    = useState(false);
  const [trabajos,  setTrabajos]  = useState([]);
  const [cargando,  setCargando]  = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [busqueda,  setBusqueda]  = useState("");
  const [orden,     setOrden]     = useState("relevancia");

  const [headerRef, headerVis] = useReveal("-20px");
  const [galRef,    galVis]    = useReveal();
  const [tiposRef,  tiposVis]  = useReveal();
  const [ctaRef,    ctaVis]    = useReveal();

  const waGeneral = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola! Vi su página de trabajos y quisiera cotizar un encargo 👋")}`;

  useEffect(() => {
    setTimeout(() => setLoaded(true), 60);
    api.get("/trabajos/")
      .then(r => setTrabajos(r.data))
      .catch(() => setTrabajos([]))
      .finally(() => setCargando(false));
  }, []);

  const filtrados = trabajos
    .filter(t =>
      t.titulo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
    )
    .sort((a, b) => {
      const pa = parseFloat(a.precio_final) || 0;
      const pb = parseFloat(b.precio_final) || 0;
      if (orden === "precio_asc")  return pa - pb;
      if (orden === "precio_desc") return pb - pa;
      return 0;
    });

  return (
    <div className={`ytw ${loaded ? "ytw--on" : ""}`}>

      {/* NAV */}
      <motion.nav className="yn"
        initial={{ y: -72, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease }}
      >
        <a href="/" className="yn__logo">
          <img src="/src/assets/logo.png" alt="Yalu" className="yn__logo-img" />
          <div><b>Yalu</b><small>Libreria Bazar · Trujillo</small></div>
        </a>
        <ul className="yn__links">
          {NAV_LINKS.map((l, i) => (
            <motion.li key={l.href}
              initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.45, ease }}
            >
              <a href={l.href} className={l.href === "/trabajos" ? "yn__link--active" : ""}
                onClick={e => { if (l.href.startsWith("/") && !l.href.startsWith("/#")) { e.preventDefault(); navigate(l.href); } }}
              >{l.label}</a>
            </motion.li>
          ))}
        </ul>
        <div className="yn__actions">
          <motion.button className="yn__login yn__login--pill"
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}
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
            initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }} transition={{ duration: 0.35, ease }}
          >
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href}
                onClick={e => { if (l.href.startsWith("/") && !l.href.startsWith("/#")) { e.preventDefault(); navigate(l.href); } setMobileNav(false); }}
              >{l.label}</a>
            ))}
            <button className="yn__cta" onClick={() => navigate("/login")}>
              Ingresar <i className="bi bi-person-circle"></i>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <motion.section className="ytw__header" ref={headerRef}
        initial="hidden" animate={headerVis ? "visible" : "hidden"}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        <div className="ytw__header-bg" />
        <div className="ytw__header-grid" />
        <div className="ytw__blob ytw__blob--a" />
        <div className="ytw__blob ytw__blob--b" />

        <div className="ytw__header-inner">
          <motion.p className="ytw__hero-pill" variants={fadeUp}>
            <span className="ytw__hero-dot" />
            <i className="bi bi-scissors"></i>&nbsp; Encargos personalizados · Trujillo
          </motion.p>

          <motion.h1 className="ytw__hero-title" variants={fadeUp} custom={0.05}>
            Hecho a tu <em>medida</em>
          </motion.h1>

          <motion.p className="ytw__hero-sub" variants={fadeUp} custom={0.12}>
            Gigantografías, maquetas, manualidades y mucho más.<br />
            Cuéntanos tu idea y lo hacemos realidad.
          </motion.p>

          <motion.div className="ytw__hero-actions" variants={fadeUp} custom={0.2}>
            <MagBtn className="ytw__btn-primary" href={waGeneral}>
              <i className="bi bi-whatsapp"></i> Cotizar por WhatsApp
            </MagBtn>
            <button className="ytw__btn-ghost"
              onClick={() => document.getElementById("galeria")?.scrollIntoView({ behavior: "smooth" })}
            >
              Ver galería <i className="bi bi-arrow-down"></i>
            </button>
          </motion.div>

          <motion.div className="ytw__hero-trust" variants={fadeUp} custom={0.3}>
            <div className="ytw__trust-item"><i className="bi bi-lightning-charge-fill"></i> Respuesta rápida</div>
            <div className="ytw__trust-sep" />
            <div className="ytw__trust-item"><i className="bi bi-patch-check-fill"></i> Calidad garantizada</div>
            <div className="ytw__trust-sep" />
            <div className="ytw__trust-item"><i className="bi bi-geo-alt-fill"></i> Entrega en Trujillo</div>
          </motion.div>
        </div>
      </motion.section>

      {/* GALERÍA — va primero */}
      <section className="ytw__galeria" id="galeria" ref={galRef}>
        <div className="ytw__section-inner">
          <motion.div className="ytw__section-head"
            initial="hidden" animate={galVis ? "visible" : "hidden"} variants={fadeUp}
          >
            <div className="ytw__section-label"><i className="bi bi-images"></i> Trabajos realizados</div>
            <h2 className="ytw__section-title">Nuestra <em>galería</em></h2>
            <p className="ytw__section-sub">Proyectos reales entregados a nuestros clientes.</p>
          </motion.div>

          <motion.div className="ytw__search-bar"
            initial={{ opacity: 0, y: 16 }} animate={galVis ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5, ease }}
          >
            <div className="ytw__search-wrap">
              <i className="bi bi-search ytw__search-icon"></i>
              <input className="ytw__search-input" type="text"
                placeholder="Buscar trabajos… ej: maqueta, gigantografía"
                value={busqueda} onChange={e => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button className="ytw__search-clear" onClick={() => setBusqueda("")}>
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
            <select className="ytw__sort" value={orden} onChange={e => setOrden(e.target.value)}>
              <option value="relevancia">Relevancia</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
            </select>
          </motion.div>

          {cargando ? (
            <motion.div className="ytw__grid" initial="hidden" animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            >
              {Array(6).fill(0).map((_, i) => <Skeleton key={i} />)}
            </motion.div>
          ) : filtrados.length === 0 ? (
            <motion.div className="ytw__empty" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
              <div className="ytw__empty-icon"><i className="bi bi-image"></i></div>
              <h3>Próximamente</h3>
              <p>Estamos subiendo nuestros trabajos. ¡Escríbenos para ver más!</p>
              <MagBtn className="ytw__btn-primary" href={waGeneral}>
                <i className="bi bi-whatsapp"></i> Ver trabajos por WhatsApp
              </MagBtn>
            </motion.div>
          ) : (
            <motion.div className="ytw__grid" initial="hidden"
              animate={galVis ? "visible" : "hidden"}
              variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
            >
              {filtrados.map(t => <WorkCard key={t.id} trabajo={t} />)}
            </motion.div>
          )}
        </div>
      </section>

      {/* TIPOS DE ENCARGOS — al final como pediste */}
      <section className="ytw__tipos" ref={tiposRef}>
        <div className="ytw__section-inner">
          <motion.div className="ytw__section-head"
            initial="hidden" animate={tiposVis ? "visible" : "hidden"} variants={fadeUp}
          >
            <div className="ytw__section-label"><i className="bi bi-grid-3x3-gap-fill"></i> ¿Qué hacemos?</div>
            <h2 className="ytw__section-title">Tipos de <em>encargos</em></h2>
            <p className="ytw__section-sub">Desde trabajos escolares hasta personalizaciones únicas.</p>
          </motion.div>

          <motion.div className="ytw__tipos-grid"
            initial="hidden" animate={tiposVis ? "visible" : "hidden"}
            variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
          >
            {TIPOS.map((t, i) => (
              <motion.div key={i} className="ytw__tipo-card"
                variants={fadeUp} custom={i * 0.06}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="ytw__tipo-ico"><i className={`bi bi-${t.icon}`}></i></div>
                <strong>{t.label}</strong>
                <span>{t.desc}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="ytw__tipos-cta"
            initial={{ opacity: 0, y: 16 }} animate={tiposVis ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.55, duration: 0.5, ease }}
          >
            <MagBtn className="ytw__btn-primary" href={waGeneral}>
              <i className="bi bi-whatsapp"></i> Cotizar mi encargo
            </MagBtn>
          </motion.div>
        </div>
      </section>

      {/* CTA FINAL */}
      <motion.section className="ytw__cta-section" ref={ctaRef}
        initial="hidden" animate={ctaVis ? "visible" : "hidden"} variants={fadeUp}
      >
        <div className="ytw__cta-bg" />
        <div className="ytw__cta-inner">
          <div className="ytw__cta-left">
            <div className="ytw__cta-ico"><i className="bi bi-chat-dots-fill"></i></div>
            <div>
              <h2>¿Tienes un encargo en mente?</h2>
              <p>Escríbenos con tu idea, foto de referencia o cualquier detalle. Respondemos rápido.</p>
              <div className="ytw__cta-steps">
                {[
                  { n: "1", txt: "Escríbenos tu idea por WhatsApp" },
                  { n: "2", txt: "Te cotizamos en minutos" },
                  { n: "3", txt: "Hacemos tu encargo con cariño" },
                ].map((s, i) => (
                  <motion.div key={i} className="ytw__cta-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={ctaVis ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.12, duration: 0.5, ease }}
                  >
                    <span className="ytw__cta-n">{s.n}</span>{s.txt}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          <MagBtn className="ytw__cta-btn" href={waGeneral}>
            <i className="bi bi-whatsapp"></i> Cotizar ahora
          </MagBtn>
        </div>
      </motion.section>

      {/* FOOTER */}
      <footer className="yf">
        <div className="yf__top">
          <div className="yf__brand">
            <img src="/src/assets/logo.png" alt="Yalu" className="yn__logo-img" />
            <div><b>Yalu</b><small>Libreria Bazar · Trujillo</small></div>
          </div>
          <div className="yf__cols">
            <div className="yf__col">
              <h4>Productos</h4>
              <a href="/catalogo">Lápices y plumas</a>
              <a href="/catalogo">Libros y cuadernos</a>
              <a href="/catalogo">Arte y pintura</a>
              <a href="/catalogo">Manualidades</a>
            </div>
            <div className="yf__col">
              <h4>Empresa</h4>
              <a href="/#nosotros">Nosotros</a>
              <a href="/trabajos">Trabajos</a>
            </div>
            <div className="yf__col">
              <h4>Contacto</h4>
              <a href={`tel:+${WA_NUMBER}`}><i className="bi bi-telephone-fill"></i> +51 900 548 662</a>
              <a href="mailto:hola@yalu.pe"><i className="bi bi-envelope-fill"></i> hola@yalu.pe</a>
              <a href="/"><i className="bi bi-geo-alt-fill"></i> Trujillo, La Libertad</a>
            </div>
          </div>
        </div>
        <div className="yf__bottom">
          <span>© 2025 Yalu Libreria Bazar · Todos los derechos reservados</span>
          <div className="yf__socials">
            <a href="#"><i className="bi bi-instagram"></i></a>
            <a href="#"><i className="bi bi-facebook"></i></a>
            <a href={waGeneral} target="_blank" rel="noopener noreferrer"><i className="bi bi-whatsapp"></i></a>
          </div>
        </div>
      </footer>

    </div>
  );
}
