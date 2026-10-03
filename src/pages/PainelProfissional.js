import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

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
    sconst [duracaoMinutos, setDuracaoMinutos] = useState('120');
    const [enviandoOrcamento, setEnviandoOrcamento] = useState(false);

    const token = localStorage.getItem('token');
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

    useEffect(function() { carregarDados(); }, [carregarDados]);

    function mesmoDia(dataHora, data) {
        const d = new Date(dataHora);
        return d.getFullYear() === data.getFullYear() && d.getMonth() === data.getMonth() && d.getDate() === data.getDate();
    }

    const agendaDoDia = agenda
        .filter(function(a) { return mesmoDia(a.data_hora, dataSelecionada); })
        .sort(function(a, b) { return new Date(a.data_hora) - new Date(b.data_hora); });

    const pedidosAguardando = pedidos.filter(function(p) { return p.status === 'aguardando_orcamento'; });
    const pedidosRespondidos = pedidos.filter(function(p) { return p.status !== 'aguardando_orcamento'; });

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
            await api.patch('/profissionais/agendamentos/' + modalAberto.id + '/concluir', { valor_pago_total: parseFloat(valorRecebido) }, { headers });
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
                { headers }
            );
            setModalOrcamento(null);
            carregarDados();
        } catch (err) {
            alert(err.response?.data?.erro || 'Erro ao enviar orçamento');
        }
        setEnviandoOrcamento(false);
    }

    function formatarHora(data_hora) {
        return new Date(data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    function formatarDataTitulo(data) {
        return data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    }

    function formatarDataHora(data_hora) {
        return new Date(data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('profissional_id');
        localStorage.removeItem('nome');
        onLogout();
    }

    function labelStatus(status) {
        if (status === 'orcamento_enviado') return 'Aguardando pagamento do sinal';
        if (status === 'convertido_agendamento') return 'Agendado';
        return status;
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <div style={styles.logoIcon}>✦</div>
                    <h1 style={styles.logo}>FAYOLA</h1>
                    <p style={styles.subLogo}>Painel de {nome}</p>
                </div>
                <button style={styles.btnSair} onClick={logout}>Sair</button>
            </div>

            <div style={styles.abasRow}>
                <button style={aba === 'agenda' ? styles.abaBotaoAtiva : styles.abaBotao} onClick={function() { setAba('agenda'); }}>
                    Agenda
                </button>
                <button style={aba === 'pedidos' ? styles.abaBotaoAtiva : styles.abaBotao} onClick={function() { setAba('pedidos'); }}>
                    Pedidos
                    {pedidosAguardando.length > 0 && <span style={styles.badgeContador}>{pedidosAguardando.length}</span>}
                </button>
            </div>

            {aba === 'agenda' && (
                <div>
                    <div style={styles.comissaoCard}>
                        <p style={styles.comissaoLabel}>Comissão acumulada</p>
                        <p style={styles.comissaoValor}>R$ {parseFloat(comissao.total).toFixed(2)}</p>
                        <p style={styles.comissaoDetalhe}>{comissao.atendimentos} atendimento(s) concluído(s)</p>
                    </div>

                    <div style={styles.navegacaoDia}>
                        <button style={styles.btnNav} onClick={function() { mudarDia(-1); }}>← Anterior</button>
                        <div style={styles.diaAtual}>
                            <p style={styles.diaTexto}>{formatarDataTitulo(dataSelecionada)}</p>
                            {!ehHoje() && <button style={styles.btnHoje} onClick={irParaHoje}>Voltar para hoje</button>}
                        </div>
                        <button style={styles.btnNav} onClick={function() { mudarDia(1); }}>Próximo →</button>
                    </div>

                    <div style={styles.lista}>
                        {agendaDoDia.length === 0 && (
                            <div style={styles.vazio}>
                                <p style={styles.vazioTexto}>Nenhum atendimento nesse dia</p>
                            </div>
                        )}
                        {agendaDoDia.map(function(a) {
                            return (
                                <div key={a.id} style={styles.card}>
                                    <div style={styles.horaBadge}>{formatarHora(a.data_hora)}</div>
                                    <div style={styles.info}>
                                        <p style={styles.clienteNome}>{a.cliente_nome}</p>
                                        <p style={styles.detalhe}>{a.servico} · R$ {parseFloat(a.preco).toFixed(2)}</p>
                                        <p style={styles.detalhe}>WhatsApp: {a.cliente_whatsapp}</p>
                                    </div>
                                    {a.status === 'confirmado' && (
                                        <button style={styles.btnConcluir} onClick={function() { abrirModalConcluir(a); }}>Marcar concluído</button>
                                    )}
                                    {a.status === 'concluido' && (
                                        <div style={styles.badgeConcluido}>
                                            <p style={styles.badgeConcluidoTexto}>Concluído</p>
                                            <p style={styles.badgeComissao}>Comissão: R$ {parseFloat(a.comissao_valor).toFixed(2)}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {aba === 'pedidos' && (
                <div>
                    <h3 style={styles.secaoTitulo}>Aguardando orçamento</h3>
                    {pedidosAguardando.length === 0 && (
                        <div style={styles.vazio}>
                            <p style={styles.vazioTexto}>Nenhum pedido novo</p>
                        </div>
                    )}
                    {pedidosAguardando.map(function(p) {
                        return (
                            <div key={p.id} style={styles.pedidoCard}>
                                <p style={styles.clienteNome}>{p.cliente_nome}</p>
                                <p style={styles.detalhe}>{p.descricao}</p>
                                <div style={styles.pedidoTagsRow}>
                                    {p.estilo && <span style={styles.pedidoTag}>{p.estilo}</span>}
                                    {p.tamanho_aproximado && <span style={styles.pedidoTag}>{p.tamanho_aproximado}</span>}
                                    {p.local_corpo && <span style={styles.pedidoTag}>{p.local_corpo}</span>}
                                </div>
                                {p.referencia_url && (
                                    <a href={p.referencia_url} target="_blank" rel="noreferrer" style={styles.linkReferencia}>Ver referência →</a>
                                )}
                                {p.observacoes && <p style={styles.detalhe}>Obs: {p.observacoes}</p>}
                                <p style={styles.detalhe}>WhatsApp: {p.cliente_whatsapp}</p>
                                <button style={styles.btnConcluir} onClick={function() { abrirModalOrcamento(p); }}>Enviar orçamento</button>
                            </div>
                        );
                    })}

                    <h3 style={{...styles.secaoTitulo, marginTop: '28px'}}>Já respondidos</h3>
                    {pedidosRespondidos.length === 0 && (
                        <div style={styles.vazio}>
                            <p style={styles.vazioTexto}>Nenhum pedido respondido ainda</p>
                        </div>
                    )}
                    {pedidosRespondidos.map(function(p) {
                        return (
                            <div key={p.id} style={styles.pedidoCard}>
                                <p style={styles.clienteNome}>{p.cliente_nome}</p>
                                <p style={styles.detalhe}>{p.descricao}</p>
                                <p style={styles.detalhe}>Tattoo: R$ {parseFloat(p.valor_tattoo).toFixed(2)} · Sinal: R$ {parseFloat(p.valor_sinal).toFixed(2)}</p>
                                {p.data_hora && <p style={styles.detalhe}>Agendado para {formatarDataHora(p.data_hora)}</p>}
                                <p style={p.sinal_status === 'pago' ? styles.statusPago : styles.statusPendente}>
                                    {p.sinal_status === 'pago' ? '✓ Sinal pago' : labelStatus(p.status)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            {modalAberto && (
                <div style={styles.modalFundo}>
                    <div style={styles.modalCard}>
                        <h3 style={styles.modalTitulo}>Concluir atendimento</h3>
                        <p style={styles.modalTexto}>{modalAberto.cliente_nome} · {modalAberto.servico}</p>
                        <label style={styles.label}>Valor total recebido (R$)</label>
                        <input
                            style={styles.input}
                            type="number"
                            step="0.01"
                            value={valorRecebido}
                            onChange={function(e) { setValorRecebido(e.target.value); }}
                        />
                        <div style={styles.modalBotoes}>
                            <button style={styles.btnCancelar} onClick={function() { setModalAberto(null); }}>Cancelar</button>
                            <button style={styles.btnConfirmar} onClick={confirmarConclusao}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {modalOrcamento && (
                <div style={styles.modalFundo}>
                    <div style={styles.modalCard}>
                        <h3 style={styles.modalTitulo}>Enviar orçamento</h3>
                        <p style={styles.modalTexto}>{modalOrcamento.cliente_nome} · {modalOrcamento.descricao}</p>
                        <label style={styles.label}>Valor da tattoo (R$)</label>
                        <input
                            style={styles.input}
                            type="number"
                            step="0.01"
                            placeholder="Ex: 600"
                            value={valorTattoo}
                            onChange={function(e) { setValorTattoo(e.target.value); }}
                        />
                        <label style={styles.label}>Valor do sinal (R$)</label>
                        <input
                            style={styles.input}
                            type="number"
                            step="0.01"
                            placeholder="Ex: 180"
                            value={valorSinal}
                            onChange={function(e) { setValorSinal(e.target.value); }}
                        />
                        <label style={styles.label}>Duração estimada da sessão (minutos)</label>
                        <input
                            style={styles.input}
                            type="number"
                            step="15"
                            placeholder="Ex: 120"
                            value={duracaoMinutos}
                            onChange={function(e) { setDuracaoMinutos(e.target.value); }}
                        />
                        <p style={styles.avisoModal}>O cliente recebe esse valor automaticamente por WhatsApp, com o link pra pagar o sinal. A duração evita que outro cliente marque no mesmo horário.</p>o
                        <div style={styles.modalBotoes}>
                            <button style={styles.btnCancelar} onClick={function() { setModalOrcamento(null); }}>Cancelar</button>
                            <button style={styles.btnConfirmar} onClick={enviarOrcamento} disabled={enviandoOrcamento}>
                                {enviandoOrcamento ? 'Enviando...' : 'Enviar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px', fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
    logoIcon: { fontSize: '18px', color: '#c9a96e' },
    logo: { fontSize: '18px', fontWeight: '700', letterSpacing: '3px', margin: '4px 0 2px' },
    subLogo: { color: '#666', fontSize: '13px', margin: 0 },
    btnSair: { background: 'transparent', border: '1px solid #2a2a2a', color: '#888', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', height: 'fit-content' },
    abasRow: { display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #262626' },
    abaBotao: { background: 'transparent', border: 'none', color: '#666', padding: '10px 4px', fontSize: '14px', cursor: 'pointer', borderBottom: '2px solid transparent', marginRight: '20px', display: 'flex', alignItems: 'center', gap: '6px' },
    abaBotaoAtiva: { background: 'transparent', border: 'none', color: '#c9a96e', padding: '10px 4px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', borderBottom: '2px solid #c9a96e', marginRight: '20px', display: 'flex', alignItems: 'center', gap: '6px' },
    badgeContador: { background: '#e05252', color: '#fff', fontSize: '11px', fontWeight: '700', borderRadius: '10px', padding: '1px 7px' },
    comissaoCard: { background: '#1f1a0f', border: '1px solid #3a3020', borderRadius: '12px', padding: '20px', marginBottom: '20px', textAlign: 'center' },
    comissaoLabel: { color: '#c9a96e', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 6px' },
    comissaoValor: { color: '#fff', fontSize: '28px', fontWeight: '700', margin: '0 0 4px' },
    comissaoDetalhe: { color: '#888', fontSize: '12px', margin: 0 },
    navegacaoDia: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '8px' },
    btnNav: { background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#c9a96e', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' },
    diaAtual: { textAlign: 'center', flex: 1 },
    diaTexto: { color: '#fff', fontSize: '13px', textTransform: 'capitalize', margin: '0 0 4px' },
    btnHoje: { background: 'none', border: 'none', color: '#c9a96e', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline', padding: 0 },
    lista: { marginBottom: '24px' },
    vazio: { textAlign: 'center', padding: '40px', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #2a2a2a' },
    vazioTexto: { color: '#444', fontSize: '14px' },
    card: { display: 'flex', alignItems: 'center', gap: '16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '16px', marginBottom: '10px' },
    horaBadge: { background: '#c9a96e', color: '#0a0a0a', fontWeight: '700', fontSize: '13px', padding: '8px 10px', borderRadius: '8px', minWidth: '54px', textAlign: 'center' },
    info: { flex: 1 },
    clienteNome: { color: '#fff', fontSize: '14px', fontWeight: '600', margin: '0 0 4px' },
    detalhe: { color: '#888', fontSize: '12px', margin: '2px 0' },
    btnConcluir: { background: 'transparent', border: '1px solid #c9a96e', color: '#c9a96e', padding: '8px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap', marginTop: '10px' },
    badgeConcluido: { textAlign: 'right' },
    badgeConcluidoTexto: { color: '#5fbf6e', fontSize: '12px', fontWeight: '600', margin: '0 0 2px' },
    badgeComissao: { color: '#888', fontSize: '11px', margin: 0 },
    secaoTitulo: { color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '12px' },
    pedidoCard: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '16px', marginBottom: '10px' },
    pedidoTagsRow: { display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '8px 0' },
    pedidoTag: { background: '#0a0a0a', border: '1px solid #2a2a2a', color: '#c9a96e', fontSize: '11px', padding: '4px 10px', borderRadius: '12px' },
    linkReferencia: { color: '#c9a96e', fontSize: '12px', textDecoration: 'underline' },
    statusPago: { color: '#5fbf6e', fontSize: '12px', fontWeight: '600', margin: '8px 0 0' },
    statusPendente: { color: '#c9a96e', fontSize: '12px', margin: '8px 0 0' },
    modalFundo: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 100 },
    modalCard: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '360px' },
    modalTitulo: { color: '#fff', fontSize: '16px', margin: '0 0 6px' },
    modalTexto: { color: '#888', fontSize: '13px', margin: '0 0 16px' },
    label: { display: 'block', color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' },
    input: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0a0a0a', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none', marginBottom: '16px' },
    avisoModal: { color: '#666', fontSize: '11px', lineHeight: '1.5', marginBottom: '16px' },
    modalBotoes: { display: 'flex', gap: '10px' },
    btnCancelar: { flex: 1, padding: '12px', background: 'transparent', border: '1px solid #2a2a2a', color: '#888', borderRadius: '8px', cursor: 'pointer' },
    btnConfirmar: { flex: 1, padding: '12px', background: '#c9a96e', border: 'none', color: '#0a0a0a', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' }
};

export default PainelProfissional;