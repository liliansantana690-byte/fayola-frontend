
import React from 'react';
import { motion } from 'framer-motion';

const WHATSAPP =
  'https://wa.me/5571985119593?text=Quero%20conhecer%20o%20Fayola';

const WHATSAPP_ASSINAR =
  'https://wa.me/5571985119593?text=Quero%20assinar%20o%20Fayola';

const aparecer = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const sequencia = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function TituloSecao({ etiqueta, titulo, descricao }) {
  return (
    <motion.div variants={aparecer} className="mx-auto max-w-3xl text-center">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#ff6a3d]">
        {etiqueta}
      </p>
      <h2 className="font-display text-4xl leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
        {titulo}
      </h2>
      {descricao && (
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
          {descricao}
        </p>
      )}
    </motion.div>
  );
}

function CelularFayola() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9 }}
      className="relative mx-auto w-full max-w-sm rounded-[36px] border border-white/10 bg-[#151515] p-3 shadow-2xl"
    >
      <div className="overflow-hidden rounded-[27px] bg-[#f5f0e6]">
        <div className="flex items-center justify-between bg-[#111] px-5 py-5 text-white">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-white/45">FAYOLA</p>
            <p className="mt-1 text-sm font-semibold">Painel do estúdio</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff6a3d] font-bold text-black">
            F
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="rounded-2xl bg-[#151515] p-4 text-white">
            <p className="text-[10px] uppercase tracking-widest text-white/45">
              Próxima sessão
            </p>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="font-semibold">Maria Silva</p>
                <p className="mt-1 text-xs text-white/50">Blackwork · 10 cm</p>
              </div>
              <p className="font-semibold text-[#ff6a3d]">14:00</p>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-4 text-black">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-black/40">
                  Pedido de tattoo
                </p>
                <p className="mt-2 text-sm font-semibold">Rosa em blackwork</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                Exemplo
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="flex h-16 items-center justify-center rounded-xl bg-black/5 text-xl">✳</div>
              <div className="flex h-16 items-center justify-center rounded-xl bg-black/5 text-xl">✦</div>
              <div className="flex h-16 items-center justify-center rounded-xl bg-black/5 text-xl">❋</div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-4 text-black">
            <p className="text-[10px] uppercase tracking-widest text-black/40">
              Exemplo de sinal
            </p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-2xl font-bold">R$ 180,00</p>
              <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                Via PIX
              </span>
            </div>
          </div>
        </div>
      </div>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -right-3 bottom-20 hidden rounded-2xl border border-white/10 bg-[#202020] p-4 shadow-xl sm:block"
      >
        <p className="text-[10px] uppercase tracking-widest text-white/40">Novo pedido</p>
        <p className="mt-2 text-sm font-semibold text-white">Projeto recebido</p>
        <p className="mt-1 text-xs text-[#ff6a3d]">Pronto para analisar</p>
      </motion.div>
    </motion.div>
  );
}

function Recurso({ numero, titulo, descricao }) {
  return (
    <motion.div
      variants={aparecer}
      className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#ff6a3d]/40 hover:bg-white/[0.06]"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#ff6a3d]">
          {numero}
        </span>
        <span className="text-white/25 transition group-hover:text-[#ff6a3d]">↗</span>
      </div>
      <h3 className="mt-10 text-xl font-semibold text-white">{titulo}</h3>
      <p className="mt-3 text-sm leading-6 text-white/50">{descricao}</p>
    </motion.div>
  );
}

function Etapa({ numero, titulo, descricao }) {
  return (
    <motion.div variants={aparecer}>
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ff6a3d]/30 bg-[#ff6a3d]/10 text-xs font-bold text-[#ff8a66]">
          {numero}
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <h3 className="text-lg font-semibold text-white">{titulo}</h3>
      <p className="mt-2 text-sm leading-6 text-white/45">{descricao}</p>
    </motion.div>
  );
}

function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#080808] font-sans text-white selection:bg-[#ff6a3d] selection:text-black">

      {/* NAVEGAÇÃO */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#080808]/85 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#inicio" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff6a3d] font-black text-black">
              F
            </span>
            <span className="text-sm font-bold tracking-[0.28em]">FAYOLA</span>
          </a>

          <nav className="hidden items-center gap-8 text-sm text-white/55 md:flex">
            <a href="#como-funciona" className="transition hover:text-white">Como funciona</a>
            <a href="#recursos" className="transition hover:text-white">Recursos</a>
            <a href="#preco" className="transition hover:text-white">Planos</a>
          </nav>

          <a
            href={WHATSAPP}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-4 py-3 text-xs font-semibold transition hover:border-[#ff6a3d] hover:bg-white/5"
          >
            Falar com o Fayola
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative flex min-h-screen items-center pt-24">
        <div className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#ff6a3d]/10 blur-[130px]" />
        <div className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-orange-500/5 blur-[100px]" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:py-20">
          <motion.div initial="hidden" animate="visible" variants={sequencia}>
            <motion.div
              variants={aparecer}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60"
            >
              <span className="h-2 w-2 rounded-full bg-[#ff6a3d]" />
              Feito para tatuadores
            </motion.div>

            <motion.h1
              variants={aparecer}
              className="font-display text-6xl leading-[0.94] tracking-tight text-white sm:text-7xl lg:text-[5.5rem]"
            >
              Você tatua.
              <br />
              <span className="text-[#ff6a3d]">O Fayola cuida do resto.</span>
            </motion.h1>

            <motion.p variants={aparecer} className="mt-7 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
              Pare de perder tempo respondendo mensagens enquanto está tatuando.
              Organize pedidos, referências, orçamentos, sinal via PIX e horários
              em um só lugar.
            </motion.p>

            <motion.div variants={aparecer} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={WHATSAPP_ASSINAR}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-[#ff6a3d] px-7 py-4 text-center text-sm font-bold text-black shadow-[0_15px_50px_rgba(255,106,61,0.18)] transition hover:-translate-y-0.5 hover:bg-[#ff815c]"
              >
                Quero conhecer o Fayola
              </a>
              <a
                href="#como-funciona"
                className="rounded-full border border-white/10 px-7 py-4 text-center text-sm font-semibold text-white/75 transition hover:border-white/25 hover:bg-white/5"
              >
                Descobrir como funciona ↓
              </a>
            </motion.div>

            <motion.div variants={aparecer} className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-xs text-white/40">
              <span>✓ Pedidos de tattoo</span>
              <span>✓ Sinal via PIX</span>
              <span>✓ Agenda profissional</span>
              <span>✓ Gestão de clientes</span>
            </motion.div>
          </motion.div>

          <CelularFayola />
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="border-y border-white/[0.06] bg-[#0d0d0d] py-24 sm:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sequencia}
          className="mx-auto max-w-7xl px-5 sm:px-8"
        >
          <TituloSecao
            etiqueta="Você conhece essa rotina"
            titulo="Enquanto você tatua, seus clientes esperam."
            descricao="Mensagens chegando, referências espalhadas e orçamentos para responder. O Fayola ajuda a organizar esse processo para você se concentrar no seu trabalho."
          />

          <div className="mx-auto mt-16 grid max-w-5xl gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {[
              ['01', 'Mensagens acumuladas', '“Quanto fica?” “Tem horário?” “Posso mandar uma referência?”'],
              ['02', 'Informações espalhadas', 'Detalhes do projeto acabam perdidos entre conversas e mensagens.'],
              ['03', 'Horários sem confirmação', 'Organize a reserva e o sinal para reduzir incertezas antes da sessão.'],
            ].map(([numero, titulo, descricao]) => (
              <motion.div key={numero} variants={aparecer} className="bg-[#111] p-7 sm:p-8">
                <span className="text-xs font-bold tracking-[0.2em] text-[#ff6a3d]">{numero}</span>
                <h3 className="mt-10 text-lg font-semibold">{titulo}</h3>
                <p className="mt-3 text-sm leading-6 text-white/45">{descricao}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FLUXO */}
      <section id="como-funciona" className="py-24 sm:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sequencia}
          className="mx-auto max-w-7xl px-5 sm:px-8"
        >
          <TituloSecao
            etiqueta="Do pedido à sessão"
            titulo="Um fluxo mais organizado para você e seu cliente."
            descricao="O cliente acessa seu link e envia as informações do projeto. Você consegue organizar o atendimento e conduzir os próximos passos."
          />

          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <Etapa numero="01" titulo="Pedido de tattoo" descricao="O cliente descreve a ideia, o estilo e o tamanho aproximado." />
            <Etapa numero="02" titulo="Referências" descricao="As imagens e informações do projeto ajudam a entender o pedido." />
            <Etapa numero="03" titulo="Orçamento" descricao="Você avalia a complexidade e define o preço e as condições." />
            <Etapa numero="04" titulo="Sinal e agenda" descricao="Organize o pagamento do sinal e a reserva do horário." />
          </div>

          <motion.div variants={aparecer} className="mt-16 rounded-[32px] border border-white/10 bg-gradient-to-br from-[#171717] to-[#0d0d0d] p-8 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[#ff6a3d]">Mais organização</p>
                <h3 className="mt-4 font-display text-3xl text-white sm:text-4xl">
                  Menos conversa para organizar.
                  <br />
                  Mais tempo para tatuar.
                </h3>
                <p className="mt-5 max-w-lg text-sm leading-6 text-white/45">
                  Tenha mais clareza sobre os pedidos, clientes, serviços e horários do seu estúdio.
                </p>
              </div>
              <div className="hidden h-24 w-px bg-white/10 lg:block" />
              <div className="grid grid-cols-2 gap-3">
                {['Pedidos', 'Referências', 'Sinal PIX', 'Agenda'].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-5 text-center text-sm font-semibold text-white/70">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* RECURSOS */}
      <section id="recursos" className="bg-[#0d0d0d] py-24 sm:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={sequencia}
          className="mx-auto max-w-7xl px-5 sm:px-8"
        >
          <TituloSecao
            etiqueta="Feito para a rotina do estúdio"
            titulo="Mais do que uma agenda."
            descricao="Uma estrutura para ajudar você a organizar o atendimento e administrar o dia a dia do seu negócio."
          />

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Recurso numero="01" titulo="Pedidos de tattoo" descricao="Organize os dados do projeto antes de avançar com o cliente." />
            <Recurso numero="02" titulo="Referências visuais" descricao="Associe imagens e inspirações ao pedido para facilitar a análise." />
            <Recurso numero="03" titulo="Tamanho e local" descricao="Registre centímetros aproximados e a região do corpo escolhida." />
            <Recurso numero="04" titulo="Orçamentos" descricao="Trabalhe com preço fixo, por tamanho, por sessão ou orçamento personalizado." />
            <Recurso numero="05" titulo="Sinal via PIX" descricao="Use o sinal para organizar a reserva da sessão, conforme suas condições." />
            <Recurso numero="06" titulo="Agenda por profissional" descricao="Organize os horários e atendimentos de cada tatuador." />
            <Recurso numero="07" titulo="Clientes e serviços" descricao="Mantenha informações de clientes e serviços mais organizadas." />
            <Recurso numero="08" titulo="WhatsApp" descricao="Facilite o contato com seus clientes e a divulgação do seu link." />
            <Recurso numero="09" titulo="Gestão do estúdio" descricao="Tenha uma visão mais organizada da operação conforme sua equipe cresce." />
          </div>
        </motion.div>
      </section>

      {/* POSICIONAMENTO */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff6a3d]/10 blur-[110px]" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sequencia}
          className="relative mx-auto max-w-5xl px-5 text-center sm:px-8"
        >
          <motion.p variants={aparecer} className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ff6a3d]">
            Para quem vive da própria arte
          </motion.p>
          <motion.h2 variants={aparecer} className="mt-6 font-display text-4xl leading-tight text-white sm:text-6xl">
            Seu talento merece uma experiência profissional do primeiro contato à sessão.
          </motion.h2>
          <motion.p variants={aparecer} className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/50">
            Você cuida da arte. O Fayola ajuda a organizar o que acontece antes e depois de cada atendimento.
          </motion.p>
        </motion.div>
      </section>

      {/* PREÇO */}
      <section id="preco" className="border-y border-white/[0.06] bg-[#0d0d0d] py-24 sm:py-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sequencia}
          className="mx-auto max-w-7xl px-5 sm:px-8"
        >
          <TituloSecao
            etiqueta="Fayola"
            titulo="Seu estúdio mais organizado."
            descricao="Conheça o Fayola e veja como ele pode se encaixar na rotina do seu trabalho."
          />

          <motion.div variants={aparecer} className="mx-auto mt-14 max-w-md rounded-[32px] border border-[#ff6a3d]/25 bg-[#111] p-8 shadow-2xl sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ff6a3d]">Fayola</p>
            <div className="mt-5 flex flex-wrap items-end gap-2">
              <span className="font-display text-5xl text-white">R$ 199,99</span>
              <span className="pb-2 text-sm text-white/40">/mês</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-white/45">
              Para organizar o atendimento, os profissionais, os clientes e os horários do seu estúdio.
            </p>
            <div className="my-7 h-px bg-white/10" />
            <ul className="space-y-3 text-sm text-white/65">
              {[
                'Organização de serviços e clientes',
                'Agenda por profissional',
                'Agendamento online',
                'Sinal via PIX, conforme configuração',
                'Acesso pelo navegador',
                'Contato pelo WhatsApp',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-[#ff6a3d]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={WHATSAPP_ASSINAR}
              target="_blank"
              rel="noreferrer"
              className="mt-8 block rounded-full bg-[#ff6a3d] px-6 py-4 text-center text-sm font-bold text-black transition hover:bg-[#ff815c]"
            >
              Quero conhecer o Fayola
            </a>
            <p className="mt-4 text-center text-xs leading-5 text-white/35">
              Consulte as funcionalidades disponíveis para o seu estúdio.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden py-28 sm:py-40">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,106,61,0.12),transparent_48%)]" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={sequencia}
          className="relative mx-auto max-w-4xl px-5 text-center sm:px-8"
        >
          <motion.p variants={aparecer} className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ff6a3d]">
            FAYOLA
          </motion.p>
          <motion.h2 variants={aparecer} className="mt-6 font-display text-5xl leading-[0.98] tracking-tight text-white sm:text-7xl">
            Você cuida da arte.
            <br />
            <span className="text-[#ff6a3d]">O Fayola cuida do resto.</span>
          </motion.h2>
          <motion.p variants={aparecer} className="mx-auto mt-7 max-w-xl text-base leading-7 text-white/50">
            Organize o atendimento e tenha mais tempo para fazer o que você ama.
          </motion.p>
          <motion.div variants={aparecer} className="mt-9">
            <a
              href={WHATSAPP_ASSINAR}
              target="_blank"
              rel="noreferrer"
              className="inline-block rounded-full bg-[#ff6a3d] px-8 py-4 text-sm font-bold text-black shadow-[0_15px_50px_rgba(255,106,61,0.2)] transition hover:-translate-y-0.5 hover:bg-[#ff815c]"
            >
              Quero conhecer o Fayola
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* RODAPÉ */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-xs text-white/35 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-bold tracking-[0.25em] text-white">✦ FAYOLA</p>
            <p className="mt-2">Gestão e agendamento para tatuadores e estúdios.</p>
          </div>
          <div className="flex flex-wrap gap-5">
            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="transition hover:text-white">
              WhatsApp
            </a>
            <a href="#inicio" className="transition hover:text-white">
              Voltar ao topo ↑
            </a>
          </div>
          <p>© 2026 Fayola. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}

export default Landing;