import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { buscarDia } from '../services/availabilityApi';

function dataHojeLocal() {
    const agora = new Date();
    return agora.getFullYear() + '-' + String(agora.getMonth() + 1).padStart(2, '0') + '-' + String(agora.getDate()).padStart(2, '0');
}

function gerarHorariosDisponiveis(dia, duracaoMinutos, data) {
    const intervalos = dia.horarios && dia.horarios.length ? dia.horarios : (dia.horario ? [dia.horario] : []);
    const ocupados = dia.ocupados || [];
    const duracao = Math.max(1, Number(duracaoMinutos) || 60);
    const agora = new Date();
    const resultado = [];
    intervalos.forEach(function(intervalo) {
        const [inicioHora, inicioMinuto] = String(intervalo.hora_inicio).slice(0, 5).split(':').map(Number);
        const [fimHora, fimMinuto] = String(intervalo.hora_fim).slice(0, 5).split(':').map(Number);
        const inicio = inicioHora * 60 + inicioMinuto;
        const fim = fimHora * 60 + fimMinuto;
        for (let minuto = inicio; minuto + duracao <= fim; minuto += 30) {
            const hora = String(Math.floor(minuto / 60)).padStart(2, '0') + ':' + String(minuto % 60).padStart(2, '0');
            const candidato = data + 'T' + hora;
            if (new Date(candidato) <= agora) continue;
            const finalMinuto = minuto + duracao;
            const fimCandidato = data + 'T' + String(Math.floor(finalMinuto / 60)).padStart(2, '0') + ':' + String(finalMinuto % 60).padStart(2, '0');
            const conflita = ocupados.some(function(item) { return candidato < item.fim && item.inicio < fimCandidato; });
            if (!conflita && !resultado.includes(hora)) resultado.push(hora);
        }
    });
    return resultado.sort();
}

