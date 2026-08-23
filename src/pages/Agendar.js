import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

function Agendar() {
    const estabelecimentoId = new URLSearchParams(window.location.search).get('id');
    const [servicos, setServicos] = useState([]);
    const [profissionais, setProfissionais] = useState([]);
    const [estabelecimento, setEstabelecimento] = useState(null);
    const [etapa, setEtapa] = useState(1);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        servico_id: '',
        profissional_id: '',
        data_hora: '',
        cliente_nome: '',
        cliente_whatsapp: ''
    });
    const [sucesso, setSucesso] = useState(false);
    const [erro, setErro] = useState('');
    const [pagamento, setPagamento] = useState(null); // { qr_code, qr_code_base64, expira_em }
    const [agendamentoId, setAgendamentoId] = useState(null);
    const [statusPagamento, setStatusPagamento] = useState('aguardando'); // aguardando | expirado
    const [segundosRestantes, setSegundosRestantes] = useState(0);
    const [copiado, setCopiado] = useState(false);
    const pollingRef = useRef(null);
    const countdownRef = useRef(null);

    useEffect(function() {
        if (!estabelecimentoId) return;
        api.get('/auth/estabelecimento/' + estabelecimentoId).then(function(r) { setEstabelecimento(r.data); });
        api.get('/servicos/' + estabelecimentoId).then(function(r) { setServicos(r.data); });
        api.get('/profissionais/' + estabelecimentoId).then(function(r) { setProfissionais(r.data); });
    }, [estabelecimentoId]);

    useEffect(function() {
        return function() {
            if (pollingRef.current) clearInterval(pollingRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, []);

    async function handleAgendar(e) {
        e.preventDefault();
        if (loading) return;
        setErro('');
        setLoading(true);
        try {
            const resp = await api.post('/agendamentos', {
                estabelecimento_id: parseInt(estabelecimentoId),
                profissional_id: parseInt(form.profissional_id),
                servico_id: parseInt(form.servico_id),
                cliente_nome: form.cliente_nome,
                cliente_whatsapp: form.cliente_whatsapp,
                data_hora: form.data_hora
            });

            const { agendamento, pagamento: pagamentoResp } = resp.data;
            setAgendamentoId(agendamento.id);
            setPagamento(pagamentoResp);
            setStatusPagamento('aguardando');
            setEtapa(4);
            iniciarContagem(pagamentoResp.expira_em);
            iniciarPolling(agendamento.id);
        } catch (err) {
            setErro('Erro ao agendar. Tente novamente.');
        }
        setLoading(false);
    }

    function iniciarContagem(expiraEm) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        function calcular() {
            const restante = Math.max(0, Math.floor((new Date(expiraEm).getTime() - Date.now()) / 1000));
            setSegundosRestantes(restante);
            return restante;
        }
        calcular();
        countdownRef.current = setInterval(function() {
            const restante = calcular();
            if (restante <= 0) {
                clearInterval(countdownRef.current);
                setStatusPagamento('expirado');
                if (pollingRef.current) clearInterval(pollingRef.current);
            }
        }, 1000);
    }

    function iniciarPolling(id) {
        if (pollingRef.current) clearInterval(pollingRef.current);
        pollingRef.current = setInterval(async function() {
            try {
                const r = await api.get('/agendamentos/' + id + '/status');
                if (r.data.status === 'confirmado') {
                    clearInterval(pollingRef.current);
                    clearInterval(countdownRef.current);
                    setSucesso(true);
                } else if (r.data.status === 'expirado') {
                    clearInterval(pollingRef.current);
                    clearInterval(countdownRef.current);
                    setStatusPagamento('expirado');
                }
            } catch (err) {
                // mantém tentando no próximo ciclo
            }
        }, 4000);
    }

    function copiarCodigoPix() {
        if (!pagamento || !pagamento.qr_code) return;
        navigator.clipboard.writeText(pagamento.qr_code).then(function() {
            setCopiado(true);
            setTimeout(function() { setCopiado(false); }, 2500);
        });
    }

    function tentarNovamente() {
        setPagamento(null);
        setAgendamentoId(null);
        setStatusPagamento('aguardando');
        setEtapa(3);
    }

    function formatarTempo(segundos) {
        const m = Math.floor(segundos / 60).toString().padStart(2, '0');
        const s = (segundos % 60).toString().padStart(2, '0');
        return m + ':' + s;
    }

    const servicoSelecionado = servicos.find(function(s) { return s.id == form.servico_id; });

    if (!estabelecimentoId) {
        return (
            <div style={styles.container}>
                <p style={{ color: '#e05252', textAlign: 'center' }}>Link inválido.</p>
            </div>
        );
    }

    if (sucesso) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.sucessoIcon}>✓</div>
                    <h2 style={styles.sucessoTitulo}>Agendamento Confirmado!</h2>
                    <p style={styles.sucessoTexto}>Sinal recebido. Você receberá uma confirmação via WhatsApp em breve.</p>
                    <button style={styles.botao} onClick={function() {
                        setSucesso(false);
                        setPagamento(null);
                        setAgendamentoId(null);
                        setForm({ servico_id: '', profissional_id: '', data_hora: '', cliente_nome: '', cliente_whatsapp: '' });
                        setEtapa(1);
                    }}>
                        Novo Agendamento
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoArea}>
                    <div style={styles.logoIcon}>✦</div>
                    <h1 style={styles.logo}>{estabelecimento ? estabelecimento.nome.toUpperCase() : 'CARREGANDO...'}</h1>
                    <p style={styles.tagline}>{estabelecimento ? (estabelecimento.tipo === 'salao' ? 'Salão de Beleza' : 'Barbearia') : ''}</p>
                    <p style={styles.powered}>powered by <span style={styles.poweredFayola}>Fayola</span></p>
                </div>

                <div style={styles.etapas}>
                    {[1, 2, 3, 4].map(function(n) {
                        return (
                            <div key={n} style={etapa >= n ? styles.etapaAtiva : styles.etapa}>{n}</div>
                        );
                    })}
                </div>

                {etapa < 4 && (
                    <form onSubmit={handleAgendar}>
                        {etapa === 1 && (
                            <div>
                                <h3 style={styles.etapaTitulo}>Escolha o Serviço</h3>
                                <div style={styles.listaSelecao}>
                                    {servicos.map(function(s) {
                                        return (
                                            <div
                                                key={s.id}
                                                style={form.servico_id == s.id ? styles.itemSelecionado : styles.itemSelecao}
                                                onClick={function() { setForm({...form, servico_id: s.id}); }}
                                            >
                                                <p style={styles.itemNome}>{s.nome}</p>
                                                <p style={styles.itemDetalhe}>{s.duracao_minutos} min · R$ {parseFloat(s.preco).toFixed(2)}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <button type="button" style={styles.botao} onClick={function() { if (form.servico_id) setEtapa(2); }}>
                                    Continuar →
                                </button>
                            </div>
                        )}

                        {etapa === 2 && (
                            <div>
                                <h3 style={styles.etapaTitulo}>Escolha o Profissional</h3>
                                <div style={styles.listaSelecao}>
                                    {profissionais.map(function(p) {
                                        return (
                                            <div
                                                key={p.id}
                                                style={form.profissional_id == p.id ? styles.itemSelecionado : styles.itemSelecao}
                                                onClick={function() { setForm({...form, profissional_id: p.id}); }}
                                            >
                                                <p style={styles.itemNome}>{p.nome}</p>
                                                <p style={styles.itemDetalhe}>{p.especialidade}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Data e Horário</label>
                                    <input
                                        style={styles.inputField}
                                        type="datetime-local"
                                        value={form.data_hora}
                                        onChange={function(e) { setForm({...form, data_hora: e.target.value}); }}
                                    />
                                </div>
                                <div style={styles.btnRow}>
                                    <button type="button" style={styles.botaoSecundario} onClick={function() { setEtapa(1); }}>← Voltar</button>
                                    <button type="button" style={styles.botao} onClick={function() { if (form.profissional_id && form.data_hora) setEtapa(3); }}>Continuar →</button>
                                </div>
                            </div>
                        )}

                        {etapa === 3 && (
                            <div>
                                <h3 style={styles.etapaTitulo}>Seus Dados</h3>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Nome completo</label>
                                    <input style={styles.inputField} placeholder="Seu nome" value={form.cliente_nome} onChange={function(e) { setForm({...form, cliente_nome: e.target.value}); }} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>WhatsApp</label>
                                    <input style={styles.inputField} placeholder="71999999999" value={form.cliente_whatsapp} onChange={function(e) { setForm({...form, cliente_whatsapp: e.target.value}); }} />
                                </div>
                                {servicoSelecionado && (
                                    <p style={styles.avisoSinal}>
                                        Um sinal de <strong>R$ {(parseFloat(servicoSelecionado.preco) * 0.3).toFixed(2)}</strong> (30% do serviço) será cobrado via PIX para confirmar o horário.
                                    </p>
                                )}
                                {erro && <p style={{ color: '#e05252', fontSize: '13px', marginBottom: '12px' }}>{erro}</p>}
                                <div style={styles.btnRow}>
                                    <button type="button" style={styles.botaoSecundario} onClick={function() { setEtapa(2); }}>← Voltar</button>
                                    <button type="submit" style={loading ? styles.botaoLoading : styles.botao} disabled={loading}>
                                        {loading ? 'Gerando PIX...' : 'Gerar PIX do Sinal'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                )}

                {etapa === 4 && pagamento && (
                    <div>
                        {statusPagamento === 'aguardando' && (
                            <div>
                                <h3 style={styles.etapaTitulo}>Pague o sinal via PIX</h3>
                                <p style={styles.pixAviso}>Seu horário só fica reservado após a confirmação do pagamento.</p>
                                <div style={styles.pixTimer}>Expira em {formatarTempo(segundosRestantes)}</div>
                                {pagamento.qr_code_base64 && (
                                    <img
                                        src={'data:image/png;base64,' + pagamento.qr_code_base64}
                                        alt="QR Code PIX"
                                        style={styles.qrImagem}
                                    />
                                )}
                                <button type="button" style={styles.botaoSecundario} onClick={copiarCodigoPix}>
                                    {copiado ? 'Código copiado ✓' : 'Copiar código PIX'}
                                </button>
                                <p style={styles.pixEspera}>Aguardando confirmação do pagamento...</p>
                            </div>
                        )}
                        {statusPagamento === 'expirado' && (
                            <div>
                                <h3 style={styles.etapaTitulo}>Tempo esgotado</h3>
                                <p style={styles.pixAviso}>O prazo para pagar o sinal expirou e o horário foi liberado.</p>
                                <button type="button" style={styles.botao} onClick={tentarNovamente}>Tentar novamente</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', background: '#0a0a0a', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' },
    card: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '480px' },
    logoArea: { textAlign: 'center', marginBottom: '28px' },
    logoIcon: { fontSize: '20px', color: '#c9a96e', marginBottom: '4px' },
    logo: { color: '#ffffff', fontSize: '20px', fontWeight: '700', letterSpacing: '3px', margin: '0 0 4px' },
    tagline: { color: '#888888', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' },
    powered: { color: '#444444', fontSize: '11px', margin: 0 },
    poweredFayola: { color: '#c9a96e', fontWeight: '700' },
    etapas: { display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '28px' },
    etapa: { width: '32px', height: '32px', borderRadius: '50%', background: '#2a2a2a', color: '#444444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' },
    etapaAtiva: { width: '32px', height: '32px', borderRadius: '50%', background: '#c9a96e', color: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' },
    etapaTitulo: { color: '#ffffff', fontSize: '16px', fontWeight: '600', marginBottom: '16px' },
    listaSelecao: { marginBottom: '16px' },
    itemSelecao: { background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px', marginBottom: '8px', cursor: 'pointer' },
    itemSelecionado: { background: '#1f1a0f', border: '1px solid #c9a96e', borderRadius: '10px', padding: '16px', marginBottom: '8px', cursor: 'pointer' },
    itemNome: { color: '#ffffff', fontSize: '15px', fontWeight: '600', margin: '0 0 4px' },
    itemDetalhe: { color: '#666666', fontSize: '13px', margin: 0 },
    inputGroup: { marginBottom: '16px' },
    label: { display: 'block', color: '#888888', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' },
    inputField: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0a0a0a', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
    botao: { flex: 1, padding: '14px', background: '#c9a96e', color: '#0a0a0a', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', cursor: 'pointer' },
    botaoLoading: { flex: 1, padding: '14px', background: '#8a7045', color: '#0a0a0a', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', cursor: 'not-allowed' },
    botaoSecundario: { width: '100%', padding: '14px 20px', background: 'transparent', color: '#c9a96e', border: '1px solid #c9a96e', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', marginBottom: '12px' },
    btnRow: { display: 'flex', gap: '12px', marginTop: '8px' },
    sucessoIcon: { width: '64px', height: '64px', background: '#c9a96e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#0a0a0a', margin: '0 auto 20px' },
    sucessoTitulo: { color: '#ffffff', fontSize: '22px', textAlign: 'center', marginBottom: '8px' },
    sucessoTexto: { color: '#666666', fontSize: '14px', textAlign: 'center', marginBottom: '28px' },
    avisoSinal: { color: '#c9a96e', fontSize: '13px', background: '#1f1a0f', border: '1px solid #3a3020', borderRadius: '8px', padding: '12px', marginBottom: '16px' },
    pixAviso: { color: '#888888', fontSize: '13px', textAlign: 'center', marginBottom: '16px' },
    pixTimer: { color: '#c9a96e', fontSize: '18px', fontWeight: '700', textAlign: 'center', marginBottom: '16px' },
    qrImagem: { display: 'block', width: '220px', height: '220px', margin: '0 auto 20px', borderRadius: '8px', background: '#ffffff', padding: '8px' },
    pixEspera: { color: '#666666', fontSize: '12px', textAlign: 'center', marginTop: '8px' }
};

export default Agendar;