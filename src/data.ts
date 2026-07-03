import { ContentTemplate, ToneOption, Draft } from "./types";

export const DEFAULT_TEMPLATES: ContentTemplate[] = [
  {
    id: "linkedin_post",
    label: "Post para LinkedIn",
    iconName: "Linkedin",
    description: "Transforma rascunhos em publicações altamente engajantes com hashtags e estrutura persuasiva.",
    placeholder: "Ex: Acabei de ler sobre desenvolvimento ágil no time de engenharia e como reuniões diárias longas na verdade atrapalham focar na sprint. Quero falar que menos é mais."
  },
  {
    id: "professional_email",
    label: "E-mail Profissional",
    iconName: "Mail",
    description: "Confecciona e-mails executivos polidos, ideais para propostas, alinhamentos ou prospecções.",
    placeholder: "Ex: Enviar proposta comercial para a empresa Delta, oferecendo 15% de desconto se fecharem o pacote Enterprise até sexta. Oferecer call amanhã às 14h."
  },
  {
    id: "blog_draft",
    label: "Draft de Artigo SEO",
    iconName: "FileText",
    description: "Cria esboços estruturados com cabeçalhos H1/H2 e parágrafos focados em termos buscados.",
    placeholder: "Ex: Quero um post sobre os benefícios de usar TypeScript em vez de JavaScript puro em projetos de larga escala, focado em segurança de tipos de manutenção a longo prazo."
  },
  {
    id: "social_thread",
    label: "Thread para X / Twitter",
    iconName: "Twitter",
    description: "Gera sequências numeradas e dinâmicas que destrincham ideias complexas de forma viciante.",
    placeholder: "Ex: Quero resumir o livro 'A Startup Enxuta' em 5 tweets práticos e acionáveis sobre validação de MVP e ciclos de feedback contínuo."
  },
  {
    id: "executive_summary",
    label: "Resumo Executivo",
    iconName: "Briefcase",
    description: "Sintetiza áudios transcritos ou atas de reunião extensas em tópicos focados de alta gerência.",
    placeholder: "Ex: Transcrição da reunião de ontem: Discutimos que o budget está apertado, vamos adiantar o marketing em 1 mês, o design atrasou a entrega das telas de checkout, o desenvolvedor Lucas vai focar na API de pagamento e o onboarding de clientes novos passará a ser automatizado."
  }
];

export const TONE_OPTIONS: ToneOption[] = [
  {
    id: "profissional",
    label: "Corporativo",
    description: "Polido, diplomático e focado em resultados executivos.",
    colorClass: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-950/20 dark:text-emerald-400"
  },
  {
    id: "persuasivo",
    label: "Persuasivo (Copy)",
    description: "Ganchos emocionais fortes, gatilhos de benefício rápido e CTAs claros.",
    colorClass: "border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-800/30 dark:bg-indigo-950/20 dark:text-indigo-400"
  },
  {
    id: "informal",
    label: "Casual",
    description: "Leve, simpático, próximo e fácil de digerir em redes sociais.",
    colorClass: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/30 dark:bg-amber-950/20 dark:text-amber-400"
  },
  {
    id: "tecnico",
    label: "Analítico / Técnico",
    description: "Baseado em dados, jargões corretos de tecnologia e tom preciso.",
    colorClass: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800/30 dark:bg-sky-950/20 dark:text-sky-400"
  },
  {
    id: "entusiasta",
    label: "Conquistador",
    description: "Autoestima alta, motivador e focado em histórias de superação.",
    colorClass: "border-pink-200 bg-pink-50 text-pink-800 dark:border-pink-800/30 dark:bg-pink-950/20 dark:text-pink-400"
  }
];

