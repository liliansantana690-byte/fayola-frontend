import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import ConfigurarDisponibilidade from './ConfigurarDisponibilidade';

function PainelProfissional({ nome, onLogout }) {
    const [aba, setAba] = useState('agenda');
    const [agenda, setAgenda] = useState([]);
    const [comissao, setComissao] = useState({ total: 0, atendimentos: 0 });
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [modalAberto, setModalAberto] = useState(null);
    const [valorRecebido, setValorRecebido] = useState('');

    const [pedidos, setPedidos] = useState([]);
    const [modalOrcamento, setModalOrcamento] = useState(null);
    const [valorTattoo, setValorTattoo] = useState('');
    const [valorSinal, setValorSinal] = useState('');
    const [duracaoMinutos, setDuracaoMinutos] = useState('120');
    const [enviandoOrcamento, setEnviandoOrcamento] = useState(false);

    const token = localStorage.getItem('token');
    const profissionalId = localStorage.getItem('profissional_id');
    const headers = { Authorization: `Bearer ${token}` };

    const carregarDados = useCallback(async function() {
        try {
            const a = await api.get('/profissionais/minha-agenda', { headers });
            const c = await api.get('/profissionais/minha-comissao', { headers });
            const p = await api.get('/pedidos-tattoo/meus-pedidos', { headers });

            setAgenda(a.data);
            setComissao(c.data);
            setPedidos(p.data);
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
            return mesmoDia(a.data_hora, dataSelecionada);
        })
        .sort(function(a, b) {
            return new Date(a.data_hora) - new Date(b.data_hora);
        });

    const pedidosAguardando = pedidos.filter(function(p) {
        return p.status === 'aguardando_orcamento';
    });

    const pedidosRespondidos = pedidos.filter(function(p) {
        return p.status !== 'aguardando_orcamento';
    });

    function mudarDia(delta) {
        const nova = new Date(dataSelecionada);
        nova.setDate(nova.getDate() + delta);
        setDataSelecionada(nova);
    }

    function irParaHoje() {
        setDataSelecionada(new Date());
    }

    function ehHoje() {
        return mesmoDia(dataSelecionada.toISOString(), new Date());
    }

    function abrirModalConcluir(agendamento) {
        setModalAberto(agendamento);
        setValorRecebido(parseFloat(agendamento.preco).toFixed(2));
    }

    async function confirmarConclusao() {
        try {
            await api.patch(
                '/profissionais/agendamentos/' + modalAberto.id + '/concluir',
                {
                    valor_pago_total: parseFloat(valorRecebido)
                },
                {
                    headers
                }
            );

            setModalAberto(null);
            carregarDados();
        } catch (err) {
            alert(err.response?.data?.erro || 'Erro ao concluir atendimento');
        }
    }

    function abrirModalOrcamento(pedido) {
        setModalOrcamento(pedido);
        setValorTattoo('');
        setValorSinal('');
        setDuracaoMinutos('120');
    }

    async function enviarOrcamento() {
        if (!valorTattoo || !valorSinal) {
            alert('Preencha o valor da tattoo e do sinal.');
            return;
        }

        setEnviandoOrcamento(true);

        try {
            await api.patch(
                '/pedidos-tattoo/' + modalOrcamento.id + '/orcamento',
                {
                    valor_tattoo: parseFloat(valorTattoo),
                    valor_sinal: parseFloat(valorSinal),
                    duracao_minutos: parseInt(duracaoMinutos) || 120
                },
                {
                    headers
                }
            );

            setModalOrcamento(null);
            carregarDados();
        } catch (err) {
            alert(err.response?.data?.erro || 'Erro ao enviar orçamento');
        }

        setEnviandoOrcamento(false);
    }

    function formatarHora(data_hora) {
        return new Date(data_hora).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatarDataTitulo(data) {
        return data.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    }

    function formatarDataHora(data_hora) {
        return new Date(data_hora).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('profissional_id');
        localStorage.removeItem('nome');
        onLogout();
    }

    function labelStatus(status) {
        if (status === 'orcamento_enviado') {
            return 'Aguardando pagamento do sinal';
        }

        if (status === 'convertido_agendamento') {
            return 'Agendado';
        }

        return status;
    }

    return (
        <div style={styles.page}>
            <motion.div
                style={styles.backgroundGlowOne}
                animate={{
                    opacity: [0.25, 0.45, 0.25],
                    scale: [1, 1.15, 1]
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />

            <motion.div
                style={styles.backgroundGlowTwo}
                animate={{
                    opacity: [0.12, 0.25, 0.12],
                    scale: [1.1, 1, 1.1]
                }}
                transition={{
                    duration: 9,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
            />

            <div style={styles.gridBackground} />

            <div style={styles.container}>
                <motion.div
                    style={styles.header}
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div>
                        <p style={styles.miniLabel}>FAYOLA</p>

                        <h1 style={styles.logo}>
                            Painel do profissional
                        </h1>

                        <p style={styles.subLogo}>
                            Olá, {nome}.
                        </p>
                    </div>

                    <motion.button
                        style={styles.btnSair}
                        onClick={logout}
                        whileHover={{
                            borderColor: '#ff6a3d',
                            color: '#ff6a3d',
                            y: -2
                        }}
                        whileTap={{ scale: 0.96 }}
                    >
                        Sair
                    </motion.button>
                </motion.div>

                <motion.div
                    style={styles.heroLine}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '100%', opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                />

                <motion.div
                    style={styles.abasRow}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                >
                    <motion.button
                        style={
                            aba === 'agenda'
                                ? styles.abaBotaoAtiva
                                : styles.abaBotao
                        }
                        onClick={function() {
                            setAba('agenda');
                        }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Agenda
                    </motion.button>

                    <motion.button
                        style={
                            aba === 'pedidos'
                                ? styles.abaBotaoAtiva
                                : styles.abaBotao
                        }
                        onClick={function() {
                            setAba('pedidos');
                        }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Pedidos

                        {pedidosAguardando.length > 0 && (
                            <motion.span
                                style={styles.badgeContador}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 18
                                }}
                            >
                                {pedidosAguardando.length}
                            </motion.span>
                        )}
                    </motion.button>

                    <motion.button
                        style={
                            aba === 'disponibilidade'
                                ? styles.abaBotaoAtiva
                                : styles.abaBotao
                        }
                        onClick={function() {
                            setAba('disponibilidade');
                        }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Disponibilidade
                    </motion.button>
                </motion.div>

                <AnimatePresence mode="wait">
                    {aba === 'agenda' && (
                        <motion.div
                            key="agenda"
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 15 }}
                            transition={{ duration: 0.35 }}
                        >
                            <motion.div
                                style={styles.comissaoCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{
                                    y: -3,
                                    borderColor: '#ff6a3d'
                                }}
                            >
                                <div style={styles.comissaoGlow} />

                                <p style={styles.comissaoLabel}>
                                    Comissão acumulada
                                </p>

                                <p style={styles.comissaoValor}>
                                    R$ {parseFloat(comissao.total || 0).toFixed(2)}
                                </p>

                                <p style={styles.comissaoDetalhe}>
                                    {comissao.atendimentos} atendimento(s) concluído(s)
                                </p>
                            </motion.div>

                            <motion.div
                                style={styles.navegacaoDia}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                            >
                                <motion.button
                                    style={styles.btnNav}
                                    onClick={function() {
                                        mudarDia(-1);
                                    }}
                                    whileHover={{
                                        y: -2,
                                        borderColor: '#ff6a3d',
                                        color: '#ff6a3d'
                                    }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    ← Anterior
                                </motion.button>

                                <div style={styles.diaAtual}>
                                    <p style={styles.diaTexto}>
                                        {formatarDataTitulo(dataSelecionada)}
                                    </p>

                                    {!ehHoje() && (
                                        <motion.button
                                            style={styles.btnHoje}
                                            onClick={irParaHoje}
                                            whileHover={{
                                                color: '#ff8a66'
                                            }}
                                        >
                                            Voltar para hoje
                                        </motion.button>
                                    )}
                                </div>

                                <motion.button
                                    style={styles.btnNav}
                                    onClick={function() {
                                        mudarDia(1);
                                    }}
                                    whileHover={{
                                        y: -2,
                                        borderColor: '#ff6a3d',
                                        color: '#ff6a3d'
                                    }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    Próximo →
                                </motion.button>
                            </motion.div>

                            <div style={styles.lista}>
                                {agendaDoDia.length === 0 && (
                                    <motion.div
                                        style={styles.vazio}
                                        initial={{ opacity: 0, scale: 0.97 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <div style={styles.vazioPonto} />

                                        <p style={styles.vazioTexto}>
                                            Nenhum atendimento nesse dia
                                        </p>
                                    </motion.div>
                                )}

                                {agendaDoDia.map(function(a, index) {
                                    return (
                                        <motion.div
                                            key={a.id}
                                            style={styles.card}
                                            initial={{
                                                opacity: 0,
                                                y: 20
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0
                                            }}
                                            transition={{
                                                duration: 0.4,
                                                delay: index * 0.06
                                            }}
                                            whileHover={{
                                                y: -3,
                                                borderColor: '#ff6a3d',
                                                boxShadow:
                                                    '0 14px 40px rgba(255,106,61,0.10)'
                                            }}
                                        >
                                            <div style={styles.horaBadge}>
                                                {formatarHora(a.data_hora)}
                                            </div>

                                            <div style={styles.info}>
                                                <p style={styles.clienteNome}>
                                                    {a.cliente_nome}
                                                </p>

                                                <p style={styles.detalhe}>
                                                    {a.servico} · R$ {parseFloat(a.preco).toFixed(2)}
                                                </p>

                                                <p style={styles.detalhe}>
                                                    WhatsApp: {a.cliente_whatsapp}
                                                </p>
                                            </div>

                                            {a.status === 'confirmado' && (
                                                <motion.button
                                                    style={styles.btnConcluir}
                                                    onClick={function() {
                                                        abrirModalConcluir(a);
                                                    }}
                                                    whileHover={{
                                                        scale: 1.03,
                                                        background: '#ff6a3d',
                                                        color: '#090909'
                                                    }}
                                                    whileTap={{ scale: 0.96 }}
                                                >
                                                    Marcar concluído
                                                </motion.button>
                                            )}

                                            {a.status === 'concluido' && (
                                                <div style={styles.badgeConcluido}>
                                                    <p style={styles.badgeConcluidoTexto}>
                                                        Concluído
                                                    </p>

                                                    <p style={styles.badgeComissao}>
                                                        Comissão: R$ {parseFloat(a.comissao_valor).toFixed(2)}
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {aba === 'pedidos' && (
                        <motion.div
                            key="pedidos"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.35 }}
                        >
                            <motion.h3
                                style={styles.secaoTitulo}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                Aguardando orçamento
                            </motion.h3>

                            {pedidosAguardando.length === 0 && (
                                <motion.div
                                    style={styles.vazio}
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div style={styles.vazioPonto} />

                                    <p style={styles.vazioTexto}>
                                        Nenhum pedido novo
                                    </p>
                                </motion.div>
                            )}

                            {pedidosAguardando.map(function(p, index) {
                                return (
                                    <motion.div
                                        key={p.id}
                                        style={styles.pedidoCard}
                                        initial={{
                                            opacity: 0,
                                            y: 18
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.06
                                        }}
                                        whileHover={{
                                            y: -3,
                                            borderColor: '#ff6a3d',
                                            boxShadow:
                                                '0 14px 40px rgba(255,106,61,0.10)'
                                        }}
                                    >
                                        <p style={styles.clienteNome}>
                                            {p.cliente_nome}
                                        </p>

                                        <p style={styles.detalhe}>
                                            {p.descricao}
                                        </p>

                                        <div style={styles.pedidoTagsRow}>
                                            {p.estilo && (
                                                <span style={styles.pedidoTag}>
                                                    {p.estilo}
                                                </span>
                                            )}

                                            {p.tamanho_aproximado && (
                                                <span style={styles.pedidoTag}>
                                                    {p.tamanho_aproximado}
                                                </span>
                                            )}

                                            {p.local_corpo && (
                                                <span style={styles.pedidoTag}>
                                                    {p.local_corpo}
                                                </span>
                                            )}
                                        </div>

                                        {p.referencia_url && (
                                            <a
                                                href={p.referencia_url}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={styles.linkReferencia}
                                            >
                                                Ver referência →
                                            </a>
                                        )}

                                        {p.observacoes && (
                                            <p style={styles.detalhe}>
                                                Obs: {p.observacoes}
                                            </p>
                                        )}

                                        <p style={styles.detalhe}>
                                            WhatsApp: {p.cliente_whatsapp}
                                        </p>

                                        <motion.button
                                            style={styles.btnConcluir}
                                            onClick={function() {
                                                abrirModalOrcamento(p);
                                            }}
                                            whileHover={{
                                                scale: 1.02,
                                                background: '#ff6a3d',
                                                color: '#090909'
                                            }}
                                            whileTap={{ scale: 0.97 }}
                                        >
                                            Enviar orçamento
                                        </motion.button>
                                    </motion.div>
                                );
                            })}

                            <motion.h3
                                style={{
                                    ...styles.secaoTitulo,
                                    marginTop: '34px'
                                }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                Já respondidos
                            </motion.h3>

                            {pedidosRespondidos.length === 0 && (
                                <motion.div
                                    style={styles.vazio}
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div style={styles.vazioPonto} />

                                    <p style={styles.vazioTexto}>
                                        Nenhum pedido respondido ainda
                                    </p>
                                </motion.div>
                            )}

                            {pedidosRespondidos.map(function(p, index) {
                                return (
                                    <motion.div
                                        key={p.id}
                                        style={styles.pedidoCard}
                                        initial={{
                                            opacity: 0,
                                            y: 18
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            delay: index * 0.06
                                        }}
                                        whileHover={{
                                            y: -3,
                                            borderColor: '#ff6a3d'
                                        }}
                                    >
                                        <p style={styles.clienteNome}>
                                            {p.cliente_nome}
                                        </p>

                                        <p style={styles.detalhe}>
                                            {p.descricao}
                                        </p>

                                        <p style={styles.detalhe}>
                                            Tattoo: R$ {parseFloat(p.valor_tattoo).toFixed(2)} · Sinal: R$ {parseFloat(p.valor_sinal).toFixed(2)}
                                        </p>

                                        {p.data_hora && (
                                            <p style={styles.detalhe}>
                                                Agendado para {formatarDataHora(p.data_hora)}
                                            </p>
                                        )}

                                        <p
                                            style={
                                                p.sinal_status === 'pago'
                                                    ? styles.statusPago
                                                    : styles.statusPendente
                                            }
                                        >
                                            {p.sinal_status === 'pago'
                                                ? '✓ Sinal pago'
                                                : labelStatus(p.status)}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {aba === 'disponibilidade' && (
                        <motion.div
                            key="disponibilidade"
                            initial={{ opacity: 0, x: 15 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -15 }}
                            transition={{ duration: 0.35 }}
                        >
                            <ConfigurarDisponibilidade profissionalId={profissionalId} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {modalAberto && (
                        <motion.div
                            style={styles.modalFundo}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                style={styles.modalCard}
                                initial={{
                                    opacity: 0,
                                    scale: 0.92,
                                    y: 20
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.92,
                                    y: 20
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 280,
                                    damping: 22
                                }}
                            >
                                <div style={styles.modalAccent} />

                                <h3 style={styles.modalTitulo}>
                                    Concluir atendimento
                                </h3>

                                <p style={styles.modalTexto}>
                                    {modalAberto.cliente_nome} · {modalAberto.servico}
                                </p>

                                <label style={styles.label}>
                                    Valor total recebido (R$)
                                </label>

                                <input
                                    style={styles.input}
                                    type="number"
                                    step="0.01"
                                    value={valorRecebido}
                                    onChange={function(e) {
                                        setValorRecebido(e.target.value);
                                    }}
                                />

                                <div style={styles.modalBotoes}>
                                    <motion.button
                                        style={styles.btnCancelar}
                                        onClick={function() {
                                            setModalAberto(null);
                                        }}
                                        whileHover={{
                                            borderColor: '#555',
                                            color: '#fff'
                                        }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        Cancelar
                                    </motion.button>

                                    <motion.button
                                        style={styles.btnConfirmar}
                                        onClick={confirmarConclusao}
                                        whileHover={{
                                            scale: 1.02,
                                            boxShadow:
                                                '0 0 30px rgba(255,106,61,0.28)'
                                        }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        Confirmar
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {modalOrcamento && (
                        <motion.div
                            style={styles.modalFundo}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                style={styles.modalCard}
                                initial={{
                                    opacity: 0,
                                    scale: 0.92,
                                    y: 20
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0
                                }}
                                exit={{
                                    opacity: 0,
                                    scale: 0.92,
                                    y: 20
                                }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 280,
                                    damping: 22
                                }}
                            >
                                <div style={styles.modalAccent} />

                                <h3 style={styles.modalTitulo}>
                                    Enviar orçamento
                                </h3>

                                <p style={styles.modalTexto}>
                                    {modalOrcamento.cliente_nome} · {modalOrcamento.descricao}
                                </p>

                                <label style={styles.label}>
                                    Valor da tattoo (R$)
                                </label>

                                <input
                                    style={styles.input}
                                    type="number"
                                    step="0.01"
                                    placeholder="Ex: 600"
                                    value={valorTattoo}
                                    onChange={function(e) {
                                        setValorTattoo(e.target.value);
                                    }}
                                />

                                <label style={styles.label}>
                                    Valor do sinal (R$)
                                </label>

                                <input
                                    style={styles.input}
                                    type="number"
                                    step="0.01"
                                    placeholder="Ex: 180"
                                    value={valorSinal}
                                    onChange={function(e) {
                                        setValorSinal(e.target.value);
                                    }}
                                />

                                <label style={styles.label}>
                                    Duração estimada da sessão (minutos)
                                </label>

                                <input
                                    style={styles.input}
                                    type="number"
                                    step="15"
                                    placeholder="Ex: 120"
                                    value={duracaoMinutos}
                                    onChange={function(e) {
                                        setDuracaoMinutos(e.target.value);
                                    }}
                                />

                                <p style={styles.avisoModal}>
                                    O cliente recebe esse valor automaticamente por WhatsApp, com o link pra pagar o sinal. A duração evita que outro cliente marque no mesmo horário.
                                </p>

                                <div style={styles.modalBotoes}>
                                    <motion.button
                                        style={styles.btnCancelar}
                                        onClick={function() {
                                            setModalOrcamento(null);
                                        }}
                                        whileHover={{
                                            borderColor: '#555',
                                            color: '#fff'
                                        }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        Cancelar
                                    </motion.button>

                                    <motion.button
                                        style={{
                                            ...styles.btnConfirmar,
                                            opacity: enviandoOrcamento ? 0.6 : 1
                                        }}
                                        onClick={enviarOrcamento}
                                        disabled={enviandoOrcamento}
                                        whileHover={
                                            !enviandoOrcamento
                                                ? {
                                                      scale: 1.02,
                                                      boxShadow:
                                                          '0 0 30px rgba(255,106,61,0.28)'
                                                  }
                                                : {}
                                        }
                                        whileTap={
                                            !enviandoOrcamento
                                                ? { scale: 0.97 }
                                                : {}
                                        }
                                    >
                                        {enviandoOrcamento
                                            ? 'Enviando...'
                                            : 'Enviar'}
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: '100vh',
        background: '#070707',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    },

    backgroundGlowOne: {
        position: 'fixed',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'rgba(255, 106, 61, 0.13)',
        filter: 'blur(100px)',
        top: '-180px',
        right: '-120px',
        pointerEvents: 'none',
        zIndex: 0
    },

    backgroundGlowTwo: {
        position: 'fixed',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'rgba(255, 106, 61, 0.08)',
        filter: 'blur(110px)',
        bottom: '-180px',
        left: '-120px',
        pointerEvents: 'none',
        zIndex: 0
    },

    gridBackground: {
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.16,
        backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
        maskImage:
            'linear-gradient(to bottom, black, transparent 85%)'
    },

    container: {
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '760px',
        margin: '0 auto',
        padding: '34px 22px 60px',
        boxSizing: 'border-box'
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '20px',
        marginBottom: '24px'
    },

    miniLabel: {
        color: '#ff6a3d',
        fontSize: '11px',
        fontWeight: '800',
        letterSpacing: '4px',
        margin: '0 0 8px',
        textShadow: '0 0 18px rgba(255,106,61,0.35)'
    },

    logo: {
        fontSize: 'clamp(24px, 5vw, 34px)',
        lineHeight: 1.05,
        fontWeight: '700',
        letterSpacing: '-1.2px',
        margin: 0,
        color: '#fff'
    },

    subLogo: {
        color: '#777',
        fontSize: '13px',
        margin: '8px 0 0'
    },

    btnSair: {
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid #292929',
        color: '#888',
        padding: '9px 17px',
        borderRadius: '999px',
        fontSize: '12px',
        cursor: 'pointer',
        height: 'fit-content',
        transition: 'all 0.25s ease',
        backdropFilter: 'blur(10px)'
    },

    heroLine: {
        height: '1px',
        background:
            'linear-gradient(90deg, #ff6a3d, rgba(255,106,61,0.18), transparent)',
        marginBottom: '22px',
        maxWidth: '100%'
    },

    abasRow: {
        display: 'flex',
        gap: '8px',
        marginBottom: '26px',
        borderBottom: '1px solid #202020',
        flexWrap: 'wrap'
    },

    abaBotao: {
        position: 'relative',
        background: 'transparent',
        border: 'none',
        color: '#666',
        padding: '11px 4px 13px',
        fontSize: '14px',
        cursor: 'pointer',
        marginRight: '22px',
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        transition: 'color 0.25s ease'
    },

    abaBotaoAtiva: {
        position: 'relative',
        background: 'transparent',
        border: 'none',
        color: '#fff',
        padding: '11px 4px 13px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        marginRight: '22px',
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        borderBottom: '2px solid #ff6a3d',
        textShadow: '0 0 16px rgba(255,106,61,0.22)'
    },

    badgeContador: {
        background: '#ff6a3d',
        color: '#090909',
        fontSize: '10px',
        fontWeight: '900',
        borderRadius: '999px',
        minWidth: '20px',
        height: '20px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 18px rgba(255,106,61,0.28)'
    },

    comissaoCard: {
        position: 'relative',
        overflow: 'hidden',
        background:
            'linear-gradient(135deg, rgba(255,106,61,0.13), rgba(255,106,61,0.035) 55%, rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,106,61,0.24)',
        borderRadius: '20px',
        padding: '26px 22px',
        marginBottom: '22px',
        textAlign: 'center',
        boxShadow: '0 20px 70px rgba(0,0,0,0.28)',
        transition: 'all 0.3s ease'
    },

    comissaoGlow: {
        position: 'absolute',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'rgba(255,106,61,0.10)',
        filter: 'blur(55px)',
        top: '-110px',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none'
    },

    comissaoLabel: {
        position: 'relative',
        color: '#ff8a66',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        fontWeight: '700',
        margin: '0 0 9px'
    },

    comissaoValor: {
        position: 'relative',
        color: '#fff',
        fontSize: 'clamp(30px, 7vw, 42px)',
        fontWeight: '800',
        letterSpacing: '-1.5px',
        margin: '0 0 5px',
        textShadow: '0 0 30px rgba(255,106,61,0.18)'
    },

    comissaoDetalhe: {
        position: 'relative',
        color: '#777',
        fontSize: '12px',
        margin: 0
    },

    navegacaoDia: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        gap: '10px'
    },

    btnNav: {
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid #292929',
        color: '#aaa',
        padding: '10px 14px',
        borderRadius: '10px',
        fontSize: '12px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.25s ease'
    },

    diaAtual: {
        textAlign: 'center',
        flex: 1,
        minWidth: 0
    },

    diaTexto: {
        color: '#fff',
        fontSize: '13px',
        textTransform: 'capitalize',
        margin: 0,
        fontWeight: '600'
    },

    btnHoje: {
        background: 'none',
        border: 'none',
        color: '#ff6a3d',
        fontSize: '11px',
        cursor: 'pointer',
        textDecoration: 'underline',
        padding: '4px 0 0',
        transition: 'color 0.2s ease'
    },

    lista: {
        marginBottom: '24px'
    },

    vazio: {
        position: 'relative',
        textAlign: 'center',
        padding: '50px 25px',
        background: 'rgba(255,255,255,0.018)',
        borderRadius: '18px',
        border: '1px solid #222',
        overflow: 'hidden'
    },

    vazioPonto: {
        width: '7px',
        height: '7px',
        borderRadius: '50%',
        background: '#ff6a3d',
        margin: '0 auto 14px',
        boxShadow: '0 0 20px rgba(255,106,61,0.5)'
    },

    vazioTexto: {
        color: '#555',
        fontSize: '13px',
        margin: 0
    },

    card: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background:
            'linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015))',
        border: '1px solid #252525',
        borderRadius: '16px',
        padding: '17px',
        marginBottom: '10px',
        transition: 'all 0.3s ease',
        boxShadow: '0 12px 35px rgba(0,0,0,0.16)'
    },

    horaBadge: {
        background: '#ff6a3d',
        color: '#090909',
        fontWeight: '900',
        fontSize: '12px',
        padding: '9px 10px',
        borderRadius: '9px',
        minWidth: '54px',
        textAlign: 'center',
        boxShadow: '0 0 25px rgba(255,106,61,0.18)'
    },

    info: {
        flex: 1,
        minWidth: 0
    },

    clienteNome: {
        color: '#fff',
        fontSize: '14px',
        fontWeight: '700',
        margin: '0 0 5px'
    },

    detalhe: {
        color: '#777',
        fontSize: '12px',
        margin: '3px 0',
        lineHeight: 1.45
    },

    btnConcluir: {
        background: 'transparent',
        border: '1px solid rgba(255,106,61,0.65)',
        color: '#ff7c57',
        padding: '9px 12px',
        borderRadius: '8px',
        fontSize: '11px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        marginTop: '10px',
        transition: 'all 0.25s ease'
    },

    badgeConcluido: {
        textAlign: 'right',
        minWidth: '110px'
    },

    badgeConcluidoTexto: {
        color: '#68d391',
        fontSize: '12px',
        fontWeight: '700',
        margin: '0 0 3px'
    },

    badgeComissao: {
        color: '#777',
        fontSize: '11px',
        margin: 0
    },

    secaoTitulo: {
        color: '#fff',
        fontSize: '16px',
        fontWeight: '700',
        marginBottom: '13px',
        letterSpacing: '-0.2px'
    },

    pedidoCard: {
        background:
            'linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))',
        border: '1px solid #252525',
        borderRadius: '16px',
        padding: '18px',
        marginBottom: '10px',
        transition: 'all 0.3s ease',
        boxShadow: '0 12px 35px rgba(0,0,0,0.16)'
    },

    pedidoTagsRow: {
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap',
        margin: '10px 0'
    },

    pedidoTag: {
        background: 'rgba(255,106,61,0.06)',
        border: '1px solid rgba(255,106,61,0.20)',
        color: '#ff8563',
        fontSize: '11px',
        padding: '5px 10px',
        borderRadius: '999px'
    },

    linkReferencia: {
        display: 'inline-block',
        color: '#ff6a3d',
        fontSize: '12px',
        textDecoration: 'none',
        margin: '4px 0 7px',
        transition: 'color 0.2s ease'
    },

    statusPago: {
        color: '#68d391',
        fontSize: '12px',
        fontWeight: '700',
        margin: '9px 0 0'
    },

    statusPendente: {
        color: '#ff9a7d',
        fontSize: '12px',
        margin: '9px 0 0'
    },

    modalFundo: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 100
    },

    modalCard: {
        position: 'relative',
        overflow: 'hidden',
        background:
            'linear-gradient(145deg, #151515, #0d0d0d)',
        border: '1px solid #2d2d2d',
        borderRadius: '20px',
        padding: '26px',
        width: '100%',
        maxWidth: '400px',
        boxShadow:
            '0 30px 100px rgba(0,0,0,0.65), 0 0 60px rgba(255,106,61,0.08)'
    },

    modalAccent: {
        position: 'absolute',
        top: 0,
        left: '20px',
        right: '20px',
        height: '2px',
        background:
            'linear-gradient(90deg, transparent, #ff6a3d, transparent)',
        boxShadow: '0 0 20px rgba(255,106,61,0.5)'
    },

    modalTitulo: {
        color: '#fff',
        fontSize: '18px',
        fontWeight: '700',
        margin: '0 0 7px'
    },

    modalTexto: {
        color: '#777',
        fontSize: '13px',
        lineHeight: 1.5,
        margin: '0 0 20px'
    },

    label: {
        display: 'block',
        color: '#999',
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        fontWeight: '700',
        marginBottom: '7px'
    },

    input: {
        width: '100%',
        padding: '13px 15px',
        borderRadius: '10px',
        border: '1px solid #2c2c2c',
        background: '#080808',
        color: '#fff',
        fontSize: '14px',
        boxSizing: 'border-box',
        outline: 'none',
        marginBottom: '17px',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease'
    },

    avisoModal: {
        color: '#666',
        fontSize: '11px',
        lineHeight: '1.55',
        marginBottom: '18px'
    },

    modalBotoes: {
        display: 'flex',
        gap: '10px'
    },

    btnCancelar: {
        flex: 1,
        padding: '12px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid #292929',
        color: '#888',
        borderRadius: '9px',
        cursor: 'pointer',
        transition: 'all 0.25s ease'
    },

    btnConfirmar: {
        flex: 1,
        padding: '12px',
        background: '#ff6a3d',
        border: 'none',
        color: '#090909',
        fontWeight: '800',
        borderRadius: '9px',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: '0 8px 30px rgba(255,106,61,0.16)'
    }
};

export default PainelProfissional;