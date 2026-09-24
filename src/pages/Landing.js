import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './Landing.css';

const WHATSAPP =
  'https://wa.me/5571985119593?text=Quero%20conhecer%20o%20Fayola';

const WHATSAPP_ASSINAR =
  'https://wa.me/5571985119593?text=Quero%20assinar%20o%20Fayola';

/* =========================================================
   NÚMERO ANIMADO
========================================================= */

function AnimatedNumber({ value, suffix = '' }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const duration = 1400;

    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = Math.min(
        (timestamp - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplay(Math.round(value * eased));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

/* =========================================================
   TOKENS DE SERVIÇOS
   Inspirados no efeito de "physical disturbance"
   da referência.
========================================================= */

function ServiceTokens() {
  const tokens = [
    {
      label: 'Cabelo',
      icon: '✦',
      className: 'token-orange',
      factorX: -1,
      factorY: -1,
      rotate: -8,
      duration: 5,
    },
    {
      label: 'Barba',
      icon: '✂',
      className: 'token-violet',
      factorX: 1,
      factorY: -0.7,
      rotate: 7,
      duration: 6,
    },
    {
      label: 'Estética',
      icon: '✧',
      className: 'token-mint',
      factorX: -0.5,
      factorY: 1,
      rotate: 5,
      duration: 5.5,
    },
  ];

  return (
    <div className="token-cluster">
      {tokens.map((token, index) => (
        <motion.div
          key={token.label}
          className={`service-token ${token.className}`}
          animate={{
            x: [
              token.factorX * -15,
              0,
              token.factorX * 15,
              0,
            ],
            y: [
              token.factorY * -10,
              0,
              token.factorY * 10,
              0,
            ],
            rotate: [
              token.rotate - 3,
              token.rotate,
              token.rotate + 3,
              token.rotate,
            ],
          }}
          whileHover={{
            scale: 1.1,
            y: -12,
            zIndex: 20,
          }}
          transition={{
            x: {
              duration: token.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            y: {
              duration: token.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            rotate: {
              duration: token.duration,
              repeat: Infinity,
              ease: 'easeInOut',
            },
            scale: {
              type: 'spring',
              stiffness: 300,
              damping: 16,
            },
          }}
          style={{
            zIndex: index + 1,
          }}
        >
          <span className="token-icon">
            {token.icon}
          </span>

          <span>{token.label}</span>
        </motion.div>
      ))}

      <motion.div
        className="token-center"
        animate={{
          y: [0, -5, 0],
          rotate: [0, 2, 0, -2, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        F
      </motion.div>
    </div>
  );
}

/* =========================================================
   NOTIFICAÇÃO FLUTUANTE
========================================================= */

function FloatingNotification({
  children,
  className = '',
  delay = 0,
}) {
  return (
    <motion.div
      className={`floating-notification ${className}`}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: [0, -8, 0],
      }}
      transition={{
        opacity: {
          duration: 0.7,
          delay,
        },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   LANDING
========================================================= */

function Landing() {
  return (
    <main className="fayola-page">

      {/* =====================================================
          AURAS DE FUNDO
      ====================================================== */}

      <div className="background-aura aura-one" />
      <div className="background-aura aura-two" />
      <div className="background-aura aura-three" />

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="fayola-nav">

        <a href="/" className="fayola-logo">
          <span className="logo-mark">F</span>
          <span>FAYOLA</span>
        </a>

        <nav className="desktop-nav">
          <a href="#recursos">
            Recursos
          </a>

          <a href="#como-funciona">
            Como funciona
          </a>

          <a href="#precos">
            Preços
          </a>
        </nav>

        <div className="nav-actions">

          <a
            href="/login"
            className="nav-login"
          >
            Entrar
          </a>

          <a
            href={WHATSAPP_ASSINAR}
            target="_blank"
            rel="noreferrer"
            className="nav-button"
          >
            Começar agora
          </a>

        </div>

      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="hero-section">

        {/* TEXTO */}

        <div className="hero-copy">

          <motion.div
            className="eyebrow"
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <span className="eyebrow-dot" />

            O jeito simples de organizar seu negócio
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 35,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            Menos confusão.
            <br />

            <span>Mais tempo</span>
            <br />

            para cuidar.
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.25,
            }}
          >
            O Fayola organiza seus agendamentos,
            clientes e horários em um só lugar —
            para você focar no que realmente importa:
            seu trabalho.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.4,
            }}
          >

            <a
              href={WHATSAPP_ASSINAR}
              target="_blank"
              rel="noreferrer"
              className="primary-button"
            >
              Quero conhecer o Fayola
              <span>↗</span>
            </a>

            <a
              href="#como-funciona"
              className="secondary-button"
            >
              Ver como funciona
              <span>↓</span>
            </a>

          </motion.div>

          <motion.div
            className="hero-trust"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.65,
            }}
          >

            <div className="avatars">
              <span>J</span>
              <span>M</span>
              <span>A</span>
              <span>+</span>
            </div>

            <div>
              <strong>
                Feito para profissionais
              </strong>

              <small>
                que valorizam seu tempo
              </small>
            </div>

          </motion.div>

        </div>

        {/* =================================================
            VISUAL DO HERO
        ================================================== */}

        <motion.div
          className="hero-visual"
          initial={{
            opacity: 0,
            scale: 0.92,
            y: 25,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >

          <div className="hero-orbit orbit-one" />

          <div className="hero-orbit orbit-two" />

          <div className="hero-orbit orbit-three" />

          {/* TOKENS */}

          <ServiceTokens />

          {/* =================================================
              CELULAR
          ================================================== */}

          <motion.div
            className="phone"
            animate={{
              y: [0, -10, 0],
              rotate: [
                0,
                1,
                0,
                -1,
                0,
              ],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >

            <div className="phone-notch" />

            <div className="phone-screen">

              {/* HEADER */}

              <div className="phone-header">

                <div>
                  <span>Olá, Camila</span>

                  <strong>
                    Seu dia
                  </strong>
                </div>

                <div className="profile-circle">
                  C
                </div>

              </div>

              {/* DATA */}

              <div className="date-row">

                <button type="button">
                  ‹
                </button>

                <strong>
                  Quarta, 24
                </strong>

                <button type="button">
                  ›
                </button>

              </div>

              {/* CALENDÁRIO */}

              <div className="calendar-strip">

                <div>
                  <small>SEG</small>
                  <span>22</span>
                </div>

                <div>
                  <small>TER</small>
                  <span>23</span>
                </div>

                <div className="active-day">
                  <small>QUA</small>
                  <span>24</span>
                </div>

                <div>
                  <small>QUI</small>
                  <span>25</span>
                </div>

                <div>
                  <small>SEX</small>
                  <span>26</span>
                </div>

              </div>

              {/* AGENDA */}

              <div className="agenda">

                <div className="agenda-item">

                  <span className="agenda-time">
                    09:00
                  </span>

                  <div className="appointment appointment-orange">
                    <strong>
                      Mariana Costa
                    </strong>

                    <small>
                      Corte + Escova
                    </small>
                  </div>

                </div>

                <div className="agenda-item">

                  <span className="agenda-time">
                    10:30
                  </span>

                  <div className="appointment appointment-violet">
                    <strong>
                      Juliana Alves
                    </strong>

                    <small>
                      Coloração
                    </small>
                  </div>

                </div>

                <div className="agenda-item">

                  <span className="agenda-time">
                    13:00
                  </span>

                  <div className="appointment appointment-mint">
                    <strong>
                      Paula Santos
                    </strong>

                    <small>
                      Manicure
                    </small>
                  </div>

                </div>

                <div className="agenda-item">

                  <span className="agenda-time">
                    15:30
                  </span>

                  <div className="appointment appointment-rose">
                    <strong>
                      Beatriz Lima
                    </strong>

                    <small>
                      Design de sobrancelha
                    </small>
                  </div>

                </div>

              </div>

              <button
                type="button"
                className="phone-add"
              >
                +
              </button>

            </div>

          </motion.div>

          {/* =================================================
              NOTIFICAÇÕES
          ================================================== */}

          <FloatingNotification
            className="notification-top"
            delay={0.7}
          >

            <div className="notification-icon notification-green">
              ✓
            </div>

            <div>
              <strong>
                Novo agendamento
              </strong>

              <span>
                Mariana confirmou
              </span>
            </div>

          </FloatingNotification>

          <FloatingNotification
            className="notification-bottom"
            delay={1.1}
          >

            <div className="notification-icon notification-orange">
              ↗
            </div>

            <div>
              <strong>
                Agenda organizada
              </strong>

              <span>
                4 horários hoje
              </span>
            </div>

          </FloatingNotification>

        </motion.div>

      </section>

      {/* =====================================================
          ESTATÍSTICAS
      ====================================================== */}

      <section className="stats-section">

        <div className="stats-intro">

          <span>
            FAYOLA
          </span>

          <p>
            Tudo que você precisa para deixar
            sua agenda trabalhar por você.
          </p>

        </div>

        <div className="stat">

          <strong>
            <AnimatedNumber
              value={100}
              suffix="%"
            />
          </strong>

          <span>
            agenda centralizada
          </span>

        </div>

        <div className="stat">

          <strong>
            <AnimatedNumber
              value={24}
              suffix="h"
            />
          </strong>

          <span>
            acesso aos seus horários
          </span>

        </div>

        <div className="stat">

          <strong>
            <AnimatedNumber
              value={0}
              suffix=""
            />
          </strong>

          <span>
            papel para controlar sua agenda
          </span>

        </div>

      </section>

      {/* =====================================================
          COMO FUNCIONA
      ====================================================== */}

      <section
        className="features-section"
        id="como-funciona"
      >

        <div className="section-heading">

          <motion.span
            className="section-label"
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >
            COMO FUNCIONA
          </motion.span>

          <motion.h2
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.1,
            }}
          >
            Seu negócio organizado
            <br />
            <em>
              sem complicação.
            </em>
          </motion.h2>

        </div>

        <div className="feature-grid">

          {/* CARD 01 */}

          <motion.article
            className="feature-card feature-card-dark"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
          >

            <div className="feature-number">
              01
            </div>

            <div className="feature-icon">
              ✦
            </div>

            <h3>
              Agendamento
              <br />
              Online.
            </h3>

            <p>
              Link exclusivo para seus clientes agendarem
              a qualquer hora, pelo celular.
            </p>

          </motion.article>

          {/* CARD 02 */}

          <motion.article
            className="feature-card feature-card-orange"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.1,
            }}
          >

            <div className="feature-number">
              02
            </div>

            <div className="feature-icon">
              +
            </div>

            <h3>
              Notificação
              <br />
              WhatsApp.
            </h3>

            <p>
              Confirmação automática e lembrete antes do horário
              pra reduzir faltas.
            </p>

          </motion.article>

          {/* CARD 03 */}

          <motion.article
            className="feature-card feature-card-violet"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.2,
            }}
          >

            <div className="feature-number">
              03
            </div>

            <div className="feature-icon">
              ✓
            </div>

            <h3>
              Agenda
              <br />
              do Dia.
            </h3>

            <p>
              Visualize todos os agendamentos do dia
              em tempo real no painel.
            </p>

          </motion.article>

          {/* CARD 04 */}

          <motion.article
            className="feature-card feature-card-dark"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.3,
            }}
          >

            <div className="feature-number">
              04
            </div>

            <div className="feature-icon">
              ✦
            </div>

            <h3>
              Gestão de
              <br />
              Serviços.
            </h3>

            <p>
              Cadastre serviços com duração, preço e comissão.
              Edite quando quiser.
            </p>

          </motion.article>

          {/* CARD 05 */}

          <motion.article
            className="feature-card feature-card-orange"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.4,
            }}
          >

            <div className="feature-number">
              05
            </div>

            <div className="feature-icon">
              +
            </div>

            <h3>
              Gestão de
              <br />
              Equipe.
            </h3>

            <p>
              Adicione profissionais com login próprio
              pra cada um.
            </p>

          </motion.article>

          {/* CARD 06 */}

          <motion.article
            className="feature-card feature-card-violet"
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.5,
            }}
          >

            <div className="feature-number">
              06
            </div>

            <div className="feature-icon">
              ✓
            </div>

            <h3>
              Sinal via
              <br />
              PIX.
            </h3>

            <p>
              Reduza faltas cobrando um sinal automático
              na hora do agendamento.
            </p>

          </motion.article>

        </div>

      </section>

      {/* =====================================================
          CTA
      ====================================================== */}

      <section
        className="cta-section"
        id="recursos"
      >

        <div className="cta-aura" />

        <motion.div
          className="cta-content"
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
        >

          <span className="section-label">
            PRONTO PARA COMEÇAR?
          </span>

          <h2>
            Sua agenda merece
            <br />
            <span>
              menos bagunça.
            </span>
          </h2>

          <p>
            Deixe o Fayola cuidar da organização
            enquanto você cuida dos seus clientes.
          </p>

          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="cta-button"
          >
            Falar com a gente no WhatsApp
            <span>↗</span>
          </a>

        </motion.div>

      </section>

      {/* =====================================================
          PREÇOS
      ====================================================== */}

      <section
        className="pricing-section"
        id="precos"
      >

        <div className="section-heading">

          <span className="section-label">
            SIMPLES ASSIM
          </span>

          <h2>
            Comece pelo próximo
            <br />
            <em>
              agendamento.
            </em>
          </h2>

        </div>

        <div className="pricing-card">

          <div>

            <span className="pricing-label">
              PLANO FAYOLA
            </span>

            <h3>
              Tudo para organizar
              <br />
              sua rotina.
            </h3>

            <p>
              Uma solução simples para profissionais
              que querem ter controle da própria agenda.
            </p>

          </div>

          <div className="pricing-right">

            <div className="price">

              <small>
                R$
              </small>

              79.99

              <span>
                /mês
              </span>

            </div>

            <a
              href={WHATSAPP_ASSINAR}
              target="_blank"
              rel="noreferrer"
              className="pricing-button"
            >
              Assinar agora
              <span>↗</span>
            </a>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="fayola-footer">

        <div className="footer-brand">

          <div className="fayola-logo">

            <span className="logo-mark">
              F
            </span>

            <span>
              FAYOLA
            </span>

          </div>

          <p>
            Sistema de agendamento para salões,
            barbearias e estéticas.
          </p>

        </div>

        <div className="footer-links">

          <a href="#recursos">
            Recursos
          </a>

          <a href="#como-funciona">
            Como funciona
          </a>

          <a href="#precos">
            Preços
          </a>

          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>

        </div>

        <div className="footer-bottom">

          <span>
            © 2026 Fayola. Todos os direitos reservados.
          </span>

          <span>
            Feito para quem cuida.
          </span>

        </div>

      </footer>

    </main>
  );
}

export default Landing;