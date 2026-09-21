import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

function PainelProfissional({ nome, onLogout }) {
    const [agenda, setAgenda] = useState([]);
    const [comissao, setComissao] = useState({ total: 0, atendimentos: 0 });
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [modalAberto, setModalAberto] = useState(null);
    const [valorRecebido, setValorRecebido] = useState('');

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const carregarDados = useCallback(async function() {
        try {
            const a = await api.get('/profissionais/minha-agenda', { headers });
            const c = await api.get('/profissionais/minha-comissao', { headers });
            setAgenda(a.data);
            setComissao(c.data);
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

    function formatarHora(data_hora) {
        return new Date(data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }

    function formatarDataTitulo(data) {
        return data.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    }

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('profissional_id');
        localStorage.removeItem('nome');
        onLogout();
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
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '24px', fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
    logoIcon: { fontSize: '18px', color: '#c9a96e' },
    logo: { fontSize: '18px', fontWeight: '700', letterSpacing: '3px', margin: '4px 0 2px' },
    subLogo: { color: '#666', fontSize: '13px', margin: 0 },
    btnSair: { background: 'transparent', border: '1px solid #2a2a2a', color: '#888', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', height: 'fit-content' },
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
    detalhe: { color: '#666', fontSize: '12px', margin: '2px 0' },
    btnConcluir: { background: 'transparent', border: '1px solid #c9a96e', color: '#c9a96e', padding: '8px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' },
    badgeConcluido: { textAlign: 'right' },
    badgeConcluidoTexto: { color: '#5fbf6e', fontSize: '12px', fontWeight: '600', margin: '0 0 2px' },
    badgeComissao: { color: '#888', fontSize: '11px', margin: 0 },
    modalFundo: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    modalCard: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '360px' },
    modalTitulo: { color: '#fff', fontSize: '16px', margin: '0 0 6px' },
    modalTexto: { color: '#888', fontSize: '13px', margin: '0 0 16px' },
    label: { display: 'block', color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' },
    input: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0a0a0a', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none', marginBottom: '16px' },
    modalBotoes: { display: 'flex', gap: '10px' },
    btnCancelar: { flex: 1, padding: '12px', background: 'transparent', border: '1px solid #2a2a2a', color: '#888', borderRadius: '8px', cursor: 'pointer' },
    btnConfirmar: { flex: 1, padding: '12px', background: '#c9a96e', border: 'none', color: '#0a0a0a', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' }
};

export default PainelProfissional;