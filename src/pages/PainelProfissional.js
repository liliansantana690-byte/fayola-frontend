import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import { motion, AnimatePresence } from "framer-motion";

import api from "../services/api";


function PainelProfissional({ nome, onLogout }) {

  const [agenda, setAgenda] = useState([]);

  const [comissao, setComissao] = useState({
    total: 0,
    atendimentos: 0,
  });

  const [dataSelecionada, setDataSelecionada] = useState(
    new Date()
  );

  const [modalAberto, setModalAberto] = useState(null);

  const [valorRecebido, setValorRecebido] = useState("");

  const [carregando, setCarregando] = useState(true);


  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };


  const carregarDados = useCallback(
    async function () {

      try {

        setCarregando(true);

        const a = await api.get(
          "/profissionais/minha-agenda",
          { headers }
        );

        const c = await api.get(
          "/profissionais/minha-comissao",
          { headers }
        );

        setAgenda(a.data);

        setComissao(c.data);

      } catch (err) {

        console.error(err);

      } finally {

        setCarregando(false);

      }

    },
    [token]
  );


  useEffect(
    function () {
      carregarDados();
    },
    [carregarDados]
  );


  function mesmoDia(dataHora, data) {

    const d = new Date(dataHora);

    return (
      d.getFullYear() === data.getFullYear() &&
      d.getMonth() === data.getMonth() &&
      d.getDate() === data.getDate()
    );

  }


  const agendaDoDia = agenda
    .filter(function (a) {
      return mesmoDia(
        a.data_hora,
        dataSelecionada
      );
    })
    .sort(function (a, b) {
      return (
        new Date(a.data_hora) -
        new Date(b.data_hora)
      );
    });


  function mudarDia(delta) {

    const nova = new Date(dataSelecionada);

    nova.setDate(
      nova.getDate() + delta
    );

    setDataSelecionada(nova);

  }


  function irParaHoje() {

    setDataSelecionada(new Date());

  }


  function ehHoje() {

    return mesmoDia(
      dataSelecionada.toISOString(),
      new Date()
    );

  }


  function abrirModalConcluir(agendamento) {

    setModalAberto(agendamento);

    setValorRecebido(
      parseFloat(agendamento.preco).toFixed(2)
    );

  }


  async function confirmarConclusao() {

    try {

      await api.patch(
        "/profissionais/agendamentos/" +
          modalAberto.id +
          "/concluir",
        {
          valor_pago_total:
            parseFloat(valorRecebido),
        },
        {
          headers,
        }
      );

      setModalAberto(null);

      carregarDados();

    } catch (err) {

      alert(
        err.response?.data?.erro ||
        "Erro ao concluir atendimento"
      );

    }

  }


  function formatarHora(data_hora) {

    return new Date(
      data_hora
    ).toLocaleTimeString(
      "pt-BR",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );

  }


  function formatarDataTitulo(data) {

    return data.toLocaleDateString(
      "pt-BR",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
      }
    );

  }


  function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem(
      "profissional_id"
    );

    localStorage.removeItem("nome");

    onLogout();

  }


  const totalDia = agendaDoDia.reduce(
    function (total, item) {

      return (
        total +
        parseFloat(item.preco || 0)
      );

    },
    0
  );


  return (

    <div style={styles.container}>

      {/* =====================================================
          FUNDO / AURAS
          ===================================================== */}

      <div style={styles.backgroundGlowOne} />

      <div style={styles.backgroundGlowTwo} />

      <div style={styles.backgroundGrid} />


      <div style={styles.page}>

        {/* =====================================================
            HEADER
            ===================================================== */}

        <motion.header
          style={styles.header}
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >

          <div style={styles.brandArea}>

            <motion.div
              style={styles.logoMark}
              animate={{
                rotate: [0, 8, -8, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ✦
            </motion.div>

            <div>

              <div style={styles.logo}>
                FAYOLA
              </div>

              <div style={styles.subLogo}>
                Painel de {nome}
              </div>

            </div>

          </div>


          <motion.button
            style={styles.btnSair}
            onClick={logout}
            whileHover={{
              y: -2,
              borderColor:
                "rgba(255,106,61,.5)",
              color: "#ff6a3d",
            }}
            whileTap={{
              scale: 0.96,
            }}
          >
            Sair
          </motion.button>

        </motion.header>


        {/* =====================================================
            BOAS VINDAS
            ===================================================== */}

        <motion.section
          style={styles.welcome}
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.1,
            duration: 0.6,
          }}
        >

          <div>

            <div style={styles.sectionLabel}>
              SEU PAINEL
            </div>

            <h1 style={styles.welcomeTitle}>
              Olá,{" "}
              <span>{nome}</span>.
            </h1>

            <p style={styles.welcomeText}>
              Aqui está o resumo dos seus
              atendimentos e da sua agenda.
            </p>

          </div>

        </motion.section>


        {/* =====================================================
            RESUMO
            ===================================================== */}

        <div style={styles.statsGrid}>

          <motion.div
            style={{
              ...styles.statCard,
              ...styles.statCardHighlight,
            }}
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
              duration: 0.6,
            }}
            whileHover={{
              y: -5,
            }}
          >

            <div style={styles.statTop}>
              <span style={styles.statLabel}>
                COMISSÃO ACUMULADA
              </span>

              <span style={styles.statIcon}>
                ✦
              </span>
            </div>

            <div style={styles.statValue}>
              R${" "}
              {parseFloat(
                comissao.total || 0
              ).toFixed(2)}
            </div>

            <div style={styles.statDetail}>
              {comissao.atendimentos} atendimento(s)
              concluído(s)
            </div>

          </motion.div>


          <motion.div
            style={styles.statCard}
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.22,
              duration: 0.6,
            }}
            whileHover={{
              y: -5,
            }}
          >

            <div style={styles.statTop}>
              <span style={styles.statLabel}>
                ATENDIMENTOS HOJE
              </span>

              <span style={styles.statIconSoft}>
                ◷
              </span>
            </div>

            <div style={styles.statValue}>
              {agendaDoDia.length}
            </div>

            <div style={styles.statDetail}>
              agendamento(s) na sua agenda
            </div>

          </motion.div>


          <motion.div
            style={styles.statCard}
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.29,
              duration: 0.6,
            }}
            whileHover={{
              y: -5,
            }}
          >

            <div style={styles.statTop}>
              <span style={styles.statLabel}>
                VALOR DO DIA
              </span>

              <span style={styles.statIconSoft}>
                R$
              </span>
            </div>

            <div style={styles.statValueSmall}>
              R${" "}
              {totalDia.toFixed(2)}
            </div>

            <div style={styles.statDetail}>
              valor dos atendimentos
            </div>

          </motion.div>

        </div>


        {/* =====================================================
            NAVEGAÇÃO DA AGENDA
            ===================================================== */}

        <motion.section
          style={styles.agendaSection}
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.35,
            duration: 0.6,
          }}
        >

          <div style={styles.agendaHeader}>

            <div>

              <div style={styles.sectionLabel}>
                AGENDA
              </div>

              <h2 style={styles.agendaTitle}>
                Seus atendimentos
              </h2>

            </div>

            <div style={styles.agendaStatus}>
              <span style={styles.statusDot} />
              Agenda atualizada
            </div>

          </div>


          <div style={styles.navegacaoDia}>

            <motion.button
              style={styles.btnNav}
              onClick={function () {
                mudarDia(-1);
              }}
              whileHover={{
                x: -3,
                borderColor:
                  "rgba(255,106,61,.4)",
              }}
              whileTap={{
                scale: 0.96,
              }}
            >
              ← Anterior
            </motion.button>


            <div style={styles.diaAtual}>

              <div style={styles.diaTexto}>
                {formatarDataTitulo(
                  dataSelecionada
                )}
              </div>

              {!ehHoje() && (

                <motion.button
                  style={styles.btnHoje}
                  onClick={irParaHoje}
                  whileHover={{
                    color: "#ff8a68",
                  }}
                >
                  Voltar para hoje
                </motion.button>

              )}

            </div>


            <motion.button
              style={styles.btnNav}
              onClick={function () {
                mudarDia(1);
              }}
              whileHover={{
                x: 3,
                borderColor:
                  "rgba(255,106,61,.4)",
              }}
              whileTap={{
                scale: 0.96,
              }}
            >
              Próximo →
            </motion.button>

          </div>


          {/* ===================================================
              LISTA
              =================================================== */}

          <div style={styles.lista}>

            {carregando && (

              <motion.div
                style={styles.vazio}
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
              >

                <div style={styles.loadingIcon}>
                  ✦
                </div>

                <p style={styles.vazioTexto}>
                  Carregando sua agenda...
                </p>

              </motion.div>

            )}


            {!carregando &&
              agendaDoDia.length === 0 && (

                <motion.div
                  style={styles.vazio}
                  initial={{
                    opacity: 0,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                >

                  <div style={styles.emptyIcon}>
                    ◷
                  </div>

                  <p style={styles.vazioTitulo}>
                    Nenhum atendimento
                  </p>

                  <p style={styles.vazioTexto}>
                    Você não possui atendimento
                    agendado para este dia.
                  </p>

                </motion.div>

              )}


            <AnimatePresence>

              {!carregando &&
                agendaDoDia.map(
                  function (a, index) {

                    return (

                      <motion.div
                        key={a.id}
                        style={styles.card}
                        initial={{
                          opacity: 0,
                          y: 20,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -10,
                        }}
                        transition={{
                          delay:
                            index * 0.05,
                        }}
                        whileHover={{
                          y: -3,
                          borderColor:
                            "rgba(255,106,61,.28)",
                          boxShadow:
                            "0 18px 50px rgba(0,0,0,.25)",
                        }}
                      >

                        <div
                          style={
                            styles.horaWrapper
                          }
                        >

                          <div
                            style={
                              styles.horaBadge
                            }
                          >
                            {formatarHora(
                              a.data_hora
                            )}
                          </div>

                        </div>


                        <div style={styles.info}>

                          <p
                            style={
                              styles.clienteNome
                            }
                          >
                            {a.cliente_nome}
                          </p>

                          <p
                            style={
                              styles.detalhePrincipal
                            }
                          >
                            {a.servico}
                          </p>

                          <div
                            style={
                              styles.detailsRow
                            }
                          >

                            <span
                              style={
                                styles.detalhe
                              }
                            >
                              R${" "}
                              {parseFloat(
                                a.preco
                              ).toFixed(2)}
                            </span>

                            <span
                              style={
                                styles.detailSeparator
                              }
                            >
                              •
                            </span>

                            <span
                              style={
                                styles.detalhe
                              }
                            >
                              WhatsApp:{" "}
                              {a.cliente_whatsapp}
                            </span>

                          </div>

                        </div>


                        <div
                          style={
                            styles.actionArea
                          }
                        >

                          {a.status ===
                            "confirmado" && (

                            <motion.button
                              style={
                                styles.btnConcluir
                              }
                              onClick={
                                function () {
                                  abrirModalConcluir(
                                    a
                                  );
                                }
                              }
                              whileHover={{
                                background:
                                  "#ff6a3d",
                                color:
                                  "#0a0a0a",
                                boxShadow:
                                  "0 8px 25px rgba(255,106,61,.18)",
                              }}
                              whileTap={{
                                scale: 0.96,
                              }}
                            >
                              Marcar concluído
                            </motion.button>

                          )}


                          {a.status ===
                            "concluido" && (

                            <div
                              style={
                                styles.badgeConcluido
                              }
                            >

                              <div
                                style={
                                  styles.concluidoTop
                                }
                              >
                                <span
                                  style={
                                    styles.concluidoDot
                                  }
                                />

                                Concluído
                              </div>

                              <p
                                style={
                                  styles.badgeComissao
                                }
                              >
                                Comissão: R${" "}
                                {parseFloat(
                                  a.comissao_valor
                                ).toFixed(2)}
                              </p>

                            </div>

                          )}

                        </div>

                      </motion.div>

                    );

                  }
                )}

            </AnimatePresence>

          </div>

        </motion.section>


        {/* =====================================================
            MODAL
            ===================================================== */}

        <AnimatePresence>

          {modalAberto && (

            <motion.div
              style={styles.modalFundo}
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={function () {
                setModalAberto(null);
              }}
            >

              <motion.div
                style={styles.modalCard}
                initial={{
                  opacity: 0,
                  scale: 0.94,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.94,
                  y: 20,
                }}
                transition={{
                  duration: 0.25,
                }}
                onClick={function (e) {
                  e.stopPropagation();
                }}
              >

                <div
                  style={
                    styles.modalGlow
                  }
                />

                <div
                  style={
                    styles.modalIcon
                  }
                >
                  ✓
                </div>

                <h3
                  style={
                    styles.modalTitulo
                  }
                >
                  Concluir atendimento
                </h3>

                <p
                  style={
                    styles.modalTexto
                  }
                >
                  {modalAberto.cliente_nome}
                  {" · "}
                  {modalAberto.servico}
                </p>

                <label
                  style={
                    styles.label
                  }
                >
                  Valor total recebido (R$)
                </label>

                <input
                  style={styles.input}
                  type="number"
                  step="0.01"
                  value={valorRecebido}
                  onChange={function (e) {
                    setValorRecebido(
                      e.target.value
                    );
                  }}
                  autoFocus
                />

                <div
                  style={
                    styles.modalBotoes
                  }
                >

                  <motion.button
                    style={
                      styles.btnCancelar
                    }
                    onClick={
                      function () {
                        setModalAberto(null);
                      }
                    }
                    whileHover={{
                      borderColor:
                        "rgba(255,255,255,.2)",
                      color: "#fff",
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                  >
                    Cancelar
                  </motion.button>

                  <motion.button
                    style={
                      styles.btnConfirmar
                    }
                    onClick={
                      confirmarConclusao
                    }
                    whileHover={{
                      background:
                        "#ff8a68",
                      boxShadow:
                        "0 10px 30px rgba(255,106,61,.2)",
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                  >
                    Confirmar
                  </motion.button>

                </div>

              </motion.div>

            </motion.div>

          )}

        </AnimatePresence>


        {/* =====================================================
            FOOTER
            ===================================================== */}

        <footer
          style={styles.footer}
        >

          <div
            style={styles.footerLogo}
          >
            <span
              style={
                styles.footerMark
              }
            >
              ✦
            </span>

            FAYOLA
          </div>

          <div
            style={styles.footerText}
          >
            Você cuida da arte.
            <br />
            O Fayola cuida do atendimento.
          </div>

        </footer>

      </div>

    </div>

  );

}


/* =============================================================
   ESTILOS — IDENTIDADE VISUAL FAYOLA
   ============================================================= */

const styles = {

  container: {
    minHeight: "100vh",
    background: "#080808",
    color: "#fff",
    position: "relative",
    overflow: "hidden",
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },


  page: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "32px 28px 50px",
    boxSizing: "border-box",
  },


  backgroundGlowOne: {
    position: "fixed",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,106,61,.10) 0%, rgba(255,106,61,0) 70%)",
    top: "-220px",
    right: "-180px",
    pointerEvents: "none",
    zIndex: 0,
  },


  backgroundGlowTwo: {
    position: "fixed",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,106,61,.055) 0%, rgba(255,106,61,0) 70%)",
    bottom: "-260px",
    left: "-200px",
    pointerEvents: "none",
    zIndex: 0,
  },


  backgroundGrid: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    opacity: 0.18,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    maskImage:
      "linear-gradient(to bottom, black, transparent 90%)",
    WebkitMaskImage:
      "linear-gradient(to bottom, black, transparent 90%)",
    zIndex: 0,
  },


  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "30px",
    borderBottom:
      "1px solid rgba(255,255,255,.07)",
  },


  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },


  logoMark: {
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ff6a3d",
    background:
      "linear-gradient(145deg, rgba(255,106,61,.15), rgba(255,106,61,.035))",
    border:
      "1px solid rgba(255,106,61,.25)",
    boxShadow:
      "0 0 30px rgba(255,106,61,.08)",
    fontSize: "18px",
  },


  logo: {
    fontSize: "17px",
    fontWeight: "800",
    letterSpacing: "4px",
    lineHeight: 1,
  },


  subLogo: {
    color: "#6f6f6f",
    fontSize: "11px",
    marginTop: "6px",
  },


  btnSair: {
    background:
      "rgba(255,255,255,.025)",
    border:
      "1px solid rgba(255,255,255,.08)",
    color: "#777",
    padding: "10px 18px",
    borderRadius: "10px",
    fontSize: "11px",
    cursor: "pointer",
    transition: "all .25s ease",
  },


  welcome: {
    padding:
      "55px 0 32px",
  },


  sectionLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "#ff6a3d",
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "2.5px",
    textTransform: "uppercase",
    marginBottom: "10px",
  },


  welcomeTitle: {
    margin: 0,
    fontSize:
      "clamp(30px, 5vw, 48px)",
    lineHeight: 1.05,
    fontWeight: 600,
    letterSpacing: "-1.8px",
  },


  welcomeTitleSpan: {
    color: "#ff6a3d",
  },


  welcomeText: {
    color: "#777",
    fontSize: "14px",
    lineHeight: 1.7,
    maxWidth: "520px",
    margin:
      "14px 0 0",
  },


  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    marginBottom: "55px",
  },


  statCard: {
    position: "relative",
    overflow: "hidden",
    minHeight: "145px",
    padding: "22px",
    borderRadius: "18px",
    background:
      "linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.018))",
    border:
      "1px solid rgba(255,255,255,.08)",
    boxSizing: "border-box",
    transition:
      "border-color .3s ease, box-shadow .3s ease",
  },


  statCardHighlight: {
    border:
      "1px solid rgba(255,106,61,.30)",
    background:
      "linear-gradient(145deg, rgba(255,106,61,.11), rgba(255,255,255,.018))",
    boxShadow:
      "inset 0 1px rgba(255,255,255,.04), 0 20px 70px rgba(255,106,61,.04)",
  },


  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },


  statLabel: {
    color: "#777",
    fontSize: "9px",
    fontWeight: "700",
    letterSpacing: "1.6px",
  },


  statIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ff6a3d",
    background:
      "rgba(255,106,61,.09)",
    border:
      "1px solid rgba(255,106,61,.16)",
    fontSize: "13px",
  },


  statIconSoft: {
    width: "30px",
    height: "30px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
    background:
      "rgba(255,255,255,.04)",
    border:
      "1px solid rgba(255,255,255,.06)",
    fontSize: "10px",
  },


  statValue: {
    fontSize: "30px",
    fontWeight: "650",
    letterSpacing: "-1px",
    marginTop: "22px",
  },


  statValueSmall: {
    fontSize: "26px",
    fontWeight: "650",
    letterSpacing: "-.7px",
    marginTop: "22px",
  },


  statDetail: {
    color: "#555",
    fontSize: "11px",
    marginTop: "6px",
  },


  agendaSection: {
    marginBottom: "50px",
  },


  agendaHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "20px",
    marginBottom: "25px",
  },


  agendaTitle: {
    margin: 0,
    fontSize: "25px",
    fontWeight: 600,
    letterSpacing: "-.7px",
  },


  agendaStatus: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#555",
    fontSize: "10px",
    letterSpacing: ".3px",
  },


  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#63c174",
    boxShadow:
      "0 0 10px rgba(99,193,116,.6)",
  },


  navegacaoDia: {
    display: "grid",
    gridTemplateColumns:
      "auto minmax(0, 1fr) auto",
    alignItems: "center",
    gap: "14px",
    padding: "14px",
    marginBottom: "18px",
    borderRadius: "16px",
    background:
      "rgba(255,255,255,.025)",
    border:
      "1px solid rgba(255,255,255,.07)",
  },


  btnNav: {
    background:
      "rgba(255,255,255,.025)",
    border:
      "1px solid rgba(255,255,255,.08)",
    color: "#999",
    padding: "10px 14px",
    borderRadius: "9px",
    fontSize: "11px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all .25s ease",
  },


  diaAtual: {
    textAlign: "center",
  },


  diaTexto: {
    color: "#e7e7e7",
    fontSize: "13px",
    fontWeight: "500",
    textTransform: "capitalize",
  },


  btnHoje: {
    background: "none",
    border: "none",
    color: "#ff6a3d",
    fontSize: "10px",
    cursor: "pointer",
    textDecoration: "none",
    padding: "5px 0 0",
  },


  lista: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },


  card: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    minHeight: "92px",
    padding: "15px",
    background:
      "linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.018))",
    border:
      "1px solid rgba(255,255,255,.075)",
    borderRadius: "16px",
    boxSizing: "border-box",
    transition:
      "border-color .25s ease, box-shadow .25s ease",
  },


  horaWrapper: {
    flexShrink: 0,
  },


  horaBadge: {
    minWidth: "62px",
    padding: "12px 9px",
    borderRadius: "11px",
    textAlign: "center",
    boxSizing: "border-box",
    background:
      "linear-gradient(145deg, #ff6a3d, #e85228)",
    color: "#0a0a0a",
    fontSize: "13px",
    fontWeight: "800",
    boxShadow:
      "0 8px 25px rgba(255,106,61,.13)",
  },


  info: {
    flex: 1,
    minWidth: 0,
  },


  clienteNome: {
    color: "#f5f5f5",
    fontSize: "15px",
    fontWeight: "650",
    margin: "0 0 5px",
  },


  detalhePrincipal: {
    color: "#aaa",
    fontSize: "12px",
    margin: "0 0 6px",
  },


  detailsRow: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    flexWrap: "wrap",
  },


  detalhe: {
    color: "#5d5d5d",
    fontSize: "10px",
  },


  detailSeparator: {
    color: "#333",
    fontSize: "9px",
  },


  actionArea: {
    flexShrink: 0,
  },


  btnConcluir: {
    background:
      "rgba(255,106,61,.035)",
    border:
      "1px solid rgba(255,106,61,.38)",
    color: "#ff6a3d",
    padding: "10px 13px",
    borderRadius: "9px",
    fontSize: "10px",
    fontWeight: "650",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition:
      "all .25s ease",
  },


  badgeConcluido: {
    minWidth: "120px",
    textAlign: "right",
  },


  concluidoTop: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "6px",
    color: "#6dc47b",
    fontSize: "11px",
    fontWeight: "650",
  },


  concluidoDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#6dc47b",
    boxShadow:
      "0 0 9px rgba(109,196,123,.45)",
  },


  badgeComissao: {
    color: "#666",
    fontSize: "10px",
    margin: "5px 0 0",
  },


  vazio: {
    textAlign: "center",
    padding: "60px 30px",
    background:
      "linear-gradient(145deg, rgba(255,255,255,.035), rgba(255,255,255,.012))",
    border:
      "1px solid rgba(255,255,255,.07)",
    borderRadius: "18px",
  },


  emptyIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    color: "#ff6a3d",
    background:
      "rgba(255,106,61,.07)",
    border:
      "1px solid rgba(255,106,61,.13)",
    fontSize: "18px",
  },


  loadingIcon: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    color: "#ff6a3d",
    background:
      "rgba(255,106,61,.07)",
    fontSize: "18px",
  },


  vazioTitulo: {
    color: "#ddd",
    fontSize: "14px",
    fontWeight: "600",
    margin: "0 0 5px",
  },


  vazioTexto: {
    color: "#555",
    fontSize: "12px",
    margin: 0,
  },


  modalFundo: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    background:
      "rgba(0,0,0,.78)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter:
      "blur(14px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },


  modalCard: {
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(145deg, #151515, #0d0d0d)",
    border:
      "1px solid rgba(255,255,255,.10)",
    borderRadius: "22px",
    padding: "30px",
    width: "100%",
    maxWidth: "400px",
    boxSizing: "border-box",
    boxShadow:
      "0 30px 100px rgba(0,0,0,.6)",
  },


  modalGlow: {
    position: "absolute",
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,106,61,.12), transparent 70%)",
    top: "-130px",
    right: "-100px",
    pointerEvents: "none",
  },


  modalIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "rgba(255,106,61,.10)",
    border:
      "1px solid rgba(255,106,61,.20)",
    color: "#ff6a3d",
    fontSize: "17px",
    marginBottom: "18px",
  },


  modalTitulo: {
    position: "relative",
    color: "#fff",
    fontSize: "20px",
    margin: "0 0 7px",
    fontWeight: "600",
    letterSpacing: "-.4px",
  },


  modalTexto: {
    position: "relative",
    color: "#777",
    fontSize: "12px",
    margin: "0 0 25px",
  },


  label: {
    display: "block",
    color: "#777",
    fontSize: "9px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1.4px",
    marginBottom: "8px",
  },


  input: {
    width: "100%",
    padding: "14px 15px",
    borderRadius: "11px",
    border:
      "1px solid rgba(255,255,255,.09)",
    background: "#080808",
    color: "#fff",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
    marginBottom: "18px",
  },


  modalBotoes: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "10px",
  },


  btnCancelar: {
    padding: "13px",
    background:
      "rgba(255,255,255,.025)",
    border:
      "1px solid rgba(255,255,255,.08)",
    color: "#777",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "11px",
    transition:
      "all .25s ease",
  },


  btnConfirmar: {
    padding: "13px",
    background: "#ff6a3d",
    border: "none",
    color: "#0a0a0a",
    fontWeight: "800",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "11px",
    transition:
      "all .25s ease",
  },


  footer: {
    marginTop: "80px",
    paddingTop: "25px",
    borderTop:
      "1px solid rgba(255,255,255,.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },


  footerLogo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "3px",
    color: "#777",
  },


  footerMark: {
    color: "#ff6a3d",
    fontSize: "13px",
  },


  footerText: {
    color: "#414141",
    fontSize: "9px",
    lineHeight: 1.7,
    textAlign: "right",
  },

};


export default PainelProfissional;