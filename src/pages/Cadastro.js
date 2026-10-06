import React, { useState } from 'react';
import api from '../services/api';

function Cadastro() {
    const [form, setForm] = useState({
        nome: '', telefone: '', email: '', senha: '', confirmarSenha: '', whatsapp: ''
    });
    const [erro, setErro] = useState('');
    const [loading, setLoading] = useState(false);
    const [sucesso, setSucesso] = useState(null);

    async function handleCadastro(e) {
        e.preventDefault();
        setErro('');
        if (form.senha.length < 6) { setErro('A senha precisa ter pelo menos 6 caracteres'); return; }
        if (form.senha !== form.confirmarSenha) { setErro('As senhas não coincidem'); return; }

        setLoading(true);
        try {
            const resp = await api.post('/auth/cadastro', {
                nome: form.nome,
                tipo: 'tatuador',
                telefone: form.telefone,
                email: form.email,
                senha: form.senha,
                whatsapp: form.whatsapp
            });
            setSucesso(resp.data);
        } catch (err) {
            setErro(err.response?.data?.erro || 'Erro ao criar conta. Tente novamente.');
        }
        setLoading(false);
    }

    if (sucesso) {
        return (
            <div style={styles.container}>
                <div style={styles.card}>
                    <div style={styles.logoArea}>
                        <div style={styles.logoIcon}>✦</div>
                        <h1 style={styles.logo}>FAYOLA</h1>
                    </div>
                    <h2 style={styles.sucessoTitulo}>Conta criada!</h2>
                    <p style={styles.sucessoTexto}>Seu estúdio "{sucesso.nome}" já está pronto. Agora é só entrar com o e-mail e senha que você acabou de criar.</p>
                    <a href="/login" style={styles.botao}>Ir para o login</a>
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
                    <p style={styles.tagline}>Crie sua conta</p>
                </div>
                <form onSubmit={handleCadastro}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nome do estúdio / tatuador</label>
                        <input style={styles.input} placeholder="Ex: Studio Preto & Agulha" value={form.nome} onChange={function(e) { setForm({...form, nome: e.target.value}); }} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Telefone</label>
                        <input style={styles.input} placeholder="71999999999" value={form.telefone} onChange={function(e) { setForm({...form, telefone: e.target.value}); }} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>WhatsApp (pra receber notificações do Fayola)</label>
                        <input style={styles.input} placeholder="71999999999" value={form.whatsapp} onChange={function(e) { setForm({...form, whatsapp: e.target.value}); }} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>E-mail</label>
                        <input style={styles.input} type="email" placeholder="seu@email.com" value={form.email} onChange={function(e) { setForm({...form, email: e.target.value}); }} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Senha</label>
                        <input style={styles.input} type="password" placeholder="Mínimo 6 caracteres" value={form.senha} onChange={function(e) { setForm({...form, senha: e.target.value}); }} required />
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirme a senha</label>
                        <input style={styles.input} type="password" placeholder="Repita a senha" value={form.confirmarSenha} onChange={function(e) { setForm({...form, confirmarSenha: e.target.value}); }} required />
                    </div>
                    {erro && <p style={styles.erro}>{erro}</p>}
                    <button style={loading ? styles.botaoLoading : styles.botao} type="submit" disabled={loading}>
                        {loading ? 'Criando conta...' : 'Criar minha conta'}
                    </button>
                </form>
                <p style={styles.footer}>Já tem conta? <a href="/login" style={styles.link}>Entrar</a></p>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0a0a0a', padding: '24px' },
    card: { background: '#1a1a1a', padding: '48px 40px', borderRadius: '16px', width: '380px', maxWidth: '100%', border: '1px solid #2a2a2a', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', boxSizing: 'border-box' },
    logoArea: { textAlign: 'center', marginBottom: '28px' },
    logoIcon: { fontSize: '28px', color: '#f95f00', marginBottom: '8px' },
    logo: { color: '#ffffff', fontSize: '28px', fontWeight: '700', letterSpacing: '6px', margin: '0 0 8px' },
    tagline: { color: '#888888', fontSize: '12px', letterSpacing: '2px', margin: 0, textTransform: 'uppercase' },
    inputGroup: { marginBottom: '14px' },
    label: { display: 'block', color: '#888888', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' },
    input: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #2a2a2a', background: '#0a0a0a', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
    botao: { display: 'block', width: '100%', padding: '14px', background: '#f83b0c', color: '#0a0a0a', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', marginTop: '8px', textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' },
    botaoLoading: { width: '100%', padding: '14px', background: '#f73206', color: '#0a0a0a', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'not-allowed', marginTop: '8px' },
    erro: { color: '#e05252', fontSize: '13px', marginBottom: '8px' },
    footer: { color: '#666666', fontSize: '12px', textAlign: 'center', marginTop: '24px' },
    link: { color: '#f95f00', textDecoration: 'underline' },
    sucessoTitulo: { color: '#fff', fontSize: '18px', textAlign: 'center', margin: '0 0 12px' },
    sucessoTexto: { color: '#888', fontSize: '13px', textAlign: 'center', lineHeight: '1.6', margin: '0 0 24px' }
};

export default Cadastro;