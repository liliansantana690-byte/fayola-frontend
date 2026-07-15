import React, { useState, useEffect } from 'react';
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
        useEffect(function() {
            carregarDados();
}, []);

    async function carregarDados() {
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
    }

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
            <div style={styles.header}>
                <h1 style={styles.logo}>💈 Fayola</h1>
                <p style={styles.nome}>{estabelecimento.nome}</p>
            </div>

            <div style={styles.abas}>
                {['hoje', 'servicos', 'profissionais'].map(function(a) {
                    return (
                        <button key={a} onClick={function() { setAba(a); }} style={aba === a ? styles.abaAtiva : styles.aba}>
                            {a === 'hoje' ? 'Agenda do Dia' : a === 'servicos' ? 'Serviços' : 'Profissionais'}
                        </button>
                    );
                })}
            </div>

            {aba === 'hoje' && (
                <div style={styles.secao}>
                    <h3 style={styles.titulo}>Agendamentos de Hoje</h3>
                    {agendamentos.length === 0 && <p style={styles.vazio}>Nenhum agendamento hoje.</p>}
                    {agendamentos.map(function(a) {
                        return (
                            <div key={a.id} style={styles.card}>
                                <div>
                                    <p style={styles.clienteNome}>{a.cliente_nome}</p>
                                    <p style={styles.detalhe}>✂️ {a.servico} — 👤 {a.profissional}</p>
                                    <p style={styles.detalhe}>🕐 {new Date(a.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    <p style={styles.detalhe}>📱 {a.cliente_whatsapp}</p>
                                </div>
                                <button onClick={function() { cancelar(a.id); }} style={styles.btnCancelar}>Cancelar</button>
                            </div>
                        );
                    })}
                </div>
            )}

            {aba === 'servicos' && (
                <div style={styles.secao}>
                    <h3 style={styles.titulo}>Serviços</h3>
                    <form onSubmit={criarServico} style={styles.form}>
                        <input style={styles.input} placeholder="Nome do serviço" value={novoServico.nome} onChange={function(e) { setNovoServico({...novoServico, nome: e.target.value}); }} />
                        <input style={styles.input} placeholder="Duração (min)" type="number" value={novoServico.duracao_minutos} onChange={function(e) { setNovoServico({...novoServico, duracao_minutos: e.target.value}); }} />
                        <input style={styles.input} placeholder="Preço (R$)" type="number" value={novoServico.preco} onChange={function(e) { setNovoServico({...novoServico, preco: e.target.value}); }} />
                        <button style={styles.botao} type="submit">Adicionar</button>
                    </form>
                    {servicos.map(function(s) {
                        return (
                            <div key={s.id} style={styles.card}>
                                <p style={styles.clienteNome}>{s.nome}</p>
                                <p style={styles.detalhe}>⏱ {s.duracao_minutos} min — R$ {parseFloat(s.preco).toFixed(2)}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {aba === 'profissionais' && (
                <div style={styles.secao}>
                    <h3 style={styles.titulo}>Profissionais</h3>
                    <form onSubmit={criarProfissional} style={styles.form}>
                        <input style={styles.input} placeholder="Nome" value={novoProfissional.nome} onChange={function(e) { setNovoProfissional({...novoProfissional, nome: e.target.value}); }} />
                        <input style={styles.input} placeholder="Especialidade" value={novoProfissional.especialidade} onChange={function(e) { setNovoProfissional({...novoProfissional, especialidade: e.target.value}); }} />
                        <button style={styles.botao} type="submit">Adicionar</button>
                    </form>
                    {profissionais.map(function(p) {
                        return (
                            <div key={p.id} style={styles.card}>
                                <p style={styles.clienteNome}>{p.nome}</p>
                                <p style={styles.detalhe}>{p.especialidade}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '24px', background: '#1a1a2e', minHeight: '100vh', color: '#f8fafc' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    logo: { color: '#e94560', margin: 0 },
    nome: { color: '#94a3b8', margin: 0 },
    abas: { display: 'flex', gap: '8px', marginBottom: '24px' },
    aba: { padding: '10px 20px', background: '#16213e', color: '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    abaAtiva: { padding: '10px 20px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
    secao: { background: '#16213e', padding: '24px', borderRadius: '12px' },
    titulo: { color: '#94a3b8', marginBottom: '16px' },
    card: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f3460', padding: '16px', borderRadius: '8px', marginBottom: '8px' },
    clienteNome: { margin: '0 0 4px', fontWeight: 'bold', color: '#f8fafc' },
    detalhe: { margin: '2px 0', fontSize: '13px', color: '#94a3b8' },
    btnCancelar: { padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    form: { marginBottom: '16px' },
    input: { width: '100%', padding: '10px', marginBottom: '8px', borderRadius: '8px', border: 'none', background: '#0f3460', color: '#f8fafc', fontSize: '14px', boxSizing: 'border-box' },
    botao: { width: '100%', padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
    vazio: { color: '#64748b', textAlign: 'center' }
};

export default Dashboard;