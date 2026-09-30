import React, {
    useState,
    useEffect,
    useCallback
} from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import api from '../services/api';

function PainelProfissional({ nome, onLogout }) {

    const [agenda, setAgenda] = useState([]);
    const [comissao, setComissao] = useState({
        total: 0,
        atendimentos: 0
    });

    const [dataSelecionada, setDataSelecionada] = useState(
        new Date()
    );

    const [modalAberto, setModalAberto] = useState(null);
    const [valorRecebido, setValorRecebido] = useState('');

    const token = localStorage.getItem('token');

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const carregarDados = useCallback(async function() {

        try {

            const a = await api.get(
                '/profissionais/minha-agenda',
                { headers }
            );

            const c = await api.get(
                '/profissionais/minha-comissao',
                { headers }
            );

            setAgenda(a.data);
            setComissao(c.data);

        } catch (err) {

            console.error(err);

        }

    }, [token]);

    useEffect(function() {

        carregarDados();

    }, [carregarDados]);

    function mesmoDia(dataHora, data) {

        const d = new Date(dataHora);

        return (
            d.getFullYear() === data.getFullYear() &&
            d.getMonth() === data.getMonth() &&
            d.getDate() === data.getDate()
        );

    }

    const agendaDoDia = agenda
        .filter(function(a) {

            return mesmoDia(
                a.data_hora,
                dataSelecionada
            );

        })
        .sort(function(a, b) {

            return (
                new Date(a.data_hora) -
                new Date(b.data_hora)
            );

        });

    function mudarDia(delta) {

        const nova = new Date(
            dataSelecionada
        );

        nova.setDate(
            nova.getDate() + delta
        );

        setDataSelecionada(nova);

    }

    function irParaHoje() {

        setDataSelecionada(
            new Date()
        );

    }

    function ehHoje() {

        return mesmoDia(
            dataSelecionada.toISOString(),
            new Date()
        );

    }

    function abrirModalConcluir(agendamento) {

        setModalAberto(
            agendamento
        );

        setValorRecebido(
            parseFloat(
                agendamento.preco
            ).toFixed(2)
        );

    }

    async function confirmarConclusao() {

        try {

            await api.patch(
                '/profissionais/agendamentos/' +
                modalAberto.id +
                '/concluir',
                {
                    valor_pago_total:
                        parseFloat(valorRecebido)
                },
                {
                    headers
                }
            );

            setModalAberto(null);

            carregarDados();

        } catch (err) {

            alert(
                err.response?.data?.erro ||
                'Erro ao concluir atendimento'
            );

        }

    }

    function formatarHora(data_hora) {

        return new Date(
            data_hora
        ).toLocaleTimeString(
            'pt-BR',
            {
                hour: '2-digit',
                minute: '2-digit'
            }
        );

    }

    function formatarDataTitulo(data) {

        return data.toLocaleDateString(
            'pt-BR',
            {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
            }
        );

    }

    function logout() {

        localStorage.removeItem(
            'token'
        );

        localStorage.removeItem(
            'profissional_id'
        );

        localStorage.removeItem(
            'nome'
        );

        onLogout();

    }

    return (

        <div style={styles.container}>

            {/* =====================================================
                BACKGROUND
            ===================================================== */}

            <div style={styles.backgroundGlow} />
            <div style={styles.backgroundGlowTwo} />

            <div style={styles.page}>

                {/* =================================================
                    HEADER
                ================================================= */}

                <motion.header
                    initial={{
                        opacity: 0,
                        y: -20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        duration: 0.6,
                        ease: 'easeOut'
                    }}
                    style={styles.header}
                >

                    <div>

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.8
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1
                            }}
                            transition={{
                                delay: 0.15,
                                duration: 0.5
                            }}
                            style={styles.logoMark}
                        >
                            ✦
                        </motion.div>

                        <div style={styles.logo}>
                            FAYOLA
                        </div>

                        <div style={styles.logoLine} />

                        <p style={styles.subLogo}>
                            Painel do profissional
                        </p>

                    </div>

                    <motion.button
                        whileHover={{
                            borderColor:
                                'rgba(255,106,61,.55)',
                            color: '#ff6a3d'
                        }}
                        whileTap={{
                            scale: 0.96
                        }}
                        onClick={logout}
                        style={styles.btnSair}
                    >
                        Sair
                    </motion.button>

                </motion.header>


                {/* =================================================
                    BOAS-VINDAS
                ================================================= */}

                <motion.section
                    initial={{
                        opacity: 0,
                        y: 25
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        delay: 0.15,
                        duration: 0.7
                    }}
                    style={styles.welcome}
                >

                    <div style={styles.sectionLabel}>
                        ÁREA DO PROFISSIONAL
                    </div>

                    <h1 style={styles.welcomeTitle}>
                        Olá,{' '}
                        <span>
                            {nome}
                        </span>.
                    </h1>

                    <p style={styles.welcomeText}>
                        Sua agenda, seus atendimentos
                        e suas comissões em um só lugar.
                    </p>

                </motion.section>


                {/* =================================================
                    COMISSÃO
                ================================================= */}

                <motion.section
                    initial={{
                        opacity: 0,
                        y: 30
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        delay: 0.25,
                        duration: 0.7
                    }}
                    whileHover={{
                        y: -3
                    }}
                    style={styles.comissaoCard}
                >

                    <div style={styles.comissaoGlow} />

                    <div style={styles.comissaoConteudo}>

                        <div>

                            <p style={styles.comissaoLabel}>
                                COMISSÃO ACUMULADA
                            </p>

                            <p style={styles.comissaoValor}>
                                R$ {parseFloat(
                                    comissao.total || 0
                                ).toFixed(2)}
                            </p>

                            <p style={styles.comissaoDetalhe}>
                                {comissao.atendimentos || 0}
                                {' '}
                                atendimento(s)
                                {' '}
                                concluído(s)
                            </p>

                        </div>

                        <div style={styles.comissaoIcon}>
                            R$
                        </div>

                    </div>

                </motion.section>


                {/* =================================================
                    NAVEGAÇÃO DA AGENDA
                ================================================= */}

                <motion.section
                    initial={{
                        opacity: 0,
                        y: 25
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        delay: 0.35,
                        duration: 0.6
                    }}
                    style={styles.agendaHeader}
                >

                    <div>

                        <div style={styles.sectionLabel}>
                            MINHA AGENDA
                        </div>

                        <h2 style={styles.agendaTitulo}>
                            {formatarDataTitulo(
                                dataSelecionada
                            )}
                        </h2>

                    </div>

                    {!ehHoje() && (

                        <motion.button
                            whileHover={{
                                color: '#ff6a3d'
                            }}
                            whileTap={{
                                scale: 0.96
                            }}
                            onClick={irParaHoje}
                            style={styles.btnHoje}
                        >
                            Voltar para hoje
                        </motion.button>

                    )}

                </motion.section>


                {/* =================================================
                    CONTROLES DE DATA
                ================================================= */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    transition={{
                        delay: 0.42,
                        duration: 0.6
                    }}
                    style={styles.navegacaoDia}
                >

                    <motion.button
                        whileHover={{
                            x: -3,
                            borderColor:
                                'rgba(255,106,61,.45)'
                        }}
                        whileTap={{
                            scale: 0.96
                        }}
                        onClick={function() {
                            mudarDia(-1);
                        }}
                        style={styles.btnNav}
                    >
                        ←
                    </motion.button>

                    <div style={styles.dataCentro}>

                        <span style={styles.dataNumero}>
                            {dataSelecionada.getDate()}
                        </span>

                        <span style={styles.dataMes}>
                            {dataSelecionada.toLocaleDateString(
                                'pt-BR',
                                {
                                    month: 'long'
                                }
                            )}
                        </span>

                    </div>

                    <motion.button
                        whileHover={{
                            x: 3,
                            borderColor:
                                'rgba(255,106,61,.45)'
                        }}
                        whileTap={{
                            scale: 0.96
                        }}
                        onClick={function() {
                            mudarDia(1);
                        }}
                        style={styles.btnNav}
                    >
                        →
                    </motion.button>

                </motion.div>


                {/* =================================================
                    AGENDA
                ================================================= */}

                <div style={styles.lista}>

                    <AnimatePresence mode="popLayout">

                        {agendaDoDia.length === 0 && (

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    scale: 0.97
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1
                                }}
                                exit={{
                                    opacity: 0
                                }}
                                style={styles.vazio}
                            >

                                <div style={styles.vazioIcon}>
                                    ✦
                                </div>

                                <p style={styles.vazioTitulo}>
                                    Agenda tranquila.
                                </p>

                                <p style={styles.vazioTexto}>
                                    Nenhum atendimento
                                    neste dia.
                                </p>

                            </motion.div>

                        )}


                        {agendaDoDia.map(function(a, index) {

                            return (

                                <motion.div
                                    key={a.id}
                                    layout
                                    initial={{
                                        opacity: 0,
                                        y: 25
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    exit={{
                                        opacity: 0,
                                        y: -15
                                    }}
                                    transition={{
                                        delay:
                                            index * 0.06,
                                        duration: 0.5
                                    }}
                                    whileHover={{
                                        y: -2,
                                        borderColor:
                                            'rgba(255,106,61,.28)'
                                    }}
                                    style={styles.card}
                                >

                                    <div style={styles.horaArea}>

                                        <div style={styles.horaLinha} />

                                        <div style={styles.horaBadge}>
                                            {formatarHora(
                                                a.data_hora
                                            )}
                                        </div>

                                    </div>


                                    <div style={styles.info}>

                                        <p style={styles.clienteNome}>
                                            {a.cliente_nome}
                                        </p>

                                        <p style={styles.detalhe}>
                                            {a.servico}
                                        </p>

                                        <p style={styles.detalhe}>
                                            WhatsApp: {a.cliente_whatsapp}
                                        </p>

                                        <p style={styles.preco}>
                                            R$ {parseFloat(
                                                a.preco || 0
                                            ).toFixed(2)}
                                        </p>

                                    </div>


                                    {a.status === 'confirmado' && (

                                        <motion.button
                                            whileHover={{
                                                background:
                                                    '#ff6a3d',
                                                color: '#0a0a0a',
                                                boxShadow:
                                                    '0 0 25px rgba(255,106,61,.20)'
                                            }}
                                            whileTap={{
                                                scale: 0.95
                                            }}
                                            onClick={function() {
                                                abrirModalConcluir(a);
                                            }}
                                            style={styles.btnConcluir}
                                        >
                                            Concluir
                                        </motion.button>

                                    )}


                                    {a.status === 'concluido' && (

                                        <div style={styles.badgeConcluido}>

                                            <div style={styles.check}>
                                                ✓
                                            </div>

                                            <p style={styles.badgeConcluidoTexto}>
                                                Concluído
                                            </p>

                                            <p style={styles.badgeComissao}>
                                                Comissão:
                                                {' '}
                                                R$ {parseFloat(
                                                    a.comissao_valor || 0
                                                ).toFixed(2)}
                                            </p>

                                        </div>

                                    )}

                                </motion.div>

                            );

                        })}

                    </AnimatePresence>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <motion.footer
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    transition={{
                        delay: 0.7,
                        duration: 0.8
                    }}
                    style={styles.footer}
                >

                    <div style={styles.footerLogo}>
                        ✦ FAYOLA
                    </div>

                    <p>
                        Você cuida da arte.
                        <br />
                        O Fayola cuida do atendimento.
                    </p>

                </motion.footer>

            </div>


            {/* =====================================================
                MODAL
            ===================================================== */}

            <AnimatePresence>

                {modalAberto && (

                    <motion.div
                        initial={{
                            opacity: 0
                        }}
                        animate={{
                            opacity: 1
                        }}
                        exit={{
                            opacity: 0
                        }}
                        style={styles.modalFundo}
                        onClick={function(e) {

                            if (
                                e.target === e.currentTarget
                            ) {
                                setModalAberto(null);
                            }

                        }}
                    >

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 35,
                                scale: 0.96
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: 1
                            }}
                            exit={{
                                opacity: 0,
                                y: 20,
                                scale: 0.97
                            }}
                            transition={{
                                duration: 0.35
                            }}
                            style={styles.modalCard}
                        >

                            <div style={styles.modalTop}>

                                <div>

                                    <div style={styles.sectionLabel}>
                                        FINALIZAR ATENDIMENTO
                                    </div>

                                    <h3 style={styles.modalTitulo}>
                                        Concluir atendimento
                                    </h3>

                                </div>

                                <button
                                    onClick={function() {
                                        setModalAberto(null);
                                    }}
                                    style={styles.modalFechar}
                                >
                                    ×
                                </button>

                            </div>


                            <p style={styles.modalTexto}>
                                {modalAberto.cliente_nome}
                                {' · '}
                                {modalAberto.servico}
                            </p>


                            <label style={styles.label}>
                                VALOR TOTAL RECEBIDO
                            </label>

                            <div style={styles.inputWrapper}>

                                <span style={styles.inputPrefix}>
                                    R$
                                </span>

                                <input
                                    style={styles.input}
                                    type="number"
                                    step="0.01"
                                    value={valorRecebido}
                                    onChange={function(e) {
                                        setValorRecebido(
                                            e.target.value
                                        );
                                    }}
                                />

                            </div>


                            <div style={styles.modalBotoes}>

                                <motion.button
                                    whileHover={{
                                        borderColor:
                                            'rgba(255,255,255,.18)'
                                    }}
                                    whileTap={{
                                        scale: 0.97
                                    }}
                                    style={styles.btnCancelar}
                                    onClick={function() {
                                        setModalAberto(null);
                                    }}
                                >
                                    Cancelar
                                </motion.button>


                                <motion.button
                                    whileHover={{
                                        boxShadow:
                                            '0 0 35px rgba(255,106,61,.25)'
                                    }}
                                    whileTap={{
                                        scale: 0.97
                                    }}
                                    style={styles.btnConfirmar}
                                    onClick={confirmarConclusao}
                                >
                                    Confirmar
                                    <span>→</span>
                                </motion.button>

                            </div>

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>

        </div>

    );

}


const styles = {

    container: {
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        fontFamily:
            'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'relative',
        overflow: 'hidden'
    },

    backgroundGlow: {
        position: 'fixed',
        width: '500px',
        height: '500px',
        top: '-260px',
        right: '-180px',
        borderRadius: '50%',
        background:
            'radial-gradient(circle, rgba(255,106,61,.12) 0%, rgba(255,106,61,0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
    },

    backgroundGlowTwo: {
        position: 'fixed',
        width: '450px',
        height: '450px',
        bottom: '-250px',
        left: '-200px',
        borderRadius: '50%',
        background:
            'radial-gradient(circle, rgba(255,106,61,.07) 0%, rgba(255,106,61,0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
    },

    page: {
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '920px',
        margin: '0 auto',
        padding: '34px 22px 60px',
        boxSizing: 'border-box'
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '65px'
    },

    logoMark: {
        color: '#ff6a3d',
        fontSize: '20px',
        lineHeight: 1,
        marginBottom: '7px',
        textShadow:
            '0 0 20px rgba(255,106,61,.45)'
    },

    logo: {
        color: '#fff',
        fontSize: '19px',
        fontWeight: '800',
        letterSpacing: '4px',
        lineHeight: 1
    },

    logoLine: {
        width: '32px',
        height: '2px',
        background: '#ff6a3d',
        marginTop: '9px',
        marginBottom: '9px',
        boxShadow:
            '0 0 12px rgba(255,106,61,.35)'
    },

    subLogo: {
        color: '#555',
        fontSize: '11px',
        margin: 0,
        letterSpacing: '.5px'
    },

    btnSair: {
        background: 'rgba(255,255,255,.015)',
        border: '1px solid rgba(255,255,255,.09)',
        color: '#777',
        padding: '9px 17px',
        borderRadius: '999px',
        fontSize: '11px',
        cursor: 'pointer',
        transition: 'all .25s ease'
    },

    welcome: {
        marginBottom: '36px'
    },

    sectionLabel: {
        color: '#ff6a3d',
        fontSize: '9px',
        fontWeight: '700',
        letterSpacing: '2.4px',
        textTransform: 'uppercase',
        marginBottom: '13px'
    },

    welcomeTitle: {
        margin: 0,
        fontSize: 'clamp(34px, 6vw, 54px)',
        lineHeight: 1.02,
        letterSpacing: '-2px',
        fontWeight: '700'
    },

    welcomeTitleSpan: {
        color: '#ff6a3d'
    },

    welcomeText: {
        color: '#666',
        fontSize: '13px',
        lineHeight: 1.7,
        maxWidth: '480px',
        marginTop: '14px',
        marginBottom: 0
    },

    comissaoCard: {
        position: 'relative',
        overflow: 'hidden',
        background:
            'linear-gradient(135deg, rgba(255,106,61,.10), rgba(255,255,255,.025))',
        border:
            '1px solid rgba(255,106,61,.20)',
        borderRadius: '20px',
        padding: '27px',
        marginBottom: '65px',
        boxShadow:
            '0 25px 80px rgba(0,0,0,.28)',
        transition: 'border-color .3s ease'
    },

    comissaoGlow: {
        position: 'absolute',
        width: '240px',
        height: '240px',
        top: '-170px',
        right: '-90px',
        borderRadius: '50%',
        background:
            'radial-gradient(circle, rgba(255,106,61,.18), transparent 68%)',
        pointerEvents: 'none'
    },

    comissaoConteudo: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    comissaoLabel: {
        color: '#ff6a3d',
        fontSize: '9px',
        fontWeight: '700',
        letterSpacing: '2px',
        margin: '0 0 9px'
    },

    comissaoValor: {
        color: '#fff',
        fontSize: '38px',
        fontWeight: '700',
        letterSpacing: '-1.5px',
        margin: 0
    },

    comissaoDetalhe: {
        color: '#666',
        fontSize: '11px',
        margin: '8px 0 0'
    },

    comissaoIcon: {
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border:
            '1px solid rgba(255,106,61,.28)',
        color: '#ff6a3d',
        fontSize: '12px',
        fontWeight: '700',
        boxShadow:
            '0 0 35px rgba(255,106,61,.08)'
    },

    agendaHeader: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '20px'
    },

    agendaTitulo: {
        margin: 0,
        color: '#fff',
        fontSize: 'clamp(20px, 4vw, 27px)',
        fontWeight: '600',
        letterSpacing: '-.6px',
        textTransform: 'capitalize'
    },

    btnHoje: {
        background: 'transparent',
        border: 'none',
        color: '#666',
        fontSize: '11px',
        cursor: 'pointer',
        padding: 0,
        textDecoration: 'underline',
        textUnderlineOffset: '3px'
    },

    navegacaoDia: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        padding:
            '13px 15px',
        background:
            'rgba(255,255,255,.018)',
        border:
            '1px solid rgba(255,255,255,.055)',
        borderRadius: '15px'
    },

    btnNav: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background:
            'rgba(255,255,255,.025)',
        border:
            '1px solid rgba(255,255,255,.08)',
        color: '#888',
        fontSize: '18px',
        cursor: 'pointer',
        transition: 'all .25s ease'
    },

    dataCentro: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '8px'
    },

    dataNumero: {
        color: '#ff6a3d',
        fontSize: '22px',
        fontWeight: '700'
    },

    dataMes: {
        color: '#777',
        fontSize: '11px',
        textTransform: 'capitalize'
    },

    lista: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },

    vazio: {
        textAlign: 'center',
        padding: '60px 25px',
        background:
            'rgba(255,255,255,.018)',
        border:
            '1px solid rgba(255,255,255,.055)',
        borderRadius: '20px'
    },

    vazioIcon: {
        color: '#ff6a3d',
        fontSize: '22px',
        marginBottom: '15px',
        opacity: .75
    },

    vazioTitulo: {
        color: '#ddd',
        fontSize: '15px',
        fontWeight: '600',
        margin: '0 0 7px'
    },

    vazioTexto: {
        color: '#555',
        fontSize: '12px',
        margin: 0
    },

    card: {
        display: 'flex',
        alignItems: 'center',
        gap: '17px',
        background:
            'linear-gradient(135deg, rgba(255,255,255,.035), rgba(255,255,255,.012))',
        border:
            '1px solid rgba(255,255,255,.065)',
        borderRadius: '17px',
        padding: '17px',
        transition:
            'border-color .3s ease, transform .3s ease',
        boxShadow:
            '0 12px 40px rgba(0,0,0,.15)'
    },

    horaArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    },

    horaLinha: {
        width: '2px',
        height: '28px',
        background: '#ff6a3d',
        borderRadius: '10px',
        boxShadow:
            '0 0 12px rgba(255,106,61,.4)'
    },

    horaBadge: {
        color: '#ff6a3d',
        fontSize: '13px',
        fontWeight: '700',
        minWidth: '43px'
    },

    info: {
        flex: 1,
        minWidth: 0
    },

    clienteNome: {
        color: '#fff',
        fontSize: '14px',
        fontWeight: '600',
        margin: '0 0 5px'
    },

    detalhe: {
        color: '#666',
        fontSize: '11px',
        margin: '3px 0'
    },

    preco: {
        color: '#aaa',
        fontSize: '11px',
        margin: '7px 0 0',
        fontWeight: '600'
    },

    btnConcluir: {
        background: 'transparent',
        border:
            '1px solid rgba(255,106,61,.45)',
        color: '#ff6a3d',
        padding: '9px 13px',
        borderRadius: '999px',
        fontSize: '10px',
        fontWeight: '700',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all .25s ease'
    },

    badgeConcluido: {
        textAlign: 'right',
        minWidth: '90px'
    },

    check: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background:
            'rgba(52,211,153,.10)',
        border:
            '1px solid rgba(52,211,153,.25)',
        color: '#34d399',
        fontSize: '11px',
        marginBottom: '5px'
    },

    badgeConcluidoTexto: {
        color: '#34d399',
        fontSize: '10px',
        fontWeight: '700',
        margin: 0,
        letterSpacing: '.5px',
        textTransform: 'uppercase'
    },

    badgeComissao: {
        color: '#555',
        fontSize: '10px',
        margin: '4px 0 0'
    },

    footer: {
        textAlign: 'center',
        paddingTop: '70px',
        color: '#3d3d3d',
        fontSize: '10px',
        lineHeight: 1.7
    },

    footerLogo: {
        color: '#444',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '3px',
        marginBottom: '8px'
    },

    footer p: {
        margin: 0
    },

    modalFundo: {
        position: 'fixed',
        inset: 0,
        background:
            'rgba(0,0,0,.78)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 100
    },

    modalCard: {
        background:
            'linear-gradient(145deg, #151515, #0d0d0d)',
        border:
            '1px solid rgba(255,106,61,.20)',
        borderRadius: '22px',
        padding: '28px',
        width: '100%',
        maxWidth: '410px',
        boxSizing: 'border-box',
        boxShadow:
            '0 30px 100px rgba(0,0,0,.7)'
    },

    modalTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },

    modalFechar: {
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        border:
            '1px solid rgba(255,255,255,.08)',
        background:
            'rgba(255,255,255,.025)',
        color: '#777',
        fontSize: '18px',
        cursor: 'pointer',
        lineHeight: 1
    },

    modalTitulo: {
        color: '#fff',
        fontSize: '23px',
        fontWeight: '600',
        letterSpacing: '-.5px',
        margin: 0
    },

    modalTexto: {
        color: '#666',
        fontSize: '12px',
        margin:
            '13px 0 26px'
    },

    label: {
        display: 'block',
        color: '#777',
        fontSize: '9px',
        fontWeight: '700',
        letterSpacing: '1.8px',
        marginBottom: '8px'
    },

    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        background: '#090909',
        border:
            '1px solid rgba(255,255,255,.09)',
        borderRadius: '12px',
        marginBottom: '22px',
        transition: 'border-color .25s ease'
    },

    inputPrefix: {
        color: '#ff6a3d',
        fontSize: '13px',
        fontWeight: '700',
        paddingLeft: '15px'
    },

    input: {
        width: '100%',
        padding: '14px 15px 14px 8px',
        border: 'none',
        outline: 'none',
        background: 'transparent',
        color: '#fff',
        fontSize: '18px',
        fontWeight: '600',
        boxSizing: 'border-box'
    },

    modalBotoes: {
        display: 'flex',
        gap: '10px'
    },

    btnCancelar: {
        flex: 1,
        padding: '13px',
        background: 'transparent',
        border:
            '1px solid rgba(255,255,255,.08)',
        color: '#777',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '11px',
        transition: 'all .25s ease'
    },

    btnConfirmar: {
        flex: 1,
        padding: '13px',
        background: '#ff6a3d',
        border: 'none',
        color: '#0a0a0a',
        fontWeight: '800',
        borderRadius: '999px',
        cursor: 'pointer',
        fontSize: '11px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        boxShadow:
            '0 0 25px rgba(255,106,61,.12)'
    }

};

export default PainelProfissional;