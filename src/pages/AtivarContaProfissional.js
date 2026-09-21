import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AtivarContaProfissional() {
    const token = new URLSearchParams(window.location.search).get('token');
    const [nome, setNome] = useState('');
    const [validando, setValidando] = useState(true);
    const [invalido, setInvalido] = useState(false);
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    useEffect(function() {
        if (!token) { setInvalido(true); setValidando(false); return; }
        api.get('/profissionais/convite/' + token)
            .then(function(r) { setNome(r.data.nome); setValidando(false); })
            .catch(function() { setInvalido(true); setValidando(false); });
    }, [token]);

    async function handleAtivar(e) {
        e.preventDefault();
        setErro('');
        if (senha.length < 6) { setErro('A senha precisa ter pelo menos 6 caracteres'); return; }
        if (senha !== confirmarSenha) { setErro('As senhas não coincidem'); return; }
        setLoading(true);
        try {
            await api.post('/profissionais/convite/' + token + '/ativar', { senha });
            setSucesso(true);
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao ativar conta');
        }
        setLoading(false);
    }

    if (validando) {
        return <div style={styles.container}><p style={{ color: '#666' }}>Carregando...</p></div>;
    }

    if (invalido) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <p style={styles.erro}>Este link de convite é inválido ou já expirou. Peça ao dono do estabelecimento pra gerar um novo.</p>
                </div>
            </div>
        );
    }

    if (sucesso) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.logoIcon}>✓</div>
                    <h2 style={{ color: '#fff', textAlign: 'center' }}>Conta ativada!</h2>
                    <p style={{ color: '#666', textAlign: 'center', marginBottom: '24px' }}>Agora você já pode entrar no seu painel.</p>
                    <button style={styles.botao} onClick={function() { window.location.href = '/painel-profissional/login'; }}>Ir para o login</button>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoArea}>
                    <div style={styles.logoIcon}>✦</div>
                    <h1 style={styles.logo}>FAYOLA</h1>
                    <p style={styles.tagline}>Bem-vindo(a), {nome}</p>
                </div>
                <form onSubmit={handleAtivar}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Crie sua senha</label>
                        <input style={styles.input} type="password" placeholder="Mínimo 6 caracteres" value={senha} onChange={function(e) { setSenha(e.target.value); }} />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirme a senha</label>
                        <input style={styles.input} type="password" placeholder="Repita a senha" value={confirmarSenha} onChange={function(e) { setConfirmarSenha(e.target.value); }} />
                    </div>
                    {erro && <p style={styles.erro}>{erro}</p>}
                    <button style={loading ? styles.botaoLoading : styles.botao} type="submit" disabled={loading}>
                        {loading ? 'Ativando...' : 'Ativar minha conta'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0a0a0a', padding: '24px' },
    card: { background: '#1a1a1a', padding: '48px 40px', borderRadius: '16px', width: '380px', maxWidth: '100%', border: '1px solid #2a2a2a', boxSizing: 'border-box' },
    logoArea: { textAlign: 'center', marginBottom: '36px' },
    logoIcon: { fontSize: '28px', color: '#c9a96e', marginBottom: '8px', textAlign: 'center' },
    logo: { color: '#ffffff', fontSize: '28px', fontWeight: '700', letterSpacing: '6px', margin: '0 0 8px', textAlign: 'center' },
    tagline: { color: '#888888', fontSize: '13px', margin: 0, textAlign: 'center' },
    inputGroup: { marginBottom: '16px' },
    label: { display: 'block', color: '#888888', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' },
    input: { width: '100%', padding: '14px 16px', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0a0a0a', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
    botao: { width: '100%', padding: '14px', background: '#c9a96e', color: '#0a0a0a', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', marginTop: '8px' },
    botaoLoading: { width: '100%', padding: '14px', background: '#8a7045', color: '#0a0a0a', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'not-allowed', marginTop: '8px' },
    erro: { color: '#e05252', fontSize: '13px', marginBottom: '8px', textAlign: 'center' }
};

export default AtivarContaProfissional;