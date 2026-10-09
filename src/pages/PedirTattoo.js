import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { buscarDia, buscarStatusPedido, confirmarHorarioPedido } from '../services/availabilityApi';

function PedirTattoo() {
    const params = new URLSearchParams(window.location.search);
    const estabelecimentoIdUrl = params.get('id');
    const profissionalIdUrl = params.get('profissional');

    const partesCaminho = window.location.pathname.split('/').filter(Boolean);
    const tokenUrl = partesCaminho.length > 1 && partesCaminho[0] === 'pedido-tattoo' ? partesCaminho[1] : null;

    const [estabelecimento, setEstabelecimento] = useState(null);
    const [profissionais, setProfissionais] = useState([]);
    const [carregando, setCarregando] = useState(!!tokenUrl);
    const [pedido, setPedido] = useState(null);
    const [enviado, setEnviado] = useState(false);
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        profissional_id: profissionalIdUrl || '',
        cliente_nome: '',
        cliente_whatsapp: '',
        descricao: '',
        estilo: '',
        tamanho_aproximado: '',
        local_corpo: '',
        referencia_url: '',
        observacoes: ''
    });

    const [pagamento, setPagamento] = useState(null);
    const [segundosRestantes, setSegundosRestantes] = useState(0);
    const [dataEscolhida, setDataEscolhida] = useState('');
    const [horaEscolhida, setHoraEscolhida] = useState('');
    const [diaInfo, setDiaInfo] = useState(null);
    const pollingRef = useRef(null);
    const countdownRef = useRef(null);

    useEffect(function() {
        if (estabelecimentoIdUrl) {
            api.get('/auth/estabelecimento/' + estabelecimentoIdUrl).then(function(r) { setEstabelecimento(r.data); });
            api.get('/profissionais/' + estabelecimentoIdUrl).then(function(r) { setProfissionais(r.data); });
        }
    }, [estabelecimentoIdUrl]);

    useEffect(function() {
        if (!tokenUrl) return;
        carregarPedido();
        return function() {
            if (pollingRef.current) clearInterval(pollingRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
        };
    }, [tokenUrl]);

    async function carregarPedido() {
        try {
            const dados = await buscarStatusPedido(tokenUrl);
            setPedido(dados);
            setCarregando(false);
        } catch (err) {
            setErro('Não foi possível carregar este pedido.');
            setCarregando(false);
        }
    }

    async function enviarPedido(e) {
        e.preventDefault();
        setErro('');
        setLoading(true);
        try {
            const resp = await api.post('/pedidos-tattoo', {
                estabelecimento_id: parseInt(estabelecimentoIdUrl),
                profissional_id: form.profissional_id ? parseInt(form.profissional_id) : null,
                cliente_nome: form.cliente_nome,
                cliente_whatsapp: form.cliente_whatsapp,
                descricao: form.descricao,
                estilo: form.estilo,
                tamanho_aproximado: form.tamanho_aproximado,
                local_corpo: form.local_corpo,
                referencia_url: form.referencia_url,
                observacoes: form.observacoes
            });
            setPedido(resp.data);
            setEnviado(true);
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao enviar pedido. Tente novamente.');
        }
        setLoading(false);
    }

    async function gerarPix() {
        setErro('');
        setLoading(true);
        try {
            const resp = await api.post('/pedidos-tattoo/' + tokenUrl + '/gerar-pix');
            setPagamento(resp.data);
            iniciarContagem(resp.data.expira_em);
            iniciarPolling();
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao gerar PIX.');
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
            if (calcular() <= 0) clearInterval(countdownRef.current);
        }, 1000);
    }

    function iniciarPolling() {
        if (pollingRef.current) clearInterval(pollingRef.current);
        pollingRef.current = setInterval(async function() {
            try {
                const dados = await buscarStatusPedido(tokenUrl);
                setPedido(dados);
                if (dados.sinal_status === 'pago') {
                    clearInterval(pollingRef.current);
                    clearInterval(countdownRef.current);
                }
            } catch (err) {}
        }, 4000);
    }

    async function escolherData(valor) {
        setDataEscolhida(valor);
        setHoraEscolhida('');
        setDiaInfo(null);
        if (!valor || !pedido?.profissional_id) return;
        try {
            const info = await buscarDia(pedido.profissional_id, valor);
            setDiaInfo(info);
        } catch (err) {
            setErro('Não foi possível carregar a agenda desse dia.');
        }
    }

    function horaDisponivel(hora) {
        if (!diaInfo || !diaInfo.aberto) return false;
        const inicio = new Date(`${dataEscolhida}T${hora}:00`);
        const fim = new Date(inicio.getTime() + (pedido?.duracao_minutos || 120) * 60 * 1000);
        const fimExpediente = new Date(`${dataEscolhida}T${diaInfo.horario.hora_fim}`);
        if (fim > fimExpediente) return false;
        return !diaInfo.ocupados.some(function(o) {
            const oi = new Date(o.inicio);
            const of = new Date(o.fim);
            return inicio < of && oi < fim;
        });
    }

    function gerarOpcoesDeHora() {
        if (!diaInfo || !diaInfo.aberto) return [];
        const opcoes = [];
        const [hi, mi] = diaInfo.horario.hora_inicio.split(':').map(Number);
        const [hf, mf] = diaInfo.horario.hora_fim.split(':').map(Number);
        let minutos = hi * 60 + mi;
        const fimMinutos = hf * 60 + mf;
        while (minutos < fimMinutos) {
            const h = String(Math.floor(minutos / 60)).padStart(2, '0');
            const m = String(minutos % 60).padStart(2, '0');
            opcoes.push(`${h}:${m}`);
            minutos += 30;
        }
        return opcoes;
    }

    async function confirmarHorario() {
        setErro('');
        setLoading(true);
        try {
            const dataHora = `${dataEscolhida}T${horaEscolhida}:00`;
            const resp = await confirmarHorarioPedido(tokenUrl, dataHora);
            setPedido(resp);
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao confirmar horário.');
        }
        setLoading(false);
    }

    function copiarCodigoPix() {
        if (!pagamento?.qr_code) return;
        navigator.clipboard.writeText(pagamento.qr_code);
    }

    function formatarTempo(segundos) {
        const m = Math.floor(segundos / 60).toString().padStart(2, '0');
        const s = (segundos % 60).toString().padStart(2, '0');
        return m + ':' + s;
    }

    if (!tokenUrl) {
        if (!estabelecimentoIdUrl) {
            return <div style={styles.container}><p style={{ color: '#e05252' }}>Link inválido.</p></div>;
        }

        if (enviado) {
            return (
                <div style={styles.container}>
                    <div style={styles.card}>
                        <div style={styles.sucessoIcon}>✓</div>
                        <h2 style={styles.sucessoTitulo}>Pedido enviado!</h2>
                        <p style={styles.sucessoTexto}>
                            Você vai receber uma mensagem no WhatsApp assim que{' '}
                            {estabelecimento?.nome || 'o tatuador'} enviar o orçamento da sua tattoo.
                        </p>
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
                        <p style={styles.tagline}>Peça sua tattoo</p>
                    </div>
                    <form onSubmit={enviarPedido}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Descreva a tattoo que você quer</label>
                            <textarea
                                style={styles.textarea}
                                placeholder="Ex: Uma rosa em blackwork, algo delicado..."
                                value={form.descricao}
                                onChange={function(e) { setForm({ ...form, descricao: e.target.value }); }}
                                required
                            />
                        </div>
                        <div style={styles.inputRow}>
                            <div style={{ ...styles.inputGroup, flex: 1 }}>
                                <label style={styles.label}>Estilo</label>
                                <input style={styles.inputField} placeholder="Blackwork, fineline..." value={form.estilo} onChange={function(e) { setForm({ ...form, estilo: e.target.value }); }} />
                            </div>
                            <div style={{ ...styles.inputGroup, flex: 1, marginLeft: '12px' }}>
                                <label style={styles.label}>Tamanho aprox.</label>
                                <input style={styles.inputField} placeholder="10 cm" value={form.tamanho_aproximado} onChange={function(e) { setForm({ ...form, tamanho_aproximado: e.target.value }); }} />
                            </div>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Local do corpo</label>
                            <input style={styles.inputField} placeholder="Antebraço, costas..." value={form.local_corpo} onChange={function(e) { setForm({ ...form, local_corpo: e.target.value }); }} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Link de referência (opcional)</label>
                            <input style={styles.inputField} placeholder="Link do Instagram, Pinterest..." value={form.referencia_url} onChange={function(e) { setForm({ ...form, referencia_url: e.target.value }); }} />
                        </div>
                        {profissionais.length > 0 && !profissionalIdUrl && (
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Prefere algum tatuador específico? (opcional)</label>
                                <select style={styles.inputField} value={form.profissional_id} onChange={function(e) { setForm({ ...form, profissional_id: e.target.value }); }}>
                                    <option value="">Sem preferência</option>
                                    {profissionais.map(function(p) {
                                        return <option key={p.id} value={p.id}>{p.nome}</option>;
                                    })}
                                </select>
                            </div>
                        )}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Observações (opcional)</label>
                            <input style={styles.inputField} placeholder="Alguma outra informação..." value={form.observacoes} onChange={function(e) { setForm({ ...form, observacoes: e.target.value }); }} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Seu nome completo</label>
                            <input style={styles.inputField} placeholder="Seu nome" value={form.cliente_nome} onChange={function(e) { setForm({ ...form, cliente_nome: e.target.value }); }} required />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Seu WhatsApp</label>
                            <input style={styles.inputField} placeholder="71999999999" value={form.cliente_whatsapp} onChange={function(e) { setForm({ ...form, cliente_whatsapp: e.target.value }); }} required />
                        </div>
                        <p style={styles.aviso}>Você vai receber o orçamento e o link de pagamento direto no seu WhatsApp.</p>
                        {erro && <p style={styles.erro}>{erro}</p>}
                        <button type="submit" style={loading ? styles.botaoLoading : styles.botao} disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar pedido'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (carregando) {
        return <div style={styles.container}><p style={{ color: '#666' }}>Carregando...</p></div>;
    }

    if (erro && !pedido) {
        return <div style={styles.container}><div style={styles.card}><p style={styles.erro}>{erro}</p></div></div>;
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoArea}>
                    <div style={styles.logoIcon}>✦</div>
                    <h1 style={styles.logo}>FAYOLA</h1>
                </div>

                {pedido?.status === 'aguardando_orcamento' && (
                    <div style={{ textAlign: 'center' }}>
                        <p style={styles.sucessoIcon}>⏳</p>
                        <h2 style={styles.sucessoTitulo}>Aguardando orçamento</h2>
                        <p style={styles.sucessoTexto}>O tatuador ainda está avaliando seu pedido. Você vai receber uma mensagem no WhatsApp assim que o orçamento estiver pronto.</p>
                    </div>
                )}

                {pedido?.status === 'orcamento_enviado' && pedido?.sinal_status !== 'pago' && !pagamento && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={styles.sucessoTitulo}>Seu orçamento chegou!</h2>
                        <div style={styles.orcamentoBox}>
                            <p style={styles.orcamentoLinha}>Valor da tattoo: <strong>R$ {parseFloat(pedido.valor_tattoo).toFixed(2)}</strong></p>
                            <p style={styles.orcamentoLinha}>Sinal para reservar: <strong>R$ {parseFloat(pedido.valor_sinal).toFixed(2)}</strong></p>
                        </div>
                        {erro && <p style={styles.erro}>{erro}</p>}
                        <button style={loading ? styles.botaoLoading : styles.botao} onClick={gerarPix} disabled={loading}>
                            {loading ? 'Gerando...' : 'Pagar sinal via PIX'}
                        </button>
                    </div>
                )}

                {pagamento && pedido?.sinal_status !== 'pago' && (
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={styles.etapaTitulo}>Pague o sinal via PIX</h3>
                        <div style={styles.pixTimer}>Expira em {formatarTempo(segundosRestantes)}</div>
                        {pagamento.qr_code_base64 && (
                            <img src={'data:image/png;base64,' + pagamento.qr_code_base64} alt="QR Code PIX" style={styles.qrImagem} />
                        )}
                        <button type="button" style={styles.botaoSecundario} onClick={copiarCodigoPix}>Copiar código PIX</button>
                        <p style={styles.pixEspera}>Aguardando confirmação do pagamento...</p>
                    </div>
                )}

                {pedido?.sinal_status === 'pago' && pedido?.status !== 'convertido_agendamento' && (
                    <div>
                        <h2 style={styles.sucessoTitulo}>Sinal confirmado! ✓</h2>
                        <p style={styles.sucessoTexto}>Agora escolhe o dia e o horário da sua sessão:</p>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Dia</label>
                            <input
                                type="date"
                                style={styles.inputField}
                                value={dataEscolhida}
                                min={new Date().toISOString().split('T')[0]}
                                onChange={function(e) { escolherData(e.target.value); }}
                            />
                        </div>

                        {dataEscolhida && diaInfo && !diaInfo.aberto && (
                            <div style={styles.ocupadosBox}>
                                <p style={styles.ocupadosTitulo}>Não é possível agendar nesse dia.</p>
                                <p style={styles.ocupadosItem}>{diaInfo.motivo}</p>
                            </div>
                        )}

                        {dataEscolhida && diaInfo?.aberto && (
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Horário</label>
                                <div style={styles.horaGrid}>
                                    {gerarOpcoesDeHora().map(function(hora) {
                                        const livre = horaDisponivel(hora);
                                        const selecionada = horaEscolhida === hora;
                                        return (
                                            <button
                                                key={hora}
                                                type="button"
                                                disabled={!livre}
                                                onClick={function() { setHoraEscolhida(hora); }}
                                                style={
                                                    !livre ? styles.horaOcupada
                                                    : selecionada ? styles.horaSelecionada
                                                    : styles.horaLivre
                                                }
                                            >
                                                {hora}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p style={styles.legendaHora}>Horários riscados já estão ocupados ou não cabem na duração da sessão.</p>
                            </div>
                        )}

                        {erro && <p style={styles.erro}>{erro}</p>}
                        <button
                            style={loading ? styles.botaoLoading : styles.botao}
                            onClick={confirmarHorario}
                            disabled={loading || !horaEscolhida}
                        >
                            {loading ? 'Confirmando...' : 'Confirmar horário'}
                        </button>
                    </div>
                )}

                {pedido?.status === 'convertido_agendamento' && (
                    <div style={{ textAlign: 'center' }}>
                        <div style={styles.sucessoIcon}>✓</div>
                        <h2 style={styles.sucessoTitulo}>Tudo certo!</h2>
                        <p style={styles.sucessoTexto}>Sua sessão está confirmada para {new Date(pedido.data_hora).toLocaleString('pt-BR')}.</p>
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
    tagline: { color: '#888888', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 },
    inputGroup: { marginBottom: '16px' },
    inputRow: { display: 'flex' },
    label: { display: 'block', color: '#888888', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' },
    inputField: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0a0a0a', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
    textarea: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0a0a0a', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', outline: 'none', minHeight: '90px', fontFamily: 'inherit', resize: 'vertical' },
    aviso: { color: '#666666', fontSize: '12px', marginBottom: '16px', lineHeight: '1.5' },
    botao: { width: '100%', padding: '14px', background: '#c9a96e', color: '#0a0a0a', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', cursor: 'pointer' },
    botaoLoading: { width: '100%', padding: '14px', background: '#8a7045', color: '#0a0a0a', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', cursor: 'not-allowed' },
    botaoSecundario: { width: '100%', padding: '14px', background: 'transparent', color: '#c9a96e', border: '1px solid #c9a96e', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', marginBottom: '12px' },
    erro: { color: '#e05252', fontSize: '13px', marginBottom: '12px', textAlign: 'center' },
    sucessoIcon: { fontSize: '40px', textAlign: 'center', margin: '0 auto 16px' },
    sucessoTitulo: { color: '#ffffff', fontSize: '20px', textAlign: 'center', margin: '0 0 12px' },
    sucessoTexto: { color: '#888888', fontSize: '14px', textAlign: 'center', lineHeight: '1.6', margin: '0 0 20px' },
    etapaTitulo: { color: '#ffffff', fontSize: '16px', fontWeight: '600', marginBottom: '16px', textAlign: 'center' },
    orcamentoBox: { background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '16px', marginBottom: '20px' },
    orcamentoLinha: { color: '#dddddd', fontSize: '14px', margin: '6px 0' },
    pixTimer: { color: '#c9a96e', fontSize: '18px', fontWeight: '700', textAlign: 'center', marginBottom: '16px' },
    qrImagem: { display: 'block', width: '220px', height: '220px', margin: '0 auto 20px', borderRadius: '8px', background: '#ffffff', padding: '8px' },
    pixEspera: { color: '#666666', fontSize: '12px', textAlign: 'center', marginTop: '8px' },
    ocupadosBox: { background: '#2a1a0f', border: '1px solid #5a3a20', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' },
    ocupadosTitulo: { color: '#e0b080', fontSize: '12px', fontWeight: '600', margin: '0 0 6px' },
    ocupadosItem: { color: '#e0b080', fontSize: '12px', margin: '2px 0' },
    horaGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' },
    horaLivre: { padding: '10px 0', background: '#0a0a0a', border: '1px solid #c9a96e', color: '#c9a96e', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
    horaSelecionada: { padding: '10px 0', background: '#c9a96e', border: '1px solid #c9a96e', color: '#0a0a0a', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },
    horaOcupada: { padding: '10px 0', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#444444', borderRadius: '8px', fontSize: '13px', textDecoration: 'line-through', cursor: 'not-allowed' },
    legendaHora: { color: '#666666', fontSize: '11px', marginTop: '8px' }
};

export default PedirTattoo;