export const INITIAL_DRAFTS: Draft[] = [
  {
    id: "draft-1",
    title: "Insight sobre Micro SaaS e Agilidade",
    rawInput: "Acabei de ler sobre desenvolvimento ágil no time de engenharia e como reuniões diárias longas na verdade atrapalham focar na sprint. Quero falar que menos é mais.",
    generatedOutput: "🚀 MENOS REUNIÃO, MAIS LINHAS DE CÓDIGO.\n\nVocê já participou de uma 'daily' de 45 minutos onde as pessoas acabam discutindo a arquitetura de banco de dados inteira?\n\nIsso não é ágil. É interrupção fantasiada de alinhamento.\n\n💡 Aqui vão 3 lições rápidas para resgatar a sprint do seu time:\n\n1️⃣ **Daily de 15 minutos é regra rígida**: O foco é o que foi feito ontem, o que será feito hoje e impedimentos. Discussões profundas ganham salas separadas.\n2️⃣ **Foco no fluxo, não na presença**: Se todos estão atualizados no board (Ex: Jira, Trello), talvez a daily nem precise de palavras faladas todos os dias.\n3️⃣ **Proteja o Deep Work**: O custo de transição cognitiva após uma reunião pode tirar até 23 minutos de foco puro de um desenvolvedor.\n\nA ferramenta de agilidade deve servir à equipe, e não o oposto.\n\nConcorda com isso ou acha as reuniões longas cruciais? Deixe seu comentário!\n\n#DesenvolvimentoAgil #Productivity #TypeScript #SypherAI",
    format: "linkedin_post",
    tone: "profissional",
    createdAt: Date.now() - 3600000 * 4, // 4 hours ago
    wordCount: 168,
    tags: ["LinkedIn", "Corporativo"]
  },
  {
    id: "draft-2",
    title: "Proposta de Valor Delta Corp",
    rawInput: "Enviar proposta comercial para a empresa Delta, oferecendo 15% de desconto se fecharem o pacote Enterprise até sexta. Oferecer call amanhã às 14h.",
    generatedOutput: "Assunto: Oportunidade Exclusiva: Condições Especiais Delta Corp & Sypher AI\n\nPrezado time de Novos Negócios da Delta Corp,\n\nEspero que este e-mail os encontre em um excelente início de semana.\n\nApós o nosso último alinhamento técnico, revisamos internamente as metas de adoção de inteligência de conteúdo da sua empresa e formulamos uma condição extraordinária para que possamos iniciar nossa parceria sem fricções.\n\nOferecemos um benefício exclusivo de **15% de desconto** nas licenças anuais do plano **Enterprise**, concedido para formalizações efetivadas até esta **sexta-feira**.\n\nEsta adesão garantirá à Delta Corp:\n• Capacidade ilimitada de refinamento de transcrições de áudio.\n• Style Profiles customizados e treinados com o guia de marca de vocês.\n• Suporte prioritário 24/7 e consultoria de implantação dedicada.\n\nPara esclarecer quaisquer detalhes contratuais finais, gostaria de propor uma breve videoconferência de 15 minutos para **amanhã (terça-feira) às 14h**.\n\nEste horário se enquadra na agenda de vocês, ou sugeririam outra alternativa?\n\nAtenciosamente,\n\n---\n**Equipe Comercial**\nSypher AI Co.\ncontato@sypher.ai | (11) 99888-7766",
    format: "professional_email",
    tone: "persuasivo",
    createdAt: Date.now() - 3600000 * 24, // 24 hours ago
    wordCount: 224,
    tags: ["E-mail", "Persuasivo"]
  }
];

export const MOCK_CHART_DATA = [
  { name: "Seg", palavras: 1200, rascunhos: 4, tempoSalvo: 35 },
  { name: "Ter", palavras: 2400, rascunhos: 6, tempoSalvo: 60 },
  { name: "Qua", palavras: 1800, rascunhos: 5, tempoSalvo: 48 },
  { name: "Qui", palavras: 3500, rascunhos: 9, tempoSalvo: 92 },
  { name: "Sex", palavras: 2800, rascunhos: 7, tempoSalvo: 74 },
  { name: "Sáb", palavras: 900,  rascunhos: 2, tempoSalvo: 15 },
  { name: "Dom", palavras: 1400, rascunhos: 3, tempoSalvo: 28 }
];

export const SAAS_PLANS = [
  {
    id: "free" as const,
    name: "Starter / Teste",
    price: "0",
    period: "grátis para sempre",
    features: [
      "Até 5 rascunhos por mês",
      "Geração de rascunhos básicos",
      "Tons Corporativo e Casual",
      "Painel de controle local",
      "Exportação direta de Markdown"
    ],
    limits: {
      draftsUsed: 2,
      draftsLimit: 5,
      wordsUsed: 392,
      wordsLimit: 1500,
      aiCreditsUsed: 3,
      aiCreditsLimit: 10
    },
    accentColor: "border-slate-200 dark:border-zinc-800"
  },
  {
    id: "pro" as const,
    name: "Sypher Pro",
    price: "49",
    period: "por usuário / mês",
    features: [
      "Rascunhos e refinamentos ilimitados",
      "Acesso completo a TODOS os 5 Tons de Voz",
      "Entrada de texto de alta densidade (15.000+ palavras)",
      "Histórico guardado com tags de organização",
      "Refinamento inteligente recursivo de IA",
      "Downloads ilimitados de relatórios em TXT e PDF"
    ],
    limits: {
      draftsUsed: 37,
      draftsLimit: 9999,
      wordsUsed: 12450,
      wordsLimit: 99999,
      aiCreditsUsed: 52,
      aiCreditsLimit: 9999
    },
    accentColor: "border-[#6366F1] ring-1 ring-[#6366F1]/20",
    popular: true
  },
  {
    id: "enterprise" as const,
    name: "Enterprise",
    price: "199",
    period: "por faturamento corporativo",
    features: [
      "Tudo no Pro e mais",
      "Treinamento de IA de voz sob demanda da empresa",
      "Acesso multiusuário simultâneo com permissões",
      "Segurança reforçada e SLA garantido",
      "API de integração direta do Sypher AI",
      "Gerente de conta exclusivo"
    ],
    limits: {
      draftsUsed: 320,
      draftsLimit: 999999,
      wordsUsed: 124000,
      wordsLimit: 9999999,
      aiCreditsUsed: 440,
      aiCreditsLimit: 999999
    },
    accentColor: "border-emerald-500 dark:border-emerald-400"
  }
];
