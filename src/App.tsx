import { useState, useEffect, useRef } from "react";
import { 
  Wand2, 
  Copy, 
  Linkedin, 
  Mail, 
  FileText, 
  Twitter, 
  Briefcase, 
  ExternalLink,
  ChevronDown,
  Globe,
  CornerDownRight,
  Sparkles,
  HelpCircle,
  Download,
  FileDown,
  X,
  FileCode,
  FileJson,
  Check,
  Home,
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ContentFormat, ToneType, Draft } from "./types";
import { DEFAULT_TEMPLATES, TONE_OPTIONS } from "./data";
import { TRANSLATIONS, Language } from "./translations";
// @ts-ignore
import sypherLogo from "./assets/images/sypherlogo.png";
import LandingPage from "./components/LandingPage";
import DocsPage from "./components/DocsPage";
import AboutPage from "./components/AboutPage";

function HelpTooltip({ text }: { text: string }) {
  return (
    <div className="relative group inline-block ml-1.5 align-middle">
      <button 
        type="button" 
        className="text-zinc-500 hover:text-red-500 transition-colors focus:outline-hidden cursor-help"
        aria-label="Help info"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2.5 bg-[#0d0d0f] border border-red-500/30 text-[10px] text-zinc-300 rounded-none shadow-2xl z-50 pointer-events-none leading-relaxed transition-all">
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0d0d0f] border-r border-b border-red-500/30 rotate-45" />
        {text}
      </div>
    </div>
  );
}

const TUTORIAL_STEPS = {
  pt: [
    {
      title: "Etapa 1: Inserir Notas Brutas",
      desc: "Aqui é onde a mágica começa. Cole suas notas desorganizadas, transcrições de áudios rápidas ou rascunhos sob pressão. O Sypher AI foi projetado para pegar ideias imperfeitas e transformá-las em ouro.",
      elementId: "step-1-container"
    },
    {
      title: "Etapa 2: Escolher Canal e Formato",
      desc: "Selecione o formato ideal para seu texto. Seja um post estruturado de LinkedIn, um e-mail comercial impecável, um rascunho de blog SEO, uma thread de Twitter/X ou um resumo executivo para a diretoria.",
      elementId: "step-2-container"
    },
    {
      title: "Etapa 3: Definir o Tom de Voz",
      desc: "Calibre a personalidade do texto. Escolha entre tons Corporativo/Diplomático, Persuasivo, Casual, Técnico/Analítico ou Conquistador para alinhar o vocabulário com sua marca pessoal ou empresarial.",
      elementId: "step-3-container"
    },
    {
      title: "Etapa 4: Motor Sypher & Painel de Saída",
      desc: "Adicione instruções extras personalizadas (como limitar parágrafos ou evitar emojis), clique em 'Polir com Inteligência Sypher AI' e veja seu texto refinado e pronto para uso no Slate Output!",
      elementId: "workspace-output-panel"
    }
  ],
  en: [
    {
      title: "Step 1: Input Raw Drafts",
      desc: "This is where the magic begins. Paste your unstructured notes, quick audio transcripts, or drafts written under pressure. Sypher AI is designed to take imperfect ideas and convert them into pure gold.",
      elementId: "step-1-container"
    },
    {
      title: "Step 2: Choose Asset Format",
      desc: "Select the perfect format for your content. Options include an engaging LinkedIn post, a polished corporate email, a structured SEO article outline, a sequential X/Twitter thread, or an executive summary.",
      elementId: "step-2-container"
    },
    {
      title: "Step 3: Choose Voice Tone Profile",
      desc: "Fine-tune the tone and style of your writing. Select between Corporate, Persuasive, Casual, Technical, or Overachiever profiles to perfectly match your target audience or company brand.",
      elementId: "workspace-output-panel"
    }
  ],
  es: [
    {
      title: "Paso 1: Ingresar Notas Crudas",
      desc: "Aquí es donde comienza la magia. Pega tus apuntes desordenados, transcripciones de voz rápidas o borradores iniciales. Sypher AI está diseñado para pulir ideas preliminares y darles una forma brillante.",
      elementId: "step-1-container"
    },
    {
      title: "Paso 2: Elegir Formato y Canal",
      desc: "Selecciona el formato ideal para tu texto. Puede ser una publicación optimizada de LinkedIn, un correo comercial formal, un borrador de artículo SEO, hilos dinámicos para Twitter/X o un resumen gerencial.",
      elementId: "step-2-container"
    },
    {
      title: "Paso 3: Definir el Tono de Voz",
      desc: "Calibra la formalidad y personalidad de tu redacción. Elige entre perfiles Corporativo/Diplomático, Presuasivo, Casual, Técnico/Analítico o Conquistador para conectar con el lector adequado.",
      elementId: "step-3-container"
    },
    {
      title: "Paso 4: Motor de Sypher y Panel de Salida",
      desc: "Añade pautas de estilo opcionales (como acotar párrafos o usar listas), haz clic en 'Pulir con Inteligencia Sypher AI' y obtén de inmediato tu borrador final refinado y copiable en la pantalla.",
      elementId: "workspace-output-panel"
    }
  ]
};

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<'landing' | 'app' | 'docs' | 'about'>('landing');

  // Controle de boot inicial do workspace
  const [booting, setBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootStepText, setBootStepText] = useState("");

  // Estado para controle da barra de avisos colada abaixo do header
  const [showWarning, setShowWarning] = useState(true);

  // Função utilitária de navegação para evitar incompatibilidade estrita de tipos
  const handleNavigate = (view: 'landing' | 'app' | 'docs' | 'about') => {
    setCurrentView(view);
  };

  // Localization states
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("sypher_lang");
      return (saved as Language) || "en";
    } catch {
      return "en";
    }
  });

  const changeLang = (l: Language) => {
    setLang(l);
    try {
      localStorage.setItem("sypher_lang", l);
    } catch {}
    addNotification(
      l === 'pt' ? "Idioma definido para Português" : l === 'en' ? "Language changed to English" : "Idioma cambiado a Español", 
      "info"
    );
  };

  const t = TRANSLATIONS[lang];

  // Lista de idiomas
  const languages = [
    { code: "pt", label: "Português", badge: "PT" },
    { code: "en", label: "English", badge: "EN" },
    { code: "es", label: "Español", badge: "ES" }
  ];

  // Toast Notifications
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' }[]>([]);

  const addNotification = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 4500);
  };

  // Editor states
  const [rawInput, setRawInput] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<ContentFormat | null>(null);
  const [selectedTone, setSelectedTone] = useState<ToneType | null>(null);
  const [customInstructions, setCustomInstructions] = useState("");
  const [outputText, setOutputText] = useState("");
  
  // Generator UI feedback mechanics
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [generatorProgress, setGeneratorProgress] = useState(0);

  // Refinement states
  const [isRefining, setIsRefining] = useState(false);
  const [refinementQuery, setRefinementQuery] = useState("");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Interactive Tutorial states
  const [tutorialActive, setTutorialActive] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(1);

  // Responsive Menu Navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  // Referência para o fechamento automático ao clicar fora
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const startTutorial = () => {
    setTutorialActive(true);
    setCurrentTutorialStep(1);
    addNotification(
      lang === 'en' ? "Interactive tutorial started!" : lang === 'es' ? "¡Tutorial interactivo iniciado!" : "Tutorial interativo iniciado!",
      "info"
    );
  };

  const stopTutorial = () => {
    setTutorialActive(false);
    addNotification(
      lang === 'en' ? "Tutorial completed. Enjoy Sypher AI!" : lang === 'es' ? "Tutorial finalizado. ¡Disfruta de Sypher AI!" : "Tutorial concluído. Aproveite o Sypher AI!",
      "success"
    );
  };

  const nextTutorialStep = () => {
    if (currentTutorialStep < 4) {
      setCurrentTutorialStep(prev => prev + 1);
    } else {
      stopTutorial();
    }
  };

  const prevTutorialStep = () => {
    if (currentTutorialStep > 1) {
      setCurrentTutorialStep(prev => prev - 1);
    }
  };

  // Silence HMR / WebSocket errors from iframe environments safely
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason?.message || String(event.reason || "");
      if (
        reason.includes("WebSocket") ||
        reason.includes("vite") ||
        reason.includes("HMR")
      ) {
        event.preventDefault();
      }
    };

    const handleError = (event: ErrorEvent) => {
      const msg = event.message || "";
      if (
        msg.includes("WebSocket") ||
        msg.includes("vite") ||
        msg.includes("HMR")
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleRejection, { capture: true });
    window.addEventListener("error", handleError, { capture: true });

    return () => {
      window.removeEventListener("unhandledrejection", handleRejection, { capture: true });
      window.removeEventListener("error", handleError, { capture: true });
    };
  }, []);

  // Força o reposicionamento no topo (0, 0) sempre que mudar de view/página na aplicação
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  // Executa a sequência de boot inicial do workspace de forma sincronizada
  useEffect(() => {
    if (currentView === 'app') {
      setBooting(true);
      setBootProgress(0);
      
      const bootSteps = {
        pt: ["Calibrando o motor", "Preparando workspace", "Carregando refinaria", "Pronto"],
        en: ["Calibrating engine", "Preparing workspace", "Loading refinery", "Ready"],
        es: ["Calibrando el motor", "Preparing workspace", "Cargando refinería", "Listo"]
      };
      const activeBootSteps = bootSteps[lang] || bootSteps.en;
      
      let progress = 0;
      setBootStepText(activeBootSteps[0]);
      setBootProgress(0);

      const intervalTime = 380;
      const timer = setInterval(() => {
        progress++;
        if (progress <= 5) {
          setBootProgress(progress);
          if (progress === 1) setBootStepText(activeBootSteps[0]);
          else if (progress === 2) setBootStepText(activeBootSteps[1]);
          else if (progress === 3) setBootStepText(activeBootSteps[2]);
          else if (progress >= 4) setBootStepText(activeBootSteps[3]);
        } else {
          // Apenas limpa o intervalo e fecha o boot após as duas extremidades (0 e 9) estarem acesas por um ciclo
          clearInterval(timer);
          setBooting(false);
        }
      }, intervalTime);
      
      return () => clearInterval(timer);
    } else {
      setBooting(false);
    }
  }, [currentView, lang]);

  // Efeito para fechar o dropdown de idioma ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        langDropdownOpen &&
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setLangDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [langDropdownOpen]);

  // Efeito para rolar a tela acompanhando a etapa ativa do tutorial
  useEffect(() => {
    if (tutorialActive) {
      const steps = TUTORIAL_STEPS[lang] || TUTORIAL_STEPS.en;
      const stepConfig = steps[currentTutorialStep - 1];
      if (stepConfig && stepConfig.elementId) {
        const element = document.getElementById(stepConfig.elementId);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      }
    }
  }, [tutorialActive, currentTutorialStep, lang]);

  const currentTemplate = selectedFormat ? DEFAULT_TEMPLATES.find(t => t.id === selectedFormat) : undefined;

  // Simulate generator multi-step labels
  const runGenerationMeters = (onComplete: () => void) => {
    const toneName = selectedTone ? selectedTone.toUpperCase() : "DEFAULT";
    const templateLabel = currentTemplate?.label || "Document";

    const ptSteps = [
      "Sypher está analisando notas e rascunhos brutos...",
      "Sypher reconhecendo termos técnicos chave...",
      "Sypher aplicando inteligência do tom [" + (selectedTone ? selectedTone.toUpperCase() : "PADRÃO") + "]...",
      "Sypher para leitura em tela...",
      "Sypher finalizando tags de engajamento do " + (currentTemplate?.label || "Documento") + "..."
    ];

    const enSteps = [
      "Sypher is analyzing messy outlines and source drafts...",
      "Sypher recognizing key trade terms and jargon...",
      "Sypher injecting [" + toneName + "] profile layers...",
      "Sypher formatting typography for screen readability...",
      "Sypher compiling engagement links for " + templateLabel + "..."
    ];

    const esSteps = [
      "Sypher está analizando borradores iniciales...",
      "Sypher reconociendo jergas técnicas clave...",
      "Sypher impregnando perfil de tono [" + (selectedTone ? selectedTone.toUpperCase() : "ESTÁNDAR") + "]...",
      "Sypher modelando legibilidad de tipografía en pantalla...",
      "Sypher empaquetando etiquetas y enlaces de " + (currentTemplate?.label || "Documento") + "..."
    ];

    const targetSteps = lang === 'en' ? enSteps : lang === 'es' ? esSteps : ptSteps;

    let i = 0;
    setGenerationStep(targetSteps[0]);
    setGeneratorProgress(1); // Passo 1 (centro)
    const timer = setInterval(() => {
      i++;
      if (i < targetSteps.length) {
        setGenerationStep(targetSteps[i]);
        setGeneratorProgress(i + 1); // Passos de 2 a 5
      } else {
        clearInterval(timer);
        onComplete();
      }
    }, 500);
  };

  // Core API call
  const handleGenerate = async () => {
    if (!rawInput.trim()) {
      addNotification(t.editor.step_1_placeholder.slice(0, 45) + "...", "info");
      return;
    }

    if (rawInput.length > 500) {
      addNotification(
        lang === 'en'
          ? "Input draft exceeds 500 characters limit!"
          : lang === 'es'
          ? "¡El borrador supera el límite de 500 caracteres!"
          : "O rascunho ultrapassa o limite de 500 caracteres!",
        "info"
      );
      return;
    }

    if (!selectedFormat) {
      addNotification(
        lang === 'en' 
          ? "Please select a channel/format (Step 2) before polishing!" 
          : lang === 'es' 
          ? "¡Por favor, seleccione un formato (Paso 2) antes de pulir!" 
          : "Por favor, selecione um canal/formato (Etapa 2) antes de polir!",
        "info"
      );
      return;
    }

    if (!selectedTone) {
      addNotification(
        lang === 'en' 
          ? "Please select a voice tone profile (Step 3) before polishing!" 
          : lang === 'es' 
          ? "¡Por favor, seleccione un perfil de tono (Paso 3) antes de pulir!" 
          : "Por favor, selecione um tom de voz (Etapa 3) antes de polir!",
        "info"
      );
      return;
    }

    setIsGenerating(true);
    runGenerationMeters(async () => {
      try {
        const response = await fetch("/api/gemini/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: rawInput,
            format: selectedFormat,
            tone: selectedTone,
            customInstructions
          })
        });

        if (!response.ok) {
          throw new Error("Erro do servidor ao gerar rascunho com IA.");
        }

        const data = await response.json();
        
        setOutputText(data.text);
        if (data.isSimulated) {
          addNotification(
            lang === 'en' 
              ? "Running in simulation sandbox mode! Add GEMINI_API_KEY to activate Gemini AI." 
              : lang === 'es'
              ? "¡Simulador activo! Proporcione GEMINI_API_KEY para activar la IA en directo."
              : "Simulador ativo! Para usar a IA real, coloque a GEMINI_API_KEY.", 
            "info"
          );
        } else {
          addNotification(
            lang === 'en' ? "Draft successfully processed via Sypher core!" : lang === 'es' ? "¡Borrador refinado exitosamente!" : "Rascunho processado com maestria pelo Sypher AI!", 
            "success"
          );
        }

      } catch (err: any) {
        console.error(err);
        addNotification("Generation failure: " + (err.message || "Error"), "info");
      } finally {
        setIsGenerating(false);
        setGenerationStep("");
      }
    });
  };

  // Refinement API call
  const handleRefine = async () => {
    if (!outputText) return;
    if (!refinementQuery.trim()) return;

    setIsRefining(true);
    try {
      const response = await fetch("/api/gemini/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalText: outputText,
          refinementInstruction: refinementQuery
        })
      });

      if (!response.ok) {
        throw new Error("Erro no servidor ao refinar conteúdo.");
      }

      const data = await response.json();
      setOutputText(data.text);
      setRefinementQuery("");
      addNotification(
        lang === 'en' ? "Adjusted text successfully!" : lang === 'es' ? "¡Texto modificado con éxito!" : "Ajustes aplicados com sucesso!", 
        "success"
      );

    } catch (err: any) {
      console.error(err);
      addNotification("Refinement error: " + err.message, "info");
    } finally {
      setIsRefining(false);
    }
  };

  const loadExample = (text: string) => {
    setRawInput(text);
    addNotification(lang === 'en' ? "Example loaded!" : lang === 'es' ? "¡Ejemplo cargado!" : "Exemplo carregado!", "success");
  };

  const downloadTextFile = (format: 'txt' | 'md' | 'html' | 'json') => {
    if (!outputText) return;
    
    let mimeType = 'text/plain';
    let content = outputText;
    let extension = format;
    
    if (format === 'md') {
      mimeType = 'text/markdown';
    } else if (format === 'html') {
      mimeType = 'text/html';
      content = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <title>Sypher AI - Exported Content</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.7;
      max-width: 740px;
      margin: 60px auto;
      padding: 0 24px;
      color: #111827;
      background-color: #ffffff;
    }
    h1, h2, h3 {
      color: #111111;
      font-weight: 700;
      margin-top: 1.8em;
      margin-bottom: 0.6em;
    }
    h1 { font-size: 2rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
    p { margin-bottom: 1.25em; }
    code {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
      background-color: #f3f4f6;
      padding: 0.2em 0.4em;
      font-size: 0.875em;
      border-radius: 4px;
    }
    pre {
      background-color: #f3f4f6;
      padding: 16px;
      overflow-x: auto;
      border-radius: 6px;
    }
    pre code {
      background-color: transparent;
      padding: 0;
      font-size: 0.875em;
    }
    hr {
      border: 0;
      border-top: 1px solid #e5e7eb;
      margin: 2em 0;
    }
    footer {
      margin-top: 4em;
      font-size: 0.75rem;
      color: #6b7280;
      text-align: center;
      border-top: 1px solid #e5e7eb;
      padding-top: 2em;
    }
  </style>
</head>
<body>
  <div>
    ${outputText.replace(/\n/g, '<br />')}
  </div>
  <footer>
    <p>Sypher AI - Premium Content Engine &copy; 2026</p>
  </footer>
</body>
</html>`;
    } else if (format === 'json') {
      mimeType = 'application/json';
      content = JSON.stringify({
        metadata: {
          platform: "Sypher AI Workspace",
          engine: "Sypher Core",
          exportedAt: new Date().toISOString(),
          format: selectedFormat,
          tone: selectedTone
        },
        draft_source: rawInput,
        refined_content: outputText
      }, null, 2);
    }
    
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `sypher-export-${timestamp}.${extension}`;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    addNotification(
      lang === 'en' 
        ? `Successfully downloaded .${extension.toUpperCase()} file!` 
        : lang === 'es' 
        ? `¡Archivo .${extension.toUpperCase()} descargado con éxito!` 
        : `Arquivo .${extension.toUpperCase()} baixado com sucesso!`,
      "success"
    );
  };

  // Dynamic process sequence progress tracking
  const isStep1Completed = rawInput.trim().length > 0;
  const isStep2Completed = isStep1Completed && selectedFormat !== null;
  const isStep3Completed = isStep2Completed && selectedTone !== null;
  const isStep4Completed = isStep3Completed && outputText.length > 0;

  // Compute progress percentage
  let progressPercent = 0;
  if (isStep4Completed) {
    progressPercent = 100;
  } else if (isStep3Completed) {
    progressPercent = 100;
  } else if (isStep2Completed) {
    progressPercent = 66.66;
  } else if (isStep1Completed) {
    progressPercent = 33.33;
  }

  // Desvios de rota globais da aplicação
  if (currentView === 'landing') {
    return <LandingPage lang={lang} onNavigate={handleNavigate} changeLang={changeLang} />;
  }

  if (currentView === 'docs') {
    return <DocsPage lang={lang} onNavigate={handleNavigate} changeLang={changeLang} />;
  }

  if (currentView === 'about') {
    return <AboutPage lang={lang} onNavigate={handleNavigate} changeLang={changeLang} />;
  }

  return (
    <div className="min-h-screen bg-[#000000] font-sans antialiased text-[#E5E5E5] relative overflow-x-hidden" id="scribecraft-saas-root">
      
      {/* SECURE WORKSPACE BOOT SEQUENCE (PREMIUM ENTRANCE ANIME) */}
      <AnimatePresence>
        {booting && (
          <motion.div
            key="secure-boot-overlay"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-[#030304] z-50 flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="relative flex flex-col items-center">
              {/* Quadrados de carregamento idênticos ao LoadingScreen (Center-Outwards) */}
              <div className="flex items-center gap-2">
                {Array.from({ length: 10 }, (_, i) => {
                  const distanceFromCenter = 4 - Math.min(i, 9 - i);
                  const isSquareFilled = distanceFromCenter < bootProgress;
                  return (
                    <div
                      key={i}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 border transition-colors duration-300 ${
                        isSquareFilled
                          ? "bg-red-500 border-red-500"
                          : "bg-transparent border-zinc-700"
                      }`}
                    />
                  );
                })}
              </div>

              {/* Textos de status idênticos ao LoadingScreen */}
              <div className="mt-8 h-4 relative flex items-center justify-center min-w-[180px]">
                <span className="absolute text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-zinc-500 text-center">
                  {bootStepText}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WORKSPACE APP INTERFACE SHELL */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={!booting ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col min-h-screen min-w-0 w-full overflow-x-hidden"
      >
        
        {/* Main Application Header */}
        <header className="sticky top-0 z-40 w-full border-b border-white/[0.04] bg-[#030304]/85 backdrop-blur-md shrink-0" id="app-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            
            {/* Logo and brand name */}
            <div 
              className="flex items-center gap-3 cursor-pointer shrink-0"
              onClick={() => {
                setMobileMenuOpen(false);
                handleNavigate('landing');
              }}
            >
              <div className="w-9 h-9 overflow-hidden flex items-center justify-center">
                <img 
                  src={sypherLogo} 
                  alt="Sypher Logo" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="text-left">
                <h1 className="text-sm font-semibold tracking-widest text-white uppercase">
                  Sypher<span className="font-sans text-red-500 font-normal lowercase tracking-normal"> AI</span>
                </h1>
              </div>
            </div>

            {/* PC HEADER LAYOUT */}
            <div className="hidden md:flex items-center gap-2">
              {/* Tutorial Trigger Button */}
              <button
                onClick={startTutorial}
                className="flex items-center justify-center w-8 h-8 bg-[#08080a] hover:bg-zinc-900 border border-white/[0.05] rounded-none text-zinc-300 hover:text-red-500 hover:border-red-500/30 transition-all cursor-pointer font-sans font-medium relative group"
                title={lang === 'en' ? "Interactive Tutorial" : lang === 'es' ? "Tutorial Interactivo" : "Tutorial Interativo"}
                id="tutorial-trigger-button"
              >
                <HelpCircle className="w-4 h-4 text-red-500" />
                <span className="absolute top-full mt-1.5 hidden group-hover:block whitespace-nowrap bg-zinc-950 border border-white/[0.08] text-[9px] px-2 py-0.5 text-zinc-400 right-0 z-50">
                  {lang === 'en' ? "Quick Tour" : lang === 'es' ? "Iniciar Tutorial" : "Iniciar Tutorial"}
                </span>
              </button>

              {/* Language Switcher Dropdown */}
              <div className="relative inline-block text-left" ref={langDropdownRef}>
                <button 
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#08080a] hover:bg-zinc-900 border border-white/[0.05] rounded-none text-xs text-zinc-300 hover:text-white transition-all cursor-pointer font-sans font-medium"
                >
                  <Globe className="w-3.5 h-3.5 text-red-500" />
                  <span className="uppercase">{lang}</span>
                  <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-300 ${langDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-[#070709] border border-white/[0.08] shadow-2xl z-50 rounded-none overflow-hidden py-1.5 text-left divide-y divide-white/[0.03]">
                    {languages.map((item) => {
                      const isActive = lang === item.code;
                      return (
                        <button 
                          key={item.code}
                          type="button"
                          onClick={() => { changeLang(item.code as Language); setLangDropdownOpen(false); }}
                          className={`w-full text-left px-3.5 py-2 text-xs font-sans font-medium transition flex items-center justify-between hover:bg-white/[0.02] group ${
                            isActive ? 'text-white bg-red-950/15' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`font-mono text-[9px] px-1 py-0.5 border rounded-xs transition-colors duration-150 ${
                              isActive 
                                ? 'bg-red-500/10 border-red-500/20 text-red-400 font-bold' 
                                : 'bg-white/[0.03] border-white/[0.05] text-zinc-500 group-hover:text-zinc-300 group-hover:border-white/10'
                            }`}>
                              {item.badge}
                            </span>
                            <span className={isActive ? "font-semibold" : ""}>{item.label}</span>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 text-red-500 shrink-0 animate-none" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Exit / Return to Landing Page Button */}
              <button
                onClick={() => handleNavigate('landing')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0e0a0a] hover:bg-zinc-900 border border-white/10 hover:border-white/30 rounded-none text-xs text-zinc-400 hover:text-white transition-all cursor-pointer font-sans font-bold uppercase tracking-wider"
              >
                <Home className="w-3.5 h-3.5 text-red-500" />
                <span>PORTAL</span>
              </button>
            </div>

            {/* CELLPHONE HEADER LAYOUT */}
            <div className="flex items-center gap-3 md:hidden">
              {/* Language Switcher Button */}
              <button
                type="button"
                onClick={() => changeLang(lang === 'en' ? 'pt' : lang === 'pt' ? 'es' : 'en')}
                className="text-[10px] font-sans font-bold uppercase border border-white/[0.04] bg-[#0c0c0f] px-2.5 py-1 cursor-pointer"
                title="Toggle Language"
              >
                {lang}
              </button>
              {/* Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-zinc-400 hover:text-white cursor-pointer p-1"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* Mobile Drawer Navigation Panel */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden border-t border-white/[0.04] bg-[#050507] overflow-hidden"
              >
                <div className="px-4 py-4 space-y-3 flex flex-col text-[11px] font-sans font-bold uppercase tracking-widest text-left">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleNavigate('landing');
                    }}
                    className="py-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Portal
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleNavigate('docs');
                    }}
                    className="py-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Docs
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleNavigate('about');
                    }}
                    className="py-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {lang === 'pt' ? 'Sobre' : lang === 'es' ? 'Sobre' : 'About'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      startTutorial();
                    }}
                    className="py-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Tutorial
                  </button>
                  <div className="border-t border-white/[0.04] pt-3 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleNavigate('app');
                      }}
                      className="text-center bg-white text-[#030304] py-2.5 font-black uppercase tracking-widest text-[10px] cursor-pointer"
                    >
                      {lang === 'pt' ? 'REFINARIA' : lang === 'es' ? 'REFINERÍA' : 'REFINERY'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Sticky Warning/Welcome Bar - Dismissible layout pinned directly below the header */}
        <AnimatePresence>
          {showWarning && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="sticky top-16 z-30 w-full border-b border-red-500/20 bg-[#0c0505]/95 backdrop-blur-md overflow-hidden shrink-0"
              id="sticky-warning-banner"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="text-red-500 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-zinc-400 truncate leading-normal">
                    <span className="text-white font-bold uppercase tracking-wider mr-1.5">
                      {lang === 'en' ? "Notice:" : lang === 'es' ? "Aviso:" : "Aviso:"}
                    </span>
                    {lang === 'en' 
                      ? "This workspace runs on state-of-the-art AI. Verify all generated texts before distribution." 
                      : lang === 'es'
                      ? "Este espacio de trabajo funciona con IA de última generación. Verifique la precisión antes de compartir."
                      : "Este espaço de trabalho funciona com IA de última geração. Verifique a precisão dos dados antes de compartilhar."
                    }
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWarning(false)}
                  className="text-zinc-500 hover:text-white cursor-pointer transition p-1 shrink-0 focus:outline-hidden"
                  aria-label="Close message"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 pb-16">
          
          {/* Interactive Procedure Steps Header */}
          <div className="w-full mb-8 relative" id="sypher-progress-sequence-panel">
            <div className="relative h-1 bg-zinc-900 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-red-700 via-red-600 to-red-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Steps Text Labels */}
            <div className="relative flex justify-between items-center w-full px-1">
              
              {/* Step 1 Checkpoint */}
              <button 
                type="button"
                onClick={() => document.getElementById("step-1-container")?.scrollIntoView({ behavior: 'smooth' })}
                className="flex flex-col items-start text-left group cursor-pointer focus:outline-hidden"
              >
                <span className={`text-[9px] font-sans font-bold uppercase tracking-wider transition-colors duration-300 ${isStep1Completed ? 'text-red-500' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                  {lang === 'en' ? "Raw Draft" : lang === 'es' ? "Borrador" : "Inserir Notas"}
                </span>
              </button>

              {/* Step 2 Checkpoint */}
              <button 
                type="button"
                onClick={() => document.getElementById("step-2-container")?.scrollIntoView({ behavior: 'smooth' })}
                className="flex flex-col items-center text-center group cursor-pointer focus:outline-hidden"
              >
                <span className={`text-[9px] font-sans font-bold uppercase tracking-wider transition-colors duration-300 ${isStep2Completed ? 'text-red-500' : (isStep1Completed && !isStep2Completed) ? 'text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                  {lang === 'en' ? "Format" : lang === 'es' ? "Formatear" : "Escolher Canal"}
                </span>
              </button>

              {/* Step 3 Checkpoint */}
              <button 
                type="button"
                onClick={() => document.getElementById("step-3-container")?.scrollIntoView({ behavior: 'smooth' })}
                className="flex flex-col items-center text-center group cursor-pointer focus:outline-hidden"
              >
                <span className={`text-[9px] font-sans font-bold uppercase tracking-wider transition-colors duration-300 ${isStep3Completed ? 'text-red-500' : (isStep2Completed && !isStep3Completed) ? 'text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                  {lang === 'en' ? "Tone" : lang === 'es' ? "Voz y Tono" : "Definir Tom"}
                </span>
              </button>

              {/* Step 4 Checkpoint */}
              <button 
                type="button"
                onClick={() => document.getElementById("workspace-output-panel")?.scrollIntoView({ behavior: 'smooth' })}
                className="flex flex-col items-end text-right group cursor-pointer focus:outline-hidden"
              >
                <span className={`text-[9px] font-sans font-bold uppercase tracking-wider transition-colors duration-300 ${isStep4Completed ? 'text-red-500' : (isStep3Completed && !isStep4Completed) ? 'text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                  {lang === 'en' ? "Sypher Engine" : lang === 'es' ? "IA Sypher" : "Motor Sypher"}
                </span>
              </button>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="view-editor">
            
            {/* Left Column: Input and Format configuration */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Input section */}
              <div 
                className={`p-5 border transition-all duration-300 ${
                  tutorialActive && currentTutorialStep === 1 
                    ? "relative z-45 bg-[#08080a] border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35)] ring-1 ring-red-500/20" 
                    : "bg-[#08080a] border-white/[0.04]"
                }`}
                id="step-1-container"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <h3 className="text-xs font-sans font-bold text-zinc-400 uppercase tracking-widest">{t.editor.step_1}</h3>
                    <HelpTooltip text={
                      lang === 'en' 
                        ? "Paste raw ideas, audio transcripts, or chaotic notes here. Sypher will rewrite them." 
                        : lang === 'es'
                        ? "Pegue aquí ideas preliminares, actas caóticas o notas sueltas. Sypher las organizará."
                        : "Cole notas soltas, transcrições inconsistentes ou ideias sob pressão. O Sypher vai lapidá-las."
                    } />
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[9px]">
                    <span className={rawInput.length >= 500 ? "text-amber-500 font-bold" : "text-zinc-500"}>
                      {rawInput.length}/500
                    </span>
                    <span className="text-zinc-600 uppercase">max</span>
                  </div>
                </div>
                
                <textarea
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value.slice(0, 500))}
                  maxLength={500}
                  placeholder={t.editor.step_1_placeholder}
                  rows={8}
                  className="w-full p-3 border border-white/[0.04] bg-zinc-950 text-xs text-white leading-relaxed font-sans placeholder-zinc-700 focus:outline-hidden focus:border-red-500"
                  id="raw-input-textarea"
                />

                {/* Content Quick Examples */}
                <div className="mt-3">
                  <span className="text-[10px] font-sans font-semibold text-zinc-500 block mb-1.5 uppercase tracking-wider">{t.editor.example_title}</span>
                  <div className="flex flex-wrap gap-2">
                     <button
                      type="button"
                      onClick={() => loadExample(
                        lang === 'en' 
                          ? "just hit a new enterprise contract with delta. Key takeaways: always listen to the stakeholder requirements before discussing pricing."
                          : lang === 'es'
                          ? "acabo de cerrar un contrato corporativo con delta. lección: escuchar los requisitos clave del cliente antes de discutir el preço final."
                          : "acabei de fechar um contrato novo com a delta global e aprendi que escutar antes de falar o preco é a chave da proposta."
                      )}
                      className="bg-black border border-white/[0.04] hover:border-red-500/30 text-[10px] px-2.5 py-1 text-zinc-500 hover:text-white transition rounded-none cursor-pointer"
                    >
                      {t.editor.example_linkedin}
                    </button>
                    <button
                      type="button"
                      onClick={() => loadExample(
                        lang === 'en'
                          ? "email template for Joana to advance customer onboarding to Thursday at 3PM, because I have a medical leave scheduled on Friday."
                          : lang === 'es'
                          ? "correo para juana solicitando adelantar la reunión de onboarding al jueves a las 3pm, ya que el viernes tengo consulta médica."
                          : "email para joana sobre adiantar a reunião de onboarding de clientes novos para quinta às 15h, pois sexta terei um compromisso médico."
                      )}
                      className="bg-black border border-white/[0.04] hover:border-red-500/30 text-[10px] px-2.5 py-1 text-zinc-500 hover:text-white transition rounded-none cursor-pointer"
                    >
                      {t.editor.example_email}
                    </button>
                  </div>
                </div>
              </div>

              {/* Format selection */}
              <div 
                className={`p-5 border transition-all duration-300 ${
                  tutorialActive && currentTutorialStep === 2 
                    ? "relative z-45 bg-[#08080a] border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35)] ring-1 ring-red-500/20" 
                    : "bg-[#08080a] border-white/[0.04]"
                }`}
                id="step-2-container"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <h3 className="text-xs font-sans font-bold text-zinc-400 tracking-widest uppercase">{t.editor.step_2}</h3>
                    <HelpTooltip text={
                      lang === 'en'
                        ? "Select your target format. Sypher adapts structural layouts and metadata."
                        : lang === 'es'
                        ? "Seleccione el formato final. Sypher ajustará la estructura y metadatos correspondientes."
                        : "Selecione o formato de destino. O Sypher reestrutura o layout e os metadados."
                    } />
                  </div>
                  <span className="text-[10px] font-sans text-zinc-500 font-medium">{t.editor.unit_refiner}</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {DEFAULT_TEMPLATES.map((tmpl) => {
                    const isSelected = selectedFormat === tmpl.id;
                    let activeBorder = "border-red-500 bg-red-950/20 text-red-500";
                    let activeIconBg = "bg-red-500 text-black";
                    
                    if (tmpl.id === "linkedin_post") {
                      activeBorder = "border-sky-500/70 bg-sky-950/20 text-sky-400";
                      activeIconBg = "bg-sky-550 bg-sky-500 text-black";
                    } else if (tmpl.id === "professional_email") {
                      activeBorder = "border-rose-500/70 bg-rose-950/20 text-rose-400";
                      activeIconBg = "bg-rose-500 text-white";
                    } else if (tmpl.id === "blog_draft") {
                      activeBorder = "border-amber-500/70 bg-amber-950/20 text-amber-400";
                      activeIconBg = "bg-amber-500 text-black";
                    } else if (tmpl.id === "social_thread") {
                      activeBorder = "border-violet-500/75 bg-violet-950/20 text-zinc-300";
                      activeIconBg = "bg-violet-500 text-white";
                    } else if (tmpl.id === "executive_summary") {
                      activeBorder = "border-emerald-500/70 bg-emerald-950/20 text-emerald-400";
                      activeIconBg = "bg-emerald-500 text-black";
                    }

                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => setSelectedFormat(tmpl.id)}
                        className={`p-2.5 rounded-none border text-left flex items-start gap-2.5 transition duration-150 cursor-pointer ${
                          isSelected ? activeBorder : "border-white/[0.04] hover:bg-black/40"
                        }`}
                      >
                        <div className={`p-1 text-xs shrink-0 flex items-center justify-center ${
                          isSelected ? activeIconBg : "bg-black border border-white/[0.04] text-zinc-500"
                        }`}>
                          {tmpl.id === 'linkedin_post' && <Linkedin className="w-3.5 h-3.5" />}
                          {tmpl.id === 'professional_email' && <Mail className="w-3.5 h-3.5" />}
                          {tmpl.id === 'blog_draft' && <FileText className="w-3.5 h-3.5" />}
                          {tmpl.id === 'social_thread' && <Twitter className="w-3.5 h-3.5" />}
                          {tmpl.id === 'executive_summary' && <Briefcase className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-white leading-tight">
                            {t.formats[tmpl.id as keyof typeof t.formats]?.label || tmpl.label}
                          </h4>
                          <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">
                            {t.formats[tmpl.id as keyof typeof t.formats]?.desc || tmpl.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="lg:col-span-7 space-y-6" id="editor-view-right-column">
              
              {/* Voice Tones */}
              <div 
                className={`p-5 border transition-all duration-300 ${
                  tutorialActive && currentTutorialStep === 3 
                    ? "relative z-45 bg-[#08080a] border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35)] ring-1 ring-red-500/20" 
                    : "bg-[#08080a] border-white/[0.04]"
                }`}
                id="step-3-container"
              >
                <div className="flex items-center mb-3">
                  <h3 className="text-xs font-sans font-bold text-zinc-400 uppercase tracking-widest">{t.editor.step_3}</h3>
                  <HelpTooltip text={
                    lang === 'en'
                      ? "Configure the writing tone. Sypher adapts the vocabulary and phrasing style."
                      : lang === 'es'
                      ? "Establezca el tono de voz. Sypher adaptará el nivel de formalidad."
                      : "Defina o tom de voz. O Sypher altera a formalidade e estilo do texto."
                  } />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {TONE_OPTIONS.map((tn) => {
                    const isSelected = selectedTone === tn.id;
                    let toneBorderAndBg = "border-red-500 bg-red-950/20 text-red-500";
                    
                    if (isSelected) {
                      if (tn.id === "profissional") {
                        toneBorderAndBg = "border-emerald-500 bg-emerald-950/20 text-emerald-400";
                      } else if (tn.id === "informal") {
                        toneBorderAndBg = "border-amber-500 bg-amber-950/20 text-amber-400";
                      } else if (tn.id === "tecnico") {
                        toneBorderAndBg = "border-sky-500 bg-sky-950/20 text-sky-400";
                      } else if (tn.id === "entusiasta") {
                        toneBorderAndBg = "border-rose-500 bg-rose-950/20 text-rose-400";
                      }
                    }

                    return (
                      <button
                        key={tn.id}
                        type="button"
                        onClick={() => setSelectedTone(tn.id)}
                        className={`p-2 rounded-none text-center border cursor-pointer hover:bg-black/30 transition-all duration-150 flex flex-col items-center justify-center ${
                          isSelected ? toneBorderAndBg : "border-white/[0.04] text-zinc-400"
                        }`}
                      >
                        <span className="text-xs font-semibold block truncate w-full">
                          {t.tones[tn.id as keyof typeof t.tones]?.label || tn.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Copilot Guidelines */}
              <div 
                className={`p-5 border transition-all duration-300 ${
                  tutorialActive && currentTutorialStep === 4 
                    ? "relative z-45 bg-[#08080a] border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35)] ring-1 ring-red-500/20" 
                    : "bg-[#08080a] border-white/[0.04]"
                }`}
                id="step-4-guidelines"
              >
                <div className="flex items-center mb-2">
                  <label className="text-xs font-sans font-bold text-zinc-400 uppercase tracking-widest">{t.editor.step_4}</label>
                  <HelpTooltip text={
                    lang === 'en'
                      ? "Optional directives such as 'limit to 3 paragraphs' or 'no hashtags'."
                      : lang === 'es'
                      ? "Pautas adicionales opcionales, como 'máximo de 3 párrafos' o 'sin hashtags'."
                      : "Diretrizes opcionais extras, como 'máximo de 3 parágrafos' ou 'evitar emojis'."
                  } />
                </div>
                <input
                  type="text"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder={t.editor.step_4_placeholder}
                  className="w-full px-3 py-2 text-xs border border-white/[0.04] bg-black text-zinc-200 placeholder-zinc-700 focus:outline-hidden focus:border-red-500"
                />
              </div>

              {/* Trigger Action Panel */}
              <div 
                className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-3 transition-all duration-300 ${
                  tutorialActive && currentTutorialStep === 4 
                    ? "relative z-45 bg-[#030304] border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35)] ring-1 ring-red-500/20 p-5" 
                    : ""
                }`}
                id="step-4-trigger"
              >
                <div className="text-left">
                  {/* Sypher Active Status Badge */}
                  <div className="flex items-center gap-3 bg-[#0d0d0f]/80 p-2 border border-white/[0.03]">
                    <div className="w-8 h-8 shrink-0 overflow-hidden">
                      <img 
                        src={sypherLogo} 
                        alt="Sypher Head" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="text-left">
                      <span className="text-[9px] font-sans text-red-400 font-bold uppercase tracking-wider block">Sypher AI Copilot</span>
                      <p className="text-[9px] text-zinc-400 leading-normal">
                        {lang === 'en' 
                          ? "Sypher is online and ready to process your draft sequence." 
                          : lang === 'es'
                          ? "Sypher está en línea y listo para procesar la secuencia de su borrador."
                          : "Sypher está online e pronto para processar a sequência do seu rascunho."}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-black border border-red-500/40 hover:border-red-400 text-red-500 font-bold text-xs py-2 px-5 rounded-none hover:bg-red-950/20 transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 min-w-[150px]"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 relative flex items-center justify-center shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500/50"></span>
                        <span className="relative w-2 h-2 rounded-full border border-red-500 border-t-transparent animate-spin"></span>
                      </div>
                      <span>{t.editor.button_generating}</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" /> {t.editor.button_generate}
                    </>
                  )}
                </button>
              </div>

              {/* Rich Output display */}
              <div 
                className={`border overflow-hidden transition-all duration-300 ${
                  tutorialActive && currentTutorialStep === 4 
                    ? "relative z-45 bg-[#08080a] border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.35)] ring-1 ring-red-500/20" 
                    : "bg-[#08080a] border-white/[0.04]"
                }`} 
                id="workspace-output-panel"
              >
                <div className="bg-[#0d0d0f] border-b border-white/[0.04] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-sans font-bold text-white uppercase tracking-wider">{t.editor.output_header}</h4>
                  </div>
                  {outputText && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(outputText);
                          addNotification(t.editor.button_copied, "success");
                        }}
                        className="text-[10px] font-sans border border-white/[0.04] text-zinc-400 hover:text-white bg-black px-2.5 py-1 flex items-center gap-1 transition rounded-none cursor-pointer"
                      >
                        <Copy className="w-3 h-3 text-red-500" /> {t.editor.button_copy}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDownloadModalOpen(true)}
                        className="text-[10px] font-sans border border-white/[0.04] text-zinc-400 hover:text-white bg-black px-2.5 py-1 flex items-center gap-1 transition rounded-none cursor-pointer"
                      >
                        <Download className="w-3 h-3 text-red-500" />{" "}
                        {lang === 'en' ? "DOWNLOAD" : lang === 'es' ? "DESCARGAR" : "BAIXAR"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-1 relative flex flex-col">
                  {/* Inline Centered Loading Overlay */}
                  <AnimatePresence>
                    {isGenerating && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 m-1 bg-[#030304]/98 flex flex-col items-center justify-center p-6 space-y-5 z-10 border border-dashed border-red-500/20"
                      >
                        {/* 10 Squares (Symmetric Curtain Height Ripple) */}
                        <div className="flex items-center justify-center gap-2 z-10 h-16">
                          {Array.from({ length: 10 }, (_, i) => {
                            const minVal = Math.min(i, 9 - i);
                            const isSquareFilled = (4 - minVal) < generatorProgress;
                            const symmetricDelay = (4 - minVal) * 0.12;

                            return (
                              <motion.div
                                key={i}
                                className={`w-3.5 border transition-all duration-300 ${
                                  isSquareFilled
                                    ? "bg-red-500 border-red-500"
                                    : "bg-transparent border-zinc-700"
                                }`}
                                style={{ originY: 0.5 }}
                                animate={{
                                  height: isSquareFilled ? ["14px", "52px", "14px"] : "14px",
                                }}
                                transition={{
                                  repeat: isSquareFilled ? Infinity : 0,
                                  duration: 1.4,
                                  ease: "easeInOut",
                                  delay: symmetricDelay,
                                }}
                              />
                            );
                          })}
                        </div>

                        {/* Staged Pipeline Text */}
                        <div className="mt-8 h-4 relative flex items-center justify-center min-w-[180px] z-10">
                          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-zinc-500 animate-pulse text-center">
                            {generationStep}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <textarea
                    value={outputText}
                    onChange={(e) => setOutputText(e.target.value)}
                    placeholder="Texto refinado aparecerá aqui..."
                    rows={12}
                    className="w-full p-4 border border-dashed border-white/[0.04] bg-black text-xs text-white leading-relaxed font-sans placeholder-zinc-800 focus:outline-hidden whitespace-pre-wrap min-h-[280px]"
                  />
                </div>

                {/* Micro Refinement sidebar */}
                {outputText && (
                  <div className="bg-black p-4 border-t border-white/[0.04] flex flex-col sm:flex-row gap-3 items-end">
                    <div className="flex-1 w-full text-left">
                      <label className="block text-[9px] font-sans font-semibold text-zinc-500 uppercase tracking-widest mb-1">{t.editor.refine_label}</label>
                      <input
                        type="text"
                        value={refinementQuery}
                        onChange={(e) => setRefinementQuery(e.target.value)}
                        placeholder={t.editor.refine_placeholder}
                        className="w-full px-3 py-1.5 text-xs border border-white/[0.04] bg-[#08080a] text-white placeholder-zinc-700 focus:outline-hidden focus:border-red-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRefine}
                      disabled={isRefining || !refinementQuery.trim()}
                      className="shrink-0 bg-transparent border border-red-500/30 hover:border-red-400 hover:bg-red-950/20 text-red-500 text-xs font-bold py-1.5 px-4 rounded-none flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 min-w-[120px] justify-center"
                    >
                      {isRefining ? (
                        <>
                          <div className="w-3.5 h-3.5 relative flex items-center justify-center shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500/50"></span>
                            <span className="relative w-2 h-2 rounded-full border border-red-500 border-t-transparent animate-spin"></span>
                          </div>
                          <span>{t.editor.button_refining}</span>
                        </>
                      ) : (
                        t.editor.button_refine
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        </main>

        {/* Minimal Footer Row */}
        <footer className="shrink-0 border-t border-white/[0.04] bg-[#030304] py-4 px-6 text-center mt-auto" id="app-footer-credits">
          <div className="max-w-7xl mx-auto flex flex-col sm:sm-row items-center justify-between gap-2 text-[10px] text-zinc-500">
            <p>© 2026 Sypher AI. Built for stable professional environments.</p>
            <div className="flex items-center gap-3 font-sans font-semibold">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-0.5">
                GitHub <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span>•</span>
              <p>PROFESSIONAL EDITION</p>
            </div>
          </div>
        </footer>

      </motion.div>

      {/* Global notifications render bubble */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" id="toast-wrapper">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-3 rounded-none text-xs flex items-center gap-2 border shadow-2xl ${
                toast.type === "success"
                  ? "bg-black border-emerald-500/30 text-emerald-400"
                  : "bg-black border-red-500/20 text-red-500"
              }`}
            >
              <div className={`w-1.5 h-1.5 ${toast.type === 'success' ? 'bg-emerald-400' : 'bg-red-500'}`} />
              <p className="font-sans font-bold text-white leading-none">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Interactive Tutorial Backdrop Shadow Overlay */}
      {tutorialActive && (
        <div 
          className="fixed inset-0 bg-[#000000]/80 z-40 pointer-events-auto transition-opacity duration-300"
          onClick={stopTutorial}
          id="tutorial-backdrop"
        />
      )}

      {/* Tutorial Card */}
      {tutorialActive && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pointer-events-none">
          <div className="bg-[#0b0b0d] border border-red-500/30 p-5 max-w-md w-full shadow-[0_10px_40px_rgba(239,68,68,0.15)] rounded-none pointer-events-auto transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-sans font-bold text-red-500 uppercase tracking-widest">
                {lang === 'en' ? `Step ${currentTutorialStep} of 4` : lang === 'es' ? `Paso ${currentTutorialStep} de 4` : `Etapa ${currentTutorialStep} de 4`}
              </span>
              <button 
                onClick={stopTutorial}
                className="text-zinc-500 hover:text-white text-xs transition-colors cursor-pointer"
                aria-label="Close tutorial"
              >
                ✕
              </button>
            </div>
            <h4 className="text-sm font-sans font-bold text-white mb-2">
              {TUTORIAL_STEPS[lang][currentTutorialStep - 1].title}
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              {TUTORIAL_STEPS[lang][currentTutorialStep - 1].desc}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div 
                    key={stepNum} 
                    className={`w-1.5 h-1.5 transition-all duration-300 ${
                      currentTutorialStep === stepNum ? 'bg-red-500 w-3.5' : 'bg-zinc-700'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                {currentTutorialStep > 1 && (
                  <button
                    onClick={prevTutorialStep}
                    className="px-2.5 py-1 text-[11px] font-sans font-semibold border border-white/[0.04] bg-zinc-950 text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    {lang === 'en' ? "Back" : lang === 'es' ? "Atrás" : "Anterior"}
                  </button>
                )}
                <button
                  onClick={nextTutorialStep}
                  className="px-3.5 py-1 text-[11px] font-sans font-bold bg-red-600 hover:bg-red-500 text-white transition cursor-pointer"
                >
                  {currentTutorialStep === 4 
                    ? (lang === 'en' ? "Finish" : lang === 'es' ? "Finalizar" : "Concluir")
                    : (lang === 'en' ? "Next" : lang === 'es' ? "Siguiente" : "Próximo")
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Format Download Modal */}
      <AnimatePresence>
        {isDownloadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDownloadModalOpen(false)}
              className="absolute inset-0 bg-[#000000]/80 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-sm bg-[#0a0a0c] border border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-6 z-10 overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 to-amber-500" />

              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="bg-red-500/10 p-1.5 border border-red-500/20 text-red-500">
                    <FileDown className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xs font-sans font-bold text-white uppercase tracking-wider">
                      {lang === 'en' ? "Export Content" : lang === 'es' ? "Exportar Contenido" : "Exportar Ativo"}
                    </h3>
                    <p className="text-[10px] text-zinc-500">
                      {lang === 'en' ? "Choose your desired format" : lang === 'es' ? "Elige tu formato deseado" : "Escolha o formato de download"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDownloadModalOpen(false)}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Formats Grid */}
              <div className="space-y-2.5 mb-6">
                {[
                  {
                    id: 'md',
                    label: 'Markdown (.md)',
                    desc: lang === 'en' ? 'Preserves rich headers and format' : lang === 'es' ? 'Preserva encabezados y formato' : 'Preserva formatação e cabeçalhos',
                    icon: FileText,
                  },
                  {
                    id: 'txt',
                    label: 'Plain Text (.txt)',
                    desc: lang === 'en' ? 'Clean unformatted raw text' : lang === 'es' ? 'Texto plano limpio sin formato' : 'Texto puro sem formatação',
                    icon: FileText,
                  },
                  {
                    id: 'html',
                    label: 'HTML Document (.html)',
                    desc: lang === 'en' ? 'Formatted visual web document' : lang === 'es' ? 'Documento web visual formateado' : 'Documento visual para navegadores',
                    icon: FileCode,
                  },
                  {
                    id: 'json',
                    label: 'JSON Metadata (.json)',
                    desc: lang === 'en' ? 'Complete structured source data' : lang === 'es' ? 'Datos estruturados completos' : 'Dados estruturados completos do rascunho',
                    icon: FileJson,
                  }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        downloadTextFile(item.id as any);
                        setIsDownloadModalOpen(false);
                      }}
                      className="w-full text-left bg-[#0e0e11] hover:bg-[#121216] border border-white/[0.04] hover:border-red-500/30 p-3 flex items-start gap-3 transition duration-150 group cursor-pointer rounded-none"
                    >
                      <div className="bg-zinc-900 border border-white/[0.04] p-2 text-zinc-400 group-hover:text-red-500 group-hover:border-red-500/20 transition-colors shrink-0 animate-none">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5 text-left">
                        <span className="text-[11px] font-sans font-bold text-zinc-200 group-hover:text-white transition-colors block">
                          {item.label}
                        </span>
                        <span className="text-[9px] text-zinc-500 block leading-normal">
                          {item.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsDownloadModalOpen(false)}
                  className="px-4 py-1.5 border border-white/[0.04] bg-zinc-950 text-zinc-400 hover:text-white text-[10px] font-sans font-bold transition uppercase tracking-wider rounded-none cursor-pointer"
                >
                  {lang === 'en' ? "Cancel" : lang === 'es' ? "Cancelar" : "Cancelar"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}