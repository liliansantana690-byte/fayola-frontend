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

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
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

function CountUp({ value, suffix = "" }) {
  const ref = useRef(null);
  const visible = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;

    const start = performance.now();
    const duration = 1300;

    function animate(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(value * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    }

    requestAnimationFrame(animate);
  }, [visible, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* =========================================================
   AURA
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

  function move(e) {
    const rect = ref.current?.getBoundingClientRect();

    if (!rect) return;

    x.set(
      (e.clientX - (rect.left + rect.width / 2)) * 0.16
    );

    y.set(
      (e.clientY - (rect.top + rect.height / 2)) * 0.16
    );
  }

  function leave() {
    x.set(0);
    y.set(0);
  }

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
   TATTOO REQUEST
   ========================================================= */

function TattooRequestCard() {
  return (
    <motion.div
      className="request-card"
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 1,
        delay: 0.4,
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
        <div className="reference-image">
          ✦
        </div>

        <div className="reference-image second">
          ◒
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

        <b>→</b>
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
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div className="pix-symbol">✦</div>

      <div>
        <span>SINAL PIX</span>
        <strong>R$ 195,00</strong>
      </div>

      <div className="pix-ok">✓</div>
    </motion.div>
  );
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function DashboardMockup() {
  return (
    <div className="dashboard-wrap">
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
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="dashboard-top">
          <div className="brand-small">
            <span>✦</span>
            FAYOLA
          </div>

          <div className="dash-user">
            <i />
            Seu estúdio
          </div>
        </div>

        <div className="dashboard-content">
          <aside className="dash-sidebar">
            <div className="active">⌂</div>
            <div>◫</div>
            <div>◌</div>
            <div>◉</div>
            <div>⚙</div>
          </aside>

          <main className="dash-main">
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
              <div className="appointment">
                <span>10:00</span>

                <div className="appointment-card">
                  <b>M</b>

                  <div>
                    <strong>Marina</strong>
                    <small>Blackwork · 12 cm</small>
                  </div>

                  <em>Confirmado</em>
                </div>
              </div>

              <div className="appointment">
                <span>14:30</span>

                <div className="appointment-card orange">
                  <b>R</b>

                  <div>
                    <strong>Rafael</strong>
                    <small>Fineline · 8 cm</small>
                  </div>

                  <em>Aguardando PIX</em>
                </div>
              </div>

              <div className="appointment">
                <span>18:00</span>

                <div className="appointment-card">
                  <b>A</b>

                  <div>
                    <strong>Ana</strong>
                    <small>Projeto aprovado</small>
                  </div>

                  <em>Confirmado</em>
                </div>
              </div>
            </div>
          </main>
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
  icon,
  title,
  text,
  delay = 0,
}) {
  return (
    <Reveal delay={delay}>
      <motion.div
        className="flow-card"
        whileHover={{
          y: -9,
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

        <div className="flow-icon">{icon}</div>

        <h3>{title}</h3>

        <p>{text}</p>
      </motion.div>
    </Reveal>
  );
}

/* =========================================================
   BEFORE / AFTER
   ========================================================= */

function BeforeAfter() {
  return (
    <div className="before-after">
      <motion.div
        className="ba-panel"
        whileHover={{ y: -5 }}
      >
        <span className="ba-label">ANTES</span>

        <h3>
          Você tentando organizar tudo.
        </h3>

        <div className="chaos">
          <div>WhatsApp</div>
          <div>Instagram</div>
          <div>“Quanto fica?”</div>
          <div>“Tem horário sábado?”</div>
          <div>“Vou mandar referência”</div>
          <div>Agenda</div>
        </div>

        <p>
          Conversas espalhadas, pedidos perdidos
          e tempo que poderia estar sendo usado
          para tatuar.
        </p>
      </motion.div>

      <div className="ba-divider">✦</div>

      <motion.div
        className="ba-panel after"
        whileHover={{ y: -5 }}
      >
        <span className="ba-label">COM FAYOLA</span>

        <h3>
          Seu atendimento organizado.
        </h3>

        <div className="organized">
          <div><span>✓</span> Pedido recebido</div>
          <div><span>✓</span> Referências anexadas</div>
          <div><span>✓</span> Orçamento enviado</div>
          <div><span>✓</span> Sinal PIX confirmado</div>
          <div><span>✓</span> Horário reservado</div>
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
   NOVO FLUXO DO PEDIDO DE TATUAGEM
   ========================================================= */

function TattooLinkFlow() {
  return (
    <div className="tattoo-flow">

      <div className="tattoo-link">
        <span className="green-dot" />
        fayola.app.br/pedido-tattoo/123
        <b>LINK DO CLIENTE</b>
      </div>

      <div className="tattoo-flow-grid">

        <Reveal>
          <motion.div
            className="tattoo-step"
            whileHover={{ y: -8 }}
          >
            <span className="step-number">01</span>

            <div className="step-icon">↗</div>

            <small>PEDIDO ENVIADO</small>

            <h3>
              O cliente envia o projeto.
            </h3>

            <p>
              Descrição, estilo, tamanho, local do corpo
              e referências ficam registrados.
            </p>

            <div className="step-status">
              <span>✓</span>
              Pedido recebido
            </div>
          </motion.div>
        </Reveal>

        <div className="flow-arrow">→</div>

        <Reveal delay={0.08}>
          <motion.div
            className="tattoo-step"
            whileHover={{ y: -8 }}
          >
            <span className="step-number">02</span>

            <div className="step-icon">◌</div>

            <small>AGUARDANDO ORÇAMENTO</small>

            <h3>
              O cliente pode ir embora.
            </h3>

            <p>
              Ele fecha a página e depois volta
              para o mesmo link quando quiser.
            </p>

            <div className="step-status waiting">
              <span>⌁</span>
              Aguardando resposta
            </div>
          </motion.div>
        </Reveal>

        <div className="flow-arrow">→</div>

        <Reveal delay={0.16}>
          <motion.div
            className="tattoo-step highlight"
            whileHover={{ y: -8 }}
          >
            <span className="step-number">03</span>

            <div className="step-icon">R$</div>

            <small>ORÇAMENTO + PIX</small>

            <h3>
              Você respondeu.
            </h3>

            <p>
              O mesmo link agora mostra o valor
              da tatuagem e o sinal para confirmar.
            </p>

            <div className="mini-price">
              <div>
                <span>VALOR</span>
                <strong>R$ 650</strong>
              </div>

              <div>
                <span>SINAL</span>
                <strong>R$ 195</strong>
              </div>

              <b>PIX</b>
            </div>
          </motion.div>
        </Reveal>

        <div className="flow-arrow">→</div>

        <Reveal delay={0.24}>
          <motion.div
            className="tattoo-step"
            whileHover={{ y: -8 }}
          >
            <span className="step-number">04</span>

            <div className="step-icon">✓</div>

            <small>PAGAMENTO + HORÁRIO</small>

            <h3>
              Pagou. Escolhe o horário.
            </h3>

            <p>
              Depois do pagamento confirmado,
              os horários disponíveis aparecem.
            </p>

            <div className="step-status confirmed">
              <span>✓</span>
              Sessão confirmada
            </div>
          </motion.div>
        </Reveal>

      </div>

      <div className="tattoo-final-bar">
        <div>
          <span>✦</span>

          <div>
            <strong>
              O mesmo link acompanha tudo.
            </strong>

            <p>
              Pedido → orçamento → PIX → horário → confirmação.
            </p>
          </div>
        </div>

        <b>
          WHATSAPP · CONFIRMAÇÃO · LEMBRETE
        </b>
      </div>
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
        className="quote-window"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
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

          <b>EM ANÁLISE</b>
        </div>

        <div className="quote-body">
          <div className="quote-photo">
            <div>✦</div>
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
              <button>Ajustar</button>
              <button>Aprovar orçamento</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
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
}) {
  return (
    <motion.div
      className="feature-card"
      whileHover={{
        y: -7,
        scale: 1.01,
      }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 20,
      }}
    >
      <span className="feature-number">
        {number}
      </span>

      <div className="feature-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

      {children}
    </motion.div>
  );
}

/* =========================================================
   MAIN
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

  function handleMove(e) {
    heroX.set(
      (e.clientX / window.innerWidth - 0.5) * 20
    );

    heroY.set(
      (e.clientY / window.innerHeight - 0.5) * 20
    );
  }

  function resetMove() {
    heroX.set(0);
    heroY.set(0);
  }

  return (
    <div
      className="fayola-page"
      onMouseMove={handleMove}
      onMouseLeave={resetMove}
    >

      {/* =====================================================
          STYLE
          ===================================================== */}

      <style>{`

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
          --cream: #f3ede2;
          --muted: #77736d;
          --panel: #0c0c0c;

          min-height: 100vh;
          overflow: hidden;
          color: var(--cream);
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(255,106,61,.10),
              transparent 34%
            ),
            #050505;
          font-family: Inter, system-ui, sans-serif;
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
            rgba(5,5,5,.94),
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
          border: 1px solid rgba(255,255,255,.2);
          border-radius: 50%;
          color: var(--orange);
        }

        .nav-links {
          display: flex;
          gap: 30px;
        }

        .nav-links a {
          color: #97928b;
          font-size: 12px;
          transition: .25s;
        }

        .nav-links a:hover {
          color: white;
        }

        .nav-cta {
          padding: 11px 18px;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 100px;
          background: rgba(255,255,255,.04);
          font-size: 12px;
          transition: .3s;
        }

        .nav-cta:hover {
          color: black;
          background: white;
        }

        .mobile-menu {
          display: none;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 50%;
          background: rgba(255,255,255,.04);
          color: white;
        }

        /* ================= HERO ================= */

        .hero {
          position: relative;
          min-height: 100vh;
          padding-top: 145px;
          display: flex;
          align-items: center;
        }

        .hero-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(
              rgba(255,255,255,.025) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255,255,255,.025) 1px,
              transparent 1px
            );
          background-size: 80px 80px;
          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 85%
            );
        }

        .hero-inner {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 20px;
        }

        .hero-copy {
          position: relative;
          z-index: 4;
        }

        .eyebrow,
        .section-label {
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--orange);
          font-family: "DM Mono", monospace;
          font-size: 8px;
          letter-spacing: .14em;
        }

        .eyebrow-dot,
        .green-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--orange);
          box-shadow: 0 0 12px var(--orange);
        }

        .hero h1 {
          margin: 25px 0 0;
          max-width: 700px;
          font-size: clamp(58px, 7vw, 95px);
          line-height: .91;
          letter-spacing: -.07em;
        }

        .hero h1 em {
          color: var(--orange);
          font-family: "Playfair Display", serif;
          font-weight: 500;
        }

        .hero-subtitle {
          max-width: 540px;
          margin-top: 28px;
          color: #77736d;
          font-size: 14px;
          line-height: 1.75;
        }

        .hero-subtitle strong {
          color: #aaa49c;
        }

        .hero-actions {
          display: flex;
          gap: 10px;
          margin-top: 32px;
        }

        .primary-button,
        .secondary-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          min-height: 48px;
          padding: 0 22px;
          border-radius: 8px;
          font-size: 11px;
        }

        .primary-button {
          background: var(--orange);
          color: #111 !important;
          font-weight: 700;
          box-shadow: 0 15px 40px rgba(255,106,61,.16);
        }

        .primary-button span {
          font-size: 17px;
        }

        .secondary-button {
          border: 1px solid rgba(255,255,255,.1);
          color: #aaa49c !important;
          background: rgba(255,255,255,.025);
        }

        .hero-note {
          margin-top: 15px;
          color: #45413d;
          font-family: "DM Mono", monospace;
          font-size: 7px;
        }

        /* ================= AURA ================= */

        .f-aura {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: var(--orange);
          opacity: .07;
          filter: blur(100px);
          pointer-events: none;
        }

        .aura-one {
          left: 30%;
          top: 25%;
        }

        .aura-two {
          right: 10%;
          bottom: 10%;
          opacity: .045;
        }

        /* ================= DASHBOARD ================= */

        .hero-product {
          position: relative;
          height: 620px;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
        }

        .dashboard-wrap {
          position: relative;
          width: 670px;
          height: 530px;
          transform: scale(.88);
        }

        .dashboard {
          position: absolute;
          left: 30px;
          top: 45px;
          width: 610px;
          height: 390px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 15px;
          background: #0b0b0b;
          box-shadow:
            0 60px 120px rgba(0,0,0,.55),
            0 0 80px rgba(255,106,61,.04);
          transform-style: preserve-3d;
        }

        .dashboard-top {
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 17px;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }

        .brand-small {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: .12em;
        }

        .brand-small span {
          color: var(--orange);
        }

        .dash-user {
          color: #68635d;
          font-size: 7px;
        }

        .dash-user i {
          display: inline-block;
          width: 5px;
          height: 5px;
          margin-right: 5px;
          border-radius: 50%;
          background: #49d48a;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 45px 1fr;
          height: calc(100% - 48px);
        }

        .dash-sidebar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 25px;
          padding-top: 22px;
          border-right: 1px solid rgba(255,255,255,.05);
          color: #44413d;
          font-size: 11px;
        }

        .dash-sidebar .active {
          color: var(--orange);
        }

        .dash-main {
          padding: 22px;
        }

        .dash-heading {
          display: flex;
          justify-content: space-between;
        }

        .dash-heading span {
          color: #4f4b46;
          font-family: "DM Mono", monospace;
          font-size: 6px;
        }

        .dash-heading h3 {
          margin: 6px 0 0;
          font-size: 18px;
          letter-spacing: -.04em;
        }

        .dash-heading button {
          align-self: center;
          border: 0;
          border-radius: 5px;
          padding: 8px 10px;
          background: var(--orange);
          color: #111;
          font-size: 6px;
          font-weight: 700;
        }

        .dash-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
          margin-top: 18px;
        }

        .dash-stats div {
          padding: 12px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 7px;
          background: rgba(255,255,255,.02);
        }

        .dash-stats small {
          display: block;
          color: #44413d;
          font-family: "DM Mono", monospace;
          font-size: 5px;
        }

        .dash-stats strong {
          display: block;
          margin-top: 6px;
          color: #aaa49c;
          font-size: 15px;
        }

        .schedule {
          margin-top: 16px;
        }

        .appointment {
          display: grid;
          grid-template-columns: 45px 1fr;
          gap: 8px;
          margin-top: 8px;
        }

        .appointment > span {
          padding-top: 9px;
          color: #48443f;
          font-family: "DM Mono", monospace;
          font-size: 6px;
        }

        .appointment-card {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px;
          border: 1px solid rgba(255,255,255,.05);
          border-radius: 7px;
          background: #101010;
        }

        .appointment-card > b {
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 6px;
          background: #1b1b1b;
          color: #8d8880;
          font-size: 7px;
        }

        .appointment-card div {
          flex: 1;
        }

        .appointment-card strong {
          display: block;
          color: #aaa49c;
          font-size: 8px;
        }

        .appointment-card small {
          display: block;
          margin-top: 2px;
          color: #4e4a46;
          font-size: 6px;
        }

        .appointment-card em {
          color: #4bd78d;
          font-size: 5px;
          font-style: normal;
        }

        .appointment-card.orange em {
          color: var(--orange);
        }

        /* ================= FLOATING CARDS ================= */

        .request-card {
          position: absolute;
          right: -8px;
          top: 5px;
          z-index: 5;
          width: 230px;
          padding: 17px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 12px;
          background: rgba(13,13,13,.96);
          box-shadow: 0 30px 70px rgba(0,0,0,.55);
        }

        .request-top {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #65615b;
          font-family: "DM Mono", monospace;
          font-size: 6px;
        }

        .request-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--orange);
        }

        .request-time {
          margin-left: auto;
        }

        .request-name {
          margin-top: 15px;
          color: #aaa49c;
          font-size: 11px;
          font-weight: 600;
        }

        .request-tags {
          display: flex;
          gap: 4px;
          margin-top: 8px;
        }

        .request-tags span {
          padding: 4px 6px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 4px;
          color: #66615b;
          font-size: 5px;
        }

        .request-images {
          display: flex;
          gap: 5px;
          margin-top: 13px;
        }

        .reference-image,
        .reference-more {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 5px;
          background:
            radial-gradient(
              circle,
              #35312d,
              #141414
            );
          color: #746f68;
          font-size: 13px;
        }

        .reference-image.second {
          background:
            radial-gradient(
              circle at 30% 30%,
              #48433d,
              #111
            );
        }

        .reference-more {
          color: #55514c;
          font-family: "DM Mono", monospace;
          font-size: 7px;
        }

        .request-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 15px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,.05);
        }

        .request-footer small {
          display: block;
          color: #45413d;
          font-size: 5px;
        }

        .request-footer strong {
          display: block;
          margin-top: 3px;
          color: #88827a;
          font-size: 7px;
        }

        .request-footer > b {
          color: var(--orange);
          font-size: 15px;
        }

        .pix-card {
          position: absolute;
          left: 0;
          bottom: 5px;
          z-index: 5;
          display: flex;
          align-items: center;
          gap: 10px;
          width: 190px;
          padding: 12px;
          border: 1px solid rgba(255,106,61,.16);
          border-radius: 10px;
          background: #0e0e0e;
          box-shadow: 0 25px 60px rgba(0,0,0,.5);
        }

        .pix-symbol {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: rgba(255,106,61,.09);
          color: var(--orange);
        }

        .pix-card span {
          display: block;
          color: #4f4b46;
          font-family: "DM Mono", monospace;
          font-size: 5px;
        }

        .pix-card strong {
          display: block;
          margin-top: 3px;
          color: #aaa49c;
          font-size: 9px;
        }

        .pix-ok {
          margin-left: auto;
          color: #4bd78d;
          font-size: 13px;
        }

        /* ================= TICKER ================= */

        .ticker {
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,.05);
          border-bottom: 1px solid rgba(255,255,255,.05);
          padding: 14px 0;
          background: #080808;
        }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker 25s linear infinite;
        }

        .ticker-item {
          display: flex;
          align-items: center;
          gap: 35px;
          padding-right: 35px;
          color: #4b4742;
          font-family: "DM Mono", monospace;
          font-size: 7px;
          letter-spacing: .12em;
        }

        .ticker-item b {
          color: var(--orange);
        }

        @keyframes ticker {
          to {
            transform: translateX(-50%);
          }
        }

        /* ================= SECTIONS ================= */

        .section {
          position: relative;
          padding: 145px 0;
        }

        .section-title {
          max-width: 850px;
          margin: 20px 0 0;
          font-size: clamp(43px, 5vw, 72px);
          line-height: .98;
          letter-spacing: -.06em;
        }

        .section-title em {
          color: var(--orange);
          font-family: "Playfair Display", serif;
          font-weight: 500;
        }

        .section-intro {
          max-width: 590px;
          margin-top: 25px;
          color: #68635d;
          font-size: 13px;
          line-height: 1.8;
        }

        /* ================= BEFORE AFTER ================= */

        .before-after {
          display: grid;
          grid-template-columns: 1fr 50px 1fr;
          gap: 15px;
          align-items: center;
          margin-top: 70px;
        }

        .ba-panel {
          min-height: 370px;
          padding: 30px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 17px;
          background: #090909;
        }

        .ba-panel.after {
          border-color: rgba(255,106,61,.16);
          background:
            radial-gradient(
              circle at 90% 10%,
              rgba(255,106,61,.08),
              transparent 35%
            ),
            #090909;
        }

        .ba-label {
          color: #4d4944;
          font-family: "DM Mono", monospace;
          font-size: 7px;
          letter-spacing: .15em;
        }

        .after .ba-label {
          color: var(--orange);
        }

        .ba-panel h3 {
          margin: 18px 0 0;
          font-size: 23px;
          letter-spacing: -.04em;
        }

        .chaos {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-top: 30px;
        }

        .chaos div {
          padding: 12px;
          border: 1px solid rgba(255,255,255,.05);
          border-radius: 7px;
          color: #5e5953;
          font-size: 8px;
          transform: rotate(var(--r, 0deg));
        }

        .chaos div:nth-child(2) {
          transform: rotate(2deg);
        }

        .chaos div:nth-child(3) {
          transform: rotate(-2deg);
        }

        .chaos div:nth-child(5) {
          transform: rotate(2deg);
        }

        .ba-panel p {
          margin-top: 25px;
          color: #55514c;
          font-size: 10px;
          line-height: 1.7;
        }

        .organized {
          display: grid;
          gap: 7px;
          margin-top: 30px;
        }

        .organized div {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px;
          border: 1px solid rgba(255,255,255,.05);
          border-radius: 7px;
          background: rgba(255,255,255,.02);
          color: #77716a;
          font-size: 8px;
        }

        .organized span {
          color: #4bd78d;
        }

        .ba-divider {
          display: grid;
          place-items: center;
          color: var(--orange);
        }

        /* ================= FLOW ================= */

        .flow-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 65px;
        }

        .flow-card {
          min-height: 255px;
          padding: 25px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 15px;
          background: #090909;
          transform-style: preserve-3d;
        }

        .flow-number {
          color: #45413d;
          font-family: "DM Mono", monospace;
          font-size: 7px;
        }

        .flow-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          margin-top: 35px;
          border: 1px solid rgba(255,106,61,.17);
          border-radius: 9px;
          color: var(--orange);
          background: rgba(255,106,61,.05);
          font-size: 12px;
        }

        .flow-card h3 {
          margin: 17px 0 0;
          font-size: 18px;
        }

        .flow-card p {
          margin-top: 9px;
          color: #5f5a54;
          font-size: 9px;
          line-height: 1.7;
        }

        /* ================= NOVO FLUXO ================= */

        .tattoo-flow {
          margin-top: 75px;
        }

        .tattoo-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 13px 15px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 8px;
          background: rgba(255,255,255,.025);
          color: #716c65;
          font-family: "DM Mono", monospace;
          font-size: 8px;
        }

        .green-dot {
          background: #4bd78d;
          box-shadow: 0 0 12px #4bd78d;
        }

        .tattoo-link b {
          margin-left: auto;
          color: var(--orange);
          font-size: 6px;
          font-weight: 400;
          letter-spacing: .1em;
        }

        .tattoo-flow-grid {
          display: grid;
          grid-template-columns:
            1fr 25px
            1fr 25px
            1fr 25px
            1fr;
          align-items: center;
          gap: 8px;
          margin-top: 15px;
        }

        .tattoo-step {
          position: relative;
          min-height: 315px;
          padding: 24px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px;
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.04),
              rgba(255,255,255,.012)
            );
          transform-style: preserve-3d;
        }

        .tattoo-step.highlight {
          border-color: rgba(255,106,61,.23);
          background:
            radial-gradient(
              circle at 90% 0,
              rgba(255,106,61,.09),
              transparent 38%
            ),
            #0a0a0a;
        }

        .step-number {
          color: #45413d;
          font-family: "DM Mono", monospace;
          font-size: 8px;
        }

        .step-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          margin-top: 30px;
          border: 1px solid rgba(255,106,61,.18);
          border-radius: 10px;
          color: var(--orange);
          background: rgba(255,106,61,.05);
        }

        .tattoo-step > small {
          display: block;
          margin-top: 20px;
          color: #55514c;
          font-family: "DM Mono", monospace;
          font-size: 6px;
          letter-spacing: .12em;
        }

        .tattoo-step h3 {
          margin: 9px 0 0;
          font-size: 17px;
          letter-spacing: -.035em;
        }

        .tattoo-step p {
          margin-top: 10px;
          color: #64605a;
          font-size: 9px;
          line-height: 1.7;
        }

        .step-status {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 22px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 7px;
          color: #77716a;
          font-size: 7px;
        }

        .step-status span {
          color: #4bd78d;
        }

        .step-status.waiting span {
          color: #aaa;
        }

        .step-status.confirmed {
          border-color: rgba(75,215,141,.12);
        }

        .mini-price {
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 22px;
          display: grid;
          grid-template-columns: 1fr 1fr 40px;
          gap: 5px;
        }

        .mini-price div {
          padding: 9px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 7px;
        }

        .mini-price span {
          display: block;
          color: #4b4742;
          font-family: "DM Mono", monospace;
          font-size: 5px;
        }

        .mini-price strong {
          display: block;
          margin-top: 4px;
          color: #aaa49c;
          font-size: 8px;
        }

        .mini-price > b {
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: var(--orange);
          color: #111;
          font-size: 7px;
        }

        .flow-arrow {
          display: grid;
          place-items: center;
          color: #45413d;
          font-size: 15px;
        }

        .tattoo-final-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 15px;
          padding: 17px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 11px;
          background: rgba(255,255,255,.018);
        }

        .tattoo-final-bar > div {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tattoo-final-bar > div > span {
          color: var(--orange);
        }

        .tattoo-final-bar strong {
          display: block;
          color: #aaa49c;
          font-size: 9px;
        }

        .tattoo-final-bar p {
          margin: 4px 0 0;
          color: #57534d;
          font-size: 7px;
        }

        .tattoo-final-bar > b {
          color: #4f4a45;
          font-family: "DM Mono", monospace;
          font-size: 6px;
          font-weight: 400;
        }

        /* ================= QUOTE ================= */

        .quote-scene {
          position: relative;
          margin-top: 70px;
          padding: 20px;
        }

        .quote-window {
          position: relative;
          z-index: 2;
          max-width: 920px;
          margin: 0 auto;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 16px;
          background: #0a0a0a;
          box-shadow: 0 50px 100px rgba(0,0,0,.45);
        }

        .quote-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 17px 20px;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }

        .quote-header span {
          display: block;
          color: var(--orange);
          font-family: "DM Mono", monospace;
          font-size: 6px;
        }

        .quote-header strong {
          display: block;
          margin-top: 4px;
          font-size: 10px;
        }

        .quote-header > b {
          padding: 6px 9px;
          border-radius: 20px;
          background: rgba(255,106,61,.07);
          color: var(--orange);
          font-family: "DM Mono", monospace;
          font-size: 5px;
        }

        .quote-body {
          display: grid;
          grid-template-columns: 40% 60%;
        }

        .quote-photo {
          min-height: 390px;
          display: grid;
          place-items: center;
          background:
            radial-gradient(
              circle at 50% 45%,
              #37322d,
              #111
            );
        }

        .quote-photo div {
          font-size: 90px;
          color: #756e65;
          opacity: .5;
        }

        .quote-details {
          padding: 28px;
        }

        .quote-details > span {
          color: #4b4742;
          font-family: "DM Mono", monospace;
          font-size: 6px;
        }

        .quote-details > strong {
          display: block;
          margin-top: 5px;
          font-size: 14px;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          margin-top: 20px;
        }

        .detail-grid div {
          padding: 12px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 7px;
        }

        .detail-grid small,
        .quote-price span {
          display: block;
          color: #4c4843;
          font-family: "DM Mono", monospace;
          font-size: 5px;
        }

        .detail-grid b {
          display: block;
          margin-top: 5px;
          color: #aaa49c;
          font-size: 8px;
          font-weight: 500;
        }

        .quote-price {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          margin-top: 7px;
        }

        .quote-price div {
          padding: 14px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 7px;
        }

        .quote-price strong {
          display: block;
          margin-top: 5px;
          font-size: 13px;
        }

        .quote-actions {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 7px;
          margin-top: 15px;
        }

        .quote-actions button {
          padding: 11px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 7px;
          background: transparent;
          color: #77716a;
          font-size: 7px;
        }

        .quote-actions button:last-child {
          border: 0;
          background: var(--orange);
          color: #111;
          font-weight: 700;
        }

        /* ================= FEATURES ================= */

        .features-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 10px;
          margin-top: 65px;
        }

        .feature-card {
          position: relative;
          min-height: 320px;
          grid-column: span 4;
          padding: 28px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px;
          background: #090909;
        }

        .feature-card:nth-child(1),
        .feature-card:nth-child(4) {
          grid-column: span 6;
        }

        .feature-number {
          color: #45413d;
          font-family: "DM Mono", monospace;
          font-size: 7px;
        }

        .feature-content {
          position: relative;
          z-index: 2;
          max-width: 330px;
          margin-top: 70px;
        }

        .feature-content h3 {
          margin: 0;
          font-size: 21px;
          letter-spacing: -.04em;
        }

        .feature-content p {
          margin-top: 11px;
          color: #625d57;
          font-size: 9px;
          line-height: 1.7;
        }

        .feature-chat {
          position: absolute;
          right: 20px;
          bottom: 20px;
          padding: 12px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 8px;
          background: #111;
          color: #77716a;
          font-size: 7px;
        }

        .feature-chat b {
          display: block;
          margin-bottom: 4px;
          color: #aaa49c;
        }

        .mini-phone {
          position: absolute;
          right: 25px;
          bottom: 20px;
          width: 95px;
          height: 160px;
          border: 5px solid #1c1c1c;
          border-radius: 17px;
          background: #0e0e0e;
          box-shadow: 0 25px 50px rgba(0,0,0,.5);
        }

        .mini-phone::before {
          content: "";
          position: absolute;
          top: 7px;
          left: 50%;
          width: 30px;
          height: 4px;
          transform: translateX(-50%);
          border-radius: 10px;
          background: #272727;
        }

        .phone-screen {
          padding: 27px 8px;
        }

        .phone-screen small {
          color: #55514c;
          font-size: 5px;
        }

        .phone-line {
          height: 6px;
          margin-top: 8px;
          border-radius: 3px;
          background: #252525;
        }

        .phone-line.short {
          width: 60%;
        }

        .phone-button {
          height: 19px;
          margin-top: 15px;
          border-radius: 5px;
          background: var(--orange);
        }

        .service-stack {
          position: absolute;
          right: 20px;
          bottom: 20px;
          width: 210px;
        }

        .service-item {
          display: flex;
          justify-content: space-between;
          margin-top: 5px;
          padding: 10px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 6px;
          background: #101010;
          color: #68625b;
          font-size: 7px;
        }

        .service-item strong {
          color: #aaa49c;
        }

        .commission-chart {
          position: absolute;
          right: 25px;
          bottom: 25px;
          width: 210px;
          height: 110px;
          display: flex;
          align-items: end;
          gap: 7px;
          padding: 15px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 8px;
          background: #0e0e0e;
        }

        .bar {
          flex: 1;
          border-radius: 3px 3px 0 0;
          background: linear-gradient(
            to top,
            rgba(255,106,61,.12),
            rgba(255,106,61,.8)
          );
        }

        .bar:nth-child(1) { height: 35%; }
        .bar:nth-child(2) { height: 50%; }
        .bar:nth-child(3) { height: 42%; }
        .bar:nth-child(4) { height: 75%; }
        .bar:nth-child(5) { height: 60%; }
        .bar:nth-child(6) { height: 92%; }

        /* ================= NUMBERS ================= */

        .numbers {
          padding: 75px 0;
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
          border: 0;
        }

        .number strong {
          display: block;
          font-size: 45px;
          letter-spacing: -.06em;
        }

        .number span {
          display: block;
          margin-top: 5px;
          color: #55514c;
          font-family: "DM Mono", monospace;
          font-size: 7px;
        }

        /* ================= PRICE ================= */

        .price-card {
          max-width: 900px;
          margin: 65px auto 0;
          padding: 45px;
          border: 1px solid rgba(255,106,61,.18);
          border-radius: 20px;
          background:
            radial-gradient(
              circle at 90% 10%,
              rgba(255,106,61,.09),
              transparent 30%
            ),
            #090909;
        }

        .price-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }

        .price-label {
          color: var(--orange);
          font-family: "DM Mono", monospace;
          font-size: 7px;
          letter-spacing: .15em;
        }

        .price-card h3 {
          margin: 14px 0;
          font-size: 32px;
        }

        .price-description {
          color: #66615b;
          font-size: 10px;
          line-height: 1.75;
        }

        .price-value {
          display: flex;
          align-items: baseline;
          margin-top: 20px;
          gap: 4px;
        }

        .price-value small {
          color: #777;
        }

        .price-value strong {
          font-size: 52px;
          letter-spacing: -.07em;
        }

        .price-value span {
          color: #666;
          font-size: 10px;
        }

        .price-features {
          display: grid;
          gap: 10px;
        }

        .price-feature {
          display: flex;
          gap: 8px;
          color: #858078;
          font-size: 9px;
        }

        .price-feature span {
          color: var(--orange);
        }

        .price-button {
          margin-top: 25px;
        }

        /* ================= CTA ================= */

        .final-cta {
          position: relative;
          min-height: 650px;
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

        .cta-content {
          position: relative;
          z-index: 2;
        }

        .cta-content .section-label {
          justify-content: center;
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
          max-width: 520px;
          margin: 25px auto;
          color: #77716a;
          font-size: 12px;
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
          color: #4a4641;
          font-size: 8px;
        }

        .footer-links {
          display: flex;
          gap: 20px;
          color: #55514c;
          font-size: 8px;
        }

        /* ================= MOBILE ================= */

        @media (max-width: 1000px) {

          .hero-inner {
            grid-template-columns: 1fr;
          }

          .hero-product {
            height: 550px;
          }

          .tattoo-flow-grid {
            grid-template-columns:
              1fr 20px
              1fr;
          }

          .tattoo-step:nth-of-type(3) {
            grid-column: 1;
          }

          .flow-arrow:nth-of-type(2) {
            display: none;
          }

          .feature-card,
          .feature-card:nth-child(1),
          .feature-card:nth-child(4) {
            grid-column: span 6;
          }
        }

        @media (max-width: 800px) {

          .container {
            width: min(100% - 28px, 600px);
          }

          .nav-links,
          .nav-cta {
            display: none;
          }

          .mobile-menu {
            display: block;
          }

          .hero {
            padding-top: 120px;
          }

          .hero h1 {
            font-size: clamp(48px, 14vw, 75px);
          }

          .hero-actions {
            flex-direction: column;
          }

          .primary-button,
          .secondary-button {
            width: 100%;
          }

          .hero-product {
            height: 430px;
            margin-top: 10px;
            transform: scale(.72);
            transform-origin: top center;
          }

          .dashboard-wrap {
            transform: scale(.9);
          }

          .section {
            padding: 90px 0;
          }

          .before-after {
            grid-template-columns: 1fr;
          }

          .ba-divider {
            transform: rotate(90deg);
          }

          .flow-grid {
            grid-template-columns: 1fr 1fr;
          }

          .tattoo-flow-grid {
            display: grid;
            grid-template-columns: 1fr;
          }

          .flow-arrow {
            transform: rotate(90deg);
            height: 20px;
          }

          .tattoo-final-bar {
            flex-direction: column;
            align-items: flex-start;
          }

          .quote-body {
            grid-template-columns: 1fr;
          }

          .quote-photo {
            min-height: 260px;
          }

          .feature-card,
          .feature-card:nth-child(1),
          .feature-card:nth-child(4) {
            grid-column: span 12;
          }

          .numbers-grid {
            grid-template-columns: 1fr 1fr;
          }

          .number:nth-child(2) {
            border: 0;
          }

          .price-grid {
            grid-template-columns: 1fr;
            gap: 35px;
          }

          .price-card {
            padding: 30px;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .footer-inner {
            flex-direction: column;
            gap: 15px;
          }
        }

        @media (max-width: 500px) {

          .hero-product {
            height: 330px;
            transform: scale(.53);
            margin-bottom: -100px;
          }

          .dashboard-wrap {
            transform: scale(.9);
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

          .numbers-grid {
            grid-template-columns: 1fr 1fr;
          }

          .number {
            padding: 12px;
          }

          .number strong {
            font-size: 34px;
          }

          .price-value strong {
            font-size: 42px;
          }

          .footer-copy {
            text-align: center;
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
          <div
            style={{
              padding: "15px 25px",
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
                padding: "10px 0",
                color: "#aaa",
                fontSize: 12,
              }}
            >
              Como funciona
            </a>

            <a
              href="#recursos"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "10px 0",
                color: "#aaa",
                fontSize: 12,
              }}
            >
              Recursos
            </a>

            <a
              href="#preco"
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "10px 0",
                color: "#aaa",
                fontSize: 12,
              }}
            >
              Preço
            </a>
          </div>
        )}
      </header>

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="hero">

        <div className="hero-grid" />

        <Aura className="aura-one" />
        <Aura className="aura-two" delay={2} />

        <motion.div
          className="container hero-inner"
          style={{
            x: smoothX,
            y: smoothY,
          }}
        >

          <div className="hero-copy">

            <motion.div
              className="eyebrow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .1 }}
            >
              <span className="eyebrow-dot" />

              FEITO PARA QUEM VIVE DA TATUAGEM
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: .15,
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: .8,
                delay: .35,
              }}
            >
              Você cuida da arte.
              <strong>
                {" "}O Fayola cuida do atendimento.
              </strong>

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
                [15, -15]
              ),
              y: useTransform(
                smoothY,
                [-20, 20],
                [8, -8]
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

          {[1, 2].map((item) => (
            <div
              className="ticker-item"
              key={item}
            >
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
              para passar o dia
              <em> respondendo mensagens.</em>
            </h2>

            <p className="section-intro">
              Enquanto você está tatuando, chegam perguntas,
              referências, pedidos de orçamento, dúvidas
              sobre tamanho, local do corpo e horários.
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
              delay={.05}
            />

            <FlowCard
              number="03"
              icon="⌁"
              title="Detalhes"
              text="Estilo, tamanho em cm e local do corpo ficam registrados."
              delay={.1}
            />

            <FlowCard
              number="04"
              icon="R$"
              title="Orçamento"
              text="Você analisa o projeto e define o valor."
              delay={.15}
            />

            <FlowCard
              number="05"
              icon="✦"
              title="Sinal PIX"
              text="O cliente recebe o PIX e confirma o projeto."
              delay={.2}
            />

            <FlowCard
              number="06"
              icon="✓"
              title="Horário"
              text="Depois do pagamento, o cliente escolhe um horário disponível."
              delay={.25}
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          MESMO LINK
          ===================================================== */}

      <section className="section">

        <div className="container">

          <Reveal>

            <div className="section-label">
              Um único link
            </div>

            <h2 className="section-title">
              O pedido começa no link.
              <br />
              <em>E termina no horário confirmado.</em>
            </h2>

            <p className="section-intro">
              Seu cliente não precisa começar uma conversa
              nova a cada etapa. O mesmo link acompanha
              o projeto desde o primeiro pedido até a sessão.
            </p>

          </Reveal>

          <TattooLinkFlow />

        </div>

      </section>

      {/* =====================================================
          PROJETO
          ===================================================== */}

      <section className="section">

        <div className="container">

          <Reveal>

            <div className="section-label">
              Feito para projetos reais
            </div>

            <h2 className="section-title">
              Do “quanto fica?”
              <br />
              até o
              <em> horário confirmado.</em>
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
              LINK PARA CADA PEDIDO
            </span>
          </div>

          <div className="number">
            <strong>
              <CountUp value={6} />
            </strong>

            <span>
              ETAPAS ORGANIZADAS
            </span>
          </div>

          <div className="number">
            <strong>
              <CountUp value={24} suffix="h" />
            </strong>

            <span>
              LINK DISPONÍVEL
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
              O Fayola reúne as partes do seu negócio
              que normalmente ficam espalhadas entre
              WhatsApp, Instagram, agenda e anotações.
            </p>

          </Reveal>

          <div className="features-grid">

            <FeatureCard
              number="01"
              title="Pedido de tatuagem"
              description="Receba novos projetos com referência, estilo, tamanho e local do corpo."
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
              <div className="mini-phone">
                <div className="phone-screen">
                  <small>REFERÊNCIAS</small>
                  <div className="phone-line" />
                  <div className="phone-line short" />
                  <div className="phone-line" />
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
              <div className="mini-phone">
                <div className="phone-screen">
                  <small>AGENDA</small>
                  <div className="phone-line" />
                  <div className="phone-line" />
                  <div className="phone-line short" />
                  <div className="phone-button" />
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
              description="Cada profissional pode ter seu acesso, horários e suas próprias comissões."
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

        <div
          className="container"
          style={{
            textAlign: "center",
          }}
        >

          <Reveal>

            <div
              className="section-label"
              style={{
                justifyContent: "center",
              }}
            >
              A ideia é simples
            </div>

            <h2
              className="section-title"
              style={{
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

          </Reveal>

        </div>

      </section>

      {/* =====================================================
          PREÇO
          ===================================================== */}

      <section
  className="section"
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

    <Reveal delay={.1}>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 18,
          alignItems: "stretch",
        }}
      >

        {/* =====================================================
            FAYOLA SOLO
            ===================================================== */}

        <div className="price-card">

          <div className="price-grid">

            <div>

              <div className="price-label">
                FAYOLA SOLO
              </div>

              <h3>
                Para você.
              </h3>

              <p className="price-description">
                Para tatuador independente que quer
                organizar o atendimento e parar de
                perder tempo com mensagens e horários.
              </p>

              <div className="price-value">
                <small>R$</small>
                <strong>79,90</strong>
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

              {[
                "Link público para seus clientes",
                "Pedidos de tatuagem",
                "Referências e informações do projeto",
                "Tamanho e serviços",
                "Agenda",
                "Clientes",
                "Sinal via PIX",
                "Notificações e lembretes",
              ].map((item) => (
                <div
                  className="price-feature"
                  key={item}
                >
                  <span>✓</span>
                  {item}
                </div>
              ))}

            </div>

          </div>

        </div>


        {/* =====================================================
            FAYOLA STUDIO
            ===================================================== */}

        <div
          className="price-card"
          style={{
            borderColor: "rgba(255,106,61,.30)",
          }}
        >

          <div className="price-grid">

            <div>

              <div className="price-label">
                FAYOLA STUDIO
              </div>

              <h3>
                Para sua equipe.
              </h3>

              <p className="price-description">
                Para estúdios com equipe que precisam
                organizar profissionais, agenda,
                clientes e comissões.
              </p>

              <div className="price-value">
                <small>R$</small>
                <strong>149,90</strong>
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

              {[
                "Tudo do Fayola Solo",
                "Profissionais e comissões",
                "Acesso individual para profissionais",
                "Agenda por profissional",
                "Gestão da equipe",
                "Clientes e histórico",
                "Sinal via PIX",
                "Notificações e lembretes",
              ].map((item) => (
                <div
                  className="price-feature"
                  key={item}
                >
                  <span>✓</span>
                  {item}
                </div>
              ))}

            </div>

          </div>

        </div>


        {/* =====================================================
            FAYOLA PRO
            ===================================================== */}

        <div
          className="price-card"
          style={{
            borderColor: "rgba(255,106,61,.55)",
            boxShadow:
              "0 0 70px rgba(255,106,61,.10)",
          }}
        >

          <div className="price-grid">

            <div>

              <div
                className="price-label"
                style={{
                  color: "#ff6a3d",
                }}
              >
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

              {[
                "Tudo do Fayola Studio",
                "Link público para seus clientes",
                "Pedidos de tatuagem",
                "Referências e informações do projeto",
                "Tamanho e serviços",
                "Orçamentos",
                "Agenda",
                "Clientes",
                "Sinal via PIX",
                "Notificações e lembretes",
                "Profissionais e comissões",
                "Acesso individual para profissionais",
              ].map((item) => (
                <div
                  className="price-feature"
                  key={item}
                >
                  <span>✓</span>
                  {item}
                </div>
              ))}

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

  <div className="container cta-content">

    <Reveal>

      <div
        className="section-label"
        style={{
          justifyContent: "center",
        }}
      >
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
        organizado enquanto você faz o que sabe
        fazer melhor.
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
          href="/painel-profissional/login"
          className="secondary-button"
        >
          Entrar
        </a>
        
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
      <span className="logo-mark">
        ✦
      </span>

      FAYOLA
    </div>

    <div className="footer-copy">
      Sistema de atendimento e agendamento
      para tatuadores e estúdios.
    </div>

    <div className="footer-links">

      <a
        href={WHATSAPP}
        target="_blank"
        rel="noreferrer"
      >
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