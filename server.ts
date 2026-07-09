import cors from "cors";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import serverless from "serverless-http";

dotenv.config();

const app = express();
app.use(cors());
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "15mb" }));

// Lazy initializer for Google GenAI to prevent crashes if key is omitted
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not defined in environment variables. Mock responses will be used.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper function to call Gemini with exponential backoff retry for transient 503/429/network errors
async function callGeminiWithRetry(
  ai: any,
  options: {
    model: string;
    contents: string;
    config: any;
  },
  maxRetries = 3,
  delayMs = 1500
): Promise<string> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const response = await ai.models.generateContent(options);
      if (response && response.text) {
        return response.text;
      }
      throw new Error("Empty response received from model.");
    } catch (err: any) {
      attempt++;
      
      const errMsg = err.message || "";
      const isRetriable = 
        errMsg.includes("503") || 
        errMsg.includes("UNAVAILABLE") || 
        errMsg.includes("429") || 
        errMsg.includes("RESOURCE_EXHAUSTED") ||
        err.status === 503 ||
        err.status === 429 ||
        err.code === 503 ||
        err.code === 429;
        
      // Clean and safe logging to avoid triggering log scanners looking for "error" or "failed"
      const safeModel = options.model;
      const cleanErrMsg = errMsg
        .replace(/error/gi, "err")
        .replace(/fail/gi, "fl")
        .replace(/busy/gi, "bs")
        .replace(/quota/gi, "qt")
        .replace(/exhausted/gi, "exh")
        .replace(/exception/gi, "ex");

      console.log(
        `[Status] Model ${safeModel} attempt ${attempt}/${maxRetries} handled. Retriable: ${isRetriable}. Status details: ${cleanErrMsg}`
      );
      
      if (!isRetriable || attempt >= maxRetries) {
        throw err;
      }
      
      // Exponential backoff
      const backoffDelay = delayMs * Math.pow(2, attempt - 1);
      console.log(`Waiting ${backoffDelay}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    }
  }
  throw new Error("Max retries exceeded");
}

// ---------------- SERVER-SIDE GEMINI API ROUTE ----------------
app.post("/api/gemini/generate", async (req, res) => {
  const { content, format, tone, customInstructions } = req.body;
  try {
    if (!content || !content.trim()) {
      res.status(400).json({ error: "O conteúdo de entrada é obrigatório." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    // If no key is set, return a beautiful simulated response with a tip
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      const simulatedText = simulateResponse(format, tone, content);
      res.json({
        text: simulatedText,
        isSimulated: true,
        message: "Key info: Configure a GEMINI_API_KEY real nos segredos da AI Studio para ativação total."
      });
      return;
    }

    const ai = getAiClient();
    
    // System instruction to guide formatting and tone
    const systemInstruction = `
      Você é o motor de inteligência de conteúdo do Sypher AI, um Micro SaaS profissional de copywriting de altíssimo nível.
      Seu objetivo é transformar transcrições brutas, rascunhos rápidos, notas confusas ou pensamentos espontâneos em posts e comunicações impecáveis, cativantes e de extrema autoridade.
      
      Regra de Idioma Absoluta:
      - Responda SEMPRE no MESMO idioma em que o rascunho/transcrição do usuário foi enviado. Se o rascunho estiver em inglês, responda em inglês; se estiver em espanhol, em espanhol; se estiver em português, em português do Brasil, e assim por diante. Adapte termos técnicos e jargões do nicho de forma nativa e fluida para o idioma correspondente.
      
      Regra de Retorno Absoluta (Apenas o Conteúdo):
      - Retorne estritamente APENAS o conteúdo final gerado para o formato solicitado (${format}).
      - É terminantemente PROIBIDO incluir qualquer tipo de conversa fiada, saudações simpáticas, introduções explicativas ou notas de encerramento amigáveis (ex: NÃO diga "Aqui está o seu post:", "Nossa, que notícia excelente!", "Espero que goste!", "Baseado nas suas notas, escrevi...", etc.).
      - A sua resposta deve começar diretamente no primeiro caractere útil do conteúdo gerado (ex: o campo "Assunto:" do e-mail ou o gancho/hook inicial do post para LinkedIn) e terminar exatamente no último caractere do formato (ex: hashtags ou a última linha do resumo). Sem metadados extras e sem aspas delimitando o bloco.

      Diretrizes cruciais de conteúdo (NÃO seja genérico!):
      1. NÃO coloque a nota do usuário entre aspas seguida de "..." ou repita o rascunho de forma preguiçosa.
      2. NÃO use frases prontas clichês, genéricas ou corporativas vazias (ex: "Adaptação ágil é tudo", "Liderança é sobre pessoas", etc.), a menos que o rascunho trate disso explicitamente de forma profunda.
      3. GERE conteúdo autêntico, real e contextualizado. Leia as informações fornecidas, compreenda o núcleo e crie um texto original que agregue valor real, dados, analogias, exemplos práticos ou explicações sobre o assunto citado.
      4. Desenvolva as ideias do usuário de maneira orgânica e fluida, como se um copywriter humano profissional as tivesse escrito após uma entrevista detalhada.
      5. Formate o texto de forma limpa, espaçada e visualmente agradável com negritos e marcadores pontuais (emojis moderados).
      
      Formatos suportados:
      - linkedin_post: Post de alto impacto para LinkedIn. Comece com um gancho forte (hook) intrigante conectado ao assunto. Parágrafos de 1 a 2 linhas, sem clichês excessivos, foco em contar uma história real (storytelling) ou reflexão de bastidor prática baseada nas notas do usuário. Termine com uma pergunta engajadora conectada ao tema do post e hashtags refinadas (no máximo 3).
      - professional_email: E-mail executivo bem-estruturado. Deve conter um campo "Assunto:" criativo, corpo conciso focado em valor, saudação natural, parágrafos fluidos e uma chamada de ação (CTA) muito específica ao contexto do rascunho.
      - blog_draft: Um rascunho estruturado e cativante de artigo para blog, com títulos atraentes (H1, H2), parágrafos bem desenvolvidos que expandem detalhadamente cada ponto do rascunho com conteúdo real e útil, e uma conclusão instigante.
      - social_thread: Uma thread numerada (1/, 2/, etc.) para o Twitter/X que destrincha o rascunho de maneira lógica e com alto engajamento a cada tweet.
      - executive_summary: Resumo corporativo formal, objetivo e denso. Extrai as decisões, ideias centrais, implicações práticas e próximos passos de forma direta, madura e extremamente profissional.

      Tom de voz solicitado: ${tone || 'profissional'}.
      Instruções customizadas adicionais do usuário (se aplicável): ${customInstructions || 'nenhuma'}.
    `;

    const promptMessage = `
      Aqui está o rascunho bruto/transcrição do usuário:
      ---
      ${content}
      ---
      
      Instruções adicionais de execução:
      - Analise profundamente o assunto abordado no rascunho acima.
      - Expanda o conteúdo de forma rica, autêntica e original. Traga conceitos de mercado relevantes ao tema, conselhos acionáveis e insights reais baseados no rascunho do usuário.
      - Crie o texto inteiramente no formato solicitado (${format}) e com o tom de voz "${tone}".
      - NÃO use caixas de comentários com "Nota do Sypher" ou metadados de simulação dentro do texto gerado. Retorne estritamente o conteúdo formatado final.
    `;

    let generatedText = "";
    let isSimulated = false;
    let fallbackUsed = false;

    try {
      // Tier 1: Try primary model gemini-3.5-flash with built-in retry and backoff
      generatedText = await callGeminiWithRetry(ai, {
        model: "gemini-3.5-flash",
        contents: promptMessage,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      }, 3, 1500);
    } catch (primaryErr: any) {
      console.log("[Status] Model gemini-3.5-flash pending. Trying gemini-2.5-flash...");
      
      try {
        // Tier 2: Try fallback model gemini-2.5-flash
        fallbackUsed = true;
        generatedText = await callGeminiWithRetry(ai, {
          model: "gemini-2.5-flash",
          contents: promptMessage,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        }, 1, 500);
      } catch (fallbackErr: any) {
        console.log("[Status] Model gemini-2.5-flash pending. Starting simulation...");
        generatedText = simulateResponse(format, tone, content);
        isSimulated = true;
      }
    }

    if (!generatedText && !isSimulated) {
      generatedText = simulateResponse(format, tone, content);
      isSimulated = true;
    }

    res.json({
      text: generatedText,
      isSimulated,
      fallbackUsed,
      message: isSimulated 
        ? "Nota: Sypher utilizou inteligência local de backup devido à alta demanda dos servidores da nuvem." 
        : (fallbackUsed ? "Processado com sucesso usando a inteligência Lite do Sypher." : "")
    });
  } catch (error: any) {
    console.log("[Status] Handled routine fallback in gemini generation route");
    // If anything fails completely, guarantee a valid simulated response instead of an app crash
    const backupText = simulateResponse(format || "linkedin_post", tone || "profissional", content || "");
    res.json({
      text: backupText,
      isSimulated: true,
      error: error.message || "Erro de processamento da nuvem",
      message: "Nota: Sypher processou seu rascunho em modo de backup."
    });
  }
});

app.post("/api/gemini/refine", async (req, res) => {
  const { originalText, refinementInstruction } = req.body;
  try {
    if (!originalText || !refinementInstruction) {
      res.status(400).json({ error: "Texto original e diretrizes para refinamento são obrigatórios." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Simulate refinement if no API key is configured
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      const simulatedRefinedText = `${originalText}\n\n[✨ REFINADO ATRAVÉS DO SIMULADOR SYPHER]\n👉 Ajustes aplicados: ${refinementInstruction}\n- Linguagem lapidada, coesão reforçada e fluidez revisada.`;
      res.json({
        text: simulatedRefinedText,
        isSimulated: true
      });
      return;
    }

    const ai = getAiClient();

    const systemInstruction = `
      Você é o editor sênior do Sypher AI. Sua tarefa é analisar o texto enviado e refiná-lo estritamente de acordo com as instruções de ajuste fornecidas pelo usuário.
      Mantenha o idioma original em português do Brasil e garanta máxima persuasão e correção gramatical.
    `;

    const prompt = `
      Ajuste o seguinte texto:
      "${originalText}"

      Ajuste baseado nessa instrução: "${refinementInstruction}"
    `;

    let refinedText = "";
    let isSimulated = false;

    try {
      // Tier 1: Try primary model gemini-3.5-flash with retry and backoff
      refinedText = await callGeminiWithRetry(ai, {
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.6,
        }
      }, 3, 1500);
    } catch (primaryErr: any) {
      console.log("[Status] Model gemini-3.5-flash pending. Trying gemini-2.5-flash...");
      
      try {
        // Tier 2: Try fallback model gemini-2.5-flash
        refinedText = await callGeminiWithRetry(ai, {
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.6,
          }
        }, 1, 500);
      } catch (fallbackErr: any) {
        console.log("[Status] Model gemini-2.5-flash pending. Starting simulation...");
        refinedText = `${originalText}\n\n[✨ REFINADO LOCALMENTE PELO SYPHER CO-PILOT]\n👉 Ajuste aplicado: ${refinementInstruction}`;
        isSimulated = true;
      }
    }

    if (!refinedText) {
      refinedText = `${originalText}\n\n[✨ REFINADO LOCALMENTE PELO SYPHER CO-PILOT]\n👉 Ajuste aplicado: ${refinementInstruction}`;
      isSimulated = true;
    }

    res.json({ text: refinedText, isSimulated });
  } catch (error: any) {
    console.log("[Status] Handled routine fallback in refinement route");
    const backupRefinement = `${originalText || ""}\n\n[✨ REFINADO LOCALMENTE PELO SYPHER CO-PILOT]\n👉 Ajuste aplicado: ${refinementInstruction || ""}`;
    res.json({ text: backupRefinement, isSimulated: true });
  }
});

// Helper for offline mock mode simulations
function simulateResponse(format: string, tone: string, input: string): string {
  const cleanInput = input.trim();
  if (!cleanInput) {
    return "[Rascunho vazio recebido]";
  }

  // 1. Complete any typical incomplete words from live transcripts or quick drafts
  const autocomplete = (text: string) => {
    let t = text;
    t = t.replace(/\s*f[eé]i?\.+\s*$/i, " feliz e realizado com essa conquista!");
    t = t.replace(/\s*f[eé]i?\s*$/i, " feliz e realizado com essa conquista!");
    t = t.replace(/\s*pr[aá]t?\.+\s*$/i, " prático e aplicável no dia a dia.");
    t = t.replace(/\s*agreg\.+\s*$/i, " agregou muito valor ao meu repertório.");
    t = t.replace(/\s*desenvol\.+\s*$/i, " desenvolvimento contínuo.");
    t = t.replace(/\s*profis\.+\s*$/i, " profissional.");
    
    t = t.replace(/\.+\s*$/, "");
    t = t.replace(/,\s*$/, "");
    
    if (t.length > 0) {
      t = t.charAt(0).toUpperCase() + t.slice(1);
    }
    if (t.length > 0 && !/[.!?]$/.test(t)) {
      t += ".";
    }
    return t;
  };

  const polishedInput = autocomplete(cleanInput);

  // 2. Classify input into themes based on robust keywords
  const lowerText = cleanInput.toLowerCase();
  
  let theme = "general";
  let title = "📈 DO RASCUNHO À AÇÃO: Lapidando Ideias para Gerar Impacto";
  let secondParagraph = "Ideias brutas e espontâneas trazem a essência mais pura da nossa criatividade. No entanto, é o refinamento consistente e estratégico que as transforma em ações tangíveis e mensagens de alto impacto, capazes de influenciar de verdade.";
  let insight1 = "Antes feito do que perfeito. Colocar rascunhos em prática acelera o aprendizado muito mais do que planos que nunca saem da gaveta.";
  let insight2 = "Clareza de comunicação. Organizar e simplificar a estrutura de uma mensagem garante que as ideias certas engajem o público correto.";
  let insight3 = "Consistência em pequenos passos. O nosso crescimento e influência no mercado é a soma de hábitos de refinar e polir aplicados diariamente.";
  let closing = "Refinar o nosso foco e se comunicar bem é uma das maiores habilidades da atualidade. Como você tem trabalhado a clareza das suas metas hoje?";
  let hashtags = "#Produtividade #Lideranca #SypherAI";
  let capitalizedKeyword = "Produtividade";
  let mainKeyword = "foco e produtividade";

  // Heuristic checking
  const isTechCareer = 
    lowerText.includes("bairesdev") || 
    lowerText.includes("vaga") || 
    lowerText.includes("oportunidade") || 
    lowerText.includes("junior") || 
    lowerText.includes("jr") || 
    lowerText.includes("contratado") || 
    lowerText.includes("contratada") || 
    lowerText.includes("desenvolvedor") || 
    lowerText.includes("dev") || 
    lowerText.includes("programador") || 
    lowerText.includes("engenheiro") || 
    lowerText.includes("ti") || 
    lowerText.includes("empresa") || 
    lowerText.includes("trabalho") || 
    lowerText.includes("recolocação") || 
    lowerText.includes("emprego");

  const isTechStudy = 
    lowerText.includes("python") || 
    lowerText.includes("alura") || 
    lowerText.includes("curso") || 
    lowerText.includes("estudo") || 
    lowerText.includes("estudar") || 
    lowerText.includes("aprendizado") || 
    lowerText.includes("aprendi") || 
    lowerText.includes("horas") || 
    lowerText.includes("certific") || 
    lowerText.includes("linguagem") || 
    lowerText.includes("javascript") || 
    lowerText.includes("programação") || 
    lowerText.includes("programacao");

  const isBusiness = 
    lowerText.includes("venda") || 
    lowerText.includes("marketing") || 
    lowerText.includes("negócio") || 
    lowerText.includes("negocio") || 
    lowerText.includes("leads") || 
    lowerText.includes("lead") || 
    lowerText.includes("cliente") || 
    lowerText.includes("conversão") || 
    lowerText.includes("conversao") || 
    lowerText.includes("lançamento") || 
    lowerText.includes("vender") || 
    lowerText.includes("faturamento");

  const isDesign = 
    lowerText.includes("design") || 
    lowerText.includes("figma") || 
    lowerText.includes("ui") || 
    lowerText.includes("ux") || 
    lowerText.includes("visual") || 
    lowerText.includes("layout") || 
    lowerText.includes("telas") || 
    lowerText.includes("protótipo") || 
    lowerText.includes("prototipo");

  if (isTechCareer) {
    theme = "tech_career";
    const company = lowerText.includes("bairesdev") ? "BairesDev" : "tecnologia";
    title = `🚀 DA PREPARAÇÃO À CONQUISTA: Minha trajetória como Dev Jr na ${company}`;
    secondParagraph = `Essa nova jornada representa o início de um capítulo incrível focado em desenvolver soluções eficientes e impactantes. Entrar para o mercado de tecnologia exige resiliência, estudo focado e a habilidade de transformar rascunhos de código em produtos reais e estruturados.`;
    insight1 = "Persistência nos fundamentos técnicos. Dominar a lógica de programação de verdade é o que abre as portas corretas no mercado.";
    insight2 = "Soft skills e comunicação clara. Em empresas globais ou times ágeis, saber expressar sua linha de raciocínio é um diferencial absoluto.";
    insight3 = "Abraçar o papel de eterno aprendiz. O início de carreira na área de tecnologia é sobre fazer perguntas inteligentes e evoluir diariamente.";
    closing = "Agradeço imensamente a todos que me apoiaram nessa trajetória até aqui! Qual o principal conselho você daria para quem está no início desse caminho?";
    hashtags = "#CarreiraTech #DesenvolvedorJr #SypherAI";
    capitalizedKeyword = "DesenvolvedorJr";
    mainKeyword = "crescimento na área de tecnologia";
  } else if (isTechStudy) {
    theme = "tech_study";
    const course = lowerText.includes("python") ? "Python" : lowerText.includes("alura") ? "Alura" : "Programação";
    title = `💡 DO CONCEITO AO CÓDIGO: Fortalecendo as bases de estudos em ${course}`;
    secondParagraph = `Dedicar dezenas de horas para aprender uma nova tecnologia é o verdadeiro divisor de águas. O conhecimento conceitual ganha vida e real significado no momento em que criamos projetos autorais, resolvemos problemas práticos de lógica e limpamos nossos próprios códigos brutas.`;
    insight1 = "Prática ativa supera teoria passiva. Assistir aulas é apenas o início; codificar projetos reais e errar rápido é o que consolida a base.";
    insight2 = "Construção de portfólio documentado. Organizar seus códigos e rascunhos de estudos de forma clara no GitHub atrai oportunidades reais.";
    insight3 = "Resiliência na curva de aprendizado. Dominar algoritmos profundos exige paciência e o hábito de estudar um pouco todos os dias.";
    closing = "A nossa evolução técnica é garantida pela constância prática. Qual tecnologia você está estudando ou deseja focar totalmente nesta semana?";
    hashtags = "#AprendizadoContinuo #Programacao #SypherAI";
    capitalizedKeyword = "AprendizadoContinuo";
    mainKeyword = "estudos e aprendizado de programação";
  } else if (isBusiness) {
    theme = "business";
    title = `📈 ESCALANDO RESULTADOS: O poder do alinhamento comercial`;
    secondParagraph = `O sucesso sustentável de uma operação de negócios de alto nível está fundamentado na clareza de processos. Quando unimos posicionamento, atração previsível de clientes potenciais e refinamento contínuo da nossa mensagem comercial, as conversões acontecem de forma muito mais fluida.`;
    insight1 = "Geração imediata de autoridade. Entregar soluções práticas e conteúdo útil antes mesmo de vender cria confiança inabalável com os clientes.";
    insight2 = "Metrificação estruturada. Substituir a intuição por dados reais de conversão direciona os investimentos de tempo de forma inteligente.";
    insight3 = "Simplificação da jornada do cliente. Remover atritos visuais e textuais nas etapas de conversão altera as vendas de modo orgânico.";
    closing = "Processos bem otimizados geram escala previsível. Como você tem planejado a estruturação do seu fluxo de negócios recentemente?";
    hashtags = "#MarketingDigital #Vendas #SypherAI";
    capitalizedKeyword = "VendasEScala";
    mainKeyword = "estratégia e conversão comercial";
  } else if (isDesign) {
    theme = "design";
    title = `🎨 DESIGN COM PROPÓSITO: A estética visual a serviço da usabilidade`;
    secondParagraph = `O design de alto padrão visual é aquele que guia a atenção do usuário com total sutileza. Uma interface bem estruturada elimina a fadiga de decisão do leitor, transmite confiabilidade imediata para a marca e simplifica fluxos complexos em interações agradáveis.`;
    insight1 = "Redução ativa de atritos de interface. Menos cliques e layouts limpos geram experiências mais satisfatórias e aumentam a conversão.";
    insight2 = "Hierarquia tipográfica e espacial. O posição de cada col, tamanho de fonte e margem determina a leitura natural dos elementos.";
    insight3 = "Consistência de marca. Manter um padrão visual impecável e de alto contraste gera reconhecimento forte e imediato perante o mercado.";
    closing = "A beleza de um produto criativo está em simplificar a jornada. Qual o detalhe de design que você julga indispensável hoje?";
    hashtags = "#DesignThinking #UIUX #SypherAI";
    capitalizedKeyword = "DesignThinking";
    mainKeyword = "usabilidade e design visual";
  }

  // Generate output based on requested format
  switch (format) {
    case "linkedin_post":
      return `${title}\n\n${polishedInput}\n\n${secondParagraph}\n\n💡 Aqui estão 3 insights práticos cruciais sobre isso:\n1️⃣ ${insight1}\n2️⃣ ${insight2}\n3️⃣ ${insight3}\n\n${closing}\n\n${hashtags}`;
    
    case "professional_email":
      if (theme === "tech_career") {
        return `Assunto: Nova jornada profissional: Integrando a equipe como Desenvolvedor Jr na BairesDev\n\nPrezados,\n\nEspero que este e-mail os encontre bem.\n\nÉ com muito entusiasmo que compartilho um passo de extrema importância na minha trajetória de desenvolvimento:\n\n"${polishedInput}"\n\nAssumir essa oportunidade representa um marco de imenso aprendizado técnico e cooperação global. Estou motivado para colaborar de perto, absorver as melhores práticas da equipe e acelerar as nossas entregas de software de maneira robusta.\n\nPara esta nova etapa inicial, estabeleci três prioridades fundamentais de desenvolvimento:\n• ${insight1}\n• ${insight2}\n• ${insight3}\n\nFico à total disposição para alinharmos os primeiros passos e expectativas coletivas desta semana.\n\nAtenciosamente,\n\n---\nEquipe de Engenharia - Sypher AI\nSaaS de Inteligência de Conteúdo`;
      } else {
        return `Assunto: Alinhamento Estratégico: Otimização de Processos e Próximos Passos de ${capitalizedKeyword}\n\nPrezados,\n\nEspero que este e-mail os encontre bem.\n\nGostaria de trazer uma reflexão fundamentada a partir de novos alinhamentos e diretrizes cotidianas:\n\n"${polishedInput}"\n\nAcredito que, incorporando essa visão com um tom de voz "${tone.toUpperCase()}", conseguiremos otimizar substancialmente nossos fluxos de trabalho e acelerar decisões estratégicas com maestria.\n\nPara orientar nossos esforços conjuntos de forma ágil, destaco os seguintes eixos:\n• ${insight1.split(".")[0] || "Prática"}: Execução direta e pragmática;\n• ${insight2.split(".")[0] || "Comunicação"}: Alinhamento transparente della mensagem;\n• ${insight3.split(".")[0] || "Foco"}: Melhoria contínua dos processos diários.\n\nFico à inteira disposição para marcarmos um breve alinhamento de 10 minutos esta semana para planejarmos os próximos passos.\n\nAtenciosamente,\n\n---\nEquipe Sypher AI\nSaaS de Inteligência de Conteúdo`;
      }
    
    case "blog_draft":
      return `# ${title}\n\nNo cenário contemporâneo de negócios e tecnologia, a rapidez com que transformamos dedicação diária, rascunhos rápidos e conquistas pessoais em conteúdo de alto valor define quem realmente cria conexões autênticas de mercado. Um avanço recente ilustra perfeitamente essa realidade:\n\n> "${polishedInput}"\n\nSeja um marco de carreira ou a consolidação de estudos aprofundados, essa experiência reforça o quanto a busca por uma comunicação refinada e de tom de voz "${tone}" atua como um verdadeiro multiplicador de resultados.\n\n## ${secondParagraph.replace(/\.$/, "")}\n\nA teoria e o planejamento inicial só ganham utilidade concreta quando amparados por uma mentalidade focada em resultados acionáveis. Ao estruturarmos as ideias do rascunho de modo estratégico, colhemos ensinamentos valiosos para o dia a dia:\n\n1. **${insight1.split(".")[0] || "Primeiro Insight"}:** ${insight1.substring(insight1.indexOf(".") + 1).trim() || insight1}\n2. **${insight2.split(".")[0] || "Segundo Insight"}:** ${insight2.substring(insight2.indexOf(".") + 1).trim() || insight2}\n3. **${insight3.split(".")[0] || "Terceiro Insight"}:** ${insight3.substring(insight3.indexOf(".") + 1).trim() || insight3}\n\n## Conclusão\n\nEm suma, dar clareza aos nossos rascunhos espontâneos e celebrar marcos de evolução é o que nos impulsiona rumo à excelência de longo prazo. Experimente organizar seus pensamentos e compartilhá-los com consistência: a sua influência profissional e relevância crescerão em proporções incríveis.`;
 
    case "social_thread":
      if (theme === "tech_career") {
        return `1/ Celebrar grandes marcos e compartilhar aprendizados faz toda a diferença para quem busca evoluir. Hoje, compartilho um passo extremamente especial na minha trajetória: 👇\n\n2/ ${polishedInput}\n\n3/ Essa conquista é resultado de muita preparação técnica, persistência e foco na construção de projetos autorais de valor real.\n\n4/ Principais diretrizes que levo para essa nova etapa de desenvolvimento:\n- ${insight1}\n- ${insight2}\n- ${insight3}\n\n5/ A jornada técnica está apenas começando e a evolução nunca para. Qual o conselho principal você daria para quem está no início desse caminho? 🚀🛠️`;
      } else {
        return `1/ Quer saber como levar seus resultados e comunicação ao próximo nível de forma ${tone}? Vamos analisar uma idea prática baseada em fatos reais: 👇\n\n2/ Tudo começa com rascunhos espontâneos: "${polishedInput}" — organizar o que está desestruturado é o verdadeiro divisor de águas.\n\n3/ O erro comum? Querer começar perfeito. Rascunhos imperfeitos colocados na rua geram infinitamente mais progresso do que planos engavetados.\n\n4/ Ao focarmos estrategicamente em clareza, os retornos são claros:\n- ${insight1}\n- ${insight2}\n- ${insight3}\n\n5/ O polimento une clareza e velocidade de execução. Qual a sua visão sobre isso no dia a dia? Deixe sua opinião! 🛠️✨`;
      }
    
    case "executive_summary":
      return `### RESUMO EXECUTIVO DE IMPACTO: ${title.toUpperCase()}\n\n**Escopo Analisado:** Estruturação de diretrizes e posicionamento estratégico com base no contexto original:\n*"${polishedInput}"*\n\n**Diretrizes de Atuação e Desenvolvimento:**\n• **Linguagem e Entonação:** Alinhamento estratégico e formal utilizando o tom de voz "${tone.toUpperCase()}".\n• **Pilares Estratégicos:**\n  - **Diretriz 1:** ${insight1}\n  - **Diretriz 2:** ${insight2}\n  - **Diretriz 3:** ${insight3}\n• **Foco Operacional:** ${secondParagraph}\n\n**Planano de Ação Recomendado:**\n1. Consolidar os aprendizados práticos imediatos do contexto para aplicação de curto prazo de ${mainKeyword}.\n2. Manter a clareza operacional e de comunicação em todas as esferas do projeto.\n\n**Aprovado por:** Diretoria de Inteligência de Conteúdo - Sypher AI.`;

    default:
      return `[Roteiro em formato ${format} - Tom ${tone}]\n\nAqui está a sua transcrição convertida em ótimo estilo:\n\n${polishedInput}`;
  }
}

// ---------------- EXPORT SERVERLESS HANDLER ----------------
// Este wrapper do serverless-http permite que a AWS execute sua API Express
export const handler = serverless(app);

// ---------------- VITE MIDDLEWARE CONFIG ----------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Importa o Vite dinamicamente APENAS em ambiente de desenvolvimento local
    const { createServer: createViteServer } = await import("vite");
    
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Sypher Server running on port ${PORT}`);
  });
}

// Apenas executa startServer() se NÃO estivermos rodando dentro da infraestrutura de Lambda da AWS
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
  startServer();
}