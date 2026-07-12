import React, { useState } from 'react';
import api from '../services/api';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, senha });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('estabelecimento_id', res.data.estabelecimento_id);
            localStorage.setItem('nome', res.data.nome);
            onLogin(res.data);
        } catch (err) {
            setErro('Email ou senha incorretos');
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.logo}>💈 Fayola</h1>
                <p style={styles.sub}>Sistema de Agendamento</p>
                <form onSubmit={handleLogin}>
                    <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <input style={styles.input} type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
                    {erro && <p style={styles.erro}>{erro}</p>}
                    <button style={styles.botao} type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1a1a2e' },
    card: { background: '#16213e', padding: '40px', borderRadius: '16px', width: '360px' },
    logo: { color: '#e94560', textAlign: 'center', marginBottom: '4px', fontSize: '32px' },
    sub: { color: '#94a3b8', textAlign: 'center', marginBottom: '24px', fontSize: '14px' },
    input: { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: 'none', background: '#0f3460', color: '#f8fafc', fontSize: '14px', boxSizing: 'border-box' },
    botao: { width: '100%', padding: '12px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
    erro: { color: '#ef4444', fontSize: '13px', marginBottom: '8px' }
};

export default Login;