function Agendar() {
    const params = new URLSearchParams(window.location.search);
    const estabelecimentoId = params.get('id');
    const profissionalIdUrl = params.get('profissional'); // trava o profissional quando vem de um link individual

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
    const [pagamento, setPagamento] = useState(null);
    const [agendamentoId, setAgendamentoId] = useState(null);
    const [statusPagamento, setStatusPagamento] = useState('aguardando');
    const [segundosRestantes, setSegundosRestantes] = useState(0);
    const [dataSelecionada, setDataSelecionada] = useState('');
    const [disponibilidadeDia, setDisponibilidadeDia] = useState(null);
    const [carregandoDisponibilidade, setCarregandoDisponibilidade] = useState(false);
    const [erroDisponibilidade, setErroDisponibilidade] = useState('');
    const [atualizarDisponibilidade, setAtualizarDisponibilidade] = useState(0);
    const [copiado, setCopiado] = useState(false);
    const pollingRef = useRef(null);
    const countdownRef = useRef(null);

    useEffect(function() {
        if (!estabelecimentoId) return;
        api.get('/auth/estabelecimento/' + estabelecimentoId).then(function(r) { setEstabelecimento(r.data); });
        api.get('/servicos/' + estabelecimentoId).then(function(r) { setServicos(r.data); });
        api.get('/profissionais/' + estabelecimentoId).then(function(r) { setProfissionais(r.data); });
    }, [estabelecimentoId]);

    // Quando o link já vem com um profissional definido, trava a escolha automaticamente
    useEffect(function() {
        if (profissionalIdUrl && profissionais.length > 0) {
            setForm(function(f) { return { ...f, profissional_id: profissionalIdUrl }; });
        }
    }, [profissionalIdUrl, profissionais]);

    useEffect(function() {
        if (!form.profissional_id || !dataSelecionada) {
            setDisponibilidadeDia(null);
            setErroDisponibilidade('');
            return;
        }
        let ativo = true;
        setCarregandoDisponibilidade(true);
        setErroDisponibilidade('');
        buscarDia(form.profissional_id, dataSelecionada).then(function(dia) {
            if (ativo) setDisponibilidadeDia(dia);
        }).catch(function() {
            if (ativo) {
                setDisponibilidadeDia(null);
                setErroDisponibilidade('Não foi possível carregar os horários. Tente novamente.');
            }
        }).finally(function() {
            if (ativo) setCarregandoDisponibilidade(false);
        });
        return function() { ativo = false; };
    }, [form.profissional_id, dataSelecionada, atualizarDisponibilidade]);

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
            const mensagem = err.response?.data?.erro || 'Erro ao agendar. Tente novamente.';
            setErro(mensagem);
            if (err.response?.status === 409) {
                setForm(function(f) { return { ...f, data_hora: '' }; });
                setAtualizarDisponibilidade(function(n) { return n + 1; });
                setEtapa(2);
            }
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
    const profissionalTravado = profissionalIdUrl ? profissionais.find(function(p) { return p.id == profissionalIdUrl; }) : null;

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
                        setForm({ servico_id: '', profissional_id: profissionalIdUrl || '', data_hora: '', cliente_nome: '', cliente_whatsapp: '' });
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

                                {profissionalIdUrl ? (
                                    <div style={styles.listaSelecao}>
                                        <div style={styles.itemSelecionado}>
                                            <p style={styles.itemNome}>{profissionalTravado ? profissionalTravado.nome : 'Carregando...'}</p>
                                            <p style={styles.itemDetalhe}>{profissionalTravado ? profissionalTravado.especialidade : ''}</p>
                                        </div>
                                        <p style={styles.linkTravadoAviso}>Este link é exclusivo deste profissional.</p>
                                    </div>
                                ) : (
                                    <div style={styles.listaSelecao}>
                                        {profissionais.map(function(p) {
                                            return (
                                                <div
                                                    key={p.id}
                                                    style={form.profissional_id == p.id ? styles.itemSelecionado : styles.itemSelecao}
                                                    onClick={function() { setForm(function(f) { return { ...f, profissional_id: p.id, data_hora: '' }; }); }}
                                                >
                                                    <p style={styles.itemNome}>{p.nome}</p>
                                                    <p style={styles.itemDetalhe}>{p.especialidade}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Data</label>
                                    <input style={styles.inputField} type="date" min={dataHojeLocal()} value={dataSelecionada} disabled={!form.profissional_id} onChange={function(e) { setDataSelecionada(e.target.value); setForm(function(f) { return { ...f, data_hora: '' }; }); }} />
                                </div>
                                {dataSelecionada && (
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Horários disponíveis</label>
                                        {carregandoDisponibilidade && <p style={styles.itemDetalhe}>Consultando horários...</p>}
                                        {!carregandoDisponibilidade && erroDisponibilidade && <p style={styles.erroDisponibilidade}>{erroDisponibilidade}</p>}
                                        {!carregandoDisponibilidade && disponibilidadeDia && !disponibilidadeDia.aberto && <p style={styles.itemDetalhe}>{disponibilidadeDia.motivo || 'Sem atendimento nesta data.'}</p>}
                                        {!carregandoDisponibilidade && disponibilidadeDia?.aberto && gerarHorariosDisponiveis(disponibilidadeDia, servicoSelecionado?.duracao_minutos || 60, dataSelecionada).length === 0 && <p style={styles.itemDetalhe}>Não há horários livres nesta data. Escolha outra.</p>}
                                        {!carregandoDisponibilidade && disponibilidadeDia?.aberto && <div style={styles.gradeHorarios}>{gerarHorariosDisponiveis(disponibilidadeDia, servicoSelecionado?.duracao_minutos || 60, dataSelecionada).map(function(hora) { const selecionado = form.data_hora === dataSelecionada + 'T' + hora; return <button key={hora} type="button" style={selecionado ? styles.horarioSelecionado : styles.horarioBotao} onClick={function() { setForm(function(f) { return { ...f, data_hora: dataSelecionada + 'T' + hora }; }); }}>{hora}</button>; })}</div>}
                                    </div>
                                )}
                                {erro && <p style={styles.erroDisponibilidade}>{erro}</p>}
                                <div style={styles.btnRow}>
                                    <button type="button" style={styles.botaoSecundario} onClick={function() { setEtapa(1); }}>← Voltar</button>
                                    <button type="button" style={styles.botao} disabled={!form.profissional_id || !form.data_hora} onClick={function() { setErro(''); setEtapa(3); }}>Continuar →</button>
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
    linkTravadoAviso: { color: '#666666', fontSize: '12px', margin: '4px 0 0' },
    inputGroup: { marginBottom: '16px' },
    label: { display: 'block', color: '#888888', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' },
    inputField: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0a0a0a', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
    gradeHorarios: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '8px' },
    horarioBotao: { padding: '11px 6px', borderRadius: '8px', border: '1px solid #3a3a3a', background: '#0a0a0a', color: '#ddd', cursor: 'pointer' },
    horarioSelecionado: { padding: '11px 6px', borderRadius: '8px', border: '1px solid #c9a96e', background: '#1f1a0f', color: '#c9a96e', fontWeight: '700', cursor: 'pointer' },
    erroDisponibilidade: { color: '#e05252', fontSize: '13px' },
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