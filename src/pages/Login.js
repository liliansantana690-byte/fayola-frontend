import React, { useState } from 'react';
import api from '../services/api';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, senha });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('estabelecimento_id', res.data.estabelecimento_id);
            localStorage.setItem('nome', res.data.nome);
            onLogin(res.data);
        } catch (err) {
            setErro('Email ou senha incorretos');
        }
        setLoading(false);
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoArea}>
                    <div style={styles.logoIcon}>✦</div>
                    <h1 style={styles.logo}>FAYOLA</h1>
                    <p style={styles.tagline}>Sistema de Agendamento Premium</p>
                </div>
                <form onSubmit={handleLogin}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={styles.input}
                            type="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Senha</label>
                        <input
                            style={styles.input}
                            type="password"
                            placeholder="••••••••"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                        />
                    </div>
                    {erro && <p style={styles.erro}>{erro}</p>}
                    <button style={loading ? styles.botaoLoading : styles.botao} type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
                <p style={styles.footer}>Fayola © 2026</p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#0a0a0a',
    },
    card: {
        background: '#1a1a1a',
        padding: '48px 40px',
        borderRadius: '16px',
        width: '380px',
        border: '1px solid #2a2a2a',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
    },
    logoArea: {
        textAlign: 'center',
        marginBottom: '36px'
    },
    logoIcon: {
        fontSize: '28px',
        color: '#c9a96e',
        marginBottom: '8px'
    },
    logo: {
        color: '#ffffff',
        fontSize: '28px',
        fontWeight: '700',
        letterSpacing: '6px',
        margin: '0 0 8px'
    },
    tagline: {
        color: '#888888',
        fontSize: '12px',
        letterSpacing: '2px',
        margin: 0,
        textTransform: 'uppercase'
    },
    inputGroup: {
        marginBottom: '16px'
    },
    label: {
        display: 'block',
        color: '#888888',
        fontSize: '12px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        marginBottom: '6px'
    },
    input: {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '8px',
        border: '1px solid #2a2a2a',
        background: '#0a0a0a',
        color: '#ffffff',
        fontSize: '14px',
        boxSizing: 'border-box',
        outline: 'none'
    },
    botao: {
        width: '100%',
        padding: '14px',
        background: '#c9a96e',
        color: '#0a0a0a',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        cursor: 'pointer',
        marginTop: '8px'
    },
    botaoLoading: {
        width: '100%',
        padding: '14px',
        background: '#8a7045',
        color: '#0a0a0a',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        cursor: 'not-allowed',
        marginTop: '8px'
    },
    erro: {
        color: '#e05252',
        fontSize: '13px',
        marginBottom: '8px'
    },
    footer: {
        color: '#444444',
        fontSize: '11px',
        textAlign: 'center',
        marginTop: '32px',
        marginBottom: 0
    }
};

export default Login;