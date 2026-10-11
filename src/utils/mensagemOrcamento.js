// Monta o texto do orçamento para o tatuador copiar e colar no próprio WhatsApp.
// O link usa o domínio onde o tatuador está logado, e o token secreto do pedido.

function formatarValor(valor) {
    return parseFloat(valor || 0).toFixed(2).replace('.', ',');
}

export function gerarTextoOrcamento(pedido) {
    const link = `${window.location.origin}/pedido-tattoo/${pedido.token_acesso}`;

    return (
        `Olá, ${pedido.cliente_nome}! Seu orçamento da tattoo está pronto.\n\n` +
        `Valor da tattoo: R$ ${formatarValor(pedido.valor_tattoo)}\n` +
        `Sinal para reservar: R$ ${formatarValor(pedido.valor_sinal)}\n\n` +
        `Acesse o link para pagar o sinal e escolher o horário:\n${link}`
    );
}

export async function copiarTexto(texto) {
    try {
        await navigator.clipboard.writeText(texto);
        alert('Mensagem copiada! Cole no seu WhatsApp e envie para o cliente.');
    } catch (err) {
        alert('Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.');
    }
}