import React, { useState } from 'react';

const CHAVE_LINK = 'fayola_onboarding_link_copiado';

function OnboardingCard({ temServicos, mpConectado, linkPedido, onIrPara }) {
    const [linkCopiado, setLinkCopiado] = useState(
        () => localStorage.getItem(CHAVE_LINK) === '1'
    );

    async function copiarLink() {
        try {
            await navigator.clipboard.writeText(linkPedido);
        } catch (err) {
            window.prompt('Copie seu link:', linkPedido);
        }
        localStorage.setItem(CHAVE_LINK, '1');
        setLinkCopiado(true);
    }

    const passos = [
        {
            titulo: 'Cadastre seus serviços',
            texto: 'Tatuagem pequena, média e grande, com o preço e o tempo de cada uma. É isso que o cliente vê ao pedir.',
            feito: temServicos,
            botao: 'Ir para Serviços',
            acao: () => onIrPara('servicos'),
        },
        {
            titulo: 'Conecte o Mercado Pago',
            texto: 'É aqui que o sinal do cliente cai, direto na sua conta. Confira antes se sua conta tem chave Pix e está verificada.',
            feito: mpConectado,
            botao: 'Conectar Mercado Pago',
            acao: () => onIrPara('pagamentos'),
        },
        {
            titulo: 'Compartilhe seu link',
            texto: 'Coloque o link na sua bio. O cliente preenche a ideia, o tamanho e a referência, e chega até você já organizado.',
            feito: linkCopiado,
            botao: 'Copiar meu link',
            acao: copiarLink,
        },
    ];

    const concluidos = passos.filter((p) => p.feito).length;
    if (concluidos === passos.length) return null;

    return (
        <div style={estilos.card}>
            <p style={estilos.eyebrow}>PRIMEIROS PASSOS</p>
            <h3 style={estilos.titulo}>Vamos deixar tudo pronto ({concluidos} de {passos.length} concluídos)</h3>

            <div style={estilos.aviso}>
                Você continua com o contato do seu cliente. O Fayola não envia mensagem em seu nome e não guarda suas conversas. Quem decide o valor é você.
            </div>

            {passos.map((passo, i) => (
                <div key={i} style={estilos.passo}>
                    <div style={estilos.linha}>
                        <span style={passo.feito ? estilos.check : estilos.numero}>
                            {passo.feito ? '✓' : i + 1}
                        </span>
                        <div style={{ flex: 1 }}>
                            <strong style={{ color: passo.feito ? '#666' : '#fff' }}>{passo.titulo}</strong>
                            <p style={estilos.texto}>{passo.texto}</p>
                        </div>
                    </div>
                    {!passo.feito && (
                        <button style={estilos.botao} onClick={passo.acao}>
                            {passo.botao}
                        </button>
                    )}
                </div>
            ))}

            <p style={estilos.rodape}>
                Equipe: se você trabalha com outros tatuadores, cadastre cada um na aba Equipe (opcional).
            </p>
        </div>
    );
}

const estilos = {
    card: { background: '#111', border: '1px solid #2a2a2a', borderRadius: 14, padding: 22, marginBottom: 24 },
    eyebrow: { color: '#df6632', fontSize: 11, letterSpacing: '.14em', margin: 0, fontFamily: 'monospace' },
    titulo: { color: '#fff', fontSize: 20, margin: '8px 0 14px' },
    aviso: { background: 'rgba(223,102,50,.08)', border: '1px solid rgba(223,102,50,.25)', borderRadius: 10, padding: '12px 14px', color: '#ccc', fontSize: 13, lineHeight: 1.6, marginBottom: 16 },
    passo: { borderTop: '1px solid #222', padding: '14px 0' },
    linha: { display: 'flex', gap: 12, alignItems: 'flex-start' },
    numero: { width: 26, height: 26, borderRadius: '50%', border: '1px solid #df6632', color: '#df6632', display: 'grid', placeItems: 'center', fontSize: 13, flexShrink: 0 },
    check: { width: 26, height: 26, borderRadius: '50%', background: '#2d7a4f', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 13, flexShrink: 0 },
    texto: { color: '#888', fontSize: 13, lineHeight: 1.6, margin: '4px 0 0' },
    botao: { marginTop: 10, marginLeft: 38, padding: '9px 14px', borderRadius: 8, border: 'none', background: '#df6632', color: '#111', fontWeight: 700, fontSize: 12, cursor: 'pointer' },
    rodape: { color: '#666', fontSize: 12, marginTop: 10, lineHeight: 1.5 },
};

export default OnboardingCard;