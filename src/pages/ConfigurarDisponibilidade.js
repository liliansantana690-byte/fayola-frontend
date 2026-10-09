import React, { useState, useEffect } from 'react';
import { buscarHorariosSemanais, salvarHorariosSemanais, listarBloqueios, bloquearDia, desbloquearDia } from '../services/availabilityApi';

const DIAS = [
    { valor: 1, nome: 'Segunda' },
    { valor: 2, nome: 'Terça' },
    { valor: 3, nome: 'Quarta' },
    { valor: 4, nome: 'Quinta' },
    { valor: 5, nome: 'Sexta' },
    { valor: 6, nome: 'Sábado' },
    { valor: 0, nome: 'Domingo' }
];

function ConfigurarDisponibilidade({ profissionalId }) {
    const [horarios, setHorarios] = useState({});
    const [bloqueios, setBloqueios] = useState([]);
    const [novaData, setNovaData] = useState('');
    const [novoMotivo, setNovoMotivo] = useState('');
    const [salvando, setSalvando] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    useEffect(function() {
        carregar();
    }, [profissionalId]);

    async function carregar() {
        try {
            const [h, b] = await Promise.all([
                buscarHorariosSemanais(profissionalId),
                listarBloqueios(profissionalId)
            ]);
            const mapa = {};
            h.forEach(function(item) {
                mapa[item.dia_semana] = {
                    hora_inicio: item.hora_inicio.slice(0, 5),
                    hora_fim: item.hora_fim.slice(0, 5)
                };
            });
            setHorarios(mapa);
            setBloqueios(b);
        } catch (err) {
            setErro('Não foi possível carregar sua disponibilidade.');
        }
    }

    function alterarDia(diaValor, campo, valor) {
        setHorarios(function(atual) {
            const dia = atual[diaValor] || { hora_inicio: '10:00', hora_fim: '19:00' };
            return { ...atual, [diaValor]: { ...dia, [campo]: valor } };
        });
    }

    function ativarDia(diaValor, ativo) {
        setHorarios(function(atual) {
            const copia = { ...atual };
            if (ativo) {
                copia[diaValor] = { hora_inicio: '10:00', hora_fim: '19:00' };
            } else {
                delete copia[diaValor];
            }
            return copia;
        });
    }

    async function salvarSemana() {
        setErro('');
        setMensagem('');
        for (const dia of Object.keys(horarios)) {
            const h = horarios[dia];
            if (h.hora_fim <= h.hora_inicio) {
                setErro('O horário de fim precisa ser depois do horário de início.');
                return;
            }
        }
        setSalvando(true);
        try {
            const lista = Object.keys(horarios).map(function(dia) {
                return {
                    dia_semana: parseInt(dia),
                    hora_inicio: horarios[dia].hora_inicio,
                    hora_fim: horarios[dia].hora_fim
                };
            });
            await salvarHorariosSemanais(lista);
            setMensagem('Horário de funcionamento salvo.');
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao salvar horário.');
        }
        setSalvando(false);
    }

    async function adicionarBloqueio() {
        setErro('');
        setMensagem('');
        if (!novaData) {
            setErro('Escolha uma data pra bloquear.');
            return;
        }
        try {
            await bloquearDia(novaData, novoMotivo);
            setNovaData('');
            setNovoMotivo('');
            setMensagem('Dia bloqueado.');
            setBloqueios(await listarBloqueios(profissionalId));
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao bloquear dia.');
        }
    }

    async function removerBloqueio(id) {
        setErro('');
        setMensagem('');
        try {
            await desbloquearDia(id);
            setBloqueios(await listarBloqueios(profissionalId));
        } catch (err) {
            setErro('Erro ao desbloquear dia.');
        }
    }

    function formatarData(dataIso) {
        const [ano, mes, dia] = dataIso.slice(0, 10).split('-');
        return `${dia}/${mes}/${ano}`;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.titulo}>Disponibilidade</h2>
            <p style={styles.subtitulo}>Defina os dias e horários em que você atende. Quem marca não consegue escolher fora disso.</p>

            <div style={styles.bloco}>
                <h3 style={styles.blocoTitulo}>Horário semanal</h3>
                {DIAS.map(function(dia) {
                    const ativo = !!horarios[dia.valor];
                    const h = horarios[dia.valor] || { hora_inicio: '10:00', hora_fim: '19:00' };
                    return (
                        <div key={dia.valor} style={styles.linhaDia}>
                            <label style={styles.checkLabel}>
                                <input type="checkbox" checked={ativo} onChange={function(e) { ativarDia(dia.valor, e.target.checked); }} />
                                <span style={{ marginLeft: '8px' }}>{dia.nome}</span>
                            </label>
                            {ativo && (
                                <div style={styles.horas}>
                                    <input type="time" value={h.hora_inicio} onChange={function(e) { alterarDia(dia.valor, 'hora_inicio', e.target.value); }} style={styles.inputHora} />
                                    <span style={{ color: '#888' }}>até</span>
                                    <input type="time" value={h.hora_fim} onChange={function(e) { alterarDia(dia.valor, 'hora_fim', e.target.value); }} style={styles.inputHora} />
                                </div>
                            )}
                        </div>
                    );
                })}
                <button style={styles.botao} onClick={salvarSemana} disabled={salvando}>
                    {salvando ? 'Salvando...' : 'Salvar horário semanal'}
                </button>
            </div>

            <div style={styles.bloco}>
                <h3 style={styles.blocoTitulo}>Dias bloqueados</h3>
                <p style={styles.ajuda}>Use pra feriados, férias ou dias em que você não abre.</p>
                <div style={styles.linhaNovoBloqueio}>
                    <input type="date" value={novaData} onChange={function(e) { setNovaData(e.target.value); }} style={styles.inputData} />
                    <input placeholder="Motivo (opcional)" value={novoMotivo} onChange={function(e) { setNovoMotivo(e.target.value); }} style={styles.inputMotivo} />
                    <button style={styles.botaoPequeno} onClick={adicionarBloqueio}>Bloquear</button>
                </div>

                {bloqueios.length === 0 && <p style={styles.vazio}>Nenhum dia bloqueado.</p>}
                {bloqueios.map(function(b) {
                    return (
                        <div key={b.id} style={styles.itemBloqueio}>
                            <div>
                                <strong style={{ color: '#fff' }}>{formatarData(b.data)}</strong>
                                {b.motivo && <span style={{ color: '#888', marginLeft: '8px' }}>{b.motivo}</span>}
                            </div>
                            <button style={styles.botaoRemover} onClick={function() { removerBloqueio(b.id); }}>Remover</button>
                        </div>
                    );
                })}
            </div>

            {mensagem && <p style={styles.sucesso}>{mensagem}</p>}
            {erro && <p style={styles.erro}>{erro}</p>}
        </div>
    );
}

const styles = {
    container: { maxWidth: '640px', margin: '0 auto', padding: '24px', color: '#fff', fontFamily: 'system-ui, sans-serif' },
    titulo: { fontSize: '22px', margin: '0 0 6px' },
    subtitulo: { color: '#888', fontSize: '13px', margin: '0 0 24px' },
    bloco: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px', marginBottom: '20px' },
    blocoTitulo: { fontSize: '15px', margin: '0 0 14px', color: '#c9a96e' },
    ajuda: { color: '#666', fontSize: '12px', margin: '0 0 14px' },
    linhaDia: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #222', flexWrap: 'wrap', gap: '8px' },
    checkLabel: { display: 'flex', alignItems: 'center', fontSize: '14px', minWidth: '120px' },
    horas: { display: 'flex', alignItems: 'center', gap: '8px' },
    inputHora: { background: '#0a0a0a', border: '1px solid #2a2a2a', color: '#fff', padding: '8px', borderRadius: '6px' },
    botao: { marginTop: '16px', width: '100%', padding: '12px', background: '#c9a96e', color: '#0a0a0a', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' },
    linhaNovoBloqueio: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' },
    inputData: { background: '#0a0a0a', border: '1px solid #2a2a2a', color: '#fff', padding: '8px', borderRadius: '6px' },
    inputMotivo: { flex: 1, minWidth: '140px', background: '#0a0a0a', border: '1px solid #2a2a2a', color: '#fff', padding: '8px', borderRadius: '6px' },
    botaoPequeno: { background: '#c9a96e', color: '#0a0a0a', border: 'none', borderRadius: '6px', padding: '8px 14px', fontWeight: '700', cursor: 'pointer' },
    itemBloqueio: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #222', fontSize: '14px' },
    botaoRemover: { background: 'transparent', border: '1px solid #e05252', color: '#e05252', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', fontSize: '12px' },
    vazio: { color: '#666', fontSize: '13px' },
    sucesso: { color: '#5fbf6e', fontSize: '13px', textAlign: 'center' },
    erro: { color: '#e05252', fontSize: '13px', textAlign: 'center' }
};

export default ConfigurarDisponibilidade;