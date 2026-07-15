import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

function Dashboard({ estabelecimento }) {
    const [agendamentos, setAgendamentos] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [profissionais, setProfissionais] = useState([]);
    const [aba, setAba] = useState('hoje');
    const [novoServico, setNovoServico] = useState({ nome: '', duracao_minutos: 60, preco: '' });
    const [novoProfissional, setNovoProfissional] = useState({ nome: '', especialidade: '' });

    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const carregarDados = useCallback(async function() {
        try {
            const a = await api.get('/agendamentos/hoje', { headers });
            const s = await api.get('/servicos/' + estabelecimento.estabelecimento_id);
            const p = await api.get('/profissionais/' + estabelecimento.estabelecimento_id);
            setAgendamentos(a.data);
            setServicos(s.data);
            setProfissionais(p.data);
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
        setNovoServico({ nome: '', duracao_minutos: 60, preco: '' });
        carregarDados();
    }

    async function criarProfissional(e) {
        e.preventDefault();
        await api.post('/profissionais', novoProfissional, { headers });
        setNovoProfissional({ nome: '', especialidade: '' });
        carregarDados();
    }

    async function cancelar(id) {
        await api.patch('/agendamentos/' + id + '/cancelar', {}, { headers });
        carregarDados();
    }

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.logoArea}>
                    <div style={styles.logoIcon}>✦</div>
                    <h1 style={styles.logo}>FAYOLA</h1>
                </div>
                <nav style={styles.nav}>
                    {[
                        { id: 'hoje', icon: '📅', label: 'Agenda' },
                        { id: 'servicos', icon: '✂️', label: 'Serviços' },
                        { id: 'profissionais', icon: '👤', label: 'Equipe' }
                    ].map(function(item) {
                        return (
                            <button
                                key={item.id}
                                onClick={function() { setAba(item.id); }}
                                style={aba === item.id ? styles.navItemAtivo : styles.navItem}
                            >
                                <span style={styles.navIcon}>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
                <div style={styles.estabelecimentoInfo}>
                    <p style={styles.estabelecimentoNome}>{estabelecimento.nome}</p>
                    <p style={styles.estabelecimentoSub}>Painel de Gestão</p>
                </div>
            </div>

            <div style={styles.main}>
                {aba === 'hoje' && (
                    <div>
                        <div style={styles.pageHeader}>
                            <h2 style={styles.pageTitle}>Agenda do Dia</h2>
                            <p style={styles.pageSubtitle}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        </div>

                        <div style={styles.statsRow}>
                            <div style={styles.statCard}>
                                <p style={styles.statNum}>{agendamentos.length}</p>
                                <p style={styles.statLabel}>Agendamentos</p>
                            </div>
                            <div style={styles.statCard}>
                                <p style={styles.statNum}>
                                    R$ {agendamentos.reduce(function(acc, a) { return acc + parseFloat(a.preco || 0); }, 0).toFixed(2)}
                                </p>
                                <p style={styles.statLabel}>Receita do dia</p>
                            </div>
                        </div>

                        {agendamentos.length === 0 && (
                            <div style={styles.vazio}>
                                <p style={styles.vazioIcon}>📅</p>
                                <p style={styles.vazioTexto}>Nenhum agendamento para hoje</p>
                            </div>
                        )}

                        {agendamentos.map(function(a) {
                            return (
                                <div key={a.id} style={styles.agendamentoCard}>
                                    <div style={styles.horaBadge}>
                                        {new Date(a.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div style={styles.agendamentoInfo}>
                                        <p style={styles.clienteNome}>{a.cliente_nome}</p>
                                        <p style={styles.agendamentoDetalhe}>✂️ {a.servico} · 👤 {a.profissional}</p>
                                        <p style={styles.agendamentoDetalhe}>📱 {a.cliente_whatsapp} · R$ {parseFloat(a.preco || 0).toFixed(2)}</p>
                                    </div>
                                    <button onClick={function() { cancelar(a.id); }} style={styles.btnCancelar}>
                                        Cancelar
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {aba === 'servicos' && (
                    <div>
                        <div style={styles.pageHeader}>
                            <h2 style={styles.pageTitle}>Serviços</h2>
                            <p style={styles.pageSubtitle}>Gerencie os serviços do seu estabelecimento</p>
                        </div>

                        <div style={styles.formCard}>
                            <h3 style={styles.formTitle}>Novo Serviço</h3>
                            <form onSubmit={criarServico}>
                                <input style={styles.input} placeholder="Nome do serviço" value={novoServico.nome} onChange={function(e) { setNovoServico({...novoServico, nome: e.target.value}); }} />
                                <div style={styles.inputRow}>
                                    <input style={{...styles.input, flex: 1}} placeholder="Duração (min)" type="number" value={novoServico.duracao_minutos} onChange={function(e) { setNovoServico({...novoServico, duracao_minutos: e.target.value}); }} />
                                    <input style={{...styles.input, flex: 1, marginLeft: '12px'}} placeholder="Preço (R$)" type="number" value={novoServico.preco} onChange={function(e) { setNovoServico({...novoServico, preco: e.target.value}); }} />
                                </div>
                                <button style={styles.botao} type="submit">+ Adicionar Serviço</button>
                            </form>
                        </div>

                        <div style={styles.listaGrid}>
                            {servicos.map(function(s) {
                                return (
                                    <div key={s.id} style={styles.servicoCard}>
                                        <div style={styles.servicoIcone}>✂️</div>
                                        <p style={styles.servicoNome}>{s.nome}</p>
                                        <p style={styles.servicoDetalhe}>{s.duracao_minutos} min</p>
                                        <p style={styles.servicoPreco}>R$ {parseFloat(s.preco).toFixed(2)}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {aba === 'profissionais' && (
                    <div>
                        <div style={styles.pageHeader}>
                            <h2 style={styles.pageTitle}>Equipe</h2>
                            <p style={styles.pageSubtitle}>Gerencie os profissionais do seu estabelecimento</p>
                        </div>

                        <div style={styles.formCard}>
                            <h3 style={styles.formTitle}>Novo Profissional</h3>
                            <form onSubmit={criarProfissional}>
                                <input style={styles.input} placeholder="Nome completo" value={novoProfissional.nome} onChange={function(e) { setNovoProfissional({...novoProfissional, nome: e.target.value}); }} />
                                <input style={styles.input} placeholder="Especialidade" value={novoProfissional.especialidade} onChange={function(e) { setNovoProfissional({...novoProfissional, especialidade: e.target.value}); }} />
                                <button style={styles.botao} type="submit">+ Adicionar Profissional</button>
                            </form>
                        </div>

                        <div style={styles.listaGrid}>
                            {profissionais.map(function(p) {
                                return (
                                    <div key={p.id} style={styles.servicoCard}>
                                        <div style={styles.servicoIcone}>👤</div>
                                        <p style={styles.servicoNome}>{p.nome}</p>
                                        <p style={styles.servicoDetalhe}>{p.especialidade}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', minHeight: '100vh', background: '#0a0a0a', color: '#ffffff', fontFamily: 'system-ui, sans-serif' },
    sidebar: { width: '220px', background: '#111111', borderRight: '1px solid #222222', display: 'flex', flexDirection: 'column', padding: '32px 0' },
    logoArea: { textAlign: 'center', padding: '0 24px 32px', borderBottom: '1px solid #222222' },
    logoIcon: { fontSize: '20px', color: '#c9a96e', marginBottom: '4px' },
    logo: { color: '#ffffff', fontSize: '18px', fontWeight: '700', letterSpacing: '4px', margin: 0 },
    nav: { padding: '24px 12px', flex: 1 },
    navItem: { width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: 'none', color: '#666666', fontSize: '14px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', textAlign: 'left' },
    navItemAtivo: { width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#c9a96e', fontSize: '14px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', textAlign: 'left' },
    navIcon: { fontSize: '16px' },
    estabelecimentoInfo: { padding: '24px', borderTop: '1px solid #222222' },
    estabelecimentoNome: { color: '#ffffff', fontSize: '13px', fontWeight: '600', margin: '0 0 4px' },
    estabelecimentoSub: { color: '#444444', fontSize: '11px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' },
    main: { flex: 1, padding: '40px' },
    pageHeader: { marginBottom: '32px' },
    pageTitle: { color: '#ffffff', fontSize: '24px', fontWeight: '700', margin: '0 0 8px' },
    pageSubtitle: { color: '#666666', fontSize: '14px', margin: 0 },
    statsRow: { display: 'flex', gap: '16px', marginBottom: '32px' },
    statCard: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px 24px', flex: 1 },
    statNum: { color: '#c9a96e', fontSize: '24px', fontWeight: '700', margin: '0 0 4px' },
    statLabel: { color: '#666666', fontSize: '12px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' },
    vazio: { textAlign: 'center', padding: '60px', background: '#1a1a1a', borderRadius: '12px', border: '1px solid #2a2a2a' },
    vazioIcon: { fontSize: '48px', marginBottom: '16px' },
    vazioTexto: { color: '#444444', fontSize: '16px' },
    agendamentoCard: { display: 'flex', alignItems: 'center', gap: '20px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px 24px', marginBottom: '12px' },
    horaBadge: { background: '#c9a96e', color: '#0a0a0a', fontWeight: '700', fontSize: '14px', padding: '8px 12px', borderRadius: '8px', minWidth: '60px', textAlign: 'center' },
    agendamentoInfo: { flex: 1 },
    clienteNome: { color: '#ffffff', fontSize: '16px', fontWeight: '600', margin: '0 0 6px' },
    agendamentoDetalhe: { color: '#666666', fontSize: '13px', margin: '2px 0' },
    btnCancelar: { padding: '8px 16px', background: 'transparent', color: '#e05252', border: '1px solid #e05252', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', letterSpacing: '1px' },
    formCard: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '28px', marginBottom: '28px' },
    formTitle: { color: '#c9a96e', fontSize: '14px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 20px' },
    input: { width: '100%', padding: '12px 16px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0a0a0a', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
    inputRow: { display: 'flex' },
    botao: { padding: '12px 24px', background: '#c9a96e', color: '#0a0a0a', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', cursor: 'pointer', marginTop: '4px' },
    listaGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' },
    servicoCard: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px', textAlign: 'center' },
    servicoIcone: { fontSize: '32px', marginBottom: '12px' },
    servicoNome: { color: '#ffffff', fontSize: '15px', fontWeight: '600', margin: '0 0 6px' },
    servicoDetalhe: { color: '#666666', fontSize: '13px', margin: '2px 0' },
    servicoPreco: { color: '#c9a96e', fontSize: '16px', fontWeight: '700', margin: '8px 0 0' }
};

export default Dashboard;