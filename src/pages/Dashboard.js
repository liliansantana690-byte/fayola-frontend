import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

function Icon({ name, size = 18 }) {
    const common = {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
    };

    const icons = {
        calendar: (
            <svg {...common}>
                <rect x="3" y="4" width="18" height="17" rx="3" />
                <path d="M8 2v4M16 2v4M3 9h18" />
                <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" />
            </svg>
        ),

        clipboard: (
            <svg {...common}>
                <rect x="5" y="4" width="14" height="17" rx="2" />
                <path d="M9 4V2h6v2" />
                <path d="M8 9h8M8 13h8M8 17h5" />
            </svg>
        ),

        sparkle: (
            <svg {...common}>
                <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z" />
                <path d="M19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16z" />
            </svg>
        ),

        users: (
            <svg {...common}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),

        wallet: (
            <svg {...common}>
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 18.5z" />
                <path d="M4 7h15" />
                <path d="M21 11h-5a2 2 0 0 0 0 4h5" />
                <path d="M17 13h.01" />
            </svg>
        ),

        card: (
            <svg {...common}>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 10h18" />
                <path d="M7 15h3" />
            </svg>
        ),

        link: (
            <svg {...common}>
                <path d="M10 13a5 5 0 0 0 7.54.54l2-2a5 5 0 0 0-7.07-7.07l-1.14 1.14" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-2 2a5 5 0 0 0 7.07 7.07l1.14-1.14" />
            </svg>
        ),

        arrow: (
            <svg {...common}>
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
            </svg>
        ),

        check: (
            <svg {...common}>
                <path d="M5 12l4 4L19 6" />
            </svg>
        ),

        warning: (
            <svg {...common}>
                <path d="M12 3L22 20H2L12 3z" />
                <path d="M12 9v5" />
                <path d="M12 17h.01" />
            </svg>
        ),

        copy: (
            <svg {...common}>
                <rect x="9" y="9" width="11" height="11" rx="2" />
                <path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" />
            </svg>
        ),

        trash: (
            <svg {...common}>
                <path d="M4 7h16" />
                <path d="M10 11v6M14 11v6" />
                <path d="M6 7l1 14h10l1-14" />
                <path d="M9 7V4h6v3" />
            </svg>
        ),

        plus: (
            <svg {...common}>
                <path d="M12 5v14M5 12h14" />
            </svg>
        ),

        logout: (
            <svg {...common}>
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
            </svg>
        )
    };

    return icons[name] || icons.sparkle;
}

function Dashboard({ estabelecimento }) {
    const [agendamentos, setAgendamentos] = useState([]);
    const [todosAgendamentos, setTodosAgendamentos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [profissionais, setProfissionais] = useState([]);
    const [comissoes, setComissoes] = useState([]);
    const [mpConectado, setMpConectado] = useState(false);
    const [conectandoMp, setConectandoMp] = useState(false);
    const [aba, setAba] = useState('hoje');
    const [novoServico, setNovoServico] = useState({
        nome: '',
        duracao_minutos: 60,
        preco: '',
        comissao_percentual: ''
    });
    const [novoProfissional, setNovoProfissional] = useState({
        nome: '',
        especialidade: '',
        whatsapp: ''
    });
    const [linkCopiado, setLinkCopiado] = useState(false);
    const [linkProfissionalCopiadoId, setLinkProfissionalCopiadoId] = useState(null);
    const [conviteRecemCriado, setConviteRecemCriado] = useState(null);
    const [pedidosTattoo, setPedidosTattoo] = useState([]);

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const linkAgendamento = `${window.location.origin}/pedido-tattoo?id=${estabelecimento.estabelecimento_id}`;

    const carregarDados = useCallback(async function() {
        try {
            const a = await api.get('/agendamentos/hoje', { headers });
            const todos = await api.get('/agendamentos/todos', { headers });
            const s = await api.get('/servicos/' + estabelecimento.estabelecimento_id);
            const p = await api.get('/profissionais', { headers });
            const c = await api.get('/profissionais/comissoes', { headers });
            const mp = await api.get('/mercadopago/status', { headers });
            const pt = await api.get('/pedidos-tattoo', { headers });

            setAgendamentos(a.data);
            setTodosAgendamentos(todos.data);
            setServicos(s.data);
            setProfissionais(p.data);
            setComissoes(c.data);
            setMpConectado(mp.data.conectado);
            setPedidosTattoo(pt.data);

        } catch (err) {
            console.error(err);
        }
    }, [estabelecimento.estabelecimento_id, token]);

    useEffect(function() {
        carregarDados();
    }, [carregarDados]);

    async function criarServico(e) {
        e.preventDefault();
        await api.post('/servicos', novoServico, { headers });
        setNovoServico({
            nome: '',
            duracao_minutos: 60,
            preco: '',
            comissao_percentual: ''
        });
        carregarDados();
    }

    async function excluirServico(id) {
        if (!window.confirm('Excluir este serviço?')) return;
        await api.delete('/servicos/' + id, { headers });
        carregarDados();
    }

    async function criarProfissional(e) {
        e.preventDefault();

        const resp = await api.post('/profissionais', novoProfissional, { headers });

        setNovoProfissional({
            nome: '',
            especialidade: '',
            whatsapp: ''
        });

        setConviteRecemCriado({
            nome: resp.data.nome,
            link: resp.data.link_convite
        });

        carregarDados();
    }

    async function excluirProfissional(id) {
        if (!window.confirm('Excluir este profissional?')) return;
        await api.delete('/profissionais/' + id, { headers });
        carregarDados();
    }

    async function cancelar(id) {
        await api.patch('/agendamentos/' + id + '/cancelar', {}, { headers });
        carregarDados();
    }

    async function excluirPedidoTattoo(id) {
        if (!window.confirm('Excluir este pedido? Essa ação não pode ser desfeita.')) return;
        try {
            await api.delete('/pedidos-tattoo/' + id, { headers });
            carregarDados();
        } catch (err) {
            alert(err.response?.data?.erro || 'Erro ao excluir pedido.');
        }
    }

    async function conectarMercadoPago() {
        setConectandoMp(true);

        try {
            const resp = await api.get('/mercadopago/conectar', { headers });
            window.location.href = resp.data.url;
        } catch (err) {
            alert('Erro ao gerar conexão com o Mercado Pago. Tente novamente.');
            setConectandoMp(false);
        }
    }

    function copiarLink() {
        navigator.clipboard.writeText(linkAgendamento);
        setLinkCopiado(true);
        setTimeout(function() {
            setLinkCopiado(false);
        }, 2000);
    }

    function copiarLinkProfissional(p, link) {
        navigator.clipboard.writeText(link);
        setLinkProfissionalCopiadoId(p.id);

        setTimeout(function() {
            setLinkProfissionalCopiadoId(null);
        }, 2000);
    }

    function copiarLinkConvite() {
        if (!conviteRecemCriado) return;
        navigator.clipboard.writeText(conviteRecemCriado.link);
    }

    function formatarData(data_hora) {
        return new Date(data_hora).toLocaleDateString('pt-BR');
    }

    function formatarHora(data_hora) {
        return new Date(data_hora).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    const pedidosPagos = pedidosTattoo.filter(function(p) { return p.sinal_status === 'pago'; });
    const totalSinaisRecebidos = pedidosPagos.reduce(function(acc, p) { return acc + parseFloat(p.valor_sinal || 0); }, 0);

    const itensNav = [
        { id: 'hoje', icon: 'calendar', label: 'Agenda' },
        { id: 'tattoo', icon: 'sparkle', label: 'Tattoo' },
        { id: 'agendamentos', icon: 'clipboard', label: 'Agendamentos' },
        { id: 'servicos', icon: 'sparkle', label: 'Serviços' },
        { id: 'profissionais', icon: 'users', label: 'Equipe' },
        { id: 'comissoes', icon: 'wallet', label: 'Comissões' },
        { id: 'pagamentos', icon: 'card', label: 'Pagamentos' },
        { id: 'link', icon: 'link', label: 'Meu Link' }
    ];

    const paginaAnimacao = {
        initial: {
            opacity: 0,
            y: 18
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1]
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: {
                duration: 0.2
            }
        }
    };

    const cardAnimacao = {
        initial: {
            opacity: 0,
            y: 18
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.45
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.backgroundGlowOne} />
            <div style={styles.backgroundGlowTwo} />
            <div style={styles.gridBackground} />

            <motion.aside
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1]
                }}
                style={styles.sidebar}
            >
                <div style={styles.logoArea}>
                    <motion.div
                        animate={{
                            rotate: [0, 8, -8, 0],
                            scale: [1, 1.04, 1]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                        style={styles.logoMark}
                    >
                        <span style={styles.logoMarkInner}>F</span>
                    </motion.div>

                    <h1 style={styles.logo}>FAYOLA</h1>
                    <p style={styles.logoSubtitle}>GESTÃO PARA SEU NEGÓCIO</p>
                </div>

                <nav style={styles.nav}>
                    <p style={styles.navLabel}>MENU</p>

                    {itensNav.map(function(item, index) {
                        const ativo = aba === item.id;

                        return (
                            <motion.button
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: 0.08 + index * 0.045,
                                    duration: 0.3
                                }}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={function() {
                                    setAba(item.id);
                                }}
                                style={ativo ? styles.navItemAtivo : styles.navItem}
                            >
                                {ativo && <motion.div
                                    layoutId="navIndicator"
                                    style={styles.navIndicator}
                                />}

                                <span style={ativo ? styles.navIconAtivo : styles.navIcon}>
                                    <Icon name={item.icon} size={17} />
                                </span>

                                <span style={styles.navText}>{item.label}</span>

                                {item.id === 'pagamentos' && !mpConectado && (
                                    <span style={styles.avisoBolinha}>!</span>
                                )}
                            </motion.button>
                        );
                    })}
                </nav>

                <div style={styles.estabelecimentoInfo}>
                    <div style={styles.profileDot}>
                        {(estabelecimento.nome || 'F').charAt(0).toUpperCase()}
                    </div>

                    <div style={{ minWidth: 0 }}>
                        <p style={styles.estabelecimentoNome}>
                            {estabelecimento.nome}
                        </p>

                        <p style={styles.estabelecimentoSub}>
                            Painel de Gestão
                        </p>
                    </div>
                </div>
            </motion.aside>

            <main style={styles.main}>
                <div style={styles.topBar}>
                    <div>
                        <p style={styles.topEyebrow}>FAYOLA / PAINEL</p>
                        <p style={styles.topDate}>
                            {new Date().toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long'
                            })}
                        </p>
                    </div>

                    <motion.div
                        animate={{
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity
                        }}
                        style={styles.onlineStatus}
                    >
                        <span style={styles.onlineDot} />
                        Sistema online
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    {aba === 'hoje' && (
                        <motion.div
                            key="hoje"
                            variants={paginaAnimacao}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <div style={styles.pageHeader}>
                                <div>
                                    <p style={styles.sectionEyebrow}>VISÃO GERAL</p>
                                    <h2 style={styles.pageTitle}>Agenda do Dia</h2>
                                    <p style={styles.pageSubtitle}>
                                        Acompanhe seus atendimentos de hoje.
                                    </p>
                                </div>

                                <div style={styles.headerGlowLine} />
                            </div>

                            {!mpConectado && (
                                <motion.div
                                    variants={cardAnimacao}
                                    initial="initial"
                                    animate="animate"
                                    style={styles.avisoMpCard}
                                >
                                    <div style={styles.avisoIcon}>
                                        <Icon name="warning" size={21} />
                                    </div>

                                    <div style={styles.avisoMpContent}>
                                        <p style={styles.avisoMpTitulo}>
                                            Mercado Pago ainda não conectado
                                        </p>

                                        <p style={styles.avisoMpTexto}>
                                            Seus clientes não conseguem agendar nem pagar o sinal até você conectar.
                                        </p>
                                    </div>

                                    <motion.button
                                        whileHover={{
                                            scale: 1.03,
                                            boxShadow: '0 0 30px rgba(201,79,36,0.22)'
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        style={styles.botao}
                                        onClick={function() {
                                            setAba('pagamentos');
                                        }}
                                    >
                                        Conectar agora
                                        <Icon name="arrow" size={15} />
                                    </motion.button>
                                </motion.div>
                            )}

                            <div style={styles.statsRow}>
                                <motion.div
                                    variants={cardAnimacao}
                                    initial="initial"
                                    animate="animate"
                                    transition={{ delay: 0.08 }}
                                    whileHover={{ y: -4 }}
                                    style={styles.statCard}
                                >
                                    <div style={styles.statTop}>
                                        <span style={styles.statSmall}>01</span>
                                        <Icon name="calendar" size={18} />
                                    </div>

                                    <p style={styles.statNum}>
                                        {agendamentos.length}
                                    </p>

                                    <p style={styles.statLabel}>
                                        Hoje
                                    </p>
                                </motion.div>

                                <motion.div
                                    variants={cardAnimacao}
                                    initial="initial"
                                    animate="animate"
                                    transition={{ delay: 0.14 }}
                                    whileHover={{ y: -4 }}
                                    style={styles.statCard}
                                >
                                    <div style={styles.statTop}>
                                        <span style={styles.statSmall}>02</span>
                                        <Icon name="wallet" size={18} />
                                    </div>

                                    <p style={styles.statNum}>
                                        R$ {agendamentos
                                            .reduce(function(acc, a) {
                                                return acc + parseFloat(a.preco || 0);
                                            }, 0)
                                            .toFixed(2)}
                                    </p>

                                    <p style={styles.statLabel}>
                                        Receita do dia
                                    </p>
                                </motion.div>

                                <motion.div
                                    variants={cardAnimacao}
                                    initial="initial"
                                    animate="animate"
                                    transition={{ delay: 0.2 }}
                                    whileHover={{ y: -4 }}
                                    style={styles.statCard}
                                >
                                    <div style={styles.statTop}>
                                        <span style={styles.statSmall}>03</span>
                                        <Icon name="clipboard" size={18} />
                                    </div>

                                    <p style={styles.statNum}>
                                        {todosAgendamentos.length}
                                    </p>

                                    <p style={styles.statLabel}>
                                        Total geral
                                    </p>
                                </motion.div>
                            </div>

                            {agendamentos.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={styles.vazio}
                                >
                                    <div style={styles.emptyIcon}>
                                        <Icon name="calendar" size={30} />
                                    </div>

                                    <p style={styles.vazioTexto}>
                                        Nenhum agendamento para hoje
                                    </p>

                                    <p style={styles.emptySubtext}>
                                        Quando houver um atendimento, ele aparecerá aqui.
                                    </p>
                                </motion.div>
                            )}

                            <div>
                                {agendamentos.map(function(a, index) {
                                    return (
                                        <motion.div
                                            key={a.id}
                                            initial={{
                                                opacity: 0,
                                                y: 15
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0
                                            }}
                                            transition={{
                                                delay: index * 0.06
                                            }}
                                            whileHover={{
                                                y: -3,
                                                borderColor: 'rgba(201,79,36,0.35)'
                                            }}
                                            style={styles.agendamentoCard}
                                        >
                                            <div style={styles.horaBadge}>
                                                {formatarHora(a.data_hora)}
                                            </div>

                                            <div style={styles.agendamentoInfo}>
                                                <p style={styles.clienteNome}>
                                                    {a.cliente_nome}
                                                </p>

                                                <p style={styles.agendamentoDetalhe}>
                                                    {a.servico} · {a.profissional}
                                                </p>

                                                <p style={styles.agendamentoDetalhe}>
                                                    {a.cliente_whatsapp} · R$ {parseFloat(a.preco || 0).toFixed(2)}
                                                </p>
                                            </div>

                                            <button
                                                onClick={function() {
                                                    cancelar(a.id);
                                                }}
                                                style={styles.btnCancelar}
                                            >
                                                Cancelar
                                                
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                                        {aba === 'tattoo' && (
                        <motion.div
                            key="tattoo"
                            variants={paginaAnimacao}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <div style={styles.pageHeader}>
                                <div>
                                    <p style={styles.sectionEyebrow}>TATTOO</p>
                                    <h2 style={styles.pageTitle}>Pedidos de tattoo</h2>
                                    <p style={styles.pageSubtitle}>
                                        Sinais recebidos e sessões agendadas.
                                    </p>
                                </div>

                                <div style={styles.headerGlowLine} />
                            </div>

                            <div style={styles.statsRow}>
                                <motion.div variants={cardAnimacao} initial="initial" animate="animate" whileHover={{ y: -4 }} style={styles.statCard}>
                                    <div style={styles.statTop}>
                                        <span style={styles.statSmall}>01</span>
                                        <Icon name="wallet" size={18} />
                                    </div>
                                    <p style={styles.statNum}>R$ {totalSinaisRecebidos.toFixed(2)}</p>
                                    <p style={styles.statLabel}>Sinais recebidos</p>
                                </motion.div>

                                <motion.div variants={cardAnimacao} initial="initial" animate="animate" transition={{ delay: 0.08 }} whileHover={{ y: -4 }} style={styles.statCard}>
                                    <div style={styles.statTop}>
                                        <span style={styles.statSmall}>02</span>
                                        <Icon name="check" size={18} />
                                    </div>
                                    <p style={styles.statNum}>{pedidosPagos.length}</p>
                                    <p style={styles.statLabel}>Sinais pagos</p>
                                </motion.div>

                                <motion.div variants={cardAnimacao} initial="initial" animate="animate" transition={{ delay: 0.16 }} whileHover={{ y: -4 }} style={styles.statCard}>
                                    <div style={styles.statTop}>
                                        <span style={styles.statSmall}>03</span>
                                        <Icon name="clipboard" size={18} />
                                    </div>
                                    <p style={styles.statNum}>{pedidosTattoo.filter(function(p) { return p.status === 'aguardando_orcamento'; }).length}</p>
                                    <p style={styles.statLabel}>Aguardando orçamento</p>
                                </motion.div>
                            </div>

                            {pedidosTattoo.length === 0 && (
                                <div style={styles.vazio}>
                                    <div style={styles.emptyIcon}>
                                        <Icon name="sparkle" size={30} />
                                    </div>
                                    <p style={styles.vazioTexto}>Nenhum pedido de tattoo ainda</p>
                                </div>
                            )}

                            {pedidosTattoo.map(function(p, index) {
                                return (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ y: -3, borderColor: 'rgba(201,79,36,0.35)' }}
                                        style={styles.agendamentoCard}
                                    >
                                        <div style={p.sinal_status === 'pago' ? styles.horaBadge : styles.horaBadgeCancelado}>
                                            {p.data_hora ? formatarHora(p.data_hora) : '--:--'}
                                        </div>

                                        <div style={styles.agendamentoInfo}>
                                            <p style={styles.clienteNome}>{p.cliente_nome}</p>
                                            <p style={styles.agendamentoDetalhe}>
                                                {p.profissional || 'Sem tatuador definido'} · {p.descricao}
                                            </p>
                                            <p style={styles.agendamentoDetalhe}>
                                                Tattoo: R$ {parseFloat(p.valor_tattoo || 0).toFixed(2)} · Sinal: R$ {parseFloat(p.valor_sinal || 0).toFixed(2)}
                                            </p>
                                            <p style={styles.agendamentoDetalhe}>
                                                {p.cliente_whatsapp}{p.data_hora ? ` · ${formatarData(p.data_hora)}` : ''}
                                            </p>
                                        </div>

                                        <p style={p.sinal_status === 'pago' ? styles.statusAtivo : styles.statusPendente}>
                                            {p.sinal_status === 'pago' ? '✓ Sinal pago' : 'Sinal pendente'}
                                        </p>
                                             {p.sinal_status !== 'pago' && (
                                            <button
                                                onClick={function() {
                                                    excluirPedidoTattoo(p.id);
                                                }}
                                                style={styles.btnExcluir}
                                            >
                                                <Icon name="trash" size={13} />
                                                Excluir
                                            </button>
                                        )}

                                    </motion.div>
                                );
                            })}
                    </motion.div>
                    )}

                    {aba === 'agendamentos' && (
                        <motion.div
                            key="agendamentos"
                            variants={paginaAnimacao}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <div style={styles.pageHeader}>
                                <div>
                                    <p style={styles.sectionEyebrow}>HISTÓRICO</p>
                                    <h2 style={styles.pageTitle}>
                                        Todos os Agendamentos
                                    </h2>
                                    <p style={styles.pageSubtitle}>
                                        Histórico completo de agendamentos.
                                    </p>
                                </div>

                                <div style={styles.headerGlowLine} />
                            </div>

                            {todosAgendamentos.length === 0 && (
                                <div style={styles.vazio}>
                                    <div style={styles.emptyIcon}>
                                        <Icon name="clipboard" size={30} />
                                    </div>

                                    <p style={styles.vazioTexto}>
                                        Nenhum agendamento encontrado
                                    </p>
                                </div>
                            )}

                            {todosAgendamentos.map(function(a, index) {
                                return (
                                    <motion.div
                                        key={a.id}
                                        initial={{
                                            opacity: 0,
                                            y: 15
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        transition={{
                                            delay: index * 0.04
                                        }}
                                        whileHover={{
                                            y: -3,
                                            borderColor: 'rgba(201,79,36,0.35)'
                                        }}
                                        style={styles.agendamentoCard}
                                    >
                                        <div
                                            style={
                                                a.status === 'cancelado'
                                                    ? styles.horaBadgeCancelado
                                                    : styles.horaBadge
                                            }
                                        >
                                            {formatarHora(a.data_hora)}
                                        </div>

                                        <div style={styles.agendamentoInfo}>
                                            <p style={styles.clienteNome}>
                                                {a.cliente_nome}
                                            </p>

                                            <p style={styles.agendamentoDetalhe}>
                                                {a.servico} · {a.profissional}
                                            </p>

                                            <p style={styles.agendamentoDetalhe}>
                                                {formatarData(a.data_hora)} · {a.cliente_whatsapp}
                                            </p>

                                            <p style={styles.agendamentoDetalhe}>
                                                R$ {parseFloat(a.preco || 0).toFixed(2)} · Status: {a.status}
                                            </p>
                                        </div>

                                        {a.status === 'confirmado' && (
                                            <button
                                                onClick={function() {
                                                    cancelar(a.id);
                                                }}
                                                style={styles.btnCancelar}
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {aba === 'servicos' && (
                        <motion.div
                            key="servicos"
                            variants={paginaAnimacao}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <div style={styles.pageHeader}>
                                <div>
                                    <p style={styles.sectionEyebrow}>CONFIGURAÇÃO</p>
                                    <h2 style={styles.pageTitle}>Serviços</h2>
                                    <p style={styles.pageSubtitle}>
                                        Gerencie os serviços do seu estabelecimento.
                                    </p>
                                </div>

                                <div style={styles.headerGlowLine} />
                            </div>

                            <motion.div
                                variants={cardAnimacao}
                                initial="initial"
                                animate="animate"
                                style={styles.formCard}
                            >
                                <div style={styles.formHeading}>
                                    <div style={styles.formIcon}>
                                        <Icon name="sparkle" size={19} />
                                    </div>

                                    <div>
                                        <h3 style={styles.formTitle}>
                                            Novo Serviço
                                        </h3>

                                        <p style={styles.formSubtitle}>
                                            Cadastre um novo serviço para seus clientes.
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={criarServico}>
                                    <input
                                        style={styles.input}
                                        placeholder="Nome do serviço"
                                        value={novoServico.nome}
                                        onChange={function(e) {
                                            setNovoServico({
                                                ...novoServico,
                                                nome: e.target.value
                                            });
                                        }}
                                    />

                                    <div style={styles.inputRow}>
                                        <input
                                            style={{
                                                ...styles.input,
                                                flex: 1
                                            }}
                                            placeholder="Duração (min)"
                                            type="number"
                                            value={novoServico.duracao_minutos}
                                            onChange={function(e) {
                                                setNovoServico({
                                                    ...novoServico,
                                                    duracao_minutos: e.target.value
                                                });
                                            }}
                                        />

                                        <input
                                            style={{
                                                ...styles.input,
                                                flex: 1,
                                                marginLeft: '12px'
                                            }}
                                            placeholder="Preço (R$)"
                                            type="number"
                                            value={novoServico.preco}
                                            onChange={function(e) {
                                                setNovoServico({
                                                    ...novoServico,
                                                    preco: e.target.value
                                                });
                                            }}
                                        />
                                    </div>

                                    <input
                                        style={styles.input}
                                        placeholder="Comissão do profissional (%)"
                                        type="number"
                                        step="0.01"
                                        value={novoServico.comissao_percentual}
                                        onChange={function(e) {
                                            setNovoServico({
                                                ...novoServico,
                                                comissao_percentual: e.target.value
                                            });
                                        }}
                                    />

                                    <motion.button
                                        whileHover={{
                                            scale: 1.02,
                                            boxShadow: '0 0 30px rgba(201,79,36,0.25)'
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        style={styles.botao}
                                        type="submit"
                                    >
                                        <Icon name="plus" size={16} />
                                        Adicionar Serviço
                                    </motion.button>
                                </form>
                            </motion.div>

                            <div style={styles.listaGrid}>
                                {servicos.map(function(s, index) {
                                    return (
                                        <motion.div
                                            key={s.id}
                                            initial={{
                                                opacity: 0,
                                                y: 18
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0
                                            }}
                                            transition={{
                                                delay: index * 0.06
                                            }}
                                            whileHover={{
                                                y: -5,
                                                borderColor: 'rgba(201,79,36,0.38)'
                                            }}
                                            style={styles.servicoCard}
                                        >
                                            <div style={styles.servicoIcone}>
                                                <Icon name="sparkle" size={25} />
                                            </div>

                                            <p style={styles.servicoNome}>
                                                {s.nome}
                                            </p>

                                            <p style={styles.servicoDetalhe}>
                                                {s.duracao_minutos} min
                                            </p>

                                            <p style={styles.servicoPreco}>
                                                R$ {parseFloat(s.preco).toFixed(2)}
                                            </p>

                                            <p style={styles.servicoDetalhe}>
                                                Comissão: {parseFloat(s.comissao_percentual || 0).toFixed(0)}%
                                            </p>

                                            <button
                                                onClick={function() {
                                                    excluirServico(s.id);
                                                }}
                                                style={styles.btnExcluir}
                                            >
                                                <Icon name="trash" size={13} />
                                                Excluir
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {aba === 'profissionais' && (
                        <motion.div
                            key="profissionais"
                            variants={paginaAnimacao}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <div style={styles.pageHeader}>
                                <div>
                                    <p style={styles.sectionEyebrow}>EQUIPE</p>
                                    <h2 style={styles.pageTitle}>Equipe</h2>
                                    <p style={styles.pageSubtitle}>
                                        Gerencie os profissionais do seu estabelecimento.
                                    </p>
                                </div>

                                <div style={styles.headerGlowLine} />
                            </div>

                            <motion.div
                                variants={cardAnimacao}
                                initial="initial"
                                animate="animate"
                                style={styles.formCard}
                            >
                                <div style={styles.formHeading}>
                                    <div style={styles.formIcon}>
                                        <Icon name="users" size={19} />
                                    </div>

                                    <div>
                                        <h3 style={styles.formTitle}>
                                            Novo Profissional
                                        </h3>

                                        <p style={styles.formSubtitle}>
                                            Adicione alguém à equipe do seu estabelecimento.
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={criarProfissional}>
                                    <input
                                        style={styles.input}
                                        placeholder="Nome completo"
                                        value={novoProfissional.nome}
                                        onChange={function(e) {
                                            setNovoProfissional({
                                                ...novoProfissional,
                                                nome: e.target.value
                                            });
                                        }}
                                    />

                                    <input
                                        style={styles.input}
                                        placeholder="Especialidade"
                                        value={novoProfissional.especialidade}
                                        onChange={function(e) {
                                            setNovoProfissional({
                                                ...novoProfissional,
                                                especialidade: e.target.value
                                            });
                                        }}
                                    />

                                    <input
                                        style={styles.input}
                                        placeholder="WhatsApp (ex: 71999999999)"
                                        value={novoProfissional.whatsapp}
                                        onChange={function(e) {
                                            setNovoProfissional({
                                                ...novoProfissional,
                                                whatsapp: e.target.value
                                            });
                                        }}
                                    />

                                    <motion.button
                                        whileHover={{
                                            scale: 1.02,
                                            boxShadow: '0 0 30px rgba(201,79,36,0.25)'
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        style={styles.botao}
                                        type="submit"
                                    >
                                        <Icon name="plus" size={16} />
                                        Adicionar Profissional
                                    </motion.button>
                                </form>
                            </motion.div>

                            {conviteRecemCriado && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        y: 15
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0
                                    }}
                                    style={styles.conviteCard}
                                >
                                    <div style={styles.conviteIcon}>
                                        <Icon name="link" size={19} />
                                    </div>

                                    <p style={styles.conviteTitulo}>
                                        Convite gerado para {conviteRecemCriado.nome}
                                    </p>

                                    <p style={styles.conviteTexto}>
                                        Envie este link para ele criar a própria senha e acessar o painel dele:
                                    </p>

                                    <div style={styles.linkBox}>
                                        <p style={styles.linkTexto}>
                                            {conviteRecemCriado.link}
                                        </p>
                                    </div>

                                    <button
                                        style={styles.botao}
                                        onClick={copiarLinkConvite}
                                    >
                                        <Icon name="copy" size={15} />
                                        Copiar link do convite
                                    </button>
                                </motion.div>
                            )}

                            <div style={styles.listaGrid}>
                                {profissionais.map(function(p, index) {
                                    return (
                                        <motion.div
                                            key={p.id}
                                            initial={{
                                                opacity: 0,
                                                y: 18
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0
                                            }}
                                            transition={{
                                                delay: index * 0.06
                                            }}
                                            whileHover={{
                                                y: -5,
                                                borderColor: 'rgba(201,79,36,0.38)'
                                            }}
                                            style={styles.servicoCard}
                                        >
                                            <div style={styles.servicoIcone}>
                                                <Icon name="users" size={25} />
                                            </div>

                                            <p style={styles.servicoNome}>
                                                {p.nome}
                                            </p>

                                            <p style={styles.servicoDetalhe}>
                                                {p.especialidade}
                                            </p>

                                            <p
                                                style={
                                                    p.conta_ativada
                                                        ? styles.statusAtivo
                                                        : styles.statusPendente
                                                }
                                            >
                                                {p.conta_ativada
                                                    ? '● Conta ativa'
                                                    : '○ Convite pendente'}
                                            </p>

                                            {!p.conta_ativada && p.link_convite && (
                                                <button
                                                    onClick={function() {
                                                        copiarLinkProfissional(
                                                            p,
                                                            p.link_convite
                                                        );
                                                    }}
                                                    style={styles.btnLinkProfissional}
                                                >
                                                    <Icon name="link" size={13} />
                                                    {linkProfissionalCopiadoId === p.id
                                                        ? 'Copiado'
                                                        : 'Copiar convite'}
                                                </button>
                                            )}

                                            {p.conta_ativada && (
                                                <button
                                                    onClick={function() {
                                                        copiarLinkProfissional(
                                                            p,
                                                            `${window.location.origin}/painel-profissional/login`
                                                        );
                                                    }}
                                                    style={styles.btnLinkProfissional}
                                                >
                                                    <Icon name="link" size={13} />
                                                    {linkProfissionalCopiadoId === p.id
                                                        ? 'Copiado'
                                                        : 'Link do painel'}
                                                </button>
                                            )}

                                            <button
                                                onClick={function() {
                                                    excluirProfissional(p.id);
                                                }}
                                                style={styles.btnExcluir}
                                            >
                                                <Icon name="trash" size={13} />
                                                Excluir
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {aba === 'comissoes' && (
                        <motion.div
                            key="comissoes"
                            variants={paginaAnimacao}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <div style={styles.pageHeader}>
                                <div>
                                    <p style={styles.sectionEyebrow}>FINANCEIRO</p>
                                    <h2 style={styles.pageTitle}>Comissões</h2>
                                    <p style={styles.pageSubtitle}>
                                        Total acumulado por profissional em atendimentos concluídos.
                                    </p>
                                </div>

                                <div style={styles.headerGlowLine} />
                            </div>

                            <div style={styles.statsRow}>
                                <motion.div
                                    variants={cardAnimacao}
                                    initial="initial"
                                    animate="animate"
                                    whileHover={{ y: -4 }}
                                    style={styles.statCard}
                                >
                                    <div style={styles.statTop}>
                                        <span style={styles.statSmall}>TOTAL</span>
                                        <Icon name="wallet" size={18} />
                                    </div>

                                    <p style={styles.statNum}>
                                        R$ {comissoes
                                            .reduce(function(acc, c) {
                                                return acc + parseFloat(c.comissao_total || 0);
                                            }, 0)
                                            .toFixed(2)}
                                    </p>

                                    <p style={styles.statLabel}>
                                        Total em comissões
                                    </p>
                                </motion.div>
                            </div>

                            {comissoes.length === 0 && (
                                <div style={styles.vazio}>
                                    <div style={styles.emptyIcon}>
                                        <Icon name="wallet" size={30} />
                                    </div>

                                    <p style={styles.vazioTexto}>
                                        Nenhuma comissão registrada ainda
                                    </p>
                                </div>
                            )}

                            {comissoes.map(function(c, index) {
                                return (
                                    <motion.div
                                        key={c.id}
                                        initial={{
                                            opacity: 0,
                                            y: 15
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        transition={{
                                            delay: index * 0.05
                                        }}
                                        whileHover={{
                                            y: -3,
                                            borderColor: 'rgba(201,79,36,0.35)'
                                        }}
                                        style={styles.agendamentoCard}
                                    >
                                        <div style={styles.avatarCircle}>
                                            {(c.nome || 'P').charAt(0).toUpperCase()}
                                        </div>

                                        <div style={styles.agendamentoInfo}>
                                            <p style={styles.clienteNome}>
                                                {c.nome}
                                            </p>

                                            <p style={styles.agendamentoDetalhe}>
                                                {c.especialidade}
                                            </p>

                                            <p style={styles.agendamentoDetalhe}>
                                                {c.atendimentos_concluidos} atendimento(s) concluído(s)
                                            </p>
                                        </div>

                                        <p style={styles.comissaoValorGrande}>
                                            R$ {parseFloat(c.comissao_total).toFixed(2)}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {aba === 'pagamentos' && (
                        <motion.div
                            key="pagamentos"
                            variants={paginaAnimacao}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <div style={styles.pageHeader}>
                                <div>
                                    <p style={styles.sectionEyebrow}>PAGAMENTOS</p>
                                    <h2 style={styles.pageTitle}>Pagamentos</h2>
                                    <p style={styles.pageSubtitle}>
                                        Conecte sua conta Mercado Pago para receber os sinais dos seus clientes.
                                    </p>
                                </div>

                                <div style={styles.headerGlowLine} />
                            </div>

                            {mpConectado ? (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        scale: 0.97
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1
                                    }}
                                    style={styles.mpConectadoCard}
                                >
                                    <div style={styles.successIcon}>
                                        <Icon name="check" size={27} />
                                    </div>

                                    <p style={styles.mpConectadoTitulo}>
                                        Mercado Pago conectado
                                    </p>

                                    <p style={styles.mpConectadoTexto}>
                                        Os sinais pagos pelos seus clientes caem direto na sua conta Mercado Pago.
                                    </p>

                                    <button
                                        style={styles.botaoSecundario}
                                        onClick={conectarMercadoPago}
                                        disabled={conectandoMp}
                                    >
                                        {conectandoMp
                                            ? 'Abrindo...'
                                            : 'Reconectar / trocar de conta'}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        scale: 0.97
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1
                                    }}
                                    style={styles.mpDesconectadoCard}
                                >
                                    <div style={styles.paymentIcon}>
                                        <Icon name="card" size={28} />
                                    </div>

                                    <p style={styles.mpConectadoTitulo}>
                                        Conecte sua conta Mercado Pago
                                    </p>

                                    <p style={styles.mpConectadoTexto}>
                                        Sem essa conexão, seus clientes não conseguem agendar (o sistema não gera o PIX do sinal).
                                        Você será direcionado ao Mercado Pago pra autorizar o Fayola — o dinheiro do sinal cai
                                        direto na SUA conta, o Fayola nunca recebe esse valor.
                                    </p>

                                    <motion.button
                                        whileHover={{
                                            scale: 1.02,
                                            boxShadow: '0 0 30px rgba(201,79,36,0.25)'
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        style={styles.botao}
                                        onClick={conectarMercadoPago}
                                        disabled={conectandoMp}
                                    >
                                        <Icon name="link" size={15} />
                                        {conectandoMp
                                            ? 'Abrindo...'
                                            : 'Conectar Mercado Pago'}
                                    </motion.button>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {aba === 'link' && (
                        <motion.div
                            key="link"
                            variants={paginaAnimacao}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <div style={styles.pageHeader}>
                                <div>
                                    <p style={styles.sectionEyebrow}>SEU FAYOLA</p>
                                    <h2 style={styles.pageTitle}>
                                        Meu Link de Agendamento
                                    </h2>
                                    <p style={styles.pageSubtitle}>
                                        Compartilhe este link com seus clientes.
                                    </p>
                                </div>

                                <div style={styles.headerGlowLine} />
                            </div>

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 18
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0
                                }}
                                style={styles.formCard}
                            >
                                <div style={styles.formHeading}>
                                    <div style={styles.formIcon}>
                                        <Icon name="link" size={19} />
                                    </div>

                                    <div>
                                        <p style={styles.formTitle}>
                                            Link Público
                                        </p>

                                        <p style={styles.formSubtitle}>
                                            Este é o endereço que seus clientes usarão para agendar.
                                        </p>
                                    </div>
                                </div>

                                <div style={styles.linkBox}>
                                    <p style={styles.linkTexto}>
                                        {linkAgendamento}
                                    </p>
                                </div>

                                <motion.button
                                    whileHover={{
                                        scale: 1.02,
                                        boxShadow: '0 0 30px rgba(201,79,36,0.25)'
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    style={styles.botao}
                                    onClick={copiarLink}
                                >
                                    <Icon
                                        name={linkCopiado ? 'check' : 'copy'}
                                        size={15}
                                    />

                                    {linkCopiado
                                        ? 'Link Copiado!'
                                        : 'Copiar Link'}
                                </motion.button>

                                <p style={styles.linkDica}>
                                    Compartilhe no WhatsApp, Instagram ou onde preferir.
                                    Seus clientes vão agendar direto por este link.
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
        minHeight: '100vh',
        background: '#080808',
        color: '#ffffff',
        fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflow: 'hidden'
    },

    backgroundGlowOne: {
        position: 'fixed',
        width: '520px',
        height: '520px',
        borderRadius: '50%',
        background: 'rgba(201,79,36,0.07)',
        filter: 'blur(100px)',
        top: '-260px',
        right: '80px',
        pointerEvents: 'none',
        zIndex: 0
    },

    backgroundGlowTwo: {
        position: 'fixed',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'rgba(201,79,36,0.045)',
        filter: 'blur(110px)',
        bottom: '-220px',
        left: '300px',
        pointerEvents: 'none',
        zIndex: 0
    },

    gridBackground: {
        position: 'fixed',
        inset: 0,
        backgroundImage:
            'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
        maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
        pointerEvents: 'none',
        zIndex: 0
    },

    sidebar: {
        position: 'relative',
        zIndex: 5,
        width: '245px',
        minHeight: '100vh',
        background: 'rgba(12,12,12,0.92)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 0'
    },

    logoArea: {
        textAlign: 'center',
        padding: '0 24px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.07)'
    },

    logoMark: {
        width: '43px',
        height: '43px',
        borderRadius: '13px',
        margin: '0 auto 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(145deg, #df6632, #9e3b1b)',
        boxShadow: '0 0 35px rgba(201,79,36,0.2)',
        transform: 'rotate(-4deg)'
    },

    logoMarkInner: {
        color: '#ffffff',
        fontSize: '21px',
        fontWeight: '800',
        transform: 'rotate(4deg)'
    },

    logo: {
        color: '#ffffff',
        fontSize: '17px',
        fontWeight: '800',
        letterSpacing: '5px',
        margin: 0
    },

    logoSubtitle: {
        color: '#555555',
        fontSize: '8px',
        letterSpacing: '1.8px',
        margin: '8px 0 0'
    },

    nav: {
        padding: '25px 12px',
        flex: 1
    },

    navLabel: {
        color: '#444444',
        fontSize: '9px',
        fontWeight: '700',
        letterSpacing: '2px',
        padding: '0 13px',
        margin: '0 0 12px'
    },

    navItem: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        background: 'transparent',
        border: '1px solid transparent',
        color: '#666666',
        fontSize: '13px',
        borderRadius: '10px',
        cursor: 'pointer',
        marginBottom: '5px',
        textAlign: 'left',
        transition: 'color 0.2s ease, background 0.2s ease, border 0.2s ease'
    },

    navItemAtivo: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        background: 'linear-gradient(90deg, rgba(201,79,36,0.12), rgba(201,79,36,0.025))',
        border: '1px solid rgba(201,79,36,0.18)',
        color: '#ef6a35',
        fontSize: '13px',
        borderRadius: '10px',
        cursor: 'pointer',
        marginBottom: '5px',
        textAlign: 'left',
        boxShadow: 'inset 3px 0 0 #c94f24'
    },

    navIndicator: {
        position: 'absolute',
        left: '-1px',
        top: '8px',
        bottom: '8px',
        width: '2px',
        background: '#d85b2b',
        borderRadius: '2px'
    },

    navIcon: {
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#555555'
    },

    navIconAtivo: {
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#df6632'
    },

    navText: {
        flex: 1
    },

    avisoBolinha: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '17px',
        height: '17px',
        borderRadius: '50%',
        background: '#c94f24',
        color: '#ffffff',
        fontSize: '10px',
        fontWeight: '800',
        boxShadow: '0 0 12px rgba(201,79,36,0.35)'
    },

    estabelecimentoInfo: {
        margin: '0 16px',
        padding: '15px',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.025)',
        display: 'flex',
        alignItems: 'center',
        gap: '11px'
    },

    profileDot: {
        flexShrink: 0,
        width: '32px',
        height: '32px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(201,79,36,0.14)',
        border: '1px solid rgba(201,79,36,0.25)',
        color: '#df6632',
        fontSize: '13px',
        fontWeight: '700'
    },

    estabelecimentoNome: {
        color: '#dddddd',
        fontSize: '12px',
        fontWeight: '600',
        margin: 0,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '145px'
    },

    estabelecimentoSub: {
        color: '#4d4d4d',
        fontSize: '8px',
        margin: '4px 0 0',
        textTransform: 'uppercase',
        letterSpacing: '1.1px'
    },

    main: {
        position: 'relative',
        zIndex: 1,
        flex: 1,
        minWidth: 0,
        minHeight: '100vh',
        padding: '32px 44px 70px',
        overflowY: 'auto'
    },

    topBar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '45px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
    },

    topEyebrow: {
        color: '#df6632',
        fontSize: '9px',
        fontWeight: '700',
        letterSpacing: '2.5px',
        margin: 0
    },

    topDate: {
        color: '#555555',
        fontSize: '12px',
        margin: '7px 0 0',
        textTransform: 'capitalize'
    },

    onlineStatus: {
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        color: '#666666',
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },

    onlineDot: {
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#63c878',
        boxShadow: '0 0 12px rgba(99,200,120,0.6)'
    },

    pageHeader: {
        position: 'relative',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },

    sectionEyebrow: {
        color: '#c94f24',
        fontSize: '9px',
        fontWeight: '700',
        letterSpacing: '2.5px',
        margin: '0 0 8px'
    },

    pageTitle: {
        color: '#ffffff',
        fontSize: '30px',
        lineHeight: 1.15,
        fontWeight: '750',
        letterSpacing: '-0.8px',
        margin: 0
    },

    pageSubtitle: {
        color: '#666666',
        fontSize: '13px',
        margin: '10px 0 0',
        lineHeight: 1.6
    },

    headerGlowLine: {
        width: '100px',
        height: '1px',
        background: 'linear-gradient(90deg, #c94f24, transparent)',
        opacity: 0.7,
        marginBottom: '4px'
    },

    avisoMpCard: {
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(201,79,36,0.11), rgba(201,79,36,0.035))',
        border: '1px solid rgba(201,79,36,0.24)',
        borderRadius: '15px',
        padding: '18px 20px',
        marginBottom: '25px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        flexWrap: 'wrap',
        boxShadow: '0 15px 50px rgba(0,0,0,0.18)'
    },

    avisoIcon: {
        width: '38px',
        height: '38px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '11px',
        color: '#df6632',
        background: 'rgba(201,79,36,0.12)',
        border: '1px solid rgba(201,79,36,0.2)'
    },

    avisoMpContent: {
        flex: 1,
        minWidth: '230px'
    },

    avisoMpTitulo: {
        color: '#eeeeee',
        fontSize: '13px',
        fontWeight: '650',
        margin: '0 0 4px'
    },

    avisoMpTexto: {
        color: '#777777',
        fontSize: '11px',
        margin: 0,
        lineHeight: 1.5
    },

    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '14px',
        marginBottom: '28px'
    },

    statCard: {
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, rgba(24,24,24,0.95), rgba(15,15,15,0.95))',
        border: '1px solid rgba(255,255,255,0.075)',
        borderRadius: '15px',
        padding: '20px 22px',
        minHeight: '115px',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        boxShadow: '0 15px 40px rgba(0,0,0,0.14)'
    },

    statTop: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#c94f24',
        marginBottom: '14px'
    },

    statSmall: {
        color: '#414141',
        fontSize: '8px',
        fontWeight: '700',
        letterSpacing: '1.5px'
    },

    statNum: {
        color: '#ffffff',
        fontSize: '24px',
        fontWeight: '750',
        letterSpacing: '-0.5px',
        margin: '0 0 5px'
    },

    statLabel: {
        color: '#5e5e5e',
        fontSize: '9px',
        margin: 0,
        textTransform: 'uppercase',
        letterSpacing: '1.2px'
    },

    vazio: {
        textAlign: 'center',
        padding: '65px 30px',
        background: 'rgba(18,18,18,0.72)',
        borderRadius: '15px',
        border: '1px solid rgba(255,255,255,0.06)'
    },

    emptyIcon: {
        width: '58px',
        height: '58px',
        borderRadius: '17px',
        margin: '0 auto 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#c94f24',
        background: 'rgba(201,79,36,0.08)',
        border: '1px solid rgba(201,79,36,0.14)'
    },

    vazioTexto: {
        color: '#888888',
        fontSize: '15px',
        fontWeight: '500',
        margin: 0
    },

    emptySubtext: {
        color: '#454545',
        fontSize: '11px',
        margin: '8px 0 0'
    },

    agendamentoCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        background: 'rgba(18,18,18,0.78)',
        border: '1px solid rgba(255,255,255,0.065)',
        borderRadius: '14px',
        padding: '17px 19px',
        marginBottom: '10px',
        transition: 'border-color 0.25s ease, transform 0.25s ease',
        boxShadow: '0 10px 35px rgba(0,0,0,0.12)'
    },

    horaBadge: {
        flexShrink: 0,
        background: 'linear-gradient(135deg, #d45a2a, #a33d1c)',
        color: '#ffffff',
        fontWeight: '750',
        fontSize: '12px',
        padding: '10px 11px',
        borderRadius: '9px',
        minWidth: '62px',
        textAlign: 'center',
        boxShadow: '0 7px 20px rgba(201,79,36,0.18)'
    },

    horaBadgeCancelado: {
        flexShrink: 0,
        background: 'rgba(224,82,82,0.08)',
        color: '#e05252',
        border: '1px solid rgba(224,82,82,0.2)',
        fontWeight: '700',
        fontSize: '12px',
        padding: '10px 11px',
        borderRadius: '9px',
        minWidth: '62px',
        textAlign: 'center'
    },

    agendamentoInfo: {
        flex: 1,
        minWidth: 0
    },

    clienteNome: {
        color: '#f0f0f0',
        fontSize: '14px',
        fontWeight: '600',
        margin: '0 0 6px'
    },

    agendamentoDetalhe: {
        color: '#606060',
        fontSize: '11px',
        margin: '3px 0'
    },

    btnCancelar: {
        flexShrink: 0,
        padding: '8px 13px',
        background: 'transparent',
        color: '#b65353',
        border: '1px solid rgba(224,82,82,0.3)',
        borderRadius: '7px',
        fontSize: '10px',
        cursor: 'pointer',
        letterSpacing: '0.7px',
        transition: 'all 0.2s ease'
    },

    formCard: {
        background: 'linear-gradient(145deg, rgba(23,23,23,0.95), rgba(14,14,14,0.95))',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        padding: '26px',
        marginBottom: '26px',
        boxShadow: '0 18px 55px rgba(0,0,0,0.16)'
    },

    formHeading: {
        display: 'flex',
        alignItems: 'center',
        gap: '13px',
        marginBottom: '22px'
    },

    formIcon: {
        width: '39px',
        height: '39px',
        borderRadius: '11px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#df6632',
        background: 'rgba(201,79,36,0.1)',
        border: '1px solid rgba(201,79,36,0.17)'
    },

    formTitle: {
        color: '#df6632',
        fontSize: '12px',
        fontWeight: '700',
        letterSpacing: '1.7px',
        textTransform: 'uppercase',
        margin: 0
    },

    formSubtitle: {
        color: '#555555',
        fontSize: '10px',
        margin: '5px 0 0'
    },

    input: {
        width: '100%',
        padding: '13px 15px',
        marginBottom: '11px',
        borderRadius: '9px',
        border: '1px solid rgba(255,255,255,0.075)',
        background: '#0a0a0a',
        color: '#ffffff',
        fontSize: '13px',
        boxSizing: 'border-box',
        outline: 'none'
    },

    inputRow: {
        display: 'flex'
    },

    botao: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '11px 18px',
        background: 'linear-gradient(135deg, #d45a2a, #a63d1d)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: '750',
        letterSpacing: '0.7px',
        cursor: 'pointer',
        marginTop: '4px',
        boxShadow: '0 8px 25px rgba(201,79,36,0.15)'
    },

    botaoSecundario: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '11px 18px',
        background: 'transparent',
        color: '#df6632',
        border: '1px solid rgba(201,79,36,0.45)',
        borderRadius: '8px',
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '0.7px',
        cursor: 'pointer',
        marginTop: '4px'
    },

    listaGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
        gap: '14px'
    },

    servicoCard: {
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(145deg, rgba(23,23,23,0.95), rgba(14,14,14,0.95))',
        border: '1px solid rgba(255,255,255,0.065)',
        borderRadius: '15px',
        padding: '22px',
        textAlign: 'center',
        transition: 'border-color 0.25s ease, transform 0.25s ease',
        boxShadow: '0 12px 40px rgba(0,0,0,0.13)'
    },

    servicoIcone: {
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        margin: '0 auto 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#df6632',
        background: 'rgba(201,79,36,0.08)',
        border: '1px solid rgba(201,79,36,0.14)'
    },

    servicoNome: {
        color: '#f0f0f0',
        fontSize: '14px',
        fontWeight: '600',
        margin: '0 0 7px'
    },

    servicoDetalhe: {
        color: '#5d5d5d',
        fontSize: '11px',
        margin: '3px 0'
    },

    servicoPreco: {
        color: '#df6632',
        fontSize: '16px',
        fontWeight: '750',
        margin: '10px 0 5px'
    },

    btnExcluir: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '13px',
        padding: '7px 12px',
        background: 'transparent',
        color: '#b65353',
        border: '1px solid rgba(224,82,82,0.25)',
        borderRadius: '7px',
        fontSize: '10px',
        cursor: 'pointer'
    },

    linkBox: {
        background: '#080808',
        border: '1px solid rgba(201,79,36,0.16)',
        borderRadius: '9px',
        padding: '15px',
        marginBottom: '15px',
        boxShadow: 'inset 0 0 25px rgba(201,79,36,0.025)'
    },

    linkTexto: {
        color: '#df6632',
        fontSize: '12px',
        margin: 0,
        wordBreak: 'break-all',
        lineHeight: 1.6
    },

    linkDica: {
        color: '#4f4f4f',
        fontSize: '10px',
        marginTop: '15px',
        lineHeight: '1.7'
    },

    statusAtivo: {
        color: '#63c878',
        fontSize: '10px',
        margin: '5px 0 9px'
    },

    statusPendente: {
        color: '#df6632',
        fontSize: '10px',
        margin: '5px 0 9px'
    },

    btnLinkProfissional: {
        marginTop: '4px',
        padding: '7px 12px',
        background: 'transparent',
        color: '#df6632',
        border: '1px solid rgba(201,79,36,0.3)',
        borderRadius: '7px',
        fontSize: '10px',
        cursor: 'pointer',
        width: '100%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px'
    },

    conviteCard: {
        position: 'relative',
        background: 'linear-gradient(145deg, rgba(201,79,36,0.08), rgba(18,18,18,0.95))',
        border: '1px solid rgba(201,79,36,0.2)',
        borderRadius: '15px',
        padding: '23px',
        marginBottom: '26px'
    },

    conviteIcon: {
        width: '38px',
        height: '38px',
        borderRadius: '11px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#df6632',
        background: 'rgba(201,79,36,0.1)',
        border: '1px solid rgba(201,79,36,0.16)',
        marginBottom: '14px'
    },

    conviteTitulo: {
        color: '#df6632',
        fontSize: '13px',
        fontWeight: '700',
        margin: '0 0 7px'
    },

    conviteTexto: {
        color: '#777777',
        fontSize: '11px',
        lineHeight: 1.6,
        margin: '0 0 13px'
    },

    comissaoValorGrande: {
        color: '#df6632',
        fontSize: '18px',
        fontWeight: '750',
        margin: 0
    },

    avatarCircle: {
        flexShrink: 0,
        width: '43px',
        height: '43px',
        borderRadius: '13px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#df6632',
        background: 'rgba(201,79,36,0.1)',
        border: '1px solid rgba(201,79,36,0.17)',
        fontSize: '15px',
        fontWeight: '700'
    },

    mpConectadoCard: {
        background: 'linear-gradient(145deg, rgba(15,36,24,0.8), rgba(14,20,16,0.95))',
        border: '1px solid rgba(95,191,110,0.22)',
        borderRadius: '17px',
        padding: '45px 35px',
        textAlign: 'center',
        maxWidth: '520px',
        boxShadow: '0 20px 70px rgba(0,0,0,0.2)'
    },

    successIcon: {
        width: '58px',
        height: '58px',
        borderRadius: '18px',
        margin: '0 auto 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#63c878',
        background: 'rgba(95,191,110,0.1)',
        border: '1px solid rgba(95,191,110,0.2)'
    },

    paymentIcon: {
        width: '58px',
        height: '58px',
        borderRadius: '18px',
        margin: '0 auto 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#df6632',
        background: 'rgba(201,79,36,0.09)',
        border: '1px solid rgba(201,79,36,0.17)'
    },

    mpConectadoTitulo: {
        color: '#ffffff',
        fontSize: '17px',
        fontWeight: '700',
        margin: '0 0 9px'
    },

    mpConectadoTexto: {
        color: '#777777',
        fontSize: '11px',
        lineHeight: '1.7',
        margin: '0 0 21px'
    },

    mpDesconectadoCard: {
        background: 'linear-gradient(145deg, rgba(23,23,23,0.95), rgba(14,14,14,0.95))',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '17px',
        padding: '45px 35px',
        textAlign: 'center',
        maxWidth: '520px',
        boxShadow: '0 20px 70px rgba(0,0,0,0.2)'
    }
};

export default Dashboard;