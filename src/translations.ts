export type Language = 'pt' | 'en' | 'es';

export const TRANSLATIONS = {
  pt: {
    common: {
      sign_in: "Entrar",
      start_free: "Começar Grátis",
      logout: "Sair do Sistema",
      home: "Início",
      docs: "Documentação",
      copy: "Copiar",
      copied: "Copiado com Sucesso!",
      cancel: "Cancelar",
      authorize: "Autorizar",
      connecting: "Conectando...",
      save: "Salvar",
      delete: "Excluir",
      back: "Voltar",
      status_online: "ONLINE",
      system_status: "Status do Sistema",
      uptime: "Garantia de Uptime (99.9%)",
      terms: "Termos de Uso",
      privacy: "Políticas de Privacidade",
      copyright: "© 2026 Sypher AI Inc. - Estável Padrão Corporativo.",
      all_rights: "Todos os direitos reservados.",
      no_results: "Nenhum resultado encontrado.",
      search_placeholder: "Pesquise na documentação (Ctrl+K)...",
    },
    hero: {
      badge: "⚡ Coprodutor de Conteúdo Corp-Level",
      title_1: "Sua excelência na",
      title_italic: "escrita executiva",
      title_2: "sem fricção",
      subtitle: "Converta anotações desconexas e rascunhos crus em artigos polidos para LinkedIn, e-mails de alta conversão, roteiros de tecnologia e sumários executivos com precisão matemática.",
      cta_google: "Entrar com Google",
      cta_github: "Conectar via GitHub",
      features_badge: "RECURSOS NATIVOS",
      features_title: "Refinamento Científico de Escrita",
      interactive_demo: "Mover o mouse ativa o campo de força do Nexus.",
      demo_placeholder: "O que você está pensando sob pressão? Digite aqui e movimente o cursor...",
    },
    metrics: {
      section_title: "Resultados de Alta Performance",
      section_subtitle: "Estatísticas reais que comprovam a superioridade da escrita refinada do Sypher AI contra rascunhos convencionais.",
      views_label: "Conversão e Cliques (%)",
      hours_saved: "Horas Salvas por Semana",
      conversion_increase: "Retenção de Leitura",
      comparison_conventional: "Escrita Clássica",
      comparison_sypher: "Refinamento Sypher AI",
      metric_1_title: "94% Mais Engajamento",
      metric_1_desc: "Algoritmos do LinkedIn priorizam textos com quebras de linha e gatilhos de tom integrados.",
      metric_2_title: "18.4 Horas Salvas",
      metric_2_desc: "Profissionais de vanguarda eliminam o bloqueio de tela em branco gerando pautas rápidas.",
      metric_3_title: "Redução de Alucinações",
      metric_3_desc: "Ajuste cirúrgico do contexto garante fidelidade de dados e conformidade corporativa."
    },
    steps: {
      step_1_title: "PASSO 01",
      step_1_header: "Despejar Rascunho Bruto",
      step_1_desc: "Digite notas soltas, transcrições inconsistentes de áudio ou tópicos rápidos que você anotou correndo.",
      step_2_title: "PASSO 02",
      step_2_header: "Calibrar Canal e Tom",
      step_2_desc: "Escolha o destino (Post, E-mail, Resumo) e selecione perfis de voz testados como Diplomático ou Entusiasta.",
      step_3_title: "PASSO 03",
      step_3_header: "Refinar Recursivamente",
      step_3_desc: "Peça ajustes finos em linguagem natural para que o modelo aprenda seus padrões de marca perfeitamente."
    },
    nav: {
      editor: "Copiloto (Editor)",
      library: "Biblioteca",
      reports: "Métricas",
      docs: "Guias (Docs)",
    },
    editor: {
      step_1: "1. Insira Notas ou Rascunhos Brutos",
      step_1_placeholder: "Cole transcrições brutas de áudios, ata de reuniões caóticas, ideias sob pressão ou rascunhos simples...",
      example_title: "Exemplos Rápidos:",
      example_linkedin: "Insight de Carreira (LinkedIn)",
      example_email: "E-mail de Reunião Comercial",
      step_2: "2. Escolha o Formato do Ativo",
      unit_refiner: "Configuração do Ativo",
      step_3: "3. Selecione o Tom de Voz",
      step_4: "4. Diretrizes de Estilo do Copiloto (Opcional)",
      step_4_placeholder: "Ex: 'Parágrafos de 2 linhas', 'use vocabulário de dev', 'adicione tags', 'preserve termos em inglês'...",
      convert_action: "PROCESSO EXECUTIVO CONVERTER",
      convert_subtitle: "O motor Sypher AI vai processar suas notas e confeccionar o texto completo.",
      button_generate: "Polir com Inteligência Sypher AI",
      button_generating: "Analisando e Refinando com IA...",
      output_header: "Slate Editor Output",
      button_copy: "COPIAR MD",
      button_copied: "Copiado com Sucesso!",
      refine_label: "Refinar Texto Gerado por IA",
      refine_placeholder: "Gostou do resultado? Peça ajustes: 'deixe mais direto', 'adicione hashtags', 'substitua por listas'...",
      button_refine: "Ajustar Rascunho",
      button_refining: "Lapidando..."
    },
    library: {
      title: "Biblioteca Sypher AI",
      subtitle: "Histórico de refinamentos recuperados e rascunhos salvos em tempo de execução",
      saved_drafts: "Rascunhos Salvos",
      word_count: "palavras",
      no_drafts: "Nenhum rascunho salvo ainda nesta sessão.",
      open: "Restaurar no Editor",
      createdAt: "Criado em"
    },
    analytics: {
      title: "Estatísticas de ROI Co-criador",
      subtitle: "Estatísticas calculadas a partir da sua biblioteca instalada no navegador",
      words_generated: "Palavras Refinadas",
      time_saved: "Horas de Trabalho Salvas",
      total_drafts: "Ativos na Biblioteca",
      chart_words_title: "Volume Semanal de Escrita",
      chart_time_title: "Métricas de Produtividade (Horas Salvas)",
      week_days: {
        seg: "Seg",
        ter: "Ter",
        qua: "Qua",
        qui: "Qui",
        sex: "Sex",
        sab: "Sáb",
        dom: "Dom"
      }
    },
    formats: {
      linkedin_post: {
        label: "Post para LinkedIn",
        desc: "Transforma rascunhos em publicações altamente engajantes com hashtags e estrutura persuasiva."
      },
      professional_email: {
        label: "E-mail Profissional",
        desc: "Confecciona e-mails executivos polidos, ideais para propostas, alinhamentos ou prospecções."
      },
      blog_draft: {
        label: "Draft de Artigo SEO",
        desc: "Cria esboços estruturados com cabeçalhos H1/H2 e parágrafos focados em termos buscados."
      },
      social_thread: {
        label: "Thread para X / Twitter",
        desc: "Gera sequências numeradas e dinâmicas que destrincham ideias complexas de forma viciante."
      },
      executive_summary: {
        label: "Resumo Executivo",
        desc: "Sintetiza áudios transcritos ou atas de reunião extensas em tópicos focados de alta gerência."
      }
    },
    tones: {
      profissional: {
        label: "Corporativo",
        desc: "Polido, diplomático e focado em resultados executivos."
      },
      persuasivo: {
        label: "Persuasivo (Copy)",
        desc: "Ganchos emocionais fortes, gatilhos de benefício rápido e CTAs claros."
      },
      informal: {
        label: "Casual",
        desc: "Leve, simpático, próximo e fácil de digerir em redes sociais."
      },
      tecnico: {
        label: "Analítico / Técnico",
        desc: "Baseado em dados, jargões corretos de tecnologia e tom preciso."
      },
      entusiasta: {
        label: "Conquistador",
        desc: "Autoestima alta, motivador e focado em histórias de superação."
      }
    },
    docs: {
      title: "Documentação de Engenharia Sypher AI",
      subtitle: "Guias avançados, arquitetura de prompts e boas práticas de integração.",
      search_dialog_title: "Pesquisar na Documentação",
      search_hotkey_tip: "Dica: Pressione Ctrl + K de qualquer lugar dos Docs para abrir esta caixa.",
      active_chapters: "Capítulos Ativos",
      chapters: [
        {
          id: "introduction",
          title: "Introduction & Core Architecture",
          category: "Começando",
          paragraphs: [
            "Bem-vindo ao Sypher AI. Nossa infraestrutura combina o motor avançado de compreensão semântica do Gemini com um pipeline sob medida para a confecção rápida de redação executiva e intelectual.",
            "Diferente de wrappers de chat comuns que produzem textos cheios de clichês ou prolixidade cansativa, o Sypher AI aplica pré-processamentos determinísticos e diretrizes rígidas.",
            "As etapas de modelagem limpam gerundismos, barram termos de preenchimento comuns ('no mundo dinâmico de hoje', 'revolucionário', 'divisor de águas') e restabelecem a clareza e elegância natural de suas transcrições e discursos crus."
          ]
        },
        {
          id: "prompt-engineering",
          title: "Executive Prompt Engineering",
          category: "Metodologia",
          paragraphs: [
            "O grande segredo por trás do polimento cirúrgico do Sypher AI é a separação rígida entre contexto e controle.",
            "No campo 1, coloque os dados puros (brain-dump comercial, notas de sprint sem polimento, transcrições de Whatsapp). No campo 4 (Diretrizes opcionais), declare restrições explícitas.",
            "Boas práticas para diretrizes executivas:",
            "- Use imperativos diretos: 'substitua todos os termos em português por jargões em inglês de engenharia'.",
            "- Estabeleça limites métricos: 'parágrafos de no máximo 2 linhas' ou 'use estrutura de bullet points para tópicos complexos'.",
            "- Barreira de hashtags: especifique exatamente quais hashtags incluir, evitando poluição visual típica de assistentes automáticos."
          ]
        },
        {
          id: "asset-modeling",
          title: "Asset Formats Spec Sheet",
          category: "Canais",
          paragraphs: [
            "Cada formato selecionado no painel do Copiloto tem parametrizações estruturais específicas em nosso compilador:",
            "1. LinkedIn Post: Otimizado para quebrar barreiras visuais de leitura rápida. Garante um gancho de impacto de 1 linha e divide as seções com espaços duplos.",
            "2. E-mail Profissional: Estrutura-se com o campo 'Assunto:' predefinido, seguido de saudação formal, proposta imediata em formato scannable e CTA indutivo para reserva de canais.",
            "3. SEO Article Draft: Foca na indexação. Inclui distribuições orgânicas de subtítulos e quebras técnicas perfeitas para engenharia de marca.",
            "4. Social Threads: Divide o fluxo do raciocínio em tweets curtos de no máximo 280 caracteres, numerados progressivamente (1/, 2/) com transições envolventes.",
            "5. Resumo Executivo: Sintetiza áudios ou atas caóticas em listas estruturadas de 'Decisões Relevantes', 'Atividades Pendentes' e 'Sumário de Alinhamento'."
          ]
        },
        {
          id: "voice-profiles",
          title: "Vocal Tone Adjustments",
          category: "Teoria",
          paragraphs: [
            "Os tons de voz alteram as 'temperaturas' de amostragem léxica e jargões dentro do Sypher Core:",
            "- Corporativo (Diplomático): Ideal para e-mails de alta gerência e memorandos formais. Usa termos sóbrios e polidos.",
            "- Persuasivo (Copy): Usa técnicas clássicas internacionais de escrita persuasiva como AIDA (Atenção, Interesse, Desejo, Ação).",
            "- Casual: Adota um vocabulário descontraído e próximo de redes sociais, sem gírias infantis.",
            "- Analítico/Técnico: Dá extremo peso a dados, cronogramas e palavras-chave específicas da engenharia.",
            "- Conquistador (Storytelling): Perfeito para posts de carreira baseados em superação, jornadas de aprendizado e storytelling envolvente."
          ]
        },
        {
          id: "data-persistence",
          title: "Durable Cloud & Context Sandbox",
          category: "Segurança",
          paragraphs: [
            "Todos os rascunhos inseridos, carregados ou refinados no Sypher AI operam sob uma política estrita de privacidade em sandbox.",
            "As notas inseridas são processadas em memória volátil durante a execução do endpoint e nunca são retidas em nosso servidor web após a entrega da resposta.",
            "O histórico da biblioteca utiliza indexação criptografada local. Isso impede o vazamento de segredos corporativos e planos estratégicos inseridos durante o processo produtivo diário sob pressão."
          ]
        },
        {
          id: "workspace-integrations",
          title: "Workspace Integration Protocols",
          category: "Avançado",
          paragraphs: [
            "Nossa infraestrutura permite a exportação ultra-rápida do texto processado via prancheta direta (clipboard) em formatos compatíveis com editores Markdown ou ricos (Rich Text Editors como Notion, Google Docs, etc).",
            "Graças às validações automáticas de codificação, o sistema preserva quebras de linha duras, numerações estruturadas e caracteres especiais comuns de codificação de software, permitindo colagem perfeita nos canais de destino executivos."
          ]
        }
      ]
    },
    footer: {
      desc: "Plataforma de co-autoria e inteligência de marca pessoal. Hospedada em contêineres seguros de Cloud Run.",
      product_pipelines: "PIPELINES DE ATIVOS",
      legal: "COMPLIANCE LEGAL",
      terms: "Termos de Uso",
      privacy: "Políticas de Privacidade",
      sla: "Garantia de Uptime (99.9%)",
      credentials: "AMBIENTE WORKSPACE DE ALTO DESEMPENHO"
    }
  },
  en: {
    common: {
      sign_in: "Sign In",
      start_free: "Start Free",
      logout: "Log Out",
      home: "Home",
      docs: "Documentation",
      copy: "Copy",
      copied: "Copied Successfully!",
      cancel: "Cancel",
      authorize: "Authorize",
      connecting: "Connecting...",
      save: "Save",
      delete: "Delete",
      back: "Back",
      status_online: "ONLINE",
      system_status: "System Status",
      uptime: "Uptime SLA (99.9%)",
      terms: "Terms of Service",
      privacy: "Privacy Protocol",
      copyright: "© 2026 Sypher AI Inc. - Stable Corporate Presets.",
      all_rights: "All rights reserved.",
      no_results: "No results matched your search.",
      search_placeholder: "Search documentation (Ctrl+K)...",
    },
    hero: {
      badge: "⚡ Corp-Level Content Co-Producer",
      title_1: "Your excellence in",
      title_italic: "executive writing",
      title_2: "without friction",
      subtitle: "Convert disjointed notes and raw drafts into polished articles for LinkedIn, high-conversion emails, software scripts, and executive summaries with mathematical precision.",
      cta_google: "Sign in with Google",
      cta_github: "Connect with GitHub",
      features_badge: "NATIVE RESOURCES",
      features_title: "Scientific Writing Refinement",
      interactive_demo: "Moving the mouse activates the Nexus force field.",
      demo_placeholder: "What are you thinking under pressure? Type here and glide the cursor...",
    },
    metrics: {
      section_title: "High Performance Results",
      section_subtitle: "Real stats proving the superiority of refined Sypher AI writing over conventional drafts.",
      views_label: "Conversion and Clicks (%)",
      hours_saved: "Hours Saved per Week",
      conversion_increase: "Reading Retention",
      comparison_conventional: "Classic Notes",
      comparison_sypher: "Sypher AI Refined",
      metric_1_title: "94% More Engagement",
      metric_1_desc: "LinkedIn algorithms prioritize texts with clean spacing, line breaks, and clear tone hooks.",
      metric_2_title: "18.4 Hours Saved",
      metric_2_desc: "Pioneering professionals bypass writers block by throwing in rapid bulleted thoughts.",
      metric_3_title: "Hallucination Reduction",
      metric_3_desc: "Surgical context alignment ensures factual correctness and brand safety."
    },
    steps: {
      step_1_title: "STEP 01",
      step_1_header: "Pour Raw Brain-dump",
      step_1_desc: "Write unsorted thoughts, messy voice transcripts, or rapid keywords you annotated on the fly.",
      step_2_title: "STEP 02",
      step_2_header: "Format & Tone Tuning",
      step_2_desc: "Pick your asset type (Post, Email, Summary) and select refined emotional profiles like Diplomatic or Technical.",
      step_3_title: "STEP 03",
      step_3_header: "Polishing Loop",
      step_3_desc: "Request smart point revisions using chat commands. Our platform continually adapts to your brand guidelines."
    },
    nav: {
      editor: "Copilot (Editor)",
      library: "Library",
      reports: "Metrics",
      docs: "Guides (Docs)",
    },
    editor: {
      step_1: "1. Input Raw Notes or Draft Outline",
      step_1_placeholder: "Paste messy voice transcription notes, chaotic meeting minutes, ideas under pressure, or simple drafts...",
      example_title: "Quick Examples:",
      example_linkedin: "Career Insight (LinkedIn)",
      example_email: "Commercial Discovery Email",
      step_2: "2. Choose Asset Template Format",
      unit_refiner: "Asset Format Engine",
      step_3: "3. Choose Voice Tone Profile",
      step_4: "4. Copilot Style Guidelines (Optional)",
      step_4_placeholder: "E.g. 'Short 2-line paragraphs', 'technical developer jargon only', 'add relevant hashtags'...",
      convert_action: "EXECUTIVE CONVERTER ENGINE",
      convert_subtitle: "The Sypher AI engine will process your notes and craft the complete high-fidelity text.",
      button_generate: "Polish with Sypher AI Engine",
      button_generating: "Analyzing & Refining with IA...",
      output_header: "Slate Editor Output",
      button_copy: "COPY MD",
      button_copied: "Copied successfully!",
      refine_label: "Refine AI Generated Content",
      refine_placeholder: "Do you like the output? Point adjustment: 'make it punchier', 'add some code references', 'summarize'...",
      button_refine: "Adjust Draft",
      button_refining: "Refining..."
    },
    library: {
      title: "Sypher Archive Library",
      subtitle: "Histórico de refinamentos recuperados e rascunhos salvos em tempo de execução",
      saved_drafts: "Saved Drafts",
      word_count: "words",
      no_drafts: "No drafts saved in this session yet.",
      open: "Restore to Editor",
      createdAt: "Created on"
    },
    analytics: {
      title: "Workplace ROI Analyzer",
      subtitle: "Estatísticas calculadas a partir da sua biblioteca instalada no navegador",
      words_generated: "Refined Words",
      time_saved: "Workplace Hours Saved",
      total_drafts: "Assets in Library",
      chart_words_title: "Weekly Written Output",
      chart_time_title: "Productivity Metrics (Hours Saved)",
      week_days: {
        seg: "Mon",
        ter: "Tue",
        qua: "Wed",
        qui: "Thu",
        sex: "Fri",
        sab: "Sat",
        dom: "Sun"
      }
    },
    formats: {
      linkedin_post: {
        label: "LinkedIn Post",
        desc: "Convert text into engaging, spacing-rich, and high-conversion professional social posts."
      },
      professional_email: {
        label: "Professional Corporate Email",
        desc: "Craft polished corporate messages, perfect for leads, syncs, proposals, and alignments."
      },
      blog_draft: {
        label: "SEO Blog Article Outline",
        desc: "Draft technical SEO outlines with pristine H1/H2 head distributions and target indexing focus."
      },
      social_thread: {
        label: "X / Twitter Thread Series",
        desc: "Generate sequential threads with natural transitions that split dense insights easily."
      },
      executive_summary: {
        label: "Executive Brief Summary",
        desc: "Condense messy recordings or transcripts into actionable high-management blueprints."
      }
    },
    tones: {
      profissional: {
        label: "Corporate (Diplomatic)",
        desc: "Polished, strategic, results-driven, and safe for senior managers."
      },
      persuasivo: {
        label: "Persuasive Copywriting",
        desc: "Strong hook mechanics, clear value, and call-to-actions built dynamically."
      },
      informal: {
        label: "Casual / Human",
        desc: "Approachable, conversational, friendly, and ideal for casual business communication."
      },
      tecnico: {
        label: "Technical / Analytical",
        desc: "Heavy data weight, software-aligned terms, objective and highly detailed."
      },
      entusiasta: {
        label: "Overachiever (Storytelling)",
        desc: "Empowering tone, focused on lessons learned and high-impact career growth."
      }
    },
    docs: {
      title: "Sypher AI Engineering & Docs",
      subtitle: "Advanced guides, prompt architecture, and workspace integration specifications.",
      search_dialog_title: "Search Documentation",
      search_hotkey_tip: "Tip: Press Ctrl + K from anywhere in the Docs to trigger this overlay.",
      active_chapters: "Active Chapters",
      chapters: [
        {
          id: "introduction",
          title: "Introduction & Core Architecture",
          category: "Getting Started",
          paragraphs: [
            "Welcome to the Sypher AI Documentation. Our systems pair Google's state-of-the-art semantic comprehension engine (Gemini) with custom, high-density professional writing parameters.",
            "Unlike simple generative chatbots that insert generic, fluff-filled sentences ('in today's digital era', 'groundbreaking', 'a game changer'), Sypher AI operates deterministic linguistic cleanups.",
            "We strip repetitive structures, prune passive vocal patterns, and mathematically enforce high-end formatting tailored for senior decision-makers and content engineers."
          ]
        },
        {
          id: "prompt-engineering",
          title: "Executive Prompt Engineering",
          category: "Methodology",
          paragraphs: [
            "The magic of Sypher AI relies on the strict segregation between inputs (raw content) and constraints (direct instructions).",
            "In Field 1, input your raw materials (e.g. brainstorming bullets, raw meeting notes, or voice transcripts). In Field 4 (Style guidelines), list explicit constraints.",
            "Best-practices for executive directives:",
            "- Use clean commands: 'Substitute specific technology references with standardized engineering nomenclature'.",
            "- Strict formatting: 'Adopt a dual-sentence paragraph style' or 'strictly represent metrics as bulleted lists'.",
            "- Hashtag limits: request exactly which hashtags to permit, blocking typical auto-generated social clutter."
          ]
        },
        {
          id: "asset-modeling",
          title: "Asset Formats Spec Sheet",
          category: "Channels",
          paragraphs: [
            "Each asset format on the Copilot dashboard has dedicated, scientifically engineered guidelines:",
            "1. LinkedIn Post: Engineered to bypass fast scrolling. Guarantees a high-impact hook and forces breathing room through double-spacing.",
            "2. Professional Email: Structures with standard 'Subject:' suggestions, greeting alignments, scannable proposals, and persuasive call-to-actions.",
            "3. SEO Article Draft: Establishes strong keyword distributions with H1/H2 header hierarchies for maximum organic ranking growth.",
            "4. Social Threads: Iteratively splits concepts into short, highly linkable posts under 280 characters, numbered progressively (1/, 2/) to keep users engaged.",
            "5. Executive Summary: Takes long transcripts and synthesizes them into actionable 'Takeaways', 'Next Steps', and 'Decision Registers'."
          ]
        },
        {
          id: "voice-profiles",
          title: "Vocal Tone Adjustments",
          category: "Theory",
          paragraphs: [
            "Vocal profiles systematically modify the backend LLM's decoding parameters, temperatures, and vocabulary densities:",
            "- Corporate (Diplomatic): Sets ideal baseline formality with high diplomatic poise, perfect for stakeholder reports and formal messages.",
            "- Persuasive Copywriting: Uses classical frameworks such as AIDA (Attention, Interest, Desire, Action) to create urgency and clear value.",
            "- Casual / Human: Simulates a welcoming peer-to-peer workspace chat, friendly but always respectful.",
            "- Technical / Analytical: Optimizes for technology terms, precise metric descriptions, lists of specs, and detailed explanations.",
            "- Overachiever (Storytelling): Leverages the hero's journey framework to highlight professional hurdles and personal triumphs."
          ]
        },
        {
          id: "data-persistence",
          title: "Durable Cloud & Context Sandbox",
          category: "Security",
          paragraphs: [
            "All inputs, drafts, and generated content are handled in strict sandboxed compliance environments.",
            "Materials are processed completely in fleeting container memory during request cycles and are never cached permanently by the cloud processor.",
            "Library historical storage uses your local browser system storage. This fully seals sensitive business information from outside access, preventing organizational leaks of proprietary strategies."
          ]
        },
        {
          id: "workspace-integrations",
          title: "Workspace Integration Protocols",
          category: "Advanced",
          paragraphs: [
            "Our viewport provides immediate clipboard exports, preserving hard line breaks, markdown tagging, and numbered hierarchies.",
            "This ensures seamless compatibility when pasting outputs directly into modern document tools such as Notion, Google Docs, Slack, or email tools with zero formatting errors."
          ]
        }
      ]
    },
    footer: {
      desc: "Co-authoring suite and personal brand builder. Fully hosted in isolated secure containers.",
      product_pipelines: "PRODUCT PIPELINES",
      legal: "LEGAL COMPLIANCE",
      terms: "Terms of Service",
      privacy: "Privacy Protocol",
      sla: "Uptime SLA (99.9%)",
      credentials: "HIGH PERFORMANCE WORKSPACE PRESET"
    }
  },
  es: {
    common: {
      sign_in: "Iniciar Sesión",
      start_free: "Comenzar Gratis",
      logout: "Cerrar Sesión",
      home: "Inicio",
      docs: "Documentación",
      copy: "Copiar",
      copied: "¡Copiado con Éxito!",
      cancel: "Cancelar",
      authorize: "Autorizar",
      connecting: "Conectando...",
      save: "Guardar",
      delete: "Eliminar",
      back: "Volver",
      status_online: "ONLINE",
      system_status: "Estado del Sistema",
      uptime: "Garantía de SLA (99.9%)",
      terms: "Términos del Servicio",
      privacy: "Pautas de Privacidad",
      copyright: "© 2026 Sypher AI Inc. - Estilo Corporativo Estable.",
      all_rights: "Todos los derechos reservados.",
      no_results: "No se encontraron resultados.",
      search_placeholder: "Buscar en la documentación (Ctrl+K)...",
    },
    hero: {
      badge: "⚡ Co-productor de Contenido de Nivel Corporativo",
      title_1: "Tu excelencia en",
      title_italic: "escritura ejecutiva",
      title_2: "sin fricciones",
      subtitle: "Convierte anotaciones dispersas y borradores ásperos en artículos pulidos para LinkedIn, correos de alta conversión, guiones de tecnología y resúmenes ejecutivos con precisión de ingeniero.",
      cta_google: "Entrar con Google",
      cta_github: "Conectar con GitHub",
      features_badge: "CONEXIONES NATIVAS",
      features_title: "Refinamiento Científico de Escritura",
      interactive_demo: "Mover el ratón activa el escudo magnético de Sypher.",
      demo_placeholder: "What are you thinking under pressure? Escribe aquí ya desliza el cursor...",
    },
    metrics: {
      section_title: "Resultados de Alto Rendimiento",
      section_subtitle: "Estadísticas reales que validan la superioridad del contenido refinado de Sypher AI contra borradores ordinarios.",
      views_label: "Conversión y Clics (%)",
      hours_saved: "Horas Ahorradas por Semana",
      conversion_increase: "Retención de Lectura",
      comparison_conventional: "Escritura Convencional",
      comparison_sypher: "Refinado por Sypher AI",
      metric_1_title: "94% Más Alcance",
      metric_1_desc: "El algoritmo de LinkedIn prioriza publicaciones estructuradas con saltos limpios y ganchos.",
      metric_2_title: "18.4 Horas Libres",
      metric_2_desc: "Ingenieros y directivos eliminan el síndrome de hoja en blanco volcando notas mentales crudas.",
      metric_3_title: "Menos Alucinaciones",
      metric_3_desc: "La alineación estricta de contexto reduce discrepancias técnicas y aporta conformidad legal."
    },
    steps: {
      step_1_title: "PASO 01",
      step_1_header: "Vaciar Ideas Crudas",
      step_1_desc: "Introduce notas aleatorias, transcripciones imperfectas de llamadas o apuntes de sprints tomados con prisa.",
      step_2_title: "PASO 02",
      step_2_header: "Canal y Tono Exacto",
      step_2_desc: "Selecciona el destino (LinkedIn, Correo, Resumen) y deforma el tono con perfiles sintonizados como Negociación o Técnico.",
      step_3_title: "PASO 03",
      step_3_header: "Reajustar y Salvar",
      step_3_desc: "Pide modificaciones incrementales utilizando instrucciones fluidas para dar forma idónea a tu voz de marca."
    },
    nav: {
      editor: "Copiloto (Editor)",
      library: "Biblioteca",
      reports: "Métricas",
      docs: "Documentos",
    },
    editor: {
      step_1: "1. Introduce Notas Crudas o Borrador",
      step_1_placeholder: "Pega transcripciones desordenadas de audio, actas de reuniones caóticas, notas rápidas del día a día...",
      example_title: "Ejemplos Rápidos:",
      example_linkedin: "Idea Profesional (LinkedIn)",
      example_email: "Correo de Prospección Comercial",
      step_2: "2. Selecciona Formato del Redactor",
      unit_refiner: "Clase de Activo",
      step_3: "3. Elige Perfil de Tono de Voz",
      step_4: "4. Pautas y Estilo del Copiloto (Opcional)",
      step_4_placeholder: "Ej: 'Párrafos de 2 líneas como máximo', 'usa vocabulario de desarrollo', 'añade hashtags'...",
      convert_action: "ACCIÓN EJECUTIVA DE CONVERSIÓN",
      convert_subtitle: "El motor de Sypher AI procesará tus ideas de inmediato para producir el texto completo.",
      button_generate: "Pulir con Inteligencia Sypher AI",
      button_generating: "Analizando y Refinando con IA...",
      output_header: "Slate Editor Output",
      button_copy: "COPIAR MD",
      button_copied: "¡Copiado con éxito!",
      refine_label: "Refinar Contenido Generado por IA",
      refine_placeholder: "¿Quieres cambios? Escribe el ajuste: 'hazlo más contundente', 'traduce al inglés', 'agrega viñetas'...",
      button_refine: "Ajustar Borrador",
      button_refining: "Lapidando..."
    },
    library: {
      title: "Archivos de Sypher AI",
      subtitle: "Historial de modificaciones locales y copias guardadas temporales",
      saved_drafts: "Borradores Guardados",
      word_count: "palabras",
      no_drafts: "No hay borradores guardados en esta sesión.",
      open: "Restaurar Editor",
      createdAt: "Creado el"
    },
    analytics: {
      title: "Métricas de ROI de Sypher AI",
      subtitle: "Estadísticas calculadas a partir de tu biblioteca local instalada en el navegador",
      words_generated: "Palabras Refinadas",
      time_saved: "Horas de Trabajo Ahorradas",
      total_drafts: "Borradores Guardados",
      chart_words_title: "Volumen de Redacción Semanal",
      chart_time_title: "Eficiencia Estimada (Horas Recuperadas)",
      week_days: {
        seg: "Lun",
        ter: "Mar",
        qua: "Mié",
        qui: "Jue",
        sex: "Vie",
        sab: "Sáb",
        dom: "Dom"
      }
    },
    formats: {
      linkedin_post: {
        label: "Publicación para LinkedIn",
        desc: "Optimiza notas en publicaciones de alta tracción, estructuradas para el algoritmo moderno con espacios."
      },
      professional_email: {
        label: "Correo Comercial Formal",
        desc: "Escribe correos directos perfectos para propuestas comerciales, leads y negociaciones ejecutivas."
      },
      blog_draft: {
        label: "Borrador de Artículo SEO",
        desc: "Crea la estructura del post con encabezados lógicos H1/H2 y alta legibilidad conceptual."
      },
      social_thread: {
        label: "Hilos para X / Twitter",
        desc: "Genera secuencias segmentadas de tweets de menos de 280 caracteres numerados racionalmente."
      },
      executive_summary: {
        label: "Resumen de Gerencia",
        desc: "Sintetiza actas de reunión o largas transcripciones de audio en conclusiones clave viables."
      }
    },
    tones: {
      profissional: {
        label: "Corporativo / Diplomático",
        desc: "Sóbrio, sofisticado y sumamente respetuoso, optimizado para ejecutivos."
      },
      persuasivo: {
        label: "Persuasivo (Copywriting)",
        desc: "Estructurado con ganchos poderosos, valor explícito y llamadas a la acción eficientes."
      },
      informal: {
        label: "Casual / Humano",
        desc: "Terminología amigable y cercana, perfecto para relaciones modernas sin rigidez."
      },
      tecnico: {
        label: "Analítico / Técnico",
        desc: "Prioriza estadísticas de ingeniería, jerga técnica exacta y argumentos lógicos."
      },
      entusiasta: {
        label: "Conquistador (Storytelling)",
        desc: "Enfoque inspirador, centrado en lecciones y desarrollo profesional excepcional."
      }
    },
    docs: {
      title: "Documentación Técnica Sypher AI",
      subtitle: "Guías avanzados, ingeniería de prompts e integración en plataformas.",
      search_dialog_title: "Buscar en la Documentación",
      search_hotkey_tip: "Tip: Presiona Ctrl + K desde cualquier lugar en los Docs para abrir este buscador.",
      active_chapters: "Capítulos Activos",
      chapters: [
        {
          id: "introduction",
          title: "Introduction & Core Architecture",
          category: "Primeros Pasos",
          paragraphs: [
            "Bienvenido a los Documentos de Sypher AI. Nuestra infraestructura asocia el motor avanzado de comprensión semántica de Gemini con reglas lingüísticas profesionales de alta fidelidad.",
            "Evitando la verborrea típica de asistentes artificiales de baja gama ('en este mundo hiperconectado', 'innovador', 'revolucionario'), Sypher AI ejecuta limpiezas sintácticas estrictas.",
            "Nuestros algoritmos reestructuran el texto, suprimen gerundios innecesarios y aplican un espaciado estratégico perfecto para directivos, ingenieros de software y creadores técnicos."
          ]
        },
        {
          id: "prompt-engineering",
          title: "Executive Prompt Engineering",
          category: "Metodología",
          paragraphs: [
            "La efectividad del refinador depende estrictamente de separar el material base de las directrices de modificación específicas.",
            "En el campo 1, inserta la información pura (apuntes breves, actas imperfectas, o notas rápidas). En el campo 4 (Pautas opcionales), define tus límites rígidos.",
            "Mejores prácticas para dirigir al copiloto:",
            "- Instrucciones claras: 'Sustituye terminología informal por conceptos técnicos de desarrollo ágil'.",
            "- Métricas precisas: 'Mantén límites de 2 frases por párrafo' o 'redacta en forma de viñetas claras'.",
            "- Filtro de etiquetas: especifica qué hashtags precisos permites para evitar saturación de redes."
          ]
        },
        {
          id: "asset-modeling",
          title: "Asset Formats Spec Sheet",
          category: "Canales",
          paragraphs: [
            "Cada formato del panel de control cuenta con patrones gramaticales y parámetros de salida especiales:",
            "1. Publicación para LinkedIn: Diseñado para cautivar la atención móvil. Contiene ganchos memorables y espaciado de doble salto para facilitar el escaneo visual rápido.",
            "2. Correo Comercial Formal: Añade sugerencias de asunto comercial de alto impacto, saludos de protocolo y llamadas de acción claras.",
            "3. Borrador de Artículo SEO: Modela la información con H1/H2 específicos ideales para algoritmos orgánicos modernos.",
            "4. Hilos para Twitter/X: Segmenta la información en tuits encadenados individuales de menos de 280 caracteres usando transiciones fluidas.",
            "5. Resumen de Gerencia: Transforma apuntes en listas categorizadas por 'Hitos Decididos', 'Tareas Técnicas Proximas' y 'Sumario General'."
          ]
        },
        {
          id: "voice-profiles",
          title: "Vocal Tone Adjustments",
          category: "Teoría",
          paragraphs: [
            "Los tonos alteran el comportamiento sémantico y temperaturas del motor de lenguaje Copilot:",
            "- Corporativo: Aporta diplomácia impecable y palabras cultas ideales para comunicaciones corporativas elevadas.",
            "- Persuasivo: Basado en estructuras clásicas de copywriting directo para promover acción e interacción acelerada.",
            "- Casual: Configura un tono amigable de igual a igual, alegre, informal y cercano.",
            "- Analítico: Resalta números, precisiones técnicas de programación y razonamientos lógicos con lenguaje exacto.",
            "- Conquistador: Emplea el viaje del héroe para construir relatos cautivadores de superación profesional o retos en startups."
          ]
        },
        {
          id: "data-persistence",
          title: "Durable Cloud & Context Sandbox",
          category: "Seguridad",
          paragraphs: [
            "Todos tus datos e ideas se manejan en un ambiente temporal seguro dentro de contenedores eficientes.",
            "Las notas del editor se cargan únicamente en memoria volátil de solicitud rápida y jamás se archivan en nuestros servidores una vez completado el flujo de refinamiento.",
            "El histórico de la biblioteca se graba estrictamente en el almacenamiento seguro de tu navegador (localStorage), protegiendo tus estrategias comerciales exclusivas e insights valiosos contra filtraciones ajenas."
          ]
        },
        {
          id: "workspace-integrations",
          title: "Workspace Integration Protocols",
          category: "Avanzado",
          paragraphs: [
            "Nuestra consola web incluye copia automática con retención de formatos optimizada para editores modernos como Notion, Google Docs, Slack, etc.",
            "Se preservan perfectamente las viñetas, guiones de listas y negritas, acelerando la transferencia a tus canales formales de trabajo cotidiano."
          ]
        }
      ]
    },
    footer: {
      desc: "Servicio de co-creación de activos digitales. Alojado y optimizado en entornos empresariales de Cloud Run.",
      product_pipelines: "PIPELINES DE SOFTWARE",
      legal: "COMPLIANCE LEGAL",
      terms: "Términos de Servicio",
      privacy: "Pautas de Privacidad",
      sla: "SLA de Disponibilidad (99.9%)",
      credentials: "CONFIGURACIÓN WORKSPACE DE ALTA GAMA"
    }
  }
};
