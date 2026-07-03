import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Zap,
  Shield,
  Cpu,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  HelpCircle,
  Lock,
  Globe,
  FileText,
  Terminal,
  Activity,
  Github,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language } from "../translations";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import LoadingScreen from "./LoadingScreen";
import NeuralCubeScene from "./NeuralCubeScene";
import RedParticleField from "./RedParticleField";
import StartNowButton from "./StartNowButton";
import RotatingHeadline from "./RotatingHeadline";
import { AbstractGridBackground } from "./AbstractGridBackground";
import AppDemoPreview from "./AppDemoPreview";
import CapabilitiesSection from "./CapabilitiesSection";
import PipelineSection from "./PipelineSection";
import NoiseToOrderSection from "./NoiseToOrderSection";
import RefineryLoopSection from "./RefineryLoopSection";
import BentoGridSection from "./BentoGridSection";

// @ts-ignore
import sypherLogo from "../assets/images/sypherlogo.png";

// Registrar o plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  lang: Language;
  onNavigate: (view: 'landing' | 'app' | 'docs' | 'about') => void;
  changeLang: (l: Language) => void;
}

const ROTATING_WORDS: Record<Language, string[]> = {
  en: ["PERSUADE", "CONVERT", "RESONATE", "ENGAGE", "CONVINCE"],
  pt: ["PERSUADIR", "CONVERTER", "RESSOAR", "ENGAJAR", "CONVENCER"],
  es: ["PERSUADIR", "CONVERTIR", "RESONAR", "CAUTIVAR", "CONVENCER"],
};

const SCROLL_HINT: Record<Language, string> = {
  en: "SCROLL",
  pt: "ROLAR",
  es: "DESPLAZAR",
};

const LANDING_TRANSLATIONS = {
  en: {
    heroSubtitle: "A high-fidelity SaaS content refinery. Calibrate tone, select optimal channels, and perfect your drafts in seconds with state-of-the-art AI. No registration required.",
    ctaStart: "Start Now",
    ctaDocs: "Read docs",
    noAuthTitle: "ZERO FRICTION. ZERO ACCOUNTS.",
    noAuthBadge: "AUTHENTICATION IMMUNITY",
    noAuthDesc: "We believe elite professional tools should have zero barriers to entry. No databases, no password managers, no cookies trackers, and absolutely no login screen. Launch the workspace and polish your drafts instantly.",
    noAuthFeature1: "Local Memory Persistence",
    noAuthFeature2: "Immediate API Provisioning",
    noAuthFeature3: "Complete Data Confidentiality",
    featuresTitle: "POWERED BY SYPHER CORE",
    featuresSubtitle: "A modular content engine engineered for professional execution across multiple domains.",
    feature1Title: "Automated Context Parsing",
    feature1Desc: "Extracts central themes, core facts, and semantic context even from messy, incomplete raw draft fragments.",
    feature2Title: "Tailored Tone Matrices",
    feature2Desc: "Switch between Corporate, Persuasive, Informal, Technical, or Overachiever personality matrices seamlessly.",
    feature3Title: "Native Multi-Format Compilers",
    feature3Desc: "Tailor outputs specifically for LinkedIn, Professional Email, Blog Drafts, X Threads, or Executive Summaries.",
    feature4Title: "Export-Ready Pipeline",
    feature4Desc: "Instantly copy formatted results or download them in Markdown, Plain Text, HTML, or structured JSON metadata.",
    processTitle: "THE DRAFT REFINEMENT SEQUENCE",
    processSubtitle: "Four highly calibrated steps from raw, disorganized thought to pristine production assets.",
    step1: "Raw Draft Input",
    step1Desc: "Paste up to 500 characters of transcripts, meeting notes, or raw outlines directly into the secure editor.",
    step2: "Channel Calibration",
    step2Desc: "Select the specific asset format that best fits your target distribution channel.",
    step3: "Vocal Calibration",
    step3Desc: "Apply highly tailored tone presets to adjust vocabulary, length, pacing, and overall authority level.",
    step4: "Sypher Polishing Engine",
    step4Desc: "Sypher AI structures, spell-checks, polishes, and delivers high-fidelity assets instantly copyable or downloadable.",
    faqTitle: "FREQUENTLY QUESTIONS",
    faqSubtitle: "Answers to critical questions about Sypher's design, limits, and technical framework.",
    faq1Q: "Do I really not need an account to use Sypher AI?",
    faq1A: "Correct. Sypher AI operates on a 'frictionless workspace' philosophy. All settings, active drafts, and system configurations are maintained securely inside your local browser storage. No server accounts are created.",
    faq2Q: "What are the text limits of the core draft area?",
    faq2A: "To ensure fast, high-quality semantic processing, the raw input area has a hard limit of 500 characters. For larger documents, we recommend refining them section by section to preserve optimal context density.",
    faq3Q: "How does the download export work?",
    faq3A: "Sypher includes a custom export engine that generates and compiles files on-the-fly. You can download your polished assets in Markdown (.md), Plain Text (.txt), visual HTML, or raw JSON containing original parameters.",
    faq4Q: "What models power Sypher AI?",
    faq4A: "Sypher is powered by Google Gemini state-of-the-art models, delivering incredible speed and pristine text styling, perfect for multi-lingual and technical content refiners.",
    footerText: "Precision content engineering.",
    learnMore: "Learn More",
    quickStats: "WORKSPACE METRICS",
    stat1: "Active Sandbox",
    stat2: "Zero Barriers",
    stat3: "Local Storage",
    product: "Product",
    aboutUs: "Sobre",
    overview: "Overview",
    pipeline: "Pipeline",
    coreEngine: "Core Engine",
    access: "Access",
    changelogText: "Sypher AI v1.0 — Live now. Refine your drafts instantly.",
    productSubtitle: "Explore our platform",
    overviewSub: "Discover the mission",
    pipelineSub: "See the workflow",
    coreEngineSub: "Learn the technology",
    accessSub: "Start without barriers"
  },
  pt: {
    heroSubtitle: "Uma refinaria de conteúdo SaaS de alta fidelidade. Calibre o tom, selecione o canal ideal e aperfeiçoe seus textos em segundos com IA de ponta. Sem necessidade de registro.",
    ctaStart: "Começar Agora",
    ctaDocs: "Ler documentação",
    noAuthTitle: "ZERO FRICÇÃO. ZERO CONTAS.",
    noAuthBadge: "IMUNIDADE DE CADASTRO",
    noAuthDesc: "Acreditamos que ferramentas profissionais de elite devem ter barreiras de entrada zero. Sem bancos de dados corporativos, sem gerenciadores de senhas e sem telas de login chatas. Acesse o workspace e comece a polir imediatamente.",
    noAuthFeature1: "Persistência em Memória Local",
    noAuthFeature2: "Processamento de API Imediato",
    noAuthFeature3: "Confidencialidade Total de Dados",
    featuresTitle: "ALIMENTADO PELO MOTOR SYPHER",
    featuresSubtitle: "Um mecanismo modular de conteúdo projetado para execução profissional em múltiplos canais.",
    feature1Title: "Análise de Contexto Automática",
    feature1Desc: "Extrai temas centrais, fatos importantes e contexto semântico mesmo de rascunhos fragmentados e confusos.",
    feature2Title: "Matrizes de Tom Customizadas",
    feature2Desc: "Alterne instantaneamente entre os tons Profissional, Persuasivo, Casual, Técnico ou Entusiasta.",
    feature3Title: "Compiladores de Múltiplos Formatos",
    feature3Desc: "Molde seus textos sob medida para LinkedIn, E-mails Formais, Esboços de Blog, Threads do X ou Resumos Executivos.",
    feature4Title: "Exportação Integrada",
    feature4Desc: "Copie os resultados formatados imediatamente ou faça o download em Markdown, Texto Puro, HTML ou metadados JSON.",
    processTitle: "A SEQUÊNCIA DE REFINAMENTO",
    processSubtitle: "Quatro etapas calibradas para levar rascunhos sem estrutura ao status de ativos refinados de alta qualidade.",
    step1: "Entrada do Rascunho",
    step1Desc: "Cole até 500 caracteres de transcrições de áudio, notas de reuniões ou ideias brutas no editor seguro.",
    step2: "Calibração de Canal",
    step2Desc: "Selecione o formato exato que melhor se adapta ao seu canal de distribuição final.",
    step3: "Calibração Vocal",
    step3Desc: "Aplique perfis de tom sob medida para calibrar o vocabulário, ritmo, tamanho e nível de autoridade.",
    step4: "Processamento e Entrega",
    step4Desc: "O Motor Sypher corrige gramática, estrutura o conteúdo e entrega o ativo pronto para cópia ou download.",
    faqTitle: "PERGUNTAS FREQUENTES",
    faqSubtitle: "Respostas a dúvidas fundamentais sobre o design, limites e arquitetura técnica do Sypher.",
    faq1Q: "Realmente não preciso de conta para usar o Sypher AI?",
    faq1A: "Correto. O Sypher opera sob uma filosofia de 'workspace sem fricção'. Todas as suas notas, rascunhos e preferências de idioma são guardados localmente no seu próprio navegador.",
    faq2Q: "Qual é o limite de texto na área de rascunho?",
    faq2A: "Para garantir rapidez e alta densidade de contexto, o rascunho inicial tem limite rígido de 500 caracteres. Para textos maiores, sugerimos refinar seção por seção.",
    faq3Q: "Como funciona a exportação de arquivos?",
    faq3A: "O Sypher possui um compilador de arquivos em tempo real. Você pode baixar seu ativo refinado em Markdown (.md), Texto Puro (.txt), HTML renderizável ou arquivos JSON com metadados estruturados.",
    faq4Q: "Quais modelos de IA alimentam o Sypher?",
    faq4A: "O Sypher é alimentado pelos modelos avançados do Google Gemini, oferecendo velocidade absurda e excelente adaptabilidade gramatical em vários idiomas.",
    footerText: "Engenharia de conteúdo de alta precisão.",
    learnMore: "Saiba Mais",
    quickStats: "MÉTRICAS DO WORKSPACE",
    stat1: "Sandbox Ativo",
    stat2: "Barreiras Zero",
    stat3: "Armazenamento Local",
    product: "Produto",
    aboutUs: "Sobre",
    overview: "Geral",
    pipeline: "Processo",
    coreEngine: "Mecanismo",
    access: "Acesso",
    changelogText: "Sypher AI v1.0 — Ao vivo agora. Refine seus rascunhos instantaneamente.",
    productSubtitle: "Explore nossa plataforma",
    overviewSub: "Descubra a missão",
    pipelineSub: "Veja o fluxo de trabalho",
    coreEngineSub: "Conheça a tecnologia",
    accessSub: "Comece sem barreiras"
  },
  es: {
    heroSubtitle: "Una refinería de contenido SaaS de alta fidelidad. Calibra el tono de voz, selecciona el canal de destino y perfecciona tus textos en segundos con IA avanzada. Sin necesidad de registros.",
    ctaStart: "Empezar Ahora",
    ctaDocs: "Leer documentación",
    noAuthTitle: "CERO FRICCIÓN. CERO CUENTAS.",
    noAuthBadge: "INMUNIDAD DE REGISTRO",
    noAuthDesc: "Creemos que las herramientas profesionales de élite no deben tener barreras de entrada. Sin bases de datos centralizadas, sin contraseñas perdidas y sin pantallas de carga molestas. Accede al editor seguro y pule tus notas al instante.",
    noAuthFeature1: "Persistencia en Memoria Local",
    noAuthFeature2: "Procesamiento de API Inmediato",
    noAuthFeature3: "Confidencialidad Total de Datos",
    featuresTitle: "IMPULSADO POR MOTOR SYPHER",
    featuresSubtitle: "Un motor de contenido modular diseñado para una ejecución profesional impecable en múltiples medios.",
    feature1Title: "Análisis Contextual Automático",
    feature1Desc: "Extracte conceptos centrales, hechos clave y sentido semántico incluso de rascunhos muy fragmentados.",
    feature2Title: "Matrices de Tono Calibradas",
    feature2Desc: "Alterna de forma fluida entre tonos Corporativo/Diplomático, Persuasivo, Casual, Técnico o Entusiasta.",
    feature3Title: "Compiladores de Múltiples Canales",
    feature3Desc: "Estructura tus notas para publicarlas en LinkedIn, Correos de Negocios, Artículos SEO, Hilos de X o Resúmenes Gerenciales.",
    feature4Title: "Exportación Integrada",
    feature4Desc: "Copia tus textos pulidos al instante o descárgarlos directamente en formato Markdown, Texto Plano, HTML o JSON.",
    processTitle: "LA SECUENCIA DE PULIDO",
    processSubtitle: "Cuatro fases altamente refinadas para transformar una idea rápida en un activo de comunicación impecable.",
    step1: "Borrador de Origen",
    step1Desc: "Pega hasta 500 caracteres de grabaciones de voz, apuntes rápidos o reflexiones desestructuradas.",
    step2: "Calibración del Canal",
    step2Desc: "Elige el formato de plantilla que mejor represente tu estrategia de distribución final.",
    step3: "Configuración Vocal",
    step3Desc: "Ajusta la personalidad del texto calibrando el tono ideal, la longitud y el estilo lúdico.",
    step4: "Refinado de Alta Fidelidad",
    step4Desc: "El motor de Sypher AI reescribe, formatea de forma elegante y genera un resultado listo para ser utilizado.",
    faqTitle: "PREGUNTAS FREQUENTES",
    faqSubtitle: "Respuestas directas sobre la arquitectura técnica, límites de diseño y políticas de Sypher.",
    faq1Q: "¿De verdad no necesito una cuenta para usar Sypher AI?",
    faq1A: "Correcto. El Sypher opera bajo una filosofía de 'espacio de trabajo instantáneo'. Todos tus borradores y configuraciones se guardan localmente en tu navegador web.",
    faq2Q: "¿Cuál es el límite del borrador de entrada?",
    faq2A: "Para ofrecer un refinamiento semántico inmediato y preciso, limitamos la caja inicial a 500 caracteres. Para textos extensos, sugerimos cargarlos por partes.",
    faq3Q: "¿Cómo funcionan las descargas de archivos?",
    faq3A: "Disponemos de un sistema de compilación en caliente. Puedes exportar tu trabajo en Markdown (.md), Técnico (.txt), formato HTML interactivo o metadados JSON.",
    faq4Q: "¿Qué tecnologías de inteligencia artificial usa?",
    faq4A: "La plataforma utiliza los modelos de lenguaje de última generación Google Gemini, garantizando excelente gramática, precisión semántica y velocidad de cómputo.",
    footerText: "Ingeniería de contenido de precisión.",
    learnMore: "Saber Más",
    quickStats: "MÉTRICAS DO WORKSPACE",
    stat1: "Sandbox Activo",
    stat2: "Fricción Cero",
    stat3: "Memoria Local",
    product: "Producto",
    aboutUs: "Sobre",
    overview: "Descripción",
    pipeline: "Proceso",
    coreEngine: "Tecnología",
    access: "Acceso",
    changelogText: "Sypher AI v1.0 — En vivo agora. Refina tus borradores al instante.",
    productSubtitle: "Explora nuestra plataforma",
    overviewSub: "Descubre la misión",
    pipelineSub: "Ver el flujo de trabajo",
    coreEngineSub: "Conoce la tecnología",
    accessSub: "Comienza sin barreras"
  }
};

export default function LandingPage({ lang, onNavigate, changeLang }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  const [assetsReady, setAssetsReady] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [loadingDone, setLoadingDone] = useState(false);
  const [particlesBurst, setParticlesBurst] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  // Referências para fechar ao clicar fora
  const productDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Ref para a linha vermelha animada
  const redLineRef = useRef<HTMLDivElement>(null);

  const reducedMotion = typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // ---------------------------
  // BOLINHA DE NAVEGAÇÃO (CÍRCULO) - FADE IN/OUT
  // ---------------------------
  const [navHover, setNavHover] = useState<string | null>(null);
  const [navDotPosition, setNavDotPosition] = useState({ left: 0, width: 0 });
  const navHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavHover = (e: React.MouseEvent<HTMLElement>, id: string) => {
    if (navHoverTimeoutRef.current) {
      clearTimeout(navHoverTimeoutRef.current);
      navHoverTimeoutRef.current = null;
    }
    const target = e.currentTarget;
    const container = target.closest('nav');
    if (container) {
      const rect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setNavDotPosition({
        left: rect.left - containerRect.left + rect.width / 2,
        width: rect.width,
      });
    }
    setNavHover(id);
  };

  const handleNavLeave = () => {
    if (navHoverTimeoutRef.current) clearTimeout(navHoverTimeoutRef.current);
    navHoverTimeoutRef.current = setTimeout(() => {
      setNavHover(null);
      navHoverTimeoutRef.current = null;
    }, 400); // Rápido tempo de saída
  };

  // ---------------------------
  // BORDA CIRCULAR DA LOGO (SCROLL) - RED-500
  // ---------------------------
  const [scrollProgress, setScrollProgress] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (circleRef.current) {
      const length = circleRef.current.getTotalLength();
      setPathLength(length);
    }
  }, []);

  // ---------------------------
  // Efeito para fechar os dropdowns ao clicar fora deles
  // ---------------------------
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        productDropdownOpen &&
        productDropdownRef.current &&
        !productDropdownRef.current.contains(event.target as Node)
      ) {
        setProductDropdownOpen(false);
      }
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
  }, [productDropdownOpen, langDropdownOpen]);

  // ---------------------------
  // Efeitos existentes
  // ---------------------------
  useEffect(() => {
    const t = setTimeout(() => setMinTimeElapsed(true), 1800);
    return () => clearTimeout(t);
  }, []);

  // Animação da linha vermelha com GSAP
  useEffect(() => {
    if (redLineRef.current) {
      gsap.set(redLineRef.current, { width: "0%" });
      gsap.to(redLineRef.current, {
        width: "100%",
        duration: 1.2,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: redLineRef.current,
          start: "top bottom",
          end: "top center",
          scrub: 1.2,
          toggleActions: "play none none reverse",
          markers: false,
        },
      });
    }
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleModelReady = useCallback(() => {
    setAssetsReady(true);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setLoadingDone(true);
    setParticlesBurst(true);
  }, []);

  const t = LANDING_TRANSLATIONS[lang] || LANDING_TRANSLATIONS.en;
  const rotatingWords = ROTATING_WORDS[lang] || ROTATING_WORDS.en;
  const scrollHint = SCROLL_HINT[lang] || SCROLL_HINT.en;

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setProductDropdownOpen(false);
    setLangDropdownOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const closeAllDropdowns = () => {
    setLangDropdownOpen(false);
    setProductDropdownOpen(false);
  };

  // Itens dinâmicos para o dropdown do Produto com IDs mapeados para rolagem direta
  const dropdownItems = [
    {
      id: "appdemopreview",
      title: lang === "pt" ? "Geral" : lang === "es" ? "General" : "Overview",
      sub: lang === "pt" ? "Conceito e visão geral da refinaria" : lang === "es" ? "Concepto y visión general del refinador" : "Refinement core concept and workspace review",
      icon: Globe,
    },
    {
      id: "capabilitiessection",
      title: lang === "pt" ? "Capacidades" : lang === "es" ? "Capacidades" : "Capabilities",
      sub: lang === "pt" ? "Recursos modulares do motor Sypher" : lang === "es" ? "Características del motor" : "Engine modules built for content production",
      icon: Zap,
    },
    {
      id: "pipelinesection",
      title: lang === "pt" ? "Arquitetura" : lang === "es" ? "Arquitectura" : "Architecture",
      sub: lang === "pt" ? "As 3 camadas do pipeline de processamento" : lang === "es" ? "Las 3 capas de refinamiento" : "Inside the three-layer pipeline architecture",
      icon: Cpu,
    },
    {
      id: "bentogrid",
      title: lang === "pt" ? "Integração" : lang === "es" ? "Integración" : "Integration",
      sub: lang === "pt" ? "Acesso local instantâneo sem fricção" : lang === "es" ? "Acceso sin registro" : "Immediate local sandbox integration",
      icon: Shield,
    }
  ];

  return (
    <div className="min-h-screen bg-[#030304] text-zinc-300 font-sans selection:bg-red-500/30 selection:text-white">

      {!loadingDone && (
        <LoadingScreen
          ready={assetsReady && minTimeElapsed}
          onComplete={handleLoadingComplete}
          lang={lang}
        />
      )}

      {/* ============================================================ */}
      {/* CHANGELOG BAR */}
      {/* ============================================================ */}
      <div
        className="top-0 left-0 right-0 z-50 min-h-10 h-auto py-2 px-4 flex items-center justify-center text-white text-[10px] sm:text-xs font-sans font-medium cursor-pointer transition-colors duration-200 group text-center"
        style={{
          backgroundImage: `url(/img/decorative-bar.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={() => onNavigate('app')}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] group-hover:text-zinc-300 transition-colors duration-200 max-w-full">
          <span className="leading-tight">{t.changelogText}</span>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        </div>
      </div>

      {/* ============================================================ */}
      {/* HEADER */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.04] bg-[#030304]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => onNavigate('landing')}>
            <div className="relative w-9 h-9 flex items-center justify-center">
              <img
                src={sypherLogo}
                alt="Sypher Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <svg
                ref={svgRef}
                className="absolute top-[-6px] left-[-6px] w-[calc(100%+12px)] h-[calc(100%+12px)] pointer-events-none"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  ref={circleRef}
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#ef4444" 
                  strokeWidth="2.3"
                  strokeDasharray={pathLength || 999}
                  strokeDashoffset={pathLength * (1 - scrollProgress) || 999}
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-widest text-white uppercase">
                  Sypher<span className="font-sans text-red-500 font-normal lowercase tracking-normal"> AI</span>
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-sans uppercase tracking-wider relative group/nav">

            {/* DROPDOWN "PRODUTO" */}
            <div className="relative inline-block text-left" ref={productDropdownRef}>
              <button
                type="button"
                onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                onMouseEnter={(e) => handleNavHover(e, 'product')}
                onMouseLeave={handleNavLeave}
                className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer transition-opacity duration-200 group-hover/nav:opacity-50 hover:opacity-100"
              >
                <span>{t.product}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-300 ${productDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {productDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-[#09090b] border border-white/[0.08] shadow-2xl z-50 rounded-none py-1 text-left">
                  {dropdownItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className="w-full text-left px-4 py-3.5 text-xs font-sans font-medium text-zinc-300 hover:text-white hover:bg-white/[0.04] transition border-b border-white/[0.02] last:border-0 flex items-center gap-3.5"
                    >
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-red-950/40 border border-red-500/40 rounded-none">
                        <item.icon className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <div className="font-bold text-white tracking-wide text-xs">{item.title}</div>
                        <div className="text-[11px] text-zinc-400 font-normal mt-0.5 normal-case leading-snug">{item.sub}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* DOCS */}
            <button
              type="button"
              onClick={() => onNavigate('docs')}
              onMouseEnter={(e) => handleNavHover(e, 'docs')}
              onMouseLeave={handleNavLeave}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer transition-opacity duration-200 group-hover/nav:opacity-50 hover:opacity-100 font-sans"
            >
              Docs
            </button>

            {/* CHANGELOG */}
            <button
              type="button"
              onClick={() => {
                window.location.hash = 'ch7';
                onNavigate('docs');
              }}
              onMouseEnter={(e) => handleNavHover(e, 'changelog')}
              onMouseLeave={handleNavLeave}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer transition-opacity duration-200 group-hover/nav:opacity-50 hover:opacity-100 font-sans"
            >
              Changelog
            </button>

            {/* SOBRE */}
            <button
              type="button"
              onClick={() => onNavigate('about')}
              onMouseEnter={(e) => handleNavHover(e, 'about')}
              onMouseLeave={handleNavLeave}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer transition-opacity duration-200 group-hover/nav:opacity-50 hover:opacity-100 font-sans"
            >
              {t.aboutUs}
            </button>

            {/* Bolinha circular de navegação */}
            <AnimatePresence>
              {navHover && (
                <motion.div
                  key={navHover}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute -bottom-[10px] w-1.5 h-1.5 rounded-full bg-red-500 pointer-events-none"
                  style={{
                    left: `calc(${navDotPosition.left}px - 3px)`,
                  }}
                />
              )}
            </AnimatePresence>
          </nav>

          {/* Header Action Controls */}
          <div className="hidden md:flex items-center gap-4">

            {/* Language Switcher Dropdown */}
            <div className="relative inline-block text-left" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#09090b] border border-white/[0.08] hover:border-red-500/40 text-xs font-mono font-bold tracking-wider text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-red-500" />
                <span className="uppercase">{lang}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 ${langDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-[#09090b] border border-white/[0.08] shadow-2xl z-50 rounded-none py-1.5 text-left">
                  {(['pt', 'en', 'es'] as Language[]).map((l) => {
                    const labels = { pt: 'Português', en: 'English', es: 'Español' };
                    const flags = { pt: '🇵🇹', en: '🇺🇸', es: '🇪🇸' };
                    const isActive = lang === l;
                    return (
                      <button
                        key={l}
                        type="button"
                        onClick={() => { changeLang(l); closeAllDropdowns(); window.location.reload(); }}
                        className={`w-full text-left px-3 py-2 text-xs font-sans font-medium transition flex items-center justify-between hover:bg-white/[0.04] ${isActive ? 'text-red-500 font-bold bg-red-950/10' : 'text-zinc-400 hover:text-white'}`}
                      >
                        <span>{flags[l]} {labels[l]}</span>
                        {isActive && <span className="text-red-500 text-xs font-bold">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Launch Workspace Button */}
            <button
              type="button"
              onClick={() => onNavigate('app')}
              className="text-[11px] font-sans font-black uppercase tracking-widest bg-red-500 hover:bg-[#a72222] text-white px-5 py-2.5 transition-colors duration-200 relative overflow-hidden cursor-pointer"
            >
              {t.ctaStart}
            </button>
          </div>

          {/* Mobile Hamburguer button */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={() => { changeLang(lang === 'en' ? 'pt' : lang === 'pt' ? 'es' : 'en'); window.location.reload(); }}
              className="text-[10px] font-sans font-bold uppercase border border-white/[0.04] bg-[#0c0c0f] px-2.5 py-1 cursor-pointer"
              title="Toggle Language"
            >
              {lang}
            </button>
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

        {/* Mobile Navigation Drawer */}
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
                  onClick={() => scrollToSection('appdemopreview')}
                  className="py-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.overview}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('pipelinesection')}
                  className="py-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.pipeline}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('capabilitiessection')}
                  className="py-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.coreEngine}
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('bentogrid')}
                  className="py-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.access}
                </button>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); onNavigate('about'); }}
                  className="py-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.aboutUs}
                </button>
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); onNavigate('docs'); }}
                  className="py-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Docs
                </button>
                <div className="border-t border-white/[0.04] pt-3 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => { setMobileMenuOpen(false); onNavigate('app'); }}
                    className="text-center bg-white text-[#030304] py-2.5 font-black uppercase tracking-widest text-[10px] cursor-pointer"
                  >
                    {t.ctaStart}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ============================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative h-[100vh] min-h-[640px] overflow-hidden pt-20">

        <AbstractGridBackground opacity={0.8} />
        <RedParticleField burst={particlesBurst} />

        {!isMobile && (
          <div className="absolute inset-y-0 right-0 w-full md:w-[60%] lg:w-[55%] z-0">
            <NeuralCubeScene onReady={handleModelReady} reducedMotion={reducedMotion} lang={lang} />
          </div>
        )}

        <div className="absolute inset-0 z-5 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-red-500/10" />

        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 sm:left-6 lg:left-8 sm:translate-x-0 z-10 w-[90%] sm:w-[70%] lg:w-[42%] max-w-3xl text-center sm:text-left">

          <RotatingHeadline prefix={lang === 'pt' ? 'Desenvolvido para' : lang === 'es' ? 'Desarrollado para' : 'Developed to'} words={rotatingWords} />

          <p className="text-sm sm:text-lg text-zinc-400 leading-relaxed mt-7 w-full mx-auto sm:mx-0">
            {t.heroSubtitle}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-6 mt-10">
            <StartNowButton lang={lang} onClick={() => onNavigate('app')} />
            <button
              type="button"
              onClick={() => onNavigate('docs')}
              className="text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.15em] text-zinc-500 hover:text-white transition-colors cursor-pointer underline underline-offset-4 decoration-zinc-700 hover:decoration-red-500"
            >
              {t.ctaDocs}
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 right-4 sm:right-6 lg:right-8 z-10 flex items-center gap-3">
          <span className="text-[9px] font-sans font-bold uppercase tracking-[0.25em] text-zinc-600">
            {scrollHint}
          </span>
          <span className="relative w-5 h-8 border border-zinc-700 rounded-full flex items-start justify-center pt-1.5 overflow-hidden">
            <motion.span
              className="w-1 h-1.5 rounded-full bg-red-500"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </div>

        {/* Linha vermelha animada no final da hero */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-[2px] bg-red-500/20">
          <div
            ref={redLineRef}
            className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400"
            style={{ width: "0%" }}
          />
        </div>

      </section>

      {/* SEÇÕES COM WRAPPERS DE ID PARA SCROLLING */}
      <div id="appdemopreview">
        <AppDemoPreview lang={lang} />
      </div>

      <div id="capabilitiessection">
        <CapabilitiesSection lang={lang} />
      </div>

      <div id="pipelinesection">
        <PipelineSection lang={lang} />
      </div>

      <div id="bentogrid">
        <BentoGridSection lang={lang} />
      </div>

      <NoiseToOrderSection lang={lang} onNavigate={onNavigate} />

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer className="border-t border-white/[0.04] bg-[#030304] pt-16 pb-10 relative z-10 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/[0.04]">

            {/* Coluna 1: Logo & Manifesto */}
            <div className="flex flex-col gap-4 text-left">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
                <img
                  src={sypherLogo}
                  alt="Sypher Logo"
                  className="w-7 h-7 object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="text-sm font-semibold tracking-widest text-white uppercase">
                  Sypher<span className="font-sans text-red-500 font-normal lowercase tracking-normal"> AI</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mt-2 max-w-xs">
                Refinaria de conteúdo profissional SaaS de alta fidelidade para profissionais de marketing e criadores.
              </p>

              {/* Indicador de Status Operacional em Tempo Real */}
              <div className="flex items-center gap-2 mt-4 bg-zinc-950 border border-white/[0.04] py-1.5 px-3 self-start">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-wider">
                  ALL SYSTEMS OPERATIONAL
                </span>
              </div>
            </div>

            {/* Coluna 2: Plataforma / Produto */}
            <div className="flex flex-col gap-4 text-left text-xs font-medium">
              <span className="font-bold text-white uppercase tracking-widest text-[10px] border-l-2 border-red-500 pl-2 leading-none">
                {t.product}
              </span>
              <button onClick={() => scrollToSection('appdemopreview')} className="text-zinc-400 hover:text-white transition-colors text-left py-0.5">{lang === 'pt' ? 'Geral' : 'Overview'}</button>
              <button onClick={() => scrollToSection('capabilitiessection')} className="text-zinc-400 hover:text-white transition-colors text-left py-0.5">{lang === 'pt' ? 'Capacidades' : 'Capabilities'}</button>
              <button onClick={() => scrollToSection('pipelinesection')} className="text-zinc-400 hover:text-white transition-colors text-left py-0.5">{lang === 'pt' ? 'Arquitetura' : 'Architecture'}</button>
              <button onClick={() => scrollToSection('bentogrid')} className="text-zinc-400 hover:text-white transition-colors text-left py-0.5">{lang === 'pt' ? 'Imunidade de Cadastro' : 'No Account Sandbox'}</button>
            </div>

            {/* Coluna 3: Recursos de Desenvolvimento */}
            <div className="flex flex-col gap-4 text-left text-xs font-medium">
              <span className="font-bold text-white uppercase tracking-widest text-[10px] border-l-2 border-red-500 pl-2 leading-none">
                RESOURCES
              </span>
              <button onClick={() => onNavigate('about')} className="text-zinc-400 hover:text-white transition-colors text-left py-0.5">
                {lang === 'pt' ? 'Sobre' : lang === 'es' ? 'Sobre Nosotros' : 'About'}
              </button>
              <button onClick={() => onNavigate('docs')} className="text-zinc-400 hover:text-white transition-colors text-left py-0.5">Documentation</button>
              <a href="https://github.com/Gustaavo-404/sypher-ai" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors text-left py-0.5">GitHub Repository</a>
              <button onClick={() => onNavigate('app')} className="text-zinc-400 hover:text-white transition-colors text-left py-0.5">Refinery Sandbox</button>
            </div>

            {/* Coluna 4: Segurança & Políticas */}
            <div className="flex flex-col gap-4 text-left text-xs font-medium">
              <span className="font-bold text-white uppercase tracking-widest text-[10px] border-l-2 border-red-500 pl-2 leading-none">
                TRUST & SECURITY
              </span>
              <div className="flex items-center gap-2 text-zinc-400">
                <Shield className="w-3.5 h-3.5 text-red-500" />
                <span>Zero Database Storage</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Lock className="w-3.5 h-3.5 text-red-500" />
                <span>Local Sandbox Isolation</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Cpu className="w-3.5 h-3.5 text-red-500" />
                <span>Gemini API Compliance</span>
              </div>
            </div>

          </div>

          {/* Barra Inferior */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
            <div className="flex items-center gap-2 order-2 sm:order-1">
              <span>SYPHER AI &copy; 2026</span>
              <span>&bull;</span>
              <span>{t.footerText}</span>
            </div>

            <div className="flex items-center gap-6 order-1 sm:order-2">
              <a href="https://github.com/Gustaavo-404/sypher-ai" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <div className="flex items-center gap-2 text-emerald-500">
                <span className="text-[11px] font-mono tracking-wider font-bold">ONLINE</span>
              </div>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}