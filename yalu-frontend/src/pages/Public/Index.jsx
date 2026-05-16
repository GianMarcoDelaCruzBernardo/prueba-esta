import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion, useInView, AnimatePresence,
  useMotionValue, useSpring
} from "framer-motion";
import Spline from "@splinetool/react-spline";
import "../../styles/Index.css";

/* ------------------------------------------------------
   DATA
------------------------------------------------------ */
const NAV_LINKS = [
  { label: "Inicio",    href: "#home" },
  { label: "Productos", href: "/catalogo" },
  { label: "Trabajos",  href: "/trabajos" },  
  { label: "Nosotros",  href: "#nosotros" },
];

const CATS = [
  { icon: "pencil-fill",    label: "Lapices y plumas",    count: "80+",  color: "#FFF3E0", accent: "#F97316", desc: "Pilot, Faber-Castell, BIC" },
  { icon: "book-fill",      label: "Libros y cuadernos",  count: "120+", color: "#E8F5E9", accent: "#16A34A", desc: "Universitarios, espiral, A4" },
  { icon: "palette-fill",   label: "Arte y pintura",      count: "95+",  color: "#EDE9FE", accent: "#7C3AED", desc: "Acrilicos, oleos, acuarelas" },
  { icon: "rulers",         label: "Geometria",           count: "40+",  color: "#DBEAFE", accent: "#1D4ED8", desc: "Escuadras, compas, reglas" },
  { icon: "scissors",       label: "Manualidades",        count: "60+",  color: "#FCE7F3", accent: "#BE185D", desc: "Goma eva, cartulina, pegamento" },
  { icon: "bag-fill",       label: "Mochilas y estuches", count: "35+",  color: "#FEF9C3", accent: "#CA8A04", desc: "Totto, Faster, Kipling" },
  { icon: "calculator-fill",label: "Calculadoras",        count: "20+",  color: "#F0FDF4", accent: "#15803D", desc: "Casio, cientificas, basicas" },
  { icon: "brush-fill",     label: "Papeleria fina",      count: "50+",  color: "#FFF1F2", accent: "#E11D48", desc: "Post-its, folders, archivadores" },
];

const PROMOS = [
  {
    id: 1,
    badge: "2x1",
    tag: "MAS VENDIDO",
    title: "Cuadernos Universitarios",
    sub: "Rayados y cuadriculados, 100 hojas",
    price: "S/. 5.00",
    old: "S/. 10.00",
    save: "Ahorras S/. 5",
    color: "#E8F5E9",
    accent: "#16A34A",
    icon: "book-fill",
  },
  {
    id: 2,
    badge: "-29%",
    tag: "OFERTA",
    title: "Lapices Faber-Castell x12",
    sub: "HB, graduacion profesional",
    price: "S/. 8.90",
    old: "S/. 12.50",
    save: "Ahorras S/. 3.60",
    color: "#FFF3E0",
    accent: "#F97316",
    icon: "pencil-fill",
  },
  {
    id: 3,
    badge: "-31%",
    tag: "KIT COMPLETO",
    title: "Kit de Arte Profesional",
    sub: "Pinturas, pinceles y lienzo 30x40",
    price: "S/. 45.00",
    old: "S/. 65.00",
    save: "Ahorras S/. 20",
    color: "#EDE9FE",
    accent: "#7C3AED",
    icon: "palette-fill",
  },
  {
    id: 4,
    badge: "-25%",
    tag: "BACK TO SCHOOL",
    title: "Mochila Escolar Reforzada",
    sub: "Compartimientos multiples, 30L",
    price: "S/. 59.90",
    old: "S/. 79.90",
    save: "Ahorras S/. 20",
    color: "#FEF9C3",
    accent: "#CA8A04",
    icon: "bag-fill",
  },
];

const STEPS = [
  { n: "01", icon: "box-arrow-in-right", title: "Ingresa con Google",  desc: "Un clic y listo. Sin formularios ni contrasenas." },
  { n: "02", icon: "search",             title: "Explora el catalogo", desc: "Filtra por categoria, precio o marca en segundos." },
  { n: "03", icon: "cart-check-fill",    title: "Agrega al carrito",   desc: "Selecciona tus utiles y revisa tu pedido." },
  { n: "04", icon: "bag-check-fill",     title: "Confirma y listo",    desc: "Recoge en tienda o entregamos en Trujillo." },
];

const MARQUEE = ["LAPICES","CUADERNOS","COLORES","REGLAS","MOCHILAS","BORRADORES","TIJERAS","PINTURAS","LIBRERIA YALU","TRUJILLO","OFERTA","BACK TO SCHOOL","ARTE","MANUALIDADES"];

const TESTIMONIALS = [
  { name: "Maria G.",   role: "Docente",   stars: 5, txt: "Excelente variedad y precios. Siempre encuentro todo para mis alumnos." },
  { name: "Carlos R.",  role: "Estudiante",stars: 5, txt: "Los cuadernos universitarios son los mejores de Trujillo. Super recomendado." },
  { name: "Lucia M.",   role: "Artista",   stars: 5, txt: "Consegui materiales de arte que no encontraba en ningun otro lado." },
  { name: "Pedro S.",   role: "Padre",     stars: 5, txt: "Pedido online rapido y me lo entregaron al dia siguiente. Perfecto." },
];

/* ------------------------------------------------------
   VARIANTS
------------------------------------------------------ */
const ease = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: d, ease } }),
};
const fadeLeft  = { hidden: { opacity:0,x:-48 }, visible: { opacity:1,x:0, transition:{duration:0.75,ease} } };
const fadeRight = { hidden: { opacity:0,x:48  }, visible: { opacity:1,x:0, transition:{duration:0.75,ease} } };

function useReveal(margin = "-80px") {
  const ref = useRef(null);
  const vis = useInView(ref, { once: true, margin });
  return [ref, vis];
}

/* ------------------------------------------------------
   MAGNETIC BUTTON
------------------------------------------------------ */
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
      className={className}
      style={{ ...style, x: sx, y: sy }}
      onMouseMove={handle}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

/* ------------------------------------------------------
   PROMO CARD
------------------------------------------------------ */
function PromoCard({ p, active, onClick }) {
  return (
    <motion.div
      className={`yp-card ${active ? "yp-card--active" : ""}`}
      style={{ "--pc": p.color, "--pa": p.accent }}
      onClick={onClick}
      whileHover={!active ? { scale: 1.02, y: -4 } : {}}
      layout
    >
      <div className="yp-card__badge">{p.badge}</div>
      <div className="yp-card__tag">{p.tag}</div>
      <div className="yp-card__icon">
        <i className={`bi bi-${p.icon}`}></i>
      </div>
      <h3 className="yp-card__title">{p.title}</h3>
      <p className="yp-card__sub">{p.sub}</p>
      <div className="yp-card__prices">
        <span className="yp-card__price">{p.price}</span>
        <span className="yp-card__old">{p.old}</span>
      </div>
      <div className="yp-card__save">{p.save}</div>
    </motion.div>
  );
}

/* ------------------------------------------------------
   COMPONENT
------------------------------------------------------ */
export default function Index() {
  const navigate = useNavigate();
  const [loaded,      setLoaded]      = useState(false);
  const [robotReady,  setRobotReady]  = useState(false);
  const [counts,      setCounts]      = useState({ p: 0, y: 0, c: 0 });
  const [activePromo, setActivePromo] = useState(0);
  const [mobileNav,   setMobileNav]   = useState(false);

  const [heroRef,  heroVis ] = useReveal("-20px");
  const [statsRef, statsVis] = useReveal();
  const [promoRef, promoVis] = useReveal();
  const [catsRef,  catsVis ] = useReveal();
  const [howRef,   howVis  ] = useReveal();
  const [aboutRef, aboutVis] = useReveal();
  const [testiRef, testiVis] = useReveal();
  const [ctaRef,   ctaVis  ] = useReveal();

  useEffect(() => {
    const id = setInterval(() => setActivePromo(p => (p + 1) % PROMOS.length), 3800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 60);
    const t = { p: 500, y: 14, c: 2000 };
    let s = 0;
    const steps = 55;
    const id = setInterval(() => {
      s++;
      const e = 1 - Math.pow(1 - s / steps, 3);
      setCounts({ p: Math.floor(e * t.p), y: Math.floor(e * t.y), c: Math.floor(e * t.c) });
      if (s >= steps) clearInterval(id);
    }, 1800 / steps);
    return () => clearInterval(id);
  }, []);

  const handleNavClick = (e, href) => {
    if (href.startsWith("/")) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <div className={`yi ${loaded ? "yi--on" : ""}`}>

      {/* --- NAVBAR ------------------------------------------ */}
      <motion.nav
        className="yn"
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease }}
      >
        <a href="#home" className="yn__logo">
          <img src="/src/assets/logo.png" alt="Yalu" className="yn__logo-img" />
          <div>
            <b>Yalu</b>
            <small>Libreria Bazar · Trujillo</small>
          </div>
        </a>

        <ul className="yn__links">
          {NAV_LINKS.map((l, i) => (
            <motion.li
              key={l.href}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.45, ease }}
            >
              <a href={l.href} onClick={(e) => handleNavClick(e, l.href)}>
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
            onClick={() => navigate("/catalogo")}
          >
            <i className="bi bi-person-circle"></i> Ingresar
          </motion.button>
        </div>

        <button className="yn__burger" onClick={() => setMobileNav(v => !v)}>
          <i className={`bi bi-${mobileNav ? "x-lg" : "list"}`}></i>
        </button>
      </motion.nav>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {mobileNav && (
          <motion.div
            className="yn__drawer"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.35, ease }}
          >
            {NAV_LINKS.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  handleNavClick(e, l.href);
                  setMobileNav(false);
                }}
              >
                {l.label}
              </a>
            ))}
            <button className="yn__cta" onClick={() => navigate("/login")}>
              Ver catalogo <i className="bi bi-arrow-right"></i>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO -------------------------------------------- */}
      <section className="yh" id="home" ref={heroRef}>
        <div className="yh__blob yh__blob--a" />
        <div className="yh__blob yh__blob--b" />
        <div className="yh__blob yh__blob--c" />
        <div className="yh__grid-lines" />

        <motion.div
          className="yh__content"
          initial="hidden"
          animate={heroVis ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.13 } } }}
        >
          <motion.div className="yh__pill" variants={fadeUp} custom={0}>
            <span className="yh__pill-dot" />
            <i className="bi bi-geo-alt-fill"></i> Trujillo, Peru · Envio gratis
          </motion.div>

          <motion.h1
            className="yh__h1"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            initial="hidden"
            animate={heroVis ? "visible" : "hidden"}
          >
            {["Todo para", "aprender y", "crear."].map((w, i) => (
              <motion.span key={i} className={`yh__word yh__word--${i + 1}`} variants={fadeUp} custom={i * 0.1}>
                {i === 2 ? <em>{w}</em> : w}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p className="yh__p" variants={fadeUp} custom={0.3}>
            La libreria bazar con mas variedad de Trujillo.
            Utiles, arte, libros y todo lo que necesitas,
            ahora en un solo lugar con precios increibles.
          </motion.p>

          <motion.div className="yh__btns" variants={fadeUp} custom={0.45}>
            <MagBtn className="yi-btn yi-btn--primary" onClick={() => navigate("/login")}>
              Ver catalogo completo <i className="bi bi-arrow-right"></i>
            </MagBtn>
            <MagBtn
              className="yi-btn yi-btn--outline"
              onClick={() => document.getElementById("promos")?.scrollIntoView({ behavior: "smooth" })}
            >
              Ver promociones
            </MagBtn>
          </motion.div>

          <motion.div className="yh__trust" variants={fadeUp} custom={0.6}>
            <div className="yh__badge"><i className="bi bi-truck"></i><span>Envio en Trujillo</span></div>
            <div className="yh__badge"><i className="bi bi-shield-check"></i><span>Compra segura</span></div>
            <div className="yh__badge"><i className="bi bi-star-fill"></i><span>4.9 · +2000 resenas</span></div>
          </motion.div>
        </motion.div>

        <motion.div
          className="yh__visual"
          initial={{ opacity: 0, x: 64, scale: 0.95 }}
          animate={heroVis ? { opacity: 1, x: 0, scale: 1 } : {}}
          transition={{ duration: 0.85, delay: 0.25, ease }}
        >
          <div className="yh__shelf">
            {[
              {
                cls: "a",
                img: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=120&h=120&fit=crop&q=80",
                lbl: "Lapices",
                p: "Desde S/.2",
              },
              {
                cls: "b",
                img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=120&h=120&fit=crop&q=80",
                lbl: "Cuadernos",
                p: "Desde S/.5",
              },
              {
                cls: "c",
                img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=120&h=120&fit=crop&q=80",
                lbl: "Pinturas",
                p: "Desde S/.8",
              },
              {
                cls: "d",
                img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=120&h=120&fit=crop&q=80",
                lbl: "Geometria",
                p: "Desde S/.3",
              },
              {
                cls: "e",
                img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=120&h=120&fit=crop&q=80",
                lbl: "Mochilas",
                p: "Desde S/.35",
              },
              {
                cls: "f",
                img: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=120&h=120&fit=crop&q=80",
                lbl: "Manualidades",
                p: "Desde S/.4",
              },
            ].map((it, i) => (
              <motion.div
                key={it.cls}
                className={`ysc ysc--${it.cls}`}
                initial={{ opacity: 0, y: 28, scale: 0.88 }}
                animate={heroVis ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.09, duration: 0.55, ease: "backOut" }}
                whileHover={{ y: -8, scale: 1.06, transition: { duration: 0.22 } }}
              >
                <div className="ysc__ico">
                  <img
                    src={it.img}
                    alt={it.lbl}
                    className="ysc__img"
                  />
                </div>
                <span>{it.lbl}</span>
                <small>{it.p}</small>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="yh__floating-tag"
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={heroVis ? { opacity: 1, scale: 1, rotate: -4 } : {}}
            transition={{ delay: 1.1, duration: 0.5, ease: "backOut" }}
          >
            <i className="bi bi-lightning-fill"></i> +500 productos
          </motion.div>
          <motion.div
            className="yh__floating-tag2"
            initial={{ opacity: 0, scale: 0.7, rotate: 6 }}
            animate={heroVis ? { opacity: 1, scale: 1, rotate: 3 } : {}}
            transition={{ delay: 1.25, duration: 0.5, ease: "backOut" }}
          >
            <i className="bi bi-star-fill"></i> Oferta del dia
          </motion.div>
        </motion.div>
      </section>

      {/* --- MARQUEE ----------------------------------------- */}
      <div className="ym" aria-hidden="true">
        <div className="ym__track">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((x, i) => (
            <span key={i}>{x} <i className="bi bi-dot"></i></span>
          ))}
        </div>
      </div>

      {/* --- STATS ------------------------------------------- */}
      <motion.section
        className="ys"
        ref={statsRef}
        initial="hidden"
        animate={statsVis ? "visible" : "hidden"}
        variants={{ visible: { transition: { staggerChildren: 0.13 } } }}
      >
        {[
          { val: `+${counts.p}`, lbl: "Productos disponibles", icon: "box-seam-fill"    },
          { val: `${counts.y}+`, lbl: "Anos en Trujillo",      icon: "shop"             },
          { val: `+${counts.c}`, lbl: "Clientes felices",      icon: "people-fill"      },
          { val: "100%",         lbl: "Productos originales",  icon: "patch-check-fill" },
        ].map((it, i, arr) => (
          <>
            <motion.div key={it.lbl} className="ys__item" variants={fadeUp} custom={i * 0.1}>
              <div className="ys__icon"><i className={`bi bi-${it.icon}`}></i></div>
              <strong>{it.val}</strong>
              <span>{it.lbl}</span>
            </motion.div>
            {i < arr.length - 1 && <div key={`d${i}`} className="ys__divider" />}
          </>
        ))}
      </motion.section>

      {/* --- PROMOCIONES ------------------------------------- */}
      <section className="ypr" id="promos" ref={promoRef}>
        <motion.div
          className="yi-sec"
          initial="hidden"
          animate={promoVis ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <p className="yi-lbl"><i className="bi bi-fire"></i> Promociones imperdibles</p>
          <h2 className="yi-h2">Ofertas de esta <em>semana</em></h2>
          <p className="yi-sub">Aprovecha antes de que se agoten!</p>
        </motion.div>

        <motion.div
          className="ypr__grid"
          initial="hidden"
          animate={promoVis ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
        >
          {PROMOS.map((p, i) => (
            <motion.div key={p.id} variants={fadeUp} custom={i * 0.1}>
              <PromoCard p={p} active={activePromo === i} onClick={() => setActivePromo(i)} />
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePromo}
            className="ypr__detail"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.45, ease }}
            style={{ "--pa": PROMOS[activePromo].accent, "--pc": PROMOS[activePromo].color }}
          >
            <div className="ypr__detail-icon">
              <i className={`bi bi-${PROMOS[activePromo].icon}`}></i>
            </div>
            <div className="ypr__detail-body">
              <span className="ypr__detail-tag">{PROMOS[activePromo].tag}</span>
              <h3>{PROMOS[activePromo].title}</h3>
              <p>{PROMOS[activePromo].sub}</p>
              <div className="ypr__detail-row">
                <span className="ypr__big-price">{PROMOS[activePromo].price}</span>
                <span className="ypr__old-price">{PROMOS[activePromo].old}</span>
                <span className="ypr__save">{PROMOS[activePromo].save}</span>
              </div>
            </div>
            <MagBtn
              className="yi-btn yi-btn--primary ypr__detail-cta"
              onClick={() => navigate("/login")}
            >
              Aprovechar oferta <i className="bi bi-bag-plus-fill"></i>
            </MagBtn>
          </motion.div>
        </AnimatePresence>

        <div className="ypr__dots">
          {PROMOS.map((_, i) => (
            <button
              key={i}
              className={`ypr__dot ${i === activePromo ? "ypr__dot--on" : ""}`}
              onClick={() => setActivePromo(i)}
            />
          ))}
        </div>
      </section>

      {/* --- CATEGORIAS -------------------------------------- */}
      <section className="yc" id="catalogo" ref={catsRef}>
        <motion.div
          className="yi-sec"
          initial="hidden"
          animate={catsVis ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <p className="yi-lbl"><i className="bi bi-grid-3x3-gap-fill"></i> Catalogo completo</p>
          <h2 className="yi-h2">Encuentra todo lo que <em>necesitas</em></h2>
          <p className="yi-sub">Desde el lapiz mas sencillo hasta materiales de arte profesional.</p>
        </motion.div>

        <motion.div
          className="yc__grid"
          initial="hidden"
          animate={catsVis ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
        >
          {CATS.map((c, i) => (
            <motion.div
              key={i}
              className="yc__card"
              style={{ "--ca": c.accent, "--cb": c.color }}
              variants={fadeUp}
              custom={i * 0.05}
              whileHover={{ y: -7, scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
            >
              <div className="yc__ico"><i className={`bi bi-${c.icon}`}></i></div>
              <div className="yc__body">
                <strong>{c.label}</strong>
                <span className="yc__desc">{c.desc}</span>
                <span className="yc__count">{c.count} productos</span>
              </div>
              <div className="yc__arr"><i className="bi bi-arrow-right"></i></div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="yc__foot"
          initial="hidden"
          animate={catsVis ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0.6}
        >
          <MagBtn className="yi-btn yi-btn--primary" onClick={() => navigate("/login")}>
            Ver todo el catalogo <i className="bi bi-grid-fill"></i>
          </MagBtn>
        </motion.div>
      </section>

      {/* --- COMO FUNCIONA ----------------------------------- */}
      <section className="yw" id="como" ref={howRef}>
        <div className="yw__bg" />
        <motion.div
          className="yi-sec yi-sec--light"
          initial="hidden"
          animate={howVis ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <p className="yi-lbl yi-lbl--w">Como funciona</p>
          <h2 className="yi-h2 yi-h2--w">Comprar es <em>muy facil</em></h2>
        </motion.div>

        <motion.div
          className="yw__grid"
          initial="hidden"
          animate={howVis ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } } }}
        >
          {STEPS.map((s, i) => (
            <motion.div
              key={i}
              className="yw__step"
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="yw__n">{s.n}</div>
              <div className="yw__ico"><i className={`bi bi-${s.icon}`}></i></div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < STEPS.length - 1 && <div className="yw__connector" />}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          style={{ textAlign: "center", paddingTop: "48px", position: "relative", zIndex: 1 }}
          initial="hidden"
          animate={howVis ? "visible" : "hidden"}
          variants={fadeUp}
          custom={0.5}
        >
          <MagBtn className="yi-btn yi-btn--white" onClick={() => navigate("/login")}>
            Empezar ahora <i className="bi bi-arrow-right-circle-fill"></i>
          </MagBtn>
        </motion.div>
      </section>

      {/* --- TESTIMONIOS ------------------------------------- */}
      <section className="yt" ref={testiRef}>
        <motion.div
          className="yi-sec"
          initial="hidden"
          animate={testiVis ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <p className="yi-lbl"><i className="bi bi-chat-quote-fill"></i> Testimonios</p>
          <h2 className="yi-h2">Lo que dicen nuestros <em>clientes</em></h2>
        </motion.div>

        <motion.div
          className="yt__grid"
          initial="hidden"
          animate={testiVis ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              className="yt__card"
              variants={fadeUp}
              custom={i * 0.08}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="yt__stars">
                {Array(t.stars).fill(0).map((_, j) => (
                  <i key={j} className="bi bi-star-fill"></i>
                ))}
              </div>
              <p className="yt__txt">"{t.txt}"</p>
              <div className="yt__author">
                <div className="yt__avatar">{t.name[0]}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- NOSOTROS ---------------------------------------- */}
      <section className="ya" id="nosotros" ref={aboutRef}>
        <motion.div
          className="ya__l"
          initial="hidden"
          animate={aboutVis ? "visible" : "hidden"}
          variants={fadeLeft}
        >
          <p className="yi-lbl">Nuestra historia</p>
          <h2 className="yi-h2">Mas que una <em>libreria</em></h2>
          <p className="ya__txt">
            Desde Trujillo, llevamos mas de 14 anos siendo el aliado de estudiantes,
            docentes y creativos. En Yalu encontraras todo lo que necesitas para
            aprender, crear y crecer. Somos una libreria con alma moderna.
          </p>
          <motion.div
            className="ya__list"
            initial="hidden"
            animate={aboutVis ? "visible" : "hidden"}
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } } }}
          >
            {["Atencion personalizada", "Precios justos y competitivos", "La mayor variedad de Trujillo"].map((txt, i) => (
              <motion.div key={i} variants={fadeUp} className="ya__item">
                <i className="bi bi-check-circle-fill"></i> {txt}
              </motion.div>
            ))}
          </motion.div>
          <MagBtn className="yi-btn yi-btn--primary" onClick={() => navigate("/login")}>
            Conocer la tienda <i className="bi bi-arrow-right"></i>
          </MagBtn>
        </motion.div>

        <motion.div
          className="ya__r"
          initial="hidden"
          animate={aboutVis ? "visible" : "hidden"}
          variants={fadeRight}
        >
          <motion.div className="ya__big" whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}>
            <i className="bi bi-book-half"></i>
            <strong>+14</strong>
            <span>Anos en Trujillo</span>
          </motion.div>
          <div className="ya__mini-grid">
            {[
              { icon: "star-fill",      val: "4.9",  lbl: "Valoracion"  },
              { icon: "bag-check-fill", val: "+500", lbl: "Pedidos/mes" },
              { icon: "person-check",   val: "98%",  lbl: "Satisfaccion"},
              { icon: "clock-fill",     val: "24h",  lbl: "Entrega"     },
            ].map((it, i) => (
              <motion.div
                key={i}
                className="ya__box"
                whileHover={{ scale: 1.06, transition: { duration: 0.2 } }}
              >
                <i className={`bi bi-${it.icon}`}></i>
                <strong>{it.val}</strong>
                <span>{it.lbl}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* --- ROBOT CTA --------------------------------------- */}
      <section className="ycta" ref={ctaRef}>
        <div className="ycta__bg" />

        <motion.div
          className="ycta__l"
          initial="hidden"
          animate={ctaVis ? "visible" : "hidden"}
          variants={fadeLeft}
        >
          <p className="yi-lbl yi-lbl--w">Tecnologia + Educacion</p>
          <h2 className="yi-h2 yi-h2--w">El futuro de comprar<br /><em>utiles escolares</em></h2>
          <p className="ycta__desc">
            Yalu no es solo una libreria. Es una plataforma disenada para que
            estudiantes, padres y docentes encuentren lo que necesitan en segundos.
          </p>
          <div className="ycta__feats">
            {["Catalogo de +500 productos", "Entrega en 24h en Trujillo", "Precios siempre actualizados"].map((f, i) => (
              <motion.div
                key={i}
                className="ycta__feat"
                initial={{ opacity: 0, x: -20 }}
                animate={ctaVis ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.55, ease }}
              >
                <i className="bi bi-check-circle-fill"></i> {f}
              </motion.div>
            ))}
          </div>
          <MagBtn className="yi-btn yi-btn--white" onClick={() => navigate("/login")}>
            Empezar gratis <i className="bi bi-arrow-right-circle-fill"></i>
          </MagBtn>
        </motion.div>

        <div className="ycta__r">
          {!robotReady && (
            <div className="yi-loader">
              <div className="yi-loader__ring yi-loader__ring--w" />
            </div>
          )}
          <div className={`ycta__spline ${robotReady ? "ycta__spline--on" : ""}`}>
            <Spline
              scene="https://prod.spline.design/d6I5rP0Gl6tfQeGu/scene.splinecode"
              onLoad={() => setRobotReady(true)}
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER ------------------------------------------ */}
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
              <a href="#catalogo">Lapices y plumas</a>
              <a href="#catalogo">Libros y cuadernos</a>
              <a href="#catalogo">Arte y pintura</a>
              <a href="#catalogo">Manualidades</a>
            </div>
            <div className="yf__col">
              <h4>Empresa</h4>
              <a href="#nosotros">Nosotros</a>
              <a href="#como">Como funciona</a>
              <a href="#promos">Promociones</a>
            </div>
            <div className="yf__col">
              <h4>Contacto</h4>
              <a href="tel:+51944000000"><i className="bi bi-telephone-fill"></i> +51 944 000 000</a>
              <a href="mailto:hola@yalu.pe"><i className="bi bi-envelope-fill"></i> hola@yalu.pe</a>
              <a href="#home"><i className="bi bi-geo-alt-fill"></i> Trujillo, La Libertad</a>
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