import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

const WHATSAPP =
  'https://wa.me/5571985119593?text=Quero%20conhecer%20o%20Fayola';

const ASSINAR =
  'https://wa.me/5571985119593?text=Quero%20assinar%20o%20Fayola';

const ease = [0.22, 1, 0.36, 1];

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.75, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function TiltPanel({ children, className = '' }) {
  const ref = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateY = useSpring(
    useTransform(mx, [-1, 1], [-7, 7]),
    {
      stiffness: 180,
      damping: 22,
    }
  );

  const rotateX = useSpring(
    useTransform(my, [-1, 1], [6, -6]),
    {
      stiffness: 180,
      damping: 22,
    }
  );

  function handleMove(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    mx.set(
      ((e.clientX - rect.left) / rect.width) * 2 - 1
    );

    my.set(
      ((e.clientY - rect.top) / rect.height) * 2 - 1
    );
  }

  function reset() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1200,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function TattooRequestCard() {
  return (
    <div className="tattoo-request-card">

      <div className="trc-top">
        <div>
          <span className="mini-label">
            NOVO PEDIDO
          </span>

          <strong>
            Projeto #0248
          </strong>
        </div>

        <span className="status-dot">
          NOVO
        </span>
      </div>

      <div className="reference-art">

        <div className="ink-orbit ink-one" />

        <div className="ink-orbit ink-two" />

        <div className="ink-flower">
          ✦
        </div>

      </div>

      <div className="request-info">

        <div>
          <span>CLIENTE</span>
          <b>Marina Costa</b>
        </div>

        <div>
          <span>ESTILO</span>
          <b>Fine line</b>
        </div>

        <div>
          <span>TAMANHO</span>
          <b>12 cm</b>
        </div>

        <div>
          <span>LOCAL</span>
          <b>Antebraço</b>
        </div>

      </div>

      <div className="request-footer">
        <span>
          2 referências anexadas
        </span>

        <span className="arrow">
          ↗
        </span>
      </div>

    </div>
  );
}

function StudioDashboard() {
  return (
    <div className="studio-dashboard">

      <div className="dashboard-top">

        <div className="brand-small">
          FAYOLA <span>STUDIO</span>
        </div>

        <div className="dashboard-date">
          QUARTA · 14 OUT
        </div>

        <div className="avatar">
          M
        </div>

      </div>

      <div className="dashboard-main">

        <div className="dashboard-heading">

          <div>

            <span className="mini-label">
              VISÃO DO ESTÚDIO
            </span>

            <h3>
              Bom dia, Marcelo.
            </h3>

          </div>

          <span className="live">
            <i /> AO VIVO
          </span>

        </div>

        <div className="metric-row">

          <div className="metric">

            <span>HOJE</span>

            <strong>
              06
            </strong>

            <small>
              sessões
            </small>

          </div>

          <div className="metric accent">

            <span>SINAIS</span>

            <strong>
              R$ 1.240
            </strong>

            <small>
              confirmados
            </small>

          </div>

          <div className="metric">

            <span>PEDIDOS</span>

            <strong>
              12
            </strong>

            <small>
              aguardando análise
            </small>

          </div>

        </div>

        <div className="agenda-box">

          <div className="agenda-title">

            <span>
              PRÓXIMAS SESSÕES
            </span>

            <span>
              Ver agenda →
            </span>

          </div>

          {[
            [
              '10:00',
              'Lucas Almeida',
              'Blackwork · 18 cm',
              'CONFIRMADO',
            ],
            [
              '14:00',
              'Marina Costa',
              'Fine line · 12 cm',
              'SINAL PAGO',
            ],
            [
              '18:30',
              'Rafael Lima',
              'Neo traditional · 15 cm',
              'CONFIRMADO',
            ],
          ].map((item) => (

            <div
              className="agenda-item"
              key={item[0]}
            >

              <b>
                {item[0]}
              </b>

              <div>

                <strong>
                  {item[1]}
                </strong>

                <span>
                  {item[2]}
                </span>

              </div>

              <em>
                {item[3]}
              </em>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

function FloatingPill({
  children,
  className = '',
}) {
  return (
    <motion.div
      animate={{
        y: [0, -9, 0],
      }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`floating-pill ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Landing() {
  return (

    <main
      className="fayola-3d"
      id="top"
    >

      <style>{`

        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        :root {
          --ink: #070707;
          --paper: #f2ede4;
          --orange: #ff6a3d;
          --orange2: #ff9a76;
          --line: rgba(255,255,255,.09);
          --muted: rgba(255,255,255,.48);
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--ink);
        }

        .fayola-3d {
          min-height: 100vh;
          overflow: hidden;
          color: #fff;

          background:
            radial-gradient(
              circle at 70% 5%,
              rgba(255,106,61,.13),
              transparent 28%
            ),
            radial-gradient(
              circle at 8% 22%,
              rgba(255,255,255,.035),
              transparent 22%
            ),
            #070707;

          font-family:
            'DM Sans',
            sans-serif;
        }

        .fayola-3d a {
          color: inherit;
          text-decoration: none;
        }

        .nav3d {
          position: fixed;
          inset: 16px 18px auto;

          z-index: 50;

          max-width: 1280px;

          margin: auto;

          left: 0;
          right: 0;

          height: 66px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 10px 0 18px;

          border:
            1px solid
            rgba(255,255,255,.1);

          border-radius: 22px;

          background:
            rgba(10,10,10,.66);

          backdrop-filter:
            blur(22px);

          box-shadow:
            0 20px 60px
            rgba(0,0,0,.25);
        }

        .logo3d {
          display: flex;
          align-items: center;
          gap: 11px;

          font-weight: 700;

          letter-spacing: .24em;

          font-size: 13px;
        }

        .logo3d-mark {
          width: 34px;
          height: 34px;

          border-radius: 11px;

          display: grid;
          place-items: center;

          background:
            var(--orange);

          color: #080808;

          font-weight: 900;

          letter-spacing: 0;

          box-shadow:
            0 8px 28px
            rgba(255,106,61,.28);
        }

        .nav-links {
          display: flex;
          gap: 30px;

          color:
            rgba(255,255,255,.52);

          font-size: 13px;
        }

        .nav-links a:hover {
          color: #fff;
        }

        .nav-cta {
          padding: 11px 16px;

          border-radius: 14px;

          background: #fff;

          color: #080808 !important;

          font-size: 12px;

          font-weight: 700;

          transition:
            .25s;
        }

        .nav-cta:hover {
          transform:
            translateY(-1px);

          background:
            var(--orange);
        }

        .hero3d {
          position: relative;

          min-height: 980px;

          max-width: 1280px;

          margin: auto;

          padding:
            175px 34px
            110px;

          display: grid;

          grid-template-columns:
            .88fr 1.12fr;

          align-items: center;

          gap: 35px;
        }

        .hero-copy {
          position: relative;
          z-index: 5;
        }

        .eyebrow3d {
          display: inline-flex;

          align-items: center;

          gap: 8px;

          padding:
            8px 12px;

          border:
            1px solid
            rgba(255,106,61,.25);

          border-radius: 999px;

          color: #ffb39c;

          background:
            rgba(255,106,61,.06);

          font-size: 10px;

          font-weight: 700;

          letter-spacing: .18em;

          text-transform:
            uppercase;
        }

        .eyebrow3d i {
          width: 6px;
          height: 6px;

          border-radius: 50%;

          background:
            var(--orange);

          box-shadow:
            0 0 16px
            var(--orange);
        }

        .hero-title {
          margin: 28px 0 0;

          font-family:
            'Space Grotesk',
            sans-serif;

          font-size:
            clamp(
              58px,
              7vw,
              105px
            );

          line-height: .89;

          letter-spacing:
            -.065em;

          max-width: 760px;
        }

        .hero-title .orange {
          color:
            var(--orange);
        }

        .hero-text {
          max-width: 570px;

          margin-top: 30px;

          color:
            var(--muted);

          font-size: 17px;

          line-height: 1.75;
        }

        .hero-actions {
          display: flex;

          gap: 12px;

          margin-top: 34px;

          flex-wrap: wrap;
        }

        .btn-primary,
        .btn-ghost {
          display: inline-flex;

          align-items: center;
          justify-content: center;

          gap: 10px;

          padding:
            15px 20px;

          border-radius: 16px;

          font-size: 13px;

          font-weight: 700;

          transition:
            transform .25s,
            background .25s,
            border .25s;
        }

        .btn-primary {
          background:
            var(--orange);

          color:
            #080808 !important;

          box-shadow:
            0 16px 45px
            rgba(255,106,61,.2);
        }

        .btn-primary:hover {
          transform:
            translateY(-3px);

          background:
            #ff825e;
        }

        .btn-ghost {
          border:
            1px solid
            var(--line);

          color:
            #fff !important;
        }

        .btn-ghost:hover {
          transform:
            translateY(-3px);

          border-color:
            rgba(255,255,255,.2);

          background:
            rgba(255,255,255,.04);
        }

        .hero-note {
          display: flex;

          gap: 18px;

          flex-wrap: wrap;

          margin-top: 28px;

          color:
            rgba(255,255,255,.34);

          font-size: 11px;
        }

        .hero-note span {
          display: flex;

          align-items: center;

          gap: 7px;
        }

        .hero-note b {
          color:
            var(--orange);
        }

        .hero-stage {
          position: relative;

          height: 680px;

          perspective: 1500px;
        }

        .stage-glow {
          position: absolute;

          width: 520px;
          height: 520px;

          border-radius: 50%;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%,-50%);

          background:
            rgba(255,106,61,.13);

          filter:
            blur(100px);
        }

        .dashboard-wrap {
          position: absolute;

          left: 50%;
          top: 50%;

          width:
            min(
              680px,
              95%
            );

          transform:
            translate(-46%,-48%)
            rotateY(-13deg)
            rotateX(5deg)
            rotateZ(1deg);

          transform-style:
            preserve-3d;

          z-index: 3;
        }

        .studio-dashboard {
          position: relative;

          overflow: hidden;

          border:
            1px solid
            rgba(255,255,255,.14);

          border-radius: 27px;

          background:
            linear-gradient(
              145deg,
              #171717,
              #0d0d0d
            );

          box-shadow:
            35px 45px 100px
            rgba(0,0,0,.72),

            0 0 0 1px
            rgba(255,255,255,.03)
            inset;
        }

        .studio-dashboard:before {
          content: '';

          position: absolute;

          inset: 0;

          background:
            linear-gradient(
              120deg,
              rgba(255,255,255,.08),
              transparent 28%,
              transparent 70%,
              rgba(255,106,61,.05)
            );

          pointer-events: none;
        }

        .dashboard-top {
          height: 62px;

          padding:
            0 20px;

          display: flex;

          align-items: center;

          gap: 16px;

          border-bottom:
            1px solid
            rgba(255,255,255,.07);
        }

        .brand-small {
          font-weight: 700;

          font-size: 11px;

          letter-spacing: .18em;
        }

        .brand-small span {
          color:
            rgba(255,255,255,.3);
        }

        .dashboard-date {
          margin-left: auto;

          color:
            rgba(255,255,255,.35);

          font-size: 9px;

          letter-spacing: .16em;
        }

        .avatar {
          width: 29px;
          height: 29px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background:
            var(--orange);

          color:
            #080808;

          font-size: 10px;

          font-weight: 800;
        }

        .dashboard-main {
          padding: 24px;
        }

        .dashboard-heading {
          display: flex;

          align-items: center;

          justify-content:
            space-between;
        }

        .mini-label {
          display: block;

          color:
            rgba(255,255,255,.31);

          font-size: 8px;

          font-weight: 700;

          letter-spacing: .2em;
        }

        .dashboard-heading h3 {
          margin: 5px 0 0;

          font-family:
            'Space Grotesk';

          font-size: 25px;

          letter-spacing:
            -.04em;
        }

        .live {
          color:
            #77e2ad;

          font-size: 8px;

          letter-spacing: .15em;

          font-weight: 700;
        }

        .live i {
          display: inline-block;

          width: 5px;
          height: 5px;

          margin-right: 6px;

          border-radius: 50%;

          background:
            #77e2ad;

          box-shadow:
            0 0 9px
            #77e2ad;
        }

        .metric-row {
          display: grid;

          grid-template-columns:
            repeat(3,1fr);

          gap: 9px;

          margin-top: 20px;
        }

        .metric {
          min-height: 104px;

          padding: 14px;

          border-radius: 16px;

          background:
            #121212;

          border:
            1px solid
            rgba(255,255,255,.06);
        }

        .metric.accent {
          background:
            linear-gradient(
              145deg,
              rgba(255,106,61,.18),
              rgba(255,106,61,.04)
            );

          border-color:
            rgba(255,106,61,.18);
        }

        .metric span {
          display: block;

          color:
            rgba(255,255,255,.31);

          font-size: 8px;

          letter-spacing: .16em;
        }

        .metric strong {
          display: block;

          margin-top: 11px;

          font-family:
            'Space Grotesk';

          font-size: 25px;

          letter-spacing:
            -.05em;
        }

        .metric small {
          display: block;

          margin-top: 4px;

          color:
            rgba(255,255,255,.29);

          font-size: 9px;
        }

        .agenda-box {
          margin-top: 12px;

          border-radius: 17px;

          background:
            #101010;

          border:
            1px solid
            rgba(255,255,255,.06);

          overflow: hidden;
        }

        .agenda-title {
          display: flex;

          justify-content:
            space-between;

          padding:
            14px 15px;

          border-bottom:
            1px solid
            rgba(255,255,255,.06);

          color:
            rgba(255,255,255,.35);

          font-size: 8px;

          letter-spacing: .16em;
        }

        .agenda-title span:last-child {
          color:
            var(--orange);
        }

        .agenda-item {
          display: grid;

          grid-template-columns:
            52px 1fr auto;

          gap: 10px;

          align-items: center;

          padding:
            13px 15px;

          border-bottom:
            1px solid
            rgba(255,255,255,.045);
        }

        .agenda-item:last-child {
          border-bottom: 0;
        }

        .agenda-item > b {
          color:
            rgba(255,255,255,.48);

          font-size: 10px;
        }

        .agenda-item div strong {
          display: block;

          font-size: 11px;
        }

        .agenda-item div span {
          display: block;

          margin-top: 3px;

          color:
            rgba(255,255,255,.31);

          font-size: 8px;
        }

        .agenda-item em {
          font-style: normal;

          color:
            #76dca8;

          font-size: 7px;

          letter-spacing: .08em;
        }

        .tattoo-request {
          position: absolute;

          z-index: 7;

          width: 310px;

          left: -25px;

          bottom: 75px;

          transform:
            translateZ(80px)
            rotateZ(-3deg);
        }

        .tattoo-request-card {
          padding: 18px;

          border:
            1px solid
            rgba(255,255,255,.13);

          border-radius: 22px;

          background:
            rgba(19,19,19,.92);

          backdrop-filter:
            blur(20px);

          box-shadow:
            0 30px 80px
            rgba(0,0,0,.6);
        }

        .trc-top {
          display: flex;

          justify-content:
            space-between;

          align-items:
            flex-start;
        }

        .trc-top strong {
          display: block;

          margin-top: 4px;

          font-size: 15px;
        }

        .status-dot {
          padding: 5px 7px;

          border-radius: 7px;

          background:
            rgba(255,106,61,.1);

          color:
            #ff9a76;

          font-size: 7px;

          font-weight: 800;

          letter-spacing: .12em;
        }

        .reference-art {
          position: relative;

          height: 115px;

          margin-top: 14px;

          overflow: hidden;

          border-radius: 14px;

          background:
            radial-gradient(
              circle at 65% 42%,
              rgba(255,255,255,.14),
              transparent 2%
            ),
            radial-gradient(
              circle at 42% 60%,
              rgba(255,255,255,.11),
              transparent 2%
            ),
            linear-gradient(
              135deg,
              #202020,
              #0b0b0b
            );
        }

        .ink-flower {
          position: absolute;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%,-50%);

          color: #eee;

          font-size: 54px;

          filter:
            drop-shadow(
              0 0 12px
              rgba(255,255,255,.25)
            );
        }

        .ink-orbit {
          position: absolute;

          border:
            1px solid
            rgba(255,255,255,.12);

          border-radius: 50%;
        }

        .ink-one {
          width: 140px;
          height: 70px;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%,-50%)
            rotate(27deg);
        }

        .ink-two {
          width: 90px;
          height: 135px;

          left: 50%;
          top: 50%;

          transform:
            translate(-50%,-50%)
            rotate(-28deg);
        }

        .request-info {
          display: grid;

          grid-template-columns:
            1fr 1fr;

          gap: 10px;

          margin-top: 14px;
        }

        .request-info span {
          display: block;

          color:
            rgba(255,255,255,.28);

          font-size: 7px;

          letter-spacing: .14em;
        }

        .request-info b {
          display: block;

          margin-top: 4px;

          font-size: 10px;
        }

        .request-footer {
          display: flex;

          justify-content:
            space-between;

          align-items: center;

          margin-top: 15px;

          padding-top: 13px;

          border-top:
            1px solid
            rgba(255,255,255,.07);

          color:
            rgba(255,255,255,.35);

          font-size: 8px;
        }

        .arrow {
          color:
            var(--orange);

          font-size: 16px;
        }

        .float-pix {
          position: absolute;

          z-index: 8;

          right: 8px;

          top: 82px;
        }

        .floating-pill {
          padding:
            12px 14px;

          border:
            1px solid
            rgba(255,255,255,.12);

          border-radius: 15px;

          background:
            rgba(20,20,20,.88);

          backdrop-filter:
            blur(18px);

          box-shadow:
            0 18px 45px
            rgba(0,0,0,.4);
        }

        .pix-pill {
          display: flex;

          align-items: center;

          gap: 10px;
        }

        .pix-icon {
          width: 28px;
          height: 28px;

          display: grid;
          place-items: center;

          border-radius: 9px;

          background:
            #173c2c;

          color:
            #74e3a7;

          font-size: 12px;
        }

        .pix-pill span {
          display: block;

          color:
            rgba(255,255,255,.35);

          font-size: 7px;

          letter-spacing: .12em;
        }

        .pix-pill b {
          display: block;

          margin-top: 3px;

          font-size: 12px;
        }

        .scroll-mark {
          position: absolute;

          left: 34px;

          bottom: 42px;

          display: flex;

          align-items: center;

          gap: 10px;

          color:
            rgba(255,255,255,.28);

          font-size: 9px;

          letter-spacing: .18em;

          text-transform:
            uppercase;
        }

        .scroll-mark:before {
          content: '';

          width: 32px;

          height: 1px;

          background:
            rgba(255,255,255,.2);
        }

        .ticker {
          border-top:
            1px solid var(--line);

          border-bottom:
            1px solid var(--line);

          overflow: hidden;

          background:
            #0b0b0b;
        }

        .ticker-track {
          display: flex;

          width: max-content;

          animation:
            ticker 28s linear infinite;
        }

        .ticker-item {
          display: flex;

          align-items: center;

          gap: 26px;

          padding:
            20px 26px;

          color:
            rgba(255,255,255,.34);

          font-size: 10px;

          font-weight: 700;

          letter-spacing: .18em;

          white-space: nowrap;
        }

        .ticker-item b {
          color:
            var(--orange);

          font-size: 15px;
        }

        @keyframes ticker {
          to {
            transform:
              translateX(-50%);
          }
        }

        .dark-section {
          background:
            #090909;
        }

        .paper-section {
          background:
            var(--paper);

          color:
            #0a0a0a;
        }

        .section {
          max-width: 1180px;

          margin: auto;

          padding:
            150px 34px;
        }

        .section-kicker {
          color:
            var(--orange);

          font-size: 10px;

          font-weight: 800;

          letter-spacing: .22em;

          text-transform:
            uppercase;
        }

        .section-title {
          margin:
            17px 0 0;

          max-width: 800px;

          font-family:
            'Space Grotesk';

          font-size:
            clamp(
              42px,
              5.2vw,
              76px
            );

          line-height: .96;

          letter-spacing:
            -.06em;
        }

        .section-text {
          max-width: 570px;

          margin-top: 24px;

          color:
            rgba(255,255,255,.48);

          font-size: 16px;

          line-height: 1.75;
        }

        .paper-section .section-text {
          color:
            rgba(0,0,0,.54);
        }

        .problem-grid {
          display: grid;

          grid-template-columns:
            1fr 1fr 1fr;

          gap: 12px;

          margin-top: 70px;
        }

        .problem-card {
          min-height: 250px;

          padding: 28px;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius: 25px;

          background:
            #0e0e0e;
        }

        .problem-card .num {
          color:
            rgba(255,106,61,.7);

          font-size: 10px;

          letter-spacing: .2em;

          font-weight: 800;
        }

        .problem-card h3 {
          margin-top: 78px;

          font-size: 20px;

          letter-spacing:
            -.03em;
        }

        .problem-card p {
          margin-top: 9px;

          color:
            rgba(255,255,255,.4);

          font-size: 13px;

          line-height: 1.65;
        }

        .flow {
          display: grid;

          grid-template-columns:
            repeat(5,1fr);

          gap: 0;

          margin-top: 70px;

          border-top:
            1px solid
            rgba(0,0,0,.12);

          border-bottom:
            1px solid
            rgba(0,0,0,.12);
        }

        .flow-card {
          position: relative;

          min-height: 250px;

          padding: 25px 20px;

          border-right:
            1px solid
            rgba(0,0,0,.12);
        }

        .flow-card:last-child {
          border-right: 0;
        }

        .flow-number {
          width: 34px;
          height: 34px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background:
            #0b0b0b;

          color:
            #fff;

          font-size: 10px;

          font-weight: 800;
        }

        .flow-card h3 {
          margin-top: 80px;

          font-size: 17px;

          letter-spacing:
            -.03em;
        }

        .flow-card p {
          margin-top: 8px;

          color:
            rgba(0,0,0,.52);

          font-size: 12px;

          line-height: 1.6;
        }

        .flow-arrow {
          position: absolute;

          right: -8px;

          top: 30px;

          z-index: 2;

          width: 16px;
          height: 16px;

          display: grid;
          place-items: center;

          background:
            var(--paper);

          color:
            var(--orange);

          font-size: 12px;
        }

        .showcase {
          display: grid;

          grid-template-columns:
            .85fr 1.15fr;

          align-items: center;

          gap: 70px;

          margin-top: 90px;
        }

        .showcase-copy h3 {
          margin-top: 16px;

          font-family:
            'Space Grotesk';

          font-size: 48px;

          line-height: 1;

          letter-spacing:
            -.055em;
        }

        .showcase-copy p {
          margin-top: 20px;

          max-width: 470px;

          color:
            rgba(0,0,0,.52);

          line-height: 1.75;

          font-size: 15px;
        }

        .showcase-list {
          display: grid;

          gap: 10px;

          margin-top: 30px;
        }

        .showcase-list div {
          display: flex;

          gap: 10px;

          align-items: center;

          font-size: 12px;

          font-weight: 600;
        }

        .showcase-list b {
          width: 20px;
          height: 20px;

          display: grid;
          place-items: center;

          border-radius: 50%;

          background:
            #0a0a0a;

          color:
            #fff;

          font-size: 9px;
        }

        .quote-3d {
          position: relative;

          min-height: 510px;

          display: grid;

          place-items: center;

          perspective: 1200px;
        }

        .quote-card {
          width:
            min(
              490px,
              100%
            );

          padding: 34px;

          border-radius: 30px;

          background:
            #0a0a0a;

          color:
            #fff;

          transform:
            rotateY(-8deg)
            rotateX(5deg)
            rotateZ(2deg);

          box-shadow:
            30px 35px 80px
            rgba(0,0,0,.25);
        }

        .quote-card-top {
          display: flex;

          justify-content:
            space-between;

          color:
            rgba(255,255,255,.35);

          font-size: 8px;

          letter-spacing: .16em;
        }

        .quote-card h4 {
          margin-top: 50px;

          font-family:
            'Space Grotesk';

          font-size: 34px;

          letter-spacing:
            -.05em;
        }

        .quote-price {
          margin-top: 32px;

          display: flex;

          justify-content:
            space-between;

          align-items:
            flex-end;

          padding-top: 20px;

          border-top:
            1px solid
            rgba(255,255,255,.1);
        }

        .quote-price span {
          color:
            rgba(255,255,255,.35);

          font-size: 8px;

          letter-spacing: .14em;
        }

        .quote-price strong {
          margin-top: 5px;

          display: block;

          font-size: 28px;
        }

        .quote-pix {
          padding:
            10px 12px;

          border-radius: 12px;

          background:
            #173c2c;

          color:
            #78dfa9;

          font-size: 9px;

          font-weight: 700;
        }

        .feature-grid {
          display: grid;

          grid-template-columns:
            repeat(3,1fr);

          gap: 12px;

          margin-top: 70px;
        }

        .feature-card {
          min-height: 245px;

          padding: 28px;

          border-radius: 25px;

          border:
            1px solid
            rgba(255,255,255,.08);

          background:
            linear-gradient(
              145deg,
              #111,
              #0b0b0b
            );

          transition:
            transform .35s,
            border .35s;
        }

        .feature-card:hover {
          transform:
            translateY(-8px);

          border-color:
            rgba(255,106,61,.3);
        }

        .feature-icon {
          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 13px;

          background:
            rgba(255,106,61,.09);

          color:
            var(--orange);

          font-size: 18px;
        }

        .feature-card h3 {
          margin-top: 55px;

          font-size: 18px;

          letter-spacing:
            -.03em;
        }

        .feature-card p {
          margin-top: 9px;

          color:
            rgba(255,255,255,.4);

          font-size: 12px;

          line-height: 1.65;
        }

        .price-section {
          padding:
            150px 34px;

          text-align: center;
        }

        .price-card {
          width:
            min(
              480px,
              100%
            );

          margin:
            55px auto 0;

          padding: 34px;

          border-radius: 30px;

          background:
            #101010;

          border:
            1px solid
            rgba(255,106,61,.24);

          box-shadow:
            0 30px 100px
            rgba(0,0,0,.35);

          text-align: left;
        }

        .price-card .price {
          margin-top: 12px;

          font-family:
            'Space Grotesk';

          font-size: 53px;

          letter-spacing:
            -.06em;
        }

        .price-card .price small {
          color:
            rgba(255,255,255,.35);

          font-family:
            'DM Sans';

          font-size: 13px;

          letter-spacing: 0;
        }

        .price-card hr {
          margin: 26px 0;

          border: 0;

          border-top:
            1px solid
            rgba(255,255,255,.08);
        }

        .price-list {
          display: grid;

          gap: 11px;

          color:
            rgba(255,255,255,.62);

          font-size: 12px;
        }

        .price-list span {
          color:
            var(--orange);

          margin-right: 9px;
        }

        .price-button {
          display: block;

          margin-top: 28px;

          padding: 16px;

          border-radius: 15px;

          background:
            var(--orange);

          color:
            #080808 !important;

          text-align: center;

          font-size: 12px;

          font-weight: 800;
        }

        .final-cta {
          position: relative;

          min-height: 620px;

          display: grid;

          place-items: center;

          overflow: hidden;

          text-align: center;

          background:
            radial-gradient(
              circle at 50% 55%,
              rgba(255,106,61,.19),
              transparent 32%
            ),
            #070707;
        }

        .final-ring {
          position: absolute;

          width: 650px;
          height: 650px;

          border:
            1px solid
            rgba(255,106,61,.12);

          border-radius: 50%;
        }

        .final-ring.two {
          width: 850px;
          height: 850px;

          border-color:
            rgba(255,255,255,.05);
        }

        .final-content {
          position: relative;

          z-index: 2;

          padding:
            40px 24px;
        }

        .final-content h2 {
          margin-top: 15px;

          font-family:
            'Space Grotesk';

          font-size:
            clamp(
              48px,
              7vw,
              92px
            );

          line-height: .9;

          letter-spacing:
            -.065em;
        }

        .final-content h2 span {
          color:
            var(--orange);
        }

        .final-content p {
          max-width: 530px;

          margin:
            25px auto 0;

          color:
            rgba(255,255,255,.43);

          line-height: 1.7;
        }

        .final-content .hero-actions {
          justify-content:
            center;
        }

        .footer3d {
          padding:
            30px 34px;

          border-top:
            1px solid
            var(--line);

          display: flex;

          justify-content:
            space-between;

          gap: 20px;

          max-width: 1280px;

          margin: auto;

          color:
            rgba(255,255,255,.3);

          font-size: 10px;
        }

        .footer3d b {
          color: #fff;

          letter-spacing:
            .22em;
        }

        @media (max-width: 980px) {

          .hero3d {
            grid-template-columns: 1fr;

            padding-top: 145px;

            min-height: auto;
          }

          .hero-stage {
            height: 640px;

            margin-top: 20px;
          }

          .dashboard-wrap {
            width:
              min(
                650px,
                92%
              );

            transform:
              translate(-48%,-50%)
              rotateY(-7deg)
              rotateX(3deg);
          }

          .showcase {
            grid-template-columns:
              1fr;
          }

          .problem-grid,
          .feature-grid {
            grid-template-columns:
              1fr 1fr;
          }

          .flow {
            grid-template-columns:
              1fr;
          }

          .flow-card {
            min-height: 170px;

            border-right: 0;

            border-bottom:
              1px solid
              rgba(0,0,0,.12);
          }

          .flow-card:last-child {
            border-bottom: 0;
          }

          .flow-arrow {
            right: 50%;

            top: auto;

            bottom: -8px;

            transform:
              translateX(50%)
              rotate(90deg);
          }
        }

        @media (max-width: 680px) {

          .nav3d {
            inset:
              10px 10px auto;

            height: 58px;

            border-radius: 18px;
          }

          .nav-links {
            display: none;
          }

          .nav-cta {
            padding:
              10px 12px;
          }

          .hero3d {
            padding:
              125px 20px 70px;
          }

          .hero-title {
            font-size: 56px;
          }

          .hero-text {
            font-size: 15px;
          }

          .hero-stage {
            height: 530px;
          }

          .dashboard-wrap {
            width: 590px;

            max-width: none;

            left: 53%;

            transform:
              translate(-50%,-50%)
              scale(.72)
              rotateY(-6deg);

            transform-origin:
              center;
          }

          .tattoo-request {
            width: 255px;

            left: -2px;

            bottom: 20px;

            transform:
              scale(.78)
              rotateZ(-3deg);

            transform-origin:
              left bottom;
          }

          .float-pix {
            right: -4px;

            top: 30px;

            transform:
              scale(.82);

            transform-origin:
              right top;
          }

          .scroll-mark {
            display: none;
          }

          .section {
            padding:
              100px 20px;
          }

          .problem-grid,
          .feature-grid {
            grid-template-columns:
              1fr;
          }

          .problem-card {
            min-height: 205px;
          }

          .problem-card h3 {
            margin-top: 55px;
          }

          .showcase-copy h3 {
            font-size: 39px;
          }

          .quote-card {
            transform: none;
          }

          .price-section {
            padding:
              100px 20px;
          }

          .footer3d {
            padding:
              24px 20px;

            flex-direction:
              column;
          }
        }

      `}</style>

      {/* NAVBAR */}

      <header className="nav3d">

        <a
          href="#top"
          className="logo3d"
        >
          <span className="logo3d-mark">
            F
          </span>

          FAYOLA
        </a>

        <nav className="nav-links">

          <a href="#fluxo">
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
          Falar com o Fayola
        </a>

      </header>

      {/* HERO */}

      <section
        id="top"
        className="hero3d"
      >

        <div className="hero-copy">

          <Reveal>

            <div className="eyebrow3d">

              <i />

              O sistema feito para tatuadores

            </div>

          </Reveal>

          <Reveal delay={0.08}>

            <h1 className="hero-title">

              Enquanto você{' '}

              <span className="orange">
                tatua,
              </span>

              <br />

              o Fayola{' '}

              <span className="orange">
                atende.
              </span>

            </h1>

          </Reveal>

          <Reveal delay={0.14}>

            <p className="hero-text">

              Transforme pedidos de tattoo em projetos
              organizados: referências, tamanho, local
              do corpo, orçamento, sinal via PIX e
              horário confirmado — sem deixar o
              atendimento parar enquanto você está
              trabalhando.

            </p>

          </Reveal>

          <Reveal delay={0.2}>

            <div className="hero-actions">

              <a
                href={ASSINAR}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Quero conhecer o Fayola
                <span>↗</span>
              </a>

              <a
                href="#fluxo"
                className="btn-ghost"
              >
                Ver a experiência
              </a>

            </div>

          </Reveal>

          <Reveal delay={0.26}>

            <div className="hero-note">

              <span>
                <b>✦</b>
                Pedido de tattoo
              </span>

              <span>
                <b>✦</b>
                Referências
              </span>

              <span>
                <b>✦</b>
                Sinal PIX
              </span>

              <span>
                <b>✦</b>
                Agenda
              </span>

            </div>

          </Reveal>

        </div>

        {/* PAINEL 3D */}

        <div className="hero-stage">

          <div className="stage-glow" />

          <TiltPanel
            className="dashboard-wrap"
          >
            <StudioDashboard />
          </TiltPanel>

          {/* PEDIDO FLUTUANTE */}

          <motion.div
            className="tattoo-request"
            initial={{
              opacity: 0,
              x: -35,
              y: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
            }}
            transition={{
              delay: 0.8,
              duration: 0.8,
              ease,
            }}
          >
            <TattooRequestCard />
          </motion.div>

          {/* PIX */}

          <div className="float-pix">

            <FloatingPill>

              <div className="pix-pill">

                <div className="pix-icon">
                  ◆
                </div>

                <div>

                  <span>
                    SINAL RECEBIDO
                  </span>

                  <b>
                    R$ 195,00 · PIX
                  </b>

                </div>

              </div>

            </FloatingPill>

          </div>

        </div>

        <div className="scroll-mark">
          Role para entrar no estúdio
        </div>

      </section>

      {/* TICKER */}

      <div className="ticker">

        <div className="ticker-track">

          {[1, 2].map((copy) => (

            <React.Fragment key={copy}>

              <div className="ticker-item">
                <b>✦</b>
                PEDIDO
              </div>

              <div className="ticker-item">
                REFERÊNCIA
              </div>

              <div className="ticker-item">
                <b>✦</b>
                ORÇAMENTO
              </div>

              <div className="ticker-item">
                SINAL PIX
              </div>

              <div className="ticker-item">
                <b>✦</b>
                HORÁRIO
              </div>

              <div className="ticker-item">
                CONFIRMADO
              </div>

            </React.Fragment>

          ))}

        </div>

      </div>

      {/* PROBLEMA */}

      <section className="dark-section">

        <div className="section">

          <Reveal>

            <div className="section-kicker">
              A rotina real do tatuador
            </div>

            <h2 className="section-title">

              Você não deveria precisar parar
              de tatuar para administrar o atendimento.

            </h2>

            <p className="section-text">

              O Fayola tira a operação do meio da
              sua arte. Em vez de procurar mensagens,
              referências e comprovantes, você encontra
              cada projeto organizado em um fluxo único.

            </p>

          </Reveal>

          <div className="problem-grid">

            {[
              [
                '01',
                'Mensagens que acumulam',
                '“Quanto fica?” “Tem horário?” “Posso mandar uma referência?”',
              ],
              [
                '02',
                'Orçamentos sem contexto',
                'Tamanho, estilo e local do corpo ficam espalhados em conversas.',
              ],
              [
                '03',
                'Sessões sem confirmação',
                'Você reserva seu tempo antes de saber se o cliente realmente confirmou.',
              ],
            ].map(
              ([n, title, text], index) => (

                <Reveal
                  key={n}
                  delay={index * 0.08}
                >

                  <div className="problem-card">

                    <span className="num">
                      {n}
                    </span>

                    <h3>
                      {title}
                    </h3>

                    <p>
                      {text}
                    </p>

                  </div>

                </Reveal>

              )
            )}

          </div>

        </div>

      </section>

      {/* FLUXO */}

      <section
        id="fluxo"
        className="paper-section"
      >

        <div className="section">

          <Reveal>

            <div className="section-kicker">
              A experiência
            </div>

            <h2 className="section-title">

              Do primeiro pedido ao horário confirmado.

            </h2>

            <p className="section-text">

              O cliente entende o próximo passo.
              Você recebe as informações certas.
              E o estúdio continua funcionando mesmo
              quando você está com a máquina na mão.

            </p>

          </Reveal>

          <div className="flow">

            {[
              [
                '01',
                'Pedido',
                'O cliente descreve a ideia da tattoo.',
              ],
              [
                '02',
                'Referências',
                'Envia imagens, estilo e inspirações.',
              ],
              [
                '03',
                'Projeto',
                'Você define tamanho, local e orçamento.',
              ],
              [
                '04',
                'Sinal',
                'O cliente confirma com PIX.',
              ],
              [
                '05',
                'Sessão',
                'O horário entra na sua agenda.',
              ],
            ].map(
              ([n, title, text], index) => (

                <Reveal
                  key={n}
                  delay={index * 0.06}
                >

                  <div className="flow-card">

                    <div className="flow-number">
                      {n}
                    </div>

                    <h3>
                      {title}
                    </h3>

                    <p>
                      {text}
                    </p>

                    {index < 4 && (
                      <span className="flow-arrow">
                        →
                      </span>
                    )}

                  </div>

                </Reveal>

              )
            )}

          </div>

          {/* ORÇAMENTO */}

          <div className="showcase">

            <Reveal className="showcase-copy">

              <div className="section-kicker">
                Orçamento sem confusão
              </div>

              <h3>
                Seu cliente chega com o projeto mais claro.
              </h3>

              <p>

                Registre centímetros, região do corpo,
                estilo, referências e valor antes de
                transformar o pedido em horário.
                Para projetos personalizados, você
                decide o orçamento.

              </p>

              <div className="showcase-list">

                <div>
                  <b>✓</b>
                  Tamanho em centímetros
                </div>

                <div>
                  <b>✓</b>
                  Local do corpo
                </div>

                <div>
                  <b>✓</b>
                  Estilo e referências
                </div>

                <div>
                  <b>✓</b>
                  Valor e sinal
                </div>

              </div>

            </Reveal>

            <Reveal delay={0.1}>

              <div className="quote-3d">

                <motion.div
                  animate={{
                    y: [0, -7, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="quote-card"
                >

                  <div className="quote-card-top">

                    <span>
                      FAYOLA · PROJETO #0248
                    </span>

                    <span>
                      APROVADO
                    </span>

                  </div>

                  <h4>

                    Blackwork
                    <br />

                    12 cm · Antebraço

                  </h4>

                  <div className="quote-price">

                    <div>

                      <span>
                        ORÇAMENTO
                      </span>

                      <strong>
                        R$ 650,00
                      </strong>

                    </div>

                    <div className="quote-pix">
                      SINAL R$ 195 · PAGO
                    </div>

                  </div>

                </motion.div>

              </div>

            </Reveal>

          </div>

        </div>

      </section>

      {/* RECURSOS */}

      <section
        id="recursos"
        className="dark-section"
      >

        <div className="section">

          <Reveal>

            <div className="section-kicker">
              O estúdio inteiro em um lugar
            </div>

            <h2 className="section-title">

              Não é só uma agenda.
              <br />
              É a operação do seu estúdio.

            </h2>

            <p className="section-text">

              O Fayola conecta atendimento,
              projetos, clientes, profissionais,
              serviços, pagamentos e horários
              em uma experiência única.

            </p>

          </Reveal>

          <div className="feature-grid">

            {[
              [
                '✦',
                'Pedidos de tattoo',
                'Receba as informações do projeto antes da conversa começar.',
              ],
              [
                '◎',
                'Referências',
                'Imagens e inspirações ficam ligadas ao pedido do cliente.',
              ],
              [
                '⌁',
                'Tamanho e local',
                'Registre centímetros e região do corpo.',
              ],
              [
                'R$',
                'Orçamentos',
                'Trabalhe com preços definidos ou projetos personalizados.',
              ],
              [
                '◆',
                'Sinal via PIX',
                'Confirme o compromisso antes de bloquear seu horário.',
              ],
              [
                '◷',
                'Agenda',
                'Veja suas sessões e horários em uma visão limpa.',
              ],
              [
                '↗',
                'WhatsApp',
                'Mantenha o cliente informado sem perder o contexto.',
              ],
              [
                '◌',
                'Equipe',
                'Cada profissional acompanha seus próprios atendimentos.',
              ],
              [
                'F',
                'Gestão',
                'Tenha uma visão organizada do estúdio conforme ele cresce.',
              ],
            ].map(
              ([icon, title, text], index) => (

                <Reveal
                  key={title}
                  delay={(index % 3) * 0.05}
                >

                  <div className="feature-card">

                    <div className="feature-icon">
                      {icon}
                    </div>

                    <h3>
                      {title}
                    </h3>

                    <p>
                      {text}
                    </p>

                  </div>

                </Reveal>

              )
            )}

          </div>

        </div>

      </section>

      {/* PREÇO */}

      <section
        id="preco"
        className="dark-section"
      >

        <div className="price-section">

          <Reveal>

            <div className="section-kicker">
              Comece sem complicar
            </div>

            <h2
              className="section-title"
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >

              Seu estúdio merece
              uma experiência profissional.

            </h2>

          </Reveal>

          <Reveal delay={0.1}>

            <div className="price-card">

              <div className="section-kicker">
                FAYOLA PRO
              </div>

              <div className="price">

                R$ 199,99

                <small>
                  /mês
                </small>

              </div>

              <p
                className="section-text"
                style={{
                  marginTop: 12,
                }}
              >

                Tudo para organizar seus pedidos,
                clientes, projetos, profissionais
                e horários.

              </p>

              <hr />

              <div className="price-list">

                <div>
                  <span>✓</span>
                  Pedidos de tattoo
                </div>

                <div>
                  <span>✓</span>
                  Referências e informações do projeto
                </div>

                <div>
                  <span>✓</span>
                  Orçamentos e serviços
                </div>

                <div>
                  <span>✓</span>
                  Sinal via PIX
                </div>

                <div>
                  <span>✓</span>
                  Agenda por profissional
                </div>

                <div>
                  <span>✓</span>
                  Clientes e atendimentos
                </div>

                <div>
                  <span>✓</span>
                  WhatsApp
                </div>

              </div>

              <a
                href={ASSINAR}
                target="_blank"
                rel="noreferrer"
                className="price-button"
              >
                Quero conhecer o Fayola
              </a>

            </div>

          </Reveal>

        </div>

      </section>

      {/* CTA FINAL */}

      <section className="final-cta">

        <motion.div
          className="final-ring"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className="final-ring two"
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 70,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <div className="final-content">

          <Reveal>

            <div className="section-kicker">
              FAYOLA
            </div>

            <h2>

              Você cuida da{' '}

              <span>
                arte.
              </span>

              <br />

              O Fayola cuida do{' '}

              <span>
                resto.
              </span>

            </h2>

            <p>

              Enquanto você está tatuando,
              o seu atendimento continua andando.
              Pedido, projeto, sinal e agenda —
              tudo organizado.

            </p>

            <div className="hero-actions">

              <a
                href={ASSINAR}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Quero começar ↗
              </a>

              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost"
              >
                Falar com o Fayola
              </a>

            </div>

          </Reveal>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="footer3d">

        <b>
          ✦ FAYOLA
        </b>

        <span>
          Gestão e agendamento para tatuadores e estúdios.
        </span>

        <span>
          © 2026 Fayola
        </span>

      </footer>

    </main>
  );
}