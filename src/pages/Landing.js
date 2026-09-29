import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";

/* =========================================================
   FAYOLA — LANDING PARA TATUADORES
   ========================================================= */

const WHATSAPP =
  "https://wa.me/5571985119593?text=Quero%20conhecer%20o%20Fayola";

const WHATSAPP_ASSINAR =
  "https://wa.me/5571985119593?text=Quero%20assinar%20o%20Fayola";

/* =========================================================
   REVEAL
   ========================================================= */

function Reveal({
  children,
  className = "",
  delay = 0,
  y = 35,
  once = true,
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   COUNT UP
   ========================================================= */

function CountUp({ value, suffix = "", duration = 1600 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.floor(start + (value - start) * eased);

      setCount(next);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* =========================================================
   ORBIT / AURA
   ========================================================= */

function Aura({ className = "", delay = 0 }) {
  return (
    <motion.div
      className={`f-aura ${className}`}
      animate={{
        x: [0, 35, -20, 0],
        y: [0, -25, 20, 0],
        scale: [1, 1.12, 0.92, 1],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

/* =========================================================
   PHYSICAL CARD
   ========================================================= */

function PhysicalCard({
  children,
  className = "",
  x = 0,
  y = 0,
  rotate = 0,
}) {
  const ref = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, {
    stiffness: 170,
    damping: 18,
    mass: 0.7,
  });

  const springY = useSpring(mouseY, {
    stiffness: 170,
    damping: 18,
    mass: 0.7,
  });

  const rotateX = useTransform(springY, [-50, 50], [8, -8]);
  const rotateY = useTransform(springX, [-50, 50], [-8, 8]);

  const handleMouseMove = (event) => {
    const rect = ref.current?.getBoundingClientRect();

    if (!rect) return;

    const px = event.clientX - (rect.left + rect.width / 2);
    const py = event.clientY - (rect.top + rect.height / 2);

    mouseX.set(px * 0.55);
    mouseY.set(py * 0.55);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`physical-card ${className}`}
      style={{
        x: springX,
        y: springY,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{
        x,
        y,
        rotate,
      }}
      animate={{
        y: [y, y - 8, y],
      }}
      transition={{
        y: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   MAGNETIC BUTTON
   ========================================================= */

function MagneticButton({ children, href, className = "" }) {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, {
    stiffness: 250,
    damping: 20,
  });

  const sy = useSpring(y, {
    stiffness: 250,
    damping: 20,
  });

  const move = (event) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.18);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.18);
  };

  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={move}
      onMouseLeave={leave}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.a>
  );
}

/* =========================================================
   TATTOO REQUEST CARD
   ========================================================= */

function TattooRequestCard() {
  return (
    <motion.div
      className="request-card"
      initial={{ opacity: 0, scale: 0.85, y: 35 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 1,
        delay: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="request-top">
        <span className="request-dot" />
        <span>NOVO PROJETO</span>
        <span className="request-time">agora</span>
      </div>

      <div className="request-name">
        Blackwork no antebraço
      </div>

      <div className="request-tags">
        <span>Blackwork</span>
        <span>12 cm</span>
        <span>Antebraço</span>
      </div>

      <div className="request-images">
        <div className="reference-image ref-one">
          <span>✦</span>
        </div>

        <div className="reference-image ref-two">
          <span>◒</span>
        </div>

        <div className="reference-more">
          +2
        </div>
      </div>

      <div className="request-footer">
        <div>
          <small>CLIENTE</small>
          <strong>Marina</strong>
        </div>

        <div className="request-arrow">
          →
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   PIX CARD
   ========================================================= */

function PixCard() {
  return (
    <motion.div
      className="pix-card"
      animate={{
        y: [0, -7, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="pix-icon">✦</div>

      <div>
        <span>SINAL PIX</span>
        <strong>R$ 195,00</strong>
      </div>

      <div className="pix-check">✓</div>
    </motion.div>
  );
}

/* =========================================================
   DASHBOARD MOCKUP
   ========================================================= */

function DashboardMockup() {
  return (
    <div className="dashboard-wrap">
      <motion.div
        className="dashboard-shadow"
        animate={{
          rotate: [-1, 1, -1],
          y: [0, -8, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="dashboard"
        initial={{
          opacity: 0,
          rotateX: 15,
          rotateY: -8,
          y: 50,
        }}
        animate={{
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
          y: 0,
        }}
        transition={{
          duration: 1.2,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="dashboard-top">
          <div className="brand-small">
            <span>✦</span>
            FAYOLA
          </div>

          <div className="dash-user">
            <span className="online-dot" />
            Seu estúdio
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dash-sidebar">
            <div className="side-active">⌂</div>
            <div>◫</div>
            <div>◌</div>
            <div>◉</div>
            <div>⚙</div>
          </div>

          <div className="dash-main">
            <div className="dash-heading">
              <div>
                <span>QUARTA · 14 OUT</span>
                <h3>Agenda do dia</h3>
              </div>

              <button>+ Novo horário</button>
            </div>

            <div className="dash-stats">
              <div>
                <small>AGENDADOS</small>
                <strong>
                  <CountUp value={6} />
                </strong>
              </div>

              <div>
                <small>A CONFIRMAR</small>
                <strong>
                  <CountUp value={2} />
                </strong>
              </div>

              <div>
                <small>FATURAMENTO</small>
                <strong>R$ 2.450</strong>
              </div>
            </div>

            <div className="schedule">
              <div className="schedule-line" />

              <div className="appointment">
                <span className="appointment-time">
                  10:00
                </span>

                <div className="appointment-card">
                  <div className="appointment-avatar">
                    M
                  </div>

                  <div>
                    <strong>Marina</strong>
                    <span>Blackwork · 12 cm</span>
                  </div>

                  <em>Confirmado</em>
                </div>
              </div>

              <div className="appointment">
                <span className="appointment-time">
                  14:30
                </span>

                <div className="appointment-card orange">
                  <div className="appointment-avatar">
                    R
                  </div>

                  <div>
                    <strong>Rafael</strong>
                    <span>Fineline · 8 cm</span>
                  </div>

                  <em>Aguardando PIX</em>
                </div>
              </div>

              <div className="appointment">
                <span className="appointment-time">
                  18:00
                </span>

                <div className="appointment-card">
                  <div className="appointment-avatar">
                    A
                  </div>

                  <div>
                    <strong>Ana</strong>
                    <span>Orçamento aprovado</span>
                  </div>

                  <em>Confirmado</em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <TattooRequestCard />
      <PixCard />
    </div>
  );
}

/* =========================================================
   FLOW CARD
   ========================================================= */

function FlowCard({
  number,
  title,
  text,
  icon,
  delay = 0,
}) {
  return (
    <Reveal delay={delay}>
      <motion.div
        className="flow-card"
        whileHover={{
          y: -10,
          rotateX: 3,
          rotateY: -3,
        }}
        transition={{
          type: "spring",
          stiffness: 220,
          damping: 18,
        }}
      >
        <div className="flow-number">{number}</div>

        <div className="flow-icon">
          {icon}
        </div>

        <h3>{title}</h3>
        <p>{text}</p>
      </motion.div>
    </Reveal>
  );
}

/* =========================================================
   FEATURE CARD
   ========================================================= */

function FeatureCard({
  number,
  title,
  description,
  children,
  className = "",
}) {
  return (
    <motion.div
      className={`feature-card ${className}`}
      whileHover={{
        y: -8,
        scale: 1.01,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 20,
      }}
    >
      <div className="feature-number">
        {number}
      </div>

      <div className="feature-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      {children}
    </motion.div>
  );
}

/* =========================================================
   BEFORE AFTER
   ========================================================= */

function BeforeAfter() {
  return (
    <div className="before-after">
      <motion.div
        className="ba-panel before"
        whileHover={{
          y: -5,
        }}
      >
        <span className="ba-label">
          ANTES
        </span>

        <h3>Você tentando organizar tudo</h3>

        <div className="chaos">
          <div>WhatsApp</div>
          <div>Instagram</div>
          <div>“Quanto fica?”</div>
          <div>“Tem horário sábado?”</div>
          <div>“Vou mandar referência”</div>
          <div>Agenda</div>
        </div>

        <p>
          Mensagens espalhadas, pedidos perdidos
          e tempo que poderia estar sendo usado
          para tatuar.
        </p>
      </motion.div>

      <motion.div
        className="ba-divider"
        animate={{
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        ✦
      </motion.div>

      <motion.div
        className="ba-panel after"
        whileHover={{
          y: -5,
        }}
      >
        <span className="ba-label">
          COM FAYOLA
        </span>

        <h3>Seu atendimento organizado</h3>

        <div className="organized">
          <div>
            <span>✓</span>
            Pedido recebido
          </div>

          <div>
            <span>✓</span>
            Referências anexadas
          </div>

          <div>
            <span>✓</span>
            Orçamento enviado
          </div>

          <div>
            <span>✓</span>
            Sinal PIX confirmado
          </div>

          <div>
            <span>✓</span>
            Horário reservado
          </div>
        </div>

        <p>
          Você entra na conversa quando precisa.
          O processo continua organizado.
        </p>
      </motion.div>
    </div>
  );
}

/* =========================================================
   QUOTE MOCKUP
   ========================================================= */

function QuoteMockup() {
  return (
    <div className="quote-scene">
      <motion.div
        className="quote-orbit orbit-one"
        animate={{ rotate: 360 }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="quote-orbit orbit-two"
        animate={{ rotate: -360 }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="quote-window"
        initial={{
          opacity: 0,
          y: 40,
          rotateX: 10,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          rotateX: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="quote-header">
          <div>
            <span>FAYOLA</span>
            <strong>Novo projeto</strong>
          </div>

          <div className="quote-status">
            EM ANÁLISE
          </div>
        </div>

        <div className="quote-body">
          <div className="quote-left">
            <div className="quote-photo">
              <div className="fake-tattoo">
                ✦
              </div>
            </div>

            <div className="reference-row">
              <div />
              <div />
              <div />
            </div>
          </div>

          <div className="quote-details">
            <span>CLIENTE</span>
            <strong>Marina Oliveira</strong>

            <div className="detail-grid">
              <div>
                <small>ESTILO</small>
                <b>Blackwork</b>
              </div>

              <div>
                <small>TAMANHO</small>
                <b>12 cm</b>
              </div>

              <div>
                <small>LOCAL</small>
                <b>Antebraço</b>
              </div>

              <div>
                <small>SESSÃO</small>
                <b>2h30</b>
              </div>
            </div>

            <div className="quote-price">
              <div>
                <span>ORÇAMENTO</span>
                <strong>R$ 650,00</strong>
              </div>

              <div>
                <span>SINAL</span>
                <strong>R$ 195,00</strong>
              </div>
            </div>

            <div className="quote-actions">
              <button className="reject">
                Ajustar
              </button>

              <button className="approve">
                Aprovar orçamento
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  const heroX = useMotionValue(0);
  const heroY = useMotionValue(0);

  const smoothX = useSpring(heroX, {
    stiffness: 80,
    damping: 20,
  });

  const smoothY = useSpring(heroY, {
    stiffness: 80,
    damping: 20,
  });

  const handleHeroMove = (event) => {
    const x =
      (event.clientX / window.innerWidth - 0.5) * 20;

    const y =
      (event.clientY / window.innerHeight - 0.5) * 20;

    heroX.set(x);
    heroY.set(y);
  };

  const handleHeroLeave = () => {
    heroX.set(0);
    heroY.set(0);
  };

  return (
    <div
      className="fayola-page"
      onMouseMove={handleHeroMove}
      onMouseLeave={handleHeroLeave}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap');

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #050505;
        }

        .fayola-page {
          --orange: #ff6a3d;
          --orange-light: #ff8a63;
          --cream: #f3ede2;
          --muted: #85817b;
          --dark: #050505;
          --panel: #0d0d0d;
          --border: rgba(255,255,255,.09);

          min-height: 100vh;
          background:
            radial-gradient(circle at 50% -10%, rgba(255,106,61,.09), transparent 35%),
            #050505;
          color: var(--cream);
          font-family: Inter, system-ui, sans-serif;
          overflow: hidden;
        }

        .fayola-page a {
          color: inherit;
          text-decoration: none;
        }

        .container {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        /* ================= HEADER ================= */

        .f-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 18px 0;
          background: linear-gradient(
            to bottom,
            rgba(5,5,5,.92),
            rgba(5,5,5,.55),
            transparent
          );
          backdrop-filter: blur(10px);
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 15px;
          font-weight: 800;
          letter-spacing: .18em;
        }

        .logo-mark {
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.25);
          border-radius: 50%;
          color: var(--orange);
          font-size: 12px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .nav-links a {
          color: #9d9992;
          font-size: 12px;
          transition: color .25s ease;
        }

        .nav-links a:hover {
          color: white;
        }

        .nav-cta {
          padding: 11px 18px;
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 100px;
          font-size: 12px;
          background: rgba(255,255,255,.04);
          transition: .3s ease;
        }

        .nav-cta:hover {
          background: white;
          color: black;
        }

        .mobile-menu {
          display: none;
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(255,255,255,.04);
          color: white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
        }

        /* ================= HERO ================= */

        .hero {
          position: relative;
          min-height: 100vh;
          padding-top: 150px;
          display: flex;
          align-items: center;
          isolation: isolate;
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: linear-gradient(to bottom, black, transparent 80%);
          opacity: .5;
          pointer-events: none;
        }

        .hero-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E");
        }

        .f-aura {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: .18;
          pointer-events: none;
          z-index: -1;
        }

        .aura-one {
          background: var(--orange);
          top: 15%;
          left: 5%;
        }

        .aura-two {
          background: #7b2cff;
          top: 25%;
          right: 5%;
          opacity: .10;
        }

        .aura-three {
          background: #ff3d81;
          bottom: -15%;
          left: 40%;
          opacity: .08;
        }

        .hero-inner {
          position: relative;
          z-index: 2;
        }

        .hero-copy {
          position: relative;
          z-index: 8;
          width: 680px;
          max-width: 100%;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 25px;
          color: #aaa49c;
          font-family: "DM Mono", monospace;
          font-size: 10px;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .eyebrow-dot {
          width: 7px;
          height: 7px;
          background: var(--orange);
          border-radius: 50%;
          box-shadow: 0 0 18px var(--orange);
        }

        .hero h1 {
          margin: 0;
          max-width: 800px;
          font-size: clamp(52px, 7vw, 94px);
          line-height: .91;
          letter-spacing: -.065em;
          font-weight: 700;
        }

        .hero h1 em {
          font-family: "Playfair Display", serif;
          font-weight: 500;
          color: var(--orange);
          letter-spacing: -.055em;
        }

        .hero-subtitle {
          max-width: 570px;
          margin: 30px 0 0;
          color: #9b9791;
          font-size: 17px;
          line-height: 1.75;
        }

        .hero-subtitle strong {
          color: #d8d2c9;
          font-weight: 500;
        }

        .hero-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-top: 35px;
        }

        .primary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 15px 22px;
          border-radius: 100px;
          background: var(--orange);
          color: #080808 !important;
          font-size: 13px;
          font-weight: 700;
          box-shadow:
            0 10px 40px rgba(255,106,61,.16),
            inset 0 1px rgba(255,255,255,.25);
        }

        .primary-button:hover {
          background: #ff805b;
        }

        .secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 15px 20px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 100px;
          color: #b7b2aa !important;
          font-size: 13px;
          background: rgba(255,255,255,.025);
        }

        .hero-note {
          margin-top: 17px;
          color: #5f5b56;
          font-size: 10px;
          font-family: "DM Mono", monospace;
        }

        .hero-product {
          position: absolute;
          z-index: 4;
          top: 17%;
          right: -10%;
          width: 650px;
          height: 570px;
          perspective: 1400px;
          pointer-events: none;
        }

        .dashboard-wrap {
          position: relative;
          width: 100%;
          height: 100%;
          perspective: 1400px;
        }

        .dashboard-shadow {
          position: absolute;
          width: 80%;
          height: 50%;
          left: 10%;
          bottom: 3%;
          border-radius: 50%;
          background: rgba(0,0,0,.8);
          filter: blur(50px);
        }

        .dashboard {
          position: absolute;
          width: 570px;
          left: 30px;
          top: 50px;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 17px;
          overflow: hidden;
          background:
            linear-gradient(145deg, rgba(25,25,25,.98), rgba(9,9,9,.98));
          box-shadow:
            0 50px 100px rgba(0,0,0,.6),
            0 0 0 1px rgba(255,255,255,.025);
          transform-style: preserve-3d;
        }

        .dashboard-top {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 17px;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .brand-small {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .15em;
        }

        .brand-small span {
          color: var(--orange);
          margin-right: 5px;
        }

        .dash-user {
          color: #777;
          font-size: 9px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .online-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #45d98b;
          box-shadow: 0 0 10px #45d98b;
        }

        .dashboard-content {
          display: flex;
        }

        .dash-sidebar {
          width: 48px;
          padding: 18px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 19px;
          color: #4e4e4e;
          font-size: 12px;
          border-right: 1px solid rgba(255,255,255,.06);
        }

        .dash-active {
          color: var(--orange);
        }

        .side-active {
          color: var(--orange);
        }

        .dash-main {
          flex: 1;
          padding: 21px;
        }

        .dash-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dash-heading span {
          font-size: 7px;
          color: #666;
          font-family: "DM Mono", monospace;
        }

        .dash-heading h3 {
          margin: 4px 0 0;
          font-size: 16px;
          letter-spacing: -.03em;
        }

        .dash-heading button {
          border: 0;
          border-radius: 6px;
          padding: 8px 10px;
          background: var(--orange);
          color: #080808;
          font-size: 7px;
          font-weight: 700;
        }

        .dash-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-top: 19px;
        }

        .dash-stats > div {
          padding: 12px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 8px;
          background: rgba(255,255,255,.02);
        }

        .dash-stats small {
          display: block;
          color: #5d5d5d;
          font-size: 6px;
          font-family: "DM Mono", monospace;
        }

        .dash-stats strong {
          display: block;
          margin-top: 7px;
          font-size: 16px;
          font-weight: 500;
        }

        .schedule {
          position: relative;
          margin-top: 17px;
        }

        .schedule-line {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 44px;
          width: 1px;
          background: rgba(255,255,255,.06);
        }

        .appointment {
          position: relative;
          display: flex;
          gap: 13px;
          margin-bottom: 12px;
        }

        .appointment-time {
          width: 32px;
          padding-top: 12px;
          color: #565656;
          font-size: 7px;
          font-family: "DM Mono", monospace;
        }

        .appointment-card {
          flex: 1;
          min-height: 49px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 8px;
          background: rgba(255,255,255,.025);
        }

        .appointment-card.orange {
          border-color: rgba(255,106,61,.18);
        }

        .appointment-avatar {
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: #252525;
          color: #bdb8b0;
          font-size: 8px;
        }

        .appointment-card strong {
          display: block;
          font-size: 8px;
        }

        .appointment-card span {
          display: block;
          margin-top: 3px;
          color: #555;
          font-size: 6px;
        }

        .appointment-card em {
          margin-left: auto;
          padding: 4px 6px;
          border-radius: 20px;
          background: rgba(255,255,255,.04);
          color: #6f6f6f;
          font-size: 5px;
          font-style: normal;
        }

        .request-card {
          position: absolute;
          z-index: 7;
          width: 220px;
          right: -18px;
          top: 20px;
          padding: 15px;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 14px;
          background: rgba(15,15,15,.88);
          backdrop-filter: blur(22px);
          box-shadow:
            0 25px 60px rgba(0,0,0,.5),
            inset 0 1px rgba(255,255,255,.07);
        }

        .request-top {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #777;
          font-size: 7px;
          font-family: "DM Mono", monospace;
        }

        .request-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--orange);
          box-shadow: 0 0 10px var(--orange);
        }

        .request-time {
          margin-left: auto;
          color: #444;
        }

        .request-name {
          margin-top: 14px;
          font-size: 12px;
          font-weight: 600;
        }

        .request-tags {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          margin-top: 9px;
        }

        .request-tags span {
          padding: 5px 7px;
          border-radius: 20px;
          color: #8d8982;
          background: rgba(255,255,255,.05);
          font-size: 6px;
        }

        .request-images {
          display: flex;
          gap: 5px;
          margin-top: 12px;
        }

        .reference-image,
        .reference-more {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          overflow: hidden;
        }

        .reference-image {
          background:
            radial-gradient(circle at 50% 45%, #777 0 8%, transparent 9%),
            radial-gradient(circle at 35% 70%, #aaa 0 5%, transparent 6%),
            linear-gradient(135deg,#171717,#353535);
          color: #d9d2c8;
          font-size: 17px;
        }

        .ref-two {
          background:
            radial-gradient(circle at 55% 40%, #aaa 0 7%, transparent 8%),
            linear-gradient(135deg,#242424,#101010);
        }

        .reference-more {
          background: rgba(255,255,255,.05);
          color: #777;
          font-size: 8px;
        }

        .request-footer {
          display: flex;
          align-items: center;
          margin-top: 13px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,.06);
        }

        .request-footer small {
          display: block;
          color: #484848;
          font-size: 5px;
        }

        .request-footer strong {
          display: block;
          margin-top: 3px;
          color: #bbb5ad;
          font-size: 8px;
        }

        .request-arrow {
          margin-left: auto;
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--orange);
          color: #111;
          font-size: 12px;
        }

        .pix-card {
          position: absolute;
          z-index: 8;
          left: -5px;
          bottom: 53px;
          width: 185px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 12px;
          background: rgba(16,16,16,.92);
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 50px rgba(0,0,0,.5);
        }

        .pix-icon {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: rgba(255,106,61,.12);
          color: var(--orange);
        }

        .pix-card span {
          display: block;
          color: #555;
          font-size: 5px;
          font-family: "DM Mono", monospace;
        }

        .pix-card strong {
          display: block;
          margin-top: 3px;
          font-size: 10px;
        }

        .pix-check {
          margin-left: auto;
          width: 20px;
          height: 20px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: rgba(60,220,140,.1);
          color: #4cda8d;
          font-size: 8px;
        }

        /* ================= MARQUEE ================= */

        .ticker {
          position: relative;
          z-index: 5;
          border-top: 1px solid rgba(255,255,255,.06);
          border-bottom: 1px solid rgba(255,255,255,.06);
          overflow: hidden;
          background: rgba(255,255,255,.015);
        }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker 30s linear infinite;
        }

        .ticker-item {
          display: flex;
          align-items: center;
          gap: 35px;
          padding: 17px 35px;
          color: #555;
          font-family: "DM Mono", monospace;
          font-size: 9px;
          letter-spacing: .12em;
          white-space: nowrap;
        }

        .ticker-item b {
          color: var(--orange);
        }

        @keyframes ticker {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        /* ================= SECTION ================= */

        .section {
          position: relative;
          padding: 145px 0;
        }

        .section-label {
          color: var(--orange);
          font-family: "DM Mono", monospace;
          font-size: 9px;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .section-title {
          max-width: 780px;
          margin: 18px 0 0;
          font-size: clamp(40px, 5.3vw, 72px);
          line-height: .98;
          letter-spacing: -.055em;
        }

        .section-title em {
          color: #79746d;
          font-family: "Playfair Display", serif;
          font-weight: 500;
        }

        .section-intro {
          max-width: 560px;
          margin-top: 25px;
          color: #77736d;
          font-size: 15px;
          line-height: 1.8;
        }

        /* ================= BEFORE AFTER ================= */

        .before-after {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 80px 1fr;
          align-items: center;
          margin-top: 75px;
        }

        .ba-panel {
          min-height: 430px;
          padding: 35px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 20px;
          background: #0a0a0a;
        }

        .ba-panel.before {
          background:
            radial-gradient(circle at 70% 10%, rgba(255,255,255,.03), transparent 30%),
            #0a0a0a;
        }

        .ba-panel.after {
          border-color: rgba(255,106,61,.18);
          background:
            radial-gradient(circle at 80% 10%, rgba(255,106,61,.07), transparent 35%),
            #0a0a0a;
        }

        .ba-label {
          color: #555;
          font-family: "DM Mono", monospace;
          font-size: 8px;
          letter-spacing: .15em;
        }

        .after .ba-label {
          color: var(--orange);
        }

        .ba-panel h3 {
          max-width: 350px;
          margin: 18px 0 30px;
          font-size: 25px;
          letter-spacing: -.04em;
        }

        .chaos {
          position: relative;
          height: 190px;
        }

        .chaos div {
          position: absolute;
          padding: 12px 15px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 9px;
          background: #111;
          color: #777;
          font-size: 10px;
        }

        .chaos div:nth-child(1) {
          left: 5%;
          top: 5%;
          transform: rotate(-7deg);
        }

        .chaos div:nth-child(2) {
          right: 8%;
          top: 3%;
          transform: rotate(5deg);
        }

        .chaos div:nth-child(3) {
          left: 20%;
          top: 38%;
          transform: rotate(3deg);
        }

        .chaos div:nth-child(4) {
          right: 5%;
          top: 46%;
          transform: rotate(-4deg);
        }

        .chaos div:nth-child(5) {
          left: 3%;
          bottom: 2%;
          transform: rotate(5deg);
        }

        .chaos div:nth-child(6) {
          right: 24%;
          bottom: 0;
          transform: rotate(-5deg);
        }

        .ba-panel p {
          color: #62605c;
          font-size: 11px;
          line-height: 1.7;
        }

        .organized {
          display: grid;
          gap: 9px;
        }

        .organized div {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 8px;
          color: #aaa49c;
          font-size: 10px;
          background: rgba(255,255,255,.025);
        }

        .organized span {
          color: var(--orange);
        }

        .ba-divider {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          justify-self: center;
          border: 1px solid rgba(255,106,61,.25);
          border-radius: 50%;
          color: var(--orange);
          background: #080808;
          box-shadow: 0 0 40px rgba(255,106,61,.08);
        }

        /* ================= FLOW ================= */

        .flow-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
          margin-top: 70px;
        }

        .flow-card {
          position: relative;
          min-height: 245px;
          padding: 22px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 15px;
          background:
            linear-gradient(145deg, rgba(255,255,255,.04), rgba(255,255,255,.015));
          overflow: hidden;
          transform-style: preserve-3d;
        }

        .flow-card::after {
          content: "";
          position: absolute;
          width: 100px;
          height: 100px;
          right: -50px;
          bottom: -50px;
          background: var(--orange);
          opacity: .05;
          filter: blur(25px);
          border-radius: 50%;
        }

        .flow-number {
          color: #494642;
          font-family: "DM Mono", monospace;
          font-size: 9px;
        }

        .flow-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          margin-top: 38px;
          border: 1px solid rgba(255,106,61,.2);
          border-radius: 10px;
          color: var(--orange);
          background: rgba(255,106,61,.05);
          font-size: 14px;
        }

        .flow-card h3 {
          margin: 18px 0 9px;
          font-size: 15px;
          letter-spacing: -.025em;
        }

        .flow-card p {
          margin: 0;
          color: #62605b;
          font-size: 10px;
          line-height: 1.65;
        }

        /* ================= QUOTE ================= */

        .quote-section {
          background:
            radial-gradient(circle at 50% 40%, rgba(255,106,61,.055), transparent 35%);
        }

        .quote-scene {
          position: relative;
          min-height: 650px;
          margin-top: 65px;
          display: grid;
          place-items: center;
          perspective: 1400px;
        }

        .quote-orbit {
          position: absolute;
          border: 1px solid rgba(255,255,255,.05);
          border-radius: 50%;
          pointer-events: none;
        }

        .orbit-one {
          width: 760px;
          height: 330px;
          transform: rotate(-14deg);
        }

        .orbit-two {
          width: 620px;
          height: 260px;
          transform: rotate(17deg);
        }

        .quote-window {
          position: relative;
          z-index: 2;
          width: min(880px, 100%);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.11);
          border-radius: 20px;
          background: #0b0b0b;
          box-shadow:
            0 50px 100px rgba(0,0,0,.55),
            0 0 80px rgba(255,106,61,.04);
        }

        .quote-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 25px;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }

        .quote-header span {
          display: block;
          color: var(--orange);
          font-family: "DM Mono", monospace;
          font-size: 7px;
          letter-spacing: .15em;
        }

        .quote-header strong {
          display: block;
          margin-top: 4px;
          font-size: 15px;
        }

        .quote-status {
          padding: 6px 9px;
          border: 1px solid rgba(255,106,61,.2);
          border-radius: 30px;
          color: var(--orange);
          font-family: "DM Mono", monospace;
          font-size: 7px;
        }

        .quote-body {
          display: grid;
          grid-template-columns: 42% 58%;
          min-height: 470px;
        }

        .quote-left {
          padding: 25px;
          border-right: 1px solid rgba(255,255,255,.06);
          background:
            radial-gradient(circle at 50% 30%, rgba(255,255,255,.05), transparent 35%);
        }

        .quote-photo {
          height: 355px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 13px;
          overflow: hidden;
          background:
            radial-gradient(circle at 48% 43%, rgba(255,255,255,.22) 0 2%, transparent 3%),
            radial-gradient(circle at 54% 49%, rgba(255,255,255,.16) 0 8%, transparent 9%),
            radial-gradient(circle at 40% 58%, rgba(255,255,255,.14) 0 7%, transparent 8%),
            linear-gradient(145deg,#1d1d1d,#080808);
        }

        .fake-tattoo {
          font-size: 90px;
          color: rgba(255,255,255,.6);
          transform: rotate(-13deg);
          filter: blur(.3px);
        }

        .reference-row {
          display: flex;
          gap: 6px;
          margin-top: 8px;
        }

        .reference-row div {
          flex: 1;
          height: 43px;
          border-radius: 6px;
          background:
            linear-gradient(135deg,#222,#0d0d0d);
          border: 1px solid rgba(255,255,255,.05);
        }

        .quote-details {
          padding: 30px;
        }

        .quote-details > span {
          color: #555;
          font-family: "DM Mono", monospace;
          font-size: 7px;
        }

        .quote-details > strong {
          display: block;
          margin-top: 7px;
          font-size: 21px;
          letter-spacing: -.04em;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 25px;
        }

        .detail-grid div {
          padding: 13px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 8px;
          background: rgba(255,255,255,.02);
        }

        .detail-grid small,
        .quote-price span {
          display: block;
          color: #555;
          font-family: "DM Mono", monospace;
          font-size: 6px;
        }

        .detail-grid b {
          display: block;
          margin-top: 6px;
          color: #b4aea6;
          font-size: 9px;
          font-weight: 500;
        }

        .quote-price {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }

        .quote-price > div {
          padding: 16px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 8px;
        }

        .quote-price strong {
          display: block;
          margin-top: 5px;
          font-size: 15px;
        }

        .quote-actions {
          display: flex;
          gap: 8px;
          margin-top: 20px;
        }

        .quote-actions button {
          flex: 1;
          padding: 12px;
          border-radius: 7px;
          font-size: 8px;
          cursor: pointer;
        }

        .reject {
          border: 1px solid rgba(255,255,255,.08);
          background: transparent;
          color: #777;
        }

        .approve {
          border: 0;
          background: var(--orange);
          color: #111;
          font-weight: 700;
        }

        /* ================= FEATURES ================= */

        .features-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 12px;
          margin-top: 70px;
        }

        .feature-card {
          position: relative;
          min-height: 360px;
          padding: 30px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 18px;
          background: #0a0a0a;
          transform-style: preserve-3d;
        }

        .feature-card:nth-child(1),
        .feature-card:nth-child(4) {
          grid-column: span 7;
        }

        .feature-card:nth-child(2),
        .feature-card:nth-child(3),
        .feature-card:nth-child(5),
        .feature-card:nth-child(6) {
          grid-column: span 5;
        }

        .feature-number {
          color: #44413e;
          font-family: "DM Mono", monospace;
          font-size: 8px;
        }

        .feature-content {
          position: relative;
          z-index: 2;
          max-width: 340px;
          margin-top: 75px;
        }

        .feature-content h3 {
          margin: 0;
          font-size: 26px;
          letter-spacing: -.045em;
        }

        .feature-content p {
          margin-top: 13px;
          color: #64615c;
          font-size: 11px;
          line-height: 1.7;
        }

        .feature-visual {
          position: absolute;
          right: 25px;
          bottom: 25px;
          width: 210px;
          height: 170px;
        }

        .mini-phone {
          position: absolute;
          right: 15px;
          bottom: 0;
          width: 105px;
          height: 180px;
          border: 5px solid #1d1d1d;
          border-radius: 18px;
          background: #0e0e0e;
          box-shadow: 0 25px 50px rgba(0,0,0,.5);
          overflow: hidden;
        }

        .mini-phone::before {
          content: "";
          position: absolute;
          top: 7px;
          left: 50%;
          width: 35px;
          height: 5px;
          transform: translateX(-50%);
          border-radius: 10px;
          background: #252525;
        }

        .phone-screen {
          padding: 27px 8px 8px;
        }

        .phone-title {
          color: #888;
          font-size: 5px;
        }

        .phone-line {
          height: 7px;
          margin-top: 7px;
          border-radius: 3px;
          background: #242424;
        }

        .phone-line.short {
          width: 60%;
        }

        .phone-button {
          height: 20px;
          margin-top: 13px;
          border-radius: 5px;
          background: var(--orange);
        }

        .feature-ring {
          position: absolute;
          width: 130px;
          height: 130px;
          left: 0;
          bottom: 10px;
          border: 1px solid rgba(255,106,61,.15);
          border-radius: 50%;
        }

        .feature-chat {
          position: absolute;
          right: 0;
          bottom: 20px;
          padding: 13px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 10px;
          background: #121212;
          color: #8b8780;
          font-size: 7px;
          box-shadow: 0 20px 40px rgba(0,0,0,.4);
        }

        .feature-chat b {
          display: block;
          color: #bbb4ab;
          margin-bottom: 4px;
          font-size: 8px;
        }

        .service-stack {
          position: absolute;
          right: 20px;
          bottom: 25px;
          width: 230px;
        }

        .service-item {
          display: flex;
          justify-content: space-between;
          padding: 12px;
          margin-top: 5px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 7px;
          background: #101010;
          color: #777;
          font-size: 8px;
        }

        .service-item strong {
          color: #aaa;
          font-weight: 500;
        }

        .commission-chart {
          position: absolute;
          right: 30px;
          bottom: 30px;
          width: 250px;
          height: 130px;
          display: flex;
          align-items: end;
          gap: 9px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 10px;
          background: #0e0e0e;
        }

        .bar {
          flex: 1;
          border-radius: 4px 4px 0 0;
          background: linear-gradient(
            to top,
            rgba(255,106,61,.12),
            rgba(255,106,61,.8)
          );
        }

        .bar:nth-child(1) { height: 35%; }
        .bar:nth-child(2) { height: 50%; }
        .bar:nth-child(3) { height: 40%; }
        .bar:nth-child(4) { height: 75%; }
        .bar:nth-child(5) { height: 62%; }
        .bar:nth-child(6) { height: 92%; }

        /* ================= NUMBERS ================= */

        .numbers {
          padding: 80px 0;
          border-top: 1px solid rgba(255,255,255,.06);
          border-bottom: 1px solid rgba(255,255,255,.06);
        }

        .numbers-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }

        .number {
          padding: 15px 30px;
          border-right: 1px solid rgba(255,255,255,.06);
        }

        .number:last-child {
          border-right: 0;
        }

        .number strong {
          display: block;
          font-size: 45px;
          letter-spacing: -.06em;
        }

        .number span {
          display: block;
          margin-top: 6px;
          color: #5f5b56;
          font-family: "DM Mono", monospace;
          font-size: 8px;
          letter-spacing: .08em;
        }

        /* ================= PRICE ================= */

        .price-section {
          padding-bottom: 160px;
        }

        .price-card {
          position: relative;
          max-width: 900px;
          margin: 70px auto 0;
          padding: 50px;
          overflow: hidden;
          border: 1px solid rgba(255,106,61,.2);
          border-radius: 22px;
          background:
            radial-gradient(circle at 90% 10%, rgba(255,106,61,.09), transparent 30%),
            #0a0a0a;
          box-shadow: 0 40px 100px rgba(0,0,0,.4);
        }

        .price-card::before {
          content: "";
          position: absolute;
          width: 350px;
          height: 350px;
          right: -180px;
          top: -180px;
          border: 1px solid rgba(255,106,61,.12);
          border-radius: 50%;
        }

        .price-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .price-label {
          color: var(--orange);
          font-family: "DM Mono", monospace;
          font-size: 8px;
          letter-spacing: .16em;
        }

        .price-card h3 {
          margin: 14px 0;
          font-size: 35px;
          letter-spacing: -.05em;
        }

        .price-description {
          color: #69655f;
          font-size: 12px;
          line-height: 1.75;
        }

        .price-value {
          display: flex;
          align-items: baseline;
          gap: 4px;
          margin-top: 20px;
        }

        .price-value small {
          color: #888;
          font-size: 12px;
        }

        .price-value strong {
          font-size: 54px;
          letter-spacing: -.07em;
        }

        .price-value span {
          color: #666;
          font-size: 12px;
        }

        .price-features {
          display: grid;
          gap: 10px;
        }

        .price-feature {
          display: flex;
          gap: 9px;
          color: #96918a;
          font-size: 10px;
        }

        .price-feature span {
          color: var(--orange);
        }

        .price-button {
          display: inline-flex;
          margin-top: 25px;
        }

        /* ================= CTA ================= */

        .final-cta {
          position: relative;
          min-height: 720px;
          display: grid;
          place-items: center;
          text-align: center;
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,.05);
        }

        .cta-aura {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: var(--orange);
          opacity: .055;
          filter: blur(100px);
        }

        .cta-lines {
          position: absolute;
          width: 100%;
          height: 100%;
          background:
            repeating-radial-gradient(
              ellipse at center,
              transparent 0,
              transparent 85px,
              rgba(255,255,255,.025) 86px,
              transparent 87px
            );
          mask-image: radial-gradient(
            ellipse at center,
            black,
            transparent 65%
          );
        }

        .cta-content {
          position: relative;
          z-index: 2;
          max-width: 850px;
        }

        .cta-content h2 {
          margin: 18px 0 0;
          font-size: clamp(50px, 7vw, 90px);
          line-height: .92;
          letter-spacing: -.065em;
        }

        .cta-content h2 em {
          color: var(--orange);
          font-family: "Playfair Display", serif;
          font-weight: 500;
        }

        .cta-content p {
          max-width: 500px;
          margin: 28px auto;
          color: #77736d;
          font-size: 14px;
          line-height: 1.75;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        /* ================= FOOTER ================= */

        .footer {
          padding: 30px 0;
          border-top: 1px solid rgba(255,255,255,.06);
        }

        .footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-copy {
          color: #4d4a46;
          font-size: 9px;
        }

        .footer-links {
          display: flex;
          gap: 20px;
          color: #555;
          font-size: 9px;
        }

        .footer-links a:hover {
          color: #aaa;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1100px) {
          .hero-product {
            right: -25%;
            opacity: .75;
          }

          .hero-copy {
            width: 620px;
          }

          .flow-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .feature-card:nth-child(n) {
            grid-column: span 6;
          }
        }

        @media (max-width: 800px) {
          .container {
            width: min(100% - 28px, 600px);
          }

          .nav-links {
            display: none;
          }

          .nav-cta {
            display: none;
          }

          .mobile-menu {
            display: block;
          }

          .hero {
            min-height: auto;
            padding-top: 135px;
            padding-bottom: 80px;
          }

          .hero-copy {
            width: 100%;
          }

          .hero h1 {
            font-size: clamp(48px, 15vw, 75px);
          }

          .hero-subtitle {
            font-size: 14px;
          }

          .hero-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
          }

          .hero-product {
            position: relative;
            top: auto;
            right: auto;
            width: 100%;
            height: 450px;
            margin-top: 40px;
            opacity: 1;
            transform: scale(.72);
            transform-origin: top center;
          }

          .dashboard {
            left: 50%;
            transform: translateX(-50%);
          }

          .request-card {
            right: -10px;
          }

          .pix-card {
            left: 0;
          }

          .section {
            padding: 90px 0;
          }

          .before-after {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .ba-divider {
            transform: rotate(90deg);
            justify-self: center;
          }

          .ba-panel {
            min-height: auto;
          }

          .flow-grid {
            grid-template-columns: 1fr 1fr;
          }

          .quote-scene {
            min-height: auto;
            display: block;
          }

          .quote-window {
            margin-top: 40px;
          }

          .quote-body {
            grid-template-columns: 1fr;
          }

          .quote-left {
            border-right: 0;
            border-bottom: 1px solid rgba(255,255,255,.06);
          }

          .quote-photo {
            height: 280px;
          }

          .features-grid {
            display: grid;
            grid-template-columns: 1fr;
          }

          .feature-card:nth-child(n) {
            grid-column: span 1;
          }

          .numbers-grid {
            grid-template-columns: 1fr 1fr;
          }

          .number:nth-child(2) {
            border-right: 0;
          }

          .number:nth-child(-n+2) {
            border-bottom: 1px solid rgba(255,255,255,.06);
          }

          .price-grid {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .price-card {
            padding: 30px;
          }

          .final-cta {
            min-height: 600px;
          }
        }

        @media (max-width: 500px) {
          .hero-product {
            height: 360px;
            transform: scale(.52);
            margin-bottom: -120px;
          }

          .dashboard {
            left: 50%;
          }

          .request-card {
            right: -15px;
          }

          .pix-card {
            left: -10px;
          }

          .flow-grid {
            grid-template-columns: 1fr;
          }

          .quote-details {
            padding: 20px;
          }

          .quote-left {
            padding: 15px;
          }

          .detail-grid {
            grid-template-columns: 1fr 1fr;
          }

          .quote-actions {
            flex-direction: column;
          }

          .feature-card {
            min-height: 330px;
          }

          .feature-content {
            margin-top: 50px;
          }

          .feature-visual,
          .service-stack,
          .commission-chart {
            transform: scale(.8);
            transform-origin: bottom right;
          }

          .numbers {
            padding: 50px 0;
          }

          .number {
            padding: 15px;
          }

          .number strong {
            font-size: 35px;
          }

          .price-value strong {
            font-size: 43px;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .footer-inner {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="f-header">
        <div className="container nav">
          <a href="#" className="logo">
            <span className="logo-mark">✦</span>
            FAYOLA
          </a>

          <nav className="nav-links">
            <a href="#como-funciona">
              Como funciona
            </a>

            <a href="#recursos">
              Recursos
            </a>

            <a href="#preco">
              Preço
            </a>
          </nav>

          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="nav-cta"
          >
            Falar com a Fayola
          </a>

          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mobile-nav"
            style={{
              padding: "20px 25px",
              background: "#080808",
              borderBottom:
                "1px solid rgba(255,255,255,.08)",
            }}
          >
            <a
              href="#como-funciona"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "12px 0",
                color: "#aaa",
                fontSize: 13,
              }}
            >
              Como funciona
            </a>

            <a
              href="#recursos"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "12px 0",
                color: "#aaa",
                fontSize: 13,
              }}
            >
              Recursos
            </a>

            <a
              href="#preco"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "12px 0",
                color: "#aaa",
                fontSize: 13,
              }}
            >
              Preço
            </a>
          </motion.div>
        )}
      </header>

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-noise" />

        <Aura className="aura-one" />
        <Aura className="aura-two" delay={2} />
        <Aura className="aura-three" delay={4} />

        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
          }}
          className="container hero-inner"
        >
          <div className="hero-copy">
            <motion.div
              className="eyebrow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="eyebrow-dot" />
              FEITO PARA QUEM VIVE DA TATUAGEM
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              Enquanto você
              <br />
              <em>tatua,</em> o Fayola
              <br />
              atende.
            </motion.h1>

            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: .8,
                delay: .35,
              }}
            >
              Você cuida da arte.
              <strong> O Fayola cuida do atendimento.</strong>
              <br />
              Do primeiro pedido ao horário confirmado,
              tudo organizado em um só lugar.
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: .7,
                delay: .5,
              }}
            >
              <MagneticButton
                href={WHATSAPP_ASSINAR}
                className="primary-button"
              >
                Quero usar o Fayola
                <span>→</span>
              </MagneticButton>

              <a
                href="#como-funciona"
                className="secondary-button"
              >
                Ver como funciona
              </a>
            </motion.div>

            <div className="hero-note">
              R$ 199,99/mês · sem complicação
            </div>
          </div>

          <motion.div
            className="hero-product"
            style={{
              x: useTransform(
                smoothX,
                [-20, 20],
                [18, -18]
              ),
              y: useTransform(
                smoothY,
                [-20, 20],
                [10, -10]
              ),
            }}
          >
            <DashboardMockup />
          </motion.div>
        </motion.div>
      </section>

      {/* =====================================================
          TICKER
          ===================================================== */}

      <div className="ticker">
        <div className="ticker-track">
          {[1, 2].map((group) => (
            <React.Fragment key={group}>
              <div className="ticker-item">
                <b>✦</b>
                PEDIDO DE TATUAGEM
                <b>✦</b>
                REFERÊNCIAS
                <b>✦</b>
                ORÇAMENTO
                <b>✦</b>
                SINAL PIX
                <b>✦</b>
                AGENDA
                <b>✦</b>
                WHATSAPP
                <b>✦</b>
                CLIENTES
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* =====================================================
          PROBLEMA
          ===================================================== */}

      <section className="section">
        <div className="container">
          <Reveal>
            <div className="section-label">
              O problema
            </div>

            <h2 className="section-title">
              Você não começou a tatuar
              <br />
              para passar o dia <em>respondendo mensagens.</em>
            </h2>

            <p className="section-intro">
              Enquanto você está tatuando, chegam perguntas,
              referências, pedidos de orçamento, dúvidas sobre
              tamanho, local do corpo e horários.
              E cada conversa pode virar uma oportunidade
              perdida.
            </p>
          </Reveal>

          <BeforeAfter />
        </div>
      </section>

      {/* =====================================================
          COMO FUNCIONA
          ===================================================== */}

      <section
        className="section"
        id="como-funciona"
      >
        <div className="container">
          <Reveal>
            <div className="section-label">
              Do pedido à sessão
            </div>

            <h2 className="section-title">
              Seu cliente sabe
              <br />
              <em>o que fazer.</em>
            </h2>

            <p className="section-intro">
              O Fayola transforma o atendimento da tatuagem
              em um fluxo organizado — sem você precisar
              controlar tudo no WhatsApp.
            </p>
          </Reveal>

          <div className="flow-grid">
            <FlowCard
              number="01"
              icon="↗"
              title="Pedido"
              text="O cliente inicia um novo projeto pelo seu link."
            />

            <FlowCard
              number="02"
              icon="◫"
              title="Referências"
              text="Ele envia imagens para mostrar o que procura."
              delay=".05"
            />

            <FlowCard
              number="03"
              icon="⌁"
              title="Detalhes"
              text="Estilo, tamanho em cm e local do corpo ficam registrados."
              delay=".1"
            />

            <FlowCard
              number="04"
              icon="R$"
              title="Orçamento"
              text="Você define o valor e envia a proposta."
              delay=".15"
            />

            <FlowCard
              number="05"
              icon="✦"
              title="Sinal PIX"
              text="O cliente confirma o compromisso pagando o sinal."
              delay=".2"
            />

            <FlowCard
              number="06"
              icon="✓"
              title="Confirmado"
              text="O horário entra na sua agenda e o cliente recebe a confirmação."
              delay=".25"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          QUOTE
          ===================================================== */}

      <section className="section quote-section">
        <div className="container">
          <Reveal>
            <div className="section-label">
              Feito para projetos reais
            </div>

            <h2 className="section-title">
              Do “quanto fica?”
              <br />
              até o <em>horário confirmado.</em>
            </h2>

            <p className="section-intro">
              Um pedido de tatuagem tem detalhes.
              O Fayola organiza todos eles para você.
            </p>
          </Reveal>

          <QuoteMockup />
        </div>
      </section>

      {/* =====================================================
          NÚMEROS
          ===================================================== */}

      <section className="numbers">
        <div className="container numbers-grid">
          <div className="number">
            <strong>
              <CountUp value={1} />
            </strong>

            <span>
              LUGAR PARA ORGANIZAR
            </span>
          </div>

          <div className="number">
            <strong>
              <CountUp value={6} />
            </strong>

            <span>
              ETAPAS DO ATENDIMENTO
            </span>
          </div>

          <div className="number">
            <strong>
              <CountUp value={24} suffix="h" />
            </strong>

            <span>
              SEU LINK DISPONÍVEL
            </span>
          </div>

          <div className="number">
            <strong>
              <CountUp value={100} suffix="%" />
            </strong>

            <span>
              FOCO NA SUA ARTE
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          RECURSOS
          ===================================================== */}

      <section
        className="section"
        id="recursos"
      >
        <div className="container">
          <Reveal>
            <div className="section-label">
              O Fayola
            </div>

            <h2 className="section-title">
              Mais que uma agenda.
              <br />
              <em>Seu atendimento inteiro.</em>
            </h2>

            <p className="section-intro">
              O Fayola reúne as partes do seu negócio que
              normalmente ficam espalhadas entre WhatsApp,
              Instagram, agenda e anotações.
            </p>
          </Reveal>

          <div className="features-grid">
            <FeatureCard
              number="01"
              title="Pedido de tatuagem"
              description="Receba novos projetos com as informações que realmente importam: referência, estilo, tamanho e local do corpo."
            >
              <div className="feature-chat">
                <b>Novo pedido</b>
                Blackwork · 12 cm
              </div>
            </FeatureCard>

            <FeatureCard
              number="02"
              title="Referências"
              description="Organize as imagens enviadas pelo cliente junto com cada projeto."
            >
              <div className="feature-visual">
                <div className="feature-ring" />

                <div className="mini-phone">
                  <div className="phone-screen">
                    <div className="phone-title">
                      REFERÊNCIAS
                    </div>

                    <div className="phone-line" />
                    <div className="phone-line short" />
                    <div className="phone-line" />
                  </div>
                </div>
              </div>
            </FeatureCard>

            <FeatureCard
              number="03"
              title="Tamanho e preço"
              description="Cadastre serviços por tamanho, sessão, valor fixo ou deixe projetos personalizados para orçamento."
            >
              <div className="service-stack">
                <div className="service-item">
                  5 cm
                  <strong>R$ 250</strong>
                </div>

                <div className="service-item">
                  10 cm
                  <strong>R$ 450</strong>
                </div>

                <div className="service-item">
                  15 cm
                  <strong>R$ 650</strong>
                </div>
              </div>
            </FeatureCard>

            <FeatureCard
              number="04"
              title="Agenda do tatuador"
              description="Veja seus horários, clientes e próximos projetos em uma visão simples."
            >
              <div className="feature-visual">
                <div className="mini-phone">
                  <div className="phone-screen">
                    <div className="phone-title">
                      AGENDA
                    </div>

                    <div className="phone-line" />
                    <div className="phone-line" />
                    <div className="phone-line short" />

                    <div className="phone-button" />
                  </div>
                </div>
              </div>
            </FeatureCard>

            <FeatureCard
              number="05"
              title="Sinal via PIX"
              description="Receba o sinal antes de reservar o horário e reduza agendamentos sem compromisso."
            >
              <div className="feature-chat">
                <b>PIX confirmado ✓</b>
                Sinal R$ 195,00
              </div>
            </FeatureCard>

            <FeatureCard
              number="06"
              title="Equipe e comissões"
              description="Se o estúdio possui mais tatuadores, cada profissional pode ter seu acesso, seus horários e suas comissões."
            >
              <div className="commission-chart">
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
                <div className="bar" />
              </div>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* =====================================================
          POSICIONAMENTO
          ===================================================== */}

      <section className="section">
        <div className="container">
          <Reveal>
            <div
              style={{
                maxWidth: 900,
                margin: "0 auto",
                textAlign: "center",
              }}
            >
              <div className="section-label">
                A ideia é simples
              </div>

              <h2
                className="section-title"
                style={{
                  maxWidth: 900,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Você cuida da arte.
                <br />
                <em>O Fayola cuida do atendimento.</em>
              </h2>

              <p
                className="section-intro"
                style={{
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Enquanto você está concentrado em fazer
                uma tatuagem incrível, seus próximos clientes
                podem continuar avançando no processo.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          PREÇO
          ===================================================== */}

      <section
        className="section price-section"
        id="preco"
      >
        <div className="container">
          <Reveal>
            <div className="section-label">
              Simples e direto
            </div>

            <h2 className="section-title">
              Um sistema para o seu
              <br />
              <em>estúdio crescer.</em>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="price-card">
              <div className="price-grid">
                <div>
                  <div className="price-label">
                    FAYOLA PRO
                  </div>

                  <h3>
                    Tudo organizado.
                  </h3>

                  <p className="price-description">
                    Para tatuadores e estúdios que querem
                    profissionalizar o atendimento sem
                    transformar o próprio trabalho em
                    burocracia.
                  </p>

                  <div className="price-value">
                    <small>R$</small>
                    <strong>199,99</strong>
                    <span>/mês</span>
                  </div>

                  <MagneticButton
                    href={WHATSAPP_ASSINAR}
                    className="primary-button price-button"
                  >
                    Quero começar
                    <span>→</span>
                  </MagneticButton>
                </div>

                <div className="price-features">
                  <div className="price-feature">
                    <span>✓</span>
                    Link público para seus clientes
                  </div>

                  <div className="price-feature">
                    <span>✓</span>
                    Pedidos de tatuagem
                  </div>

                  <div className="price-feature">
                    <span>✓</span>
                    Referências e informações do projeto
                  </div>

                  <div className="price-feature">
                    <span>✓</span>
                    Tamanho e serviços
                  </div>

                  <div className="price-feature">
                    <span>✓</span>
                    Agenda
                  </div>

                  <div className="price-feature">
                    <span>✓</span>
                    Clientes
                  </div>

                  <div className="price-feature">
                    <span>✓</span>
                    Sinal via PIX
                  </div>

                  <div className="price-feature">
                    <span>✓</span>
                    Notificações e lembretes
                  </div>

                  <div className="price-feature">
                    <span>✓</span>
                    Profissionais e comissões
                  </div>

                  <div className="price-feature">
                    <span>✓</span>
                    Acesso individual para profissionais
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          CTA FINAL
          ===================================================== */}

      <section className="final-cta">
        <div className="cta-aura" />

        <motion.div
          className="cta-lines"
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="container cta-content">
          <Reveal>
            <div className="section-label">
              Seu próximo projeto começa aqui
            </div>

            <h2>
              Você tatua.
              <br />
              O Fayola <em>atende.</em>
            </h2>

            <p>
              Pare de perder tempo procurando conversas,
              referências e horários. Deixe o atendimento
              organizado enquanto você faz o que sabe fazer
              melhor.
            </p>

            <div className="cta-buttons">
              <MagneticButton
                href={WHATSAPP_ASSINAR}
                className="primary-button"
              >
                Quero usar o Fayola
                <span>→</span>
              </MagneticButton>

              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="secondary-button"
              >
                Falar com a Fayola
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =====================================================
          FOOTER
          ===================================================== */}

      <footer className="footer">
        <div className="container footer-inner">
          <div className="logo">
            <span className="logo-mark">✦</span>
            FAYOLA
          </div>

          <div className="footer-copy">
            Sistema de atendimento e agendamento
            para tatuadores e estúdios.
          </div>

          <div className="footer-links">
            <a href={WHATSAPP}>
              WhatsApp
            </a>

            <a href="#preco">
              Planos
            </a>
          </div>
        </div>

        <div
          className="container"
          style={{
            marginTop: 25,
            paddingTop: 20,
            borderTop:
              "1px solid rgba(255,255,255,.04)",
            color: "#383633",
            fontSize: 8,
            fontFamily: "DM Mono, monospace",
          }}
        >
          © 2026 Fayola. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}