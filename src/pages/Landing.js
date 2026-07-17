import React from 'react';

function Landing() {

    return (
        <div style={styles.container}>

            {/* NAVBAR */}
            <nav style={styles.nav}>
                <div style={styles.navLogo}>
                    <span style={styles.navLogoIcon}>✦</span>
                    <span style={styles.navLogoTexto}>FAYOLA</span>
                </div>
                <div style={styles.navLinks}>
                    <a href="#funcionalidades" style={styles.navLink}>Funcionalidades</a>
                    <a href="#planos" style={styles.navLink}>Planos</a>
                    <a href="/login" style={styles.navBotao}>Entrar</a>
                </div>
            </nav>

            {/* HERO */}
            <section style={styles.hero}>
                <div style={styles.heroBadge}>✦ Sistema de Agendamento Premium</div>
                <h1 style={styles.heroTitulo}>
                    Seu negócio de beleza com<br />
                    <span style={styles.heroDestaque}>agendamento online</span><br />
                    e notificação no WhatsApp
                </h1>
                <p style={styles.heroSubtitulo}>
                    Seus clientes agendam pelo celular e recebem confirmação automática no WhatsApp. Você gerencia tudo pelo painel, sem complicação.
                </p>
                <div style={styles.heroBotoes}>
                    <a href="#planos" style={styles.botaoPrimario}>Começar agora — R$ 60/mês</a>
                    <a href="#funcionalidades" style={styles.botaoSecundario}>Ver como funciona</a>
                </div>
                <p style={styles.heroObs}>✓ Sem taxa de adesão · ✓ Cancele quando quiser · ✓ Suporte via WhatsApp</p>
            </section>

            {/* COMO FUNCIONA */}
            <section style={styles.secao} id="funcionalidades">
                <div style={styles.secaoHeader}>
                    <p style={styles.secaoTag}>COMO FUNCIONA</p>
                    <h2 style={styles.secaoTitulo}>Simples para você.<br />Simples para seu cliente.</h2>
                </div>
                <div style={styles.passosGrid}>
                    {[
                        { num: '01', titulo: 'Você cadastra seu negócio', desc: 'Adicione seus serviços, profissionais e horários em menos de 5 minutos.' },
                        { num: '02', titulo: 'Compartilhe o link', desc: 'Você recebe um link exclusivo. Compartilhe no Instagram, WhatsApp ou onde quiser.' },
                        { num: '03', titulo: 'Cliente agenda online', desc: 'Seu cliente escolhe o serviço, profissional e horário direto pelo celular.' },
                        { num: '04', titulo: 'WhatsApp automático', desc: 'Cliente recebe confirmação e lembrete automático 24h antes pelo WhatsApp.' },
                    ].map(function(p) {
                        return (
                            <div key={p.num} style={styles.passoCard}>
                                <div style={styles.passoNum}>{p.num}</div>
                                <h3 style={styles.passoTitulo}>{p.titulo}</h3>
                                <p style={styles.passoDesc}>{p.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* FUNCIONALIDADES */}
            <section style={styles.secaoEscura}>
                <div style={styles.secaoHeader}>
                    <p style={styles.secaoTag}>FUNCIONALIDADES</p>
                    <h2 style={styles.secaoTitulo}>Tudo que você precisa<br />em um só lugar</h2>
                </div>
                <div style={styles.featuresGrid}>
                    {[
                        { icon: '📱', titulo: 'Agendamento Online', desc: 'Link exclusivo para seus clientes agendarem a qualquer hora, pelo celular.' },
                        { icon: '💬', titulo: 'Notificação WhatsApp', desc: 'Confirmação automática e lembrete 24h antes para reduzir faltas.' },
                        { icon: '📅', titulo: 'Agenda do Dia', desc: 'Visualize todos os agendamentos do dia em tempo real no painel.' },
                        { icon: '✂️', titulo: 'Gestão de Serviços', desc: 'Cadastre serviços com duração e preço. Edite quando quiser.' },
                        { icon: '👤', titulo: 'Gestão de Equipe', desc: 'Adicione seus profissionais e vincule aos serviços.' },
                        { icon: '💰', titulo: 'Receita do Dia', desc: 'Acompanhe o faturamento do dia direto no painel.' },
                    ].map(function(f) {
                        return (
                            <div key={f.titulo} style={styles.featureCard}>
                                <div style={styles.featureIcon}>{f.icon}</div>
                                <h3 style={styles.featureTitulo}>{f.titulo}</h3>
                                <p style={styles.featureDesc}>{f.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* PARA QUEM E */}
            <section style={styles.secao}>
                <div style={styles.secaoHeader}>
                    <p style={styles.secaoTag}>PARA QUEM É</p>
                    <h2 style={styles.secaoTitulo}>Feito para negócios<br />de beleza e estética</h2>
                </div>
                <div style={styles.passosGrid}>
                    {[
                        { icon: '💇', titulo: 'Salões de Beleza', desc: 'Corte, coloração, escova, hidratação e muito mais.' },
                        { icon: '💈', titulo: 'Barbearias', desc: 'Corte masculino, barba, sobrancelha e tratamentos.' },
                        { icon: '✨', titulo: 'Clínicas de Estética', desc: 'Depilação, limpeza de pele, massagem e procedimentos estéticos.' },
                        { icon: '💅', titulo: 'Esmalterias', desc: 'Manicure, pedicure, nail art e esmaltação em gel.' },
                    ].map(function(p) {
                        return (
                            <div key={p.titulo} style={styles.passoCard}>
                                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{p.icon}</div>
                                <h3 style={styles.passoTitulo}>{p.titulo}</h3>
                                <p style={styles.passoDesc}>{p.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* PLANOS */}
            <section style={styles.secaoEscura} id="planos">
                <div style={styles.secaoHeader}>
                    <p style={styles.secaoTag}>PLANOS</p>
                    <h2 style={styles.secaoTitulo}>Um plano simples.<br />Sem surpresas.</h2>
                </div>
                <div style={styles.planoCard}>
                    <div style={styles.planoBadge}>MAIS POPULAR</div>
                    <h3 style={styles.planoNome}>Plano Profissional</h3>
                    <div style={styles.planoPreco}>
                        <span style={styles.planoMoeda}>R$</span>
                        <span style={styles.planoValor}>60</span>
                        <span style={styles.planoPeriodo}>/mês</span>
                    </div>
                    <ul style={styles.planoLista}>
                        {[
                            'Agendamento online ilimitado',
                            'Notificações WhatsApp automáticas',
                            'Profissionais ilimitados',
                            'Serviços ilimitados',
                            'Agenda do dia em tempo real',
                            'Relatório de receita',
                            'Suporte via WhatsApp',
                            'Sem taxa de adesão',
                        ].map(function(item) {
                            return <li key={item} style={styles.planoItem}><span style={styles.planoCheck}>✓</span> {item}</li>;
                        })}
                    </ul>
                    <a href="https://wa.me/5571985119593?text=Quero+assinar+o+Fayola" style={styles.botaoPrimario} target="_blank" rel="noreferrer">
                        Assinar agora
                    </a>
                </div>
            </section>

            {/* CTA FINAL */}
            <section style={styles.ctaSecao}>
                <h2 style={styles.ctaTitulo}>Pronto para modernizar<br />seu negócio?</h2>
                <p style={styles.ctaSubtitulo}>Comece hoje. Seus clientes vão amar agendar pelo celular.</p>
                <a href="https://wa.me/5571985119593?text=Quero+conhecer+o+Fayola" style={styles.botaoPrimario} target="_blank" rel="noreferrer">
                    Falar com a gente no WhatsApp
                </a>
            </section>

            {/* FOOTER */}
            <footer style={styles.footer}>
                <span style={styles.footerLogo}>✦ FAYOLA</span>
                <p style={styles.footerTexto}>Sistema de agendamento para salões, barbearias e estéticas · Salvador, BA</p>
                <p style={styles.footerTexto}>© 2026 Fayola. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

const styles = {
    container: { background: '#0a0a0a', color: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif', minHeight: '100vh' },

    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, background: '#0a0a0a', zIndex: 100 },
    navLogo: { display: 'flex', alignItems: 'center', gap: '8px' },
    navLogoIcon: { color: '#c9a96e', fontSize: '16px' },
    navLogoTexto: { color: '#ffffff', fontSize: '18px', fontWeight: '700', letterSpacing: '4px' },
    navLinks: { display: 'flex', alignItems: 'center', gap: '32px' },
    navLink: { color: '#888888', fontSize: '14px', textDecoration: 'none' },
    navBotao: { background: '#c9a96e', color: '#0a0a0a', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', textDecoration: 'none', letterSpacing: '1px' },

    hero: { textAlign: 'center', padding: '100px 48px 80px', maxWidth: '800px', margin: '0 auto' },
    heroBadge: { display: 'inline-block', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#c9a96e', fontSize: '12px', letterSpacing: '2px', padding: '8px 16px', borderRadius: '20px', marginBottom: '32px' },
    heroTitulo: { fontSize: '52px', fontWeight: '800', lineHeight: '1.2', margin: '0 0 24px', color: '#ffffff' },
    heroDestaque: { color: '#c9a96e' },
    heroSubtitulo: { fontSize: '18px', color: '#888888', lineHeight: '1.6', margin: '0 0 40px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' },
    heroBotoes: { display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap' },
    botaoPrimario: { background: '#c9a96e', color: '#0a0a0a', padding: '16px 32px', borderRadius: '10px', fontSize: '15px', fontWeight: '700', textDecoration: 'none', letterSpacing: '0.5px', display: 'inline-block' },
    botaoSecundario: { background: 'transparent', color: '#ffffff', padding: '16px 32px', borderRadius: '10px', fontSize: '15px', border: '1px solid #2a2a2a', textDecoration: 'none', display: 'inline-block' },
    heroObs: { color: '#444444', fontSize: '13px', margin: 0 },

    secao: { padding: '80px 48px', maxWidth: '1100px', margin: '0 auto' },
    secaoEscura: { padding: '80px 48px', background: '#0f0f0f', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' },
    secaoHeader: { textAlign: 'center', marginBottom: '56px' },
    secaoTag: { color: '#c9a96e', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 12px' },
    secaoTitulo: { color: '#ffffff', fontSize: '36px', fontWeight: '700', margin: 0, lineHeight: '1.3' },

    passosGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' },
    passoCard: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '28px' },
    passoNum: { color: '#c9a96e', fontSize: '32px', fontWeight: '800', marginBottom: '12px' },
    passoTitulo: { color: '#ffffff', fontSize: '16px', fontWeight: '600', margin: '0 0 8px' },
    passoDesc: { color: '#666666', fontSize: '14px', lineHeight: '1.6', margin: 0 },

    featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '1100px', margin: '0 auto' },
    featureCard: { background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '28px' },
    featureIcon: { fontSize: '32px', marginBottom: '16px' },
    featureTitulo: { color: '#ffffff', fontSize: '16px', fontWeight: '600', margin: '0 0 8px' },
    featureDesc: { color: '#666666', fontSize: '14px', lineHeight: '1.6', margin: 0 },

    planoCard: { background: '#1a1a1a', border: '1px solid #c9a96e', borderRadius: '16px', padding: '40px', maxWidth: '420px', margin: '0 auto', textAlign: 'center', position: 'relative' },
    planoBadge: { position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#c9a96e', color: '#0a0a0a', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', padding: '6px 16px', borderRadius: '20px' },
    planoNome: { color: '#ffffff', fontSize: '20px', fontWeight: '700', margin: '0 0 24px' },
    planoPreco: { margin: '0 0 32px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px' },
    planoMoeda: { color: '#c9a96e', fontSize: '20px', fontWeight: '700', paddingBottom: '8px' },
    planoValor: { color: '#c9a96e', fontSize: '64px', fontWeight: '800', lineHeight: 1 },
    planoPeriodo: { color: '#666666', fontSize: '16px', paddingBottom: '8px' },
    planoLista: { listStyle: 'none', padding: 0, margin: '0 0 32px', textAlign: 'left' },
    planoItem: { color: '#888888', fontSize: '14px', padding: '8px 0', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: '10px' },
    planoCheck: { color: '#c9a96e', fontWeight: '700', fontSize: '14px' },

    ctaSecao: { textAlign: 'center', padding: '100px 48px', background: '#0f0f0f', borderTop: '1px solid #1a1a1a' },
    ctaTitulo: { color: '#ffffff', fontSize: '40px', fontWeight: '800', margin: '0 0 16px', lineHeight: '1.2' },
    ctaSubtitulo: { color: '#666666', fontSize: '18px', margin: '0 0 40px' },

    footer: { textAlign: 'center', padding: '40px 48px', borderTop: '1px solid #1a1a1a' },
    footerLogo: { color: '#c9a96e', fontSize: '16px', fontWeight: '700', letterSpacing: '3px', display: 'block', marginBottom: '12px' },
    footerTexto: { color: '#444444', fontSize: '13px', margin: '4px 0' }
};

export default Landing;