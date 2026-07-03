import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  BookOpen, 
  Terminal, 
  Cpu, 
  Shield, 
  Zap, 
  FileDown, 
  Check, 
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Globe,
  CornerDownRight,
  Sparkles,
  Info,
  Search,
  X,
  Activity,
  Code
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Language } from "../translations";
// @ts-ignore
import sypherLogo from "../assets/images/sypherlogo.png";

interface DocsPageProps {
  lang: Language;
  onNavigate: (view: 'landing' | 'app' | 'docs' | 'about') => void;
  changeLang: (l: Language) => void;
}

interface Chapter {
  id: string;
  title: string;
  badge: string;
}

interface Category {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  chapters: Chapter[];
}

// Chaves estáticas de ID para o controle de ScrollSpy
const CHAPTER_IDS = ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6", "ch7"];

export default function DocsPage({ lang, onNavigate, changeLang }: DocsPageProps) {
  const [activeSection, setActiveSection] = useState("ch1");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  
  // Referência para fechar o dropdown ao clicar fora
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "pt", label: "Português", badge: "PT" },
    { code: "en", label: "English", badge: "EN" },
    { code: "es", label: "Español", badge: "ES" }
  ];

  const matchChapter = (id: string, query: string) => {
    if (!query) return true;
    const q = query.toLowerCase().trim();
    
    if (id === "ch1") {
      return q.includes("overview") || q.includes("visão") || q.includes("visión") || q.includes("immunity") || q.includes("fricção");
    }
    if (id === "ch2") {
      return q.includes("context") || q.includes("engine") || q.includes("limit") || q.includes("caracteres") || q.includes("cascade") || q.includes("gemini") || q.includes("autocomplete");
    }
    if (id === "ch3") {
      return q.includes("format") || q.includes("matrices") || q.includes("linkedin") || q.includes("email") || q.includes("blog") || q.includes("thread") || q.includes("executive");
    }
    if (id === "ch4") {
      return q.includes("vocal") || q.includes("preset") || q.includes("tone") || q.includes("temperatura") || q.includes("temperature");
    }
    if (id === "ch5") {
      return q.includes("export") || q.includes("blob") || q.includes("compil") || q.includes("markdown") || q.includes("html") || q.includes("json");
    }
    if (id === "ch6") {
      return q.includes("security") || q.includes("cloud run") || q.includes("proxy") || q.includes("backoff") || q.includes("retries") || q.includes("privacy");
    }
    if (id === "ch7") {
      return q.includes("changelog") || q.includes("version") || q.includes("keep a changelog") || q.includes("versão") || q.includes("semantic") || q.includes("1.0.0");
    }
    return true;
  };

  // Definição das Categorias com os números removidos do início dos títulos
  const categories: Category[] = [
    {
      id: "cat_architecture",
      title: lang === 'en' ? "Core Architecture" : lang === 'es' ? "Arquitectura Base" : "Arquitetura Base",
      icon: Cpu,
      chapters: [
        { 
          id: "ch1", 
          title: lang === 'en' ? "Architectural Vision" : lang === 'es' ? "Visión de Arquitectura" : "Visão de Arquitetura",
          badge: "01" 
        },
        { 
          id: "ch2", 
          title: lang === 'en' ? "Ingestion & Model Cascading" : lang === 'es' ? "Cascada de Modelos" : "Ingestão e Model Cascading",
          badge: "02" 
        }
      ]
    },
    {
      id: "cat_compilation",
      title: lang === 'en' ? "Compilation & Synthesis" : lang === 'es' ? "Compilación y Síntesis" : "Compilação e Síntese",
      icon: Code,
      chapters: [
        { 
          id: "ch3", 
          title: lang === 'en' ? "Format Spec Compilers" : lang === 'es' ? "Compiladores de Formato" : "Compiladores de Formato",
          badge: "03" 
        },
        { 
          id: "ch4", 
          title: lang === 'en' ? "Entropy & Preset Tuning" : lang === 'es' ? "Entropía y Ajuste de Voz" : "Entropia e Tuning de Presets",
          badge: "04" 
        },
        { 
          id: "ch5", 
          title: lang === 'en' ? "Clientside Blob Exporter" : lang === 'es' ? "Exportación Vía Blobs" : "Exportador Blob no Cliente",
          badge: "05" 
        }
      ]
    },
    {
      id: "cat_security",
      title: lang === 'en' ? "Security & Resilience" : lang === 'es' ? "Seguridad y Resiliencia" : "Segurança e Resiliência",
      icon: Shield,
      chapters: [
        { 
          id: "ch6", 
          title: lang === 'en' ? "Security Proxy & Backoff" : lang === 'es' ? "Proxy de Seguridad y Reintentos" : "Proxy de Segurança e Retentativas",
          badge: "06" 
        }
      ]
    }
  ];

  // Capítulo de Changelog Isolado sem número no início do título
  const changelogChapter: Chapter = { 
    id: "ch7", 
    title: lang === 'en' ? "Changelog (Keep a Changelog)" : lang === 'es' ? "Registro de Cambios" : "Changelog Oficial",
    badge: "07" 
  };

  // União de todos os capítulos para verificação geral de busca
  const allChapters = [
    ...categories.flatMap(cat => cat.chapters),
    changelogChapter
  ];

  const hasAnyMatches = allChapters.some(ch => matchChapter(ch.id, searchQuery));

  // Detecta hash de link e rola automaticamente na montagem da página
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && CHAPTER_IDS.includes(hash)) {
      const timer = setTimeout(() => {
        scrollToSection(hash);
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let current = "ch1";
      const scrollPosition = window.scrollY + 220;

      for (const id of CHAPTER_IDS) {
        const el = sectionRefs.current[id];
        if (el && el.offsetTop <= scrollPosition) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efeito para monitorar cliques fora do dropdown de idioma
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

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#030304] text-zinc-300 font-sans selection:bg-red-500/30 selection:text-white">
      {/* Decorative accent grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111115_1px,transparent_1px),linear-gradient(to_bottom,#111115_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />

      {/* FIXED DOCS HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.04] bg-[#030304]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Back Link with Divider + "Docs" */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
              aria-label="Back to landing"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="h-4 w-[1px] bg-white/[0.08]" />
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="w-8 h-8 overflow-hidden flex items-center justify-center">
                <img 
                  src={sypherLogo} 
                  alt="Sypher Logo" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xs font-mono font-bold tracking-widest text-white">
                Docs
              </span>
            </div>
          </div>

          {/* Center: Interactive Search Bar */}
          <div className="flex-1 max-w-sm md:max-w-md relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'en' ? "Search technical documentation..." : lang === 'es' ? "Buscar en documentación técnica..." : "Buscar na documentação técnica..."}
                className="w-full bg-[#08080a] hover:bg-zinc-900 focus:bg-zinc-900 border border-white/[0.05] focus:border-red-500/30 px-9 py-1.5 text-xs text-white rounded-none outline-none transition-all placeholder:text-zinc-600 font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition cursor-pointer p-0.5"
                >
                  <X className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Language Switcher Dropdown */}
            <div className="relative inline-block text-left" ref={langDropdownRef}>
              <button 
                type="button"
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

            {/* Launch App Button */}
            <button
              type="button"
              onClick={() => onNavigate('app')}
              className="text-[9px] sm:text-[10px] font-sans font-black uppercase tracking-widest bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white px-2.5 sm:px-4 py-2 hover:opacity-95 transition-opacity shadow-[0_0_10px_rgba(239,68,68,0.2)] cursor-pointer"
            >
              <span className="hidden xs:inline">{lang === 'en' ? "OPEN WORKSPACE" : lang === 'es' ? "ABRIR WORKSPACE" : "ABRIR WORKSPACE"}</span>
              <span className="xs:hidden">{lang === 'en' ? "OPEN" : lang === 'es' ? "ENTRAR" : "ENTRAR"}</span>
            </button>
          </div>

        </div>
      </header>

      {/* DOCS CONTAINER LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* ASSISTED NAVIGATION SIDEBAR (Sticky) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-4 hidden lg:block space-y-6">
            <div className="text-left">
              <h4 className="text-[10px] font-sans font-black tracking-widest text-zinc-500 uppercase mb-3">
                {lang === 'en' ? "DOCUMENTATION INDEX" : lang === 'es' ? "ÍNDICE DE DOCUMENTACIÓN" : "ÍNDICE DA DOCUMENTAÇÃO"}
              </h4>
              <div className="h-[2px] w-12 bg-red-500" />
            </div>

            {/* Navigation Chapter Nodes by Category */}
            <nav className="flex flex-col gap-5 text-left">
              {categories.map((cat) => {
                const matchedChapters = cat.chapters.filter((ch) => matchChapter(ch.id, searchQuery));
                if (matchedChapters.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex items-center gap-1.5 px-1 py-0.5 text-[9px] font-mono font-black text-zinc-400 tracking-wider uppercase border-b border-white/[0.04] pb-1">
                      <cat.icon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{cat.title}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {matchedChapters.map((chapter) => {
                        const isActive = activeSection === chapter.id;
                        return (
                          <button
                            key={chapter.id}
                            type="button"
                            onClick={() => scrollToSection(chapter.id)}
                            className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between border transition-all duration-200 cursor-pointer rounded-none group ${
                              isActive
                                ? "bg-red-950/10 border-red-500/30 text-white shadow-[inset_3px_0_0_#ef4444]"
                                : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.01]"
                            }`}
                          >
                            <span className="text-[11px] font-sans font-bold tracking-wide uppercase transition-colors">
                              {chapter.title}
                            </span>
                            <span className={`font-mono text-[9px] font-bold ${isActive ? 'text-red-500' : 'text-zinc-700 group-hover:text-zinc-500'}`}>
                              {chapter.badge}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Isolated Changelog node in Sidebar */}
              {matchChapter(changelogChapter.id, searchQuery) && (
                <div className="space-y-2 pt-4 border-t border-white/[0.05]">
                  <div className="flex items-center gap-1.5 px-1 py-0.5 text-[9px] font-mono font-black text-zinc-400 tracking-wider uppercase border-b border-white/[0.04] pb-1">
                    <BookOpen className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{lang === 'en' ? "RELEASES" : lang === 'es' ? "HISTORIAL" : "HISTÓRICO"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollToSection(changelogChapter.id)}
                    className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between border transition-all duration-200 cursor-pointer rounded-none group ${
                      activeSection === changelogChapter.id
                        ? "bg-red-950/10 border-red-500/30 text-white shadow-[inset_3px_0_0_#ef4444]"
                        : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.01]"
                    }`}
                  >
                    <span className="text-[11px] font-sans font-bold tracking-wide uppercase transition-colors">
                      {changelogChapter.title}
                    </span>
                    <span className={`font-mono text-[9px] font-bold ${activeSection === changelogChapter.id ? 'text-red-500' : 'text-zinc-700 group-hover:text-zinc-500'}`}>
                      {changelogChapter.badge}
                    </span>
                  </button>
                </div>
              )}

              {!hasAnyMatches && (
                <div className="text-[10px] font-mono text-zinc-600 uppercase py-4">
                  [ 0 Matches Found ]
                </div>
              )}
            </nav>

            {/* Quick Specs box */}
            <div className="bg-[#070709] border border-white/[0.03] p-4 text-left font-mono text-[9px] space-y-2 pt-6">
              <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
                <span className="text-zinc-600">PRIMARY ENGINE</span>
                <span className="text-red-500 font-bold uppercase">Gemini 3.5 Flash</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
                <span className="text-zinc-600">FALLBACK TIER</span>
                <span className="text-zinc-400">Gemini 2.5 Flash</span>
              </div>
              <div className="flex justify-between border-b border-white/[0.02] pb-1.5">
                <span className="text-zinc-600">MAX CHARACTER CAP</span>
                <span className="text-zinc-400">500 Characters</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600">EXPORT ENGINE</span>
                <span className="text-zinc-400">Client-Side Blob</span>
              </div>
            </div>
          </aside>

          {/* MAIN TECHNICAL DOCUMENTATION CONTENT */}
          <main className="lg:col-span-9 space-y-20 pb-20">
            {!hasAnyMatches ? (
              <div className="bg-[#08080b] border border-white/[0.04] p-12 text-center space-y-4">
                <Search className="w-8 h-8 text-red-500 mx-auto opacity-50 animate-pulse" />
                <h3 className="text-sm font-sans font-black text-white uppercase tracking-wider">
                  {lang === 'en' ? "NO MATCHING DOCUMENTATION FOUND" : lang === 'es' ? "NO SE ENCONTRÓ DOCUMENTACIÓN" : "NENHUMA DOCUMENTAÇÃO ENCONTRADA"}
                </h3>
                <p className="text-[11px] text-zinc-500 max-w-md mx-auto leading-relaxed">
                  {lang === 'en'
                    ? "Your search term did not resolve within any cognitive index matrix nodes. Please refine your query or reset filters."
                    : lang === 'es'
                    ? "Tu término de búsqueda no coincide con ninguna matriz del índice cognitivo. Por favor, intenta de nuevo o limpia el filtro."
                    : "Seu termo de busca não retornou resultados nas matrizes do índice. Por favor, tente outra combinação ou limpe o filtro."}
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-sans font-black text-[10px] uppercase tracking-widest cursor-pointer transition-all"
                >
                  {lang === 'en' ? "RESET SEARCH" : lang === 'es' ? "REINICIAR BÚSQUEDA" : "LIMPAR BUSCA"}
                </button>
              </div>
            ) : (
              <>
                {/* LOOP DE CATEGORIAS */}
                {categories.map((cat) => {
                  const matchedChapters = cat.chapters.filter((ch) => matchChapter(ch.id, searchQuery));
                  if (matchedChapters.length === 0) return null;

                  return (
                    <div key={cat.id} className="space-y-12 pb-6">
                      {/* Cabeçalho da Categoria */}
                      <div className="flex items-center gap-3 pb-3 border-b border-white/[0.05]">
                        <div className="p-2 bg-red-950/10 border border-red-500/20">
                          <cat.icon className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <span className="text-[9px] font-mono font-bold text-red-500 tracking-widest uppercase">
                            {lang === 'en' ? "CATEGORY" : lang === 'es' ? "CATEGORÍA" : "CATEGORIA"}
                          </span>
                          <h3 className="text-sm font-sans font-black text-white uppercase tracking-wider">
                            {cat.title}
                          </h3>
                        </div>
                      </div>

                      {/* Capítulos Internos da Categoria */}
                      <div className="space-y-16">
                        {matchedChapters.map((chapter) => (
                          <div key={chapter.id}>
                            
                            {/* 1. Architectural Vision */}
                            {chapter.id === "ch1" && (
                              <section 
                                id="ch1" 
                                ref={(el) => { sectionRefs.current["ch1"] = el; }}
                                className="scroll-mt-24 space-y-6 text-left"
                              >
                                <h2 className="text-2xl sm:text-3xl font-sans font-black text-white uppercase tracking-wider">
                                  {lang === 'en' ? "1. Architectural Vision & Sandbox Philosophy" : lang === 'es' ? "1. Visión de Arquitectura y Sandbox" : "1. Visão de Arquitetura e Sandbox"}
                                </h2>

                                <p className="text-xs text-zinc-400 leading-relaxed">
                                  {lang === 'en'
                                    ? "Sypher AI operates on a modern frictionless sandbox paradigm. Typical content generation and copy editing tools require mandatory centralized database logins, long onboarding verification queues, and cookies tracking simply to translate or rephrase text. Sypher completely isolates user state. By leveraging HTML5 LocalStorage partition pools directly inside the client sandbox, all configurations, active drafts, and localization attributes remain strictly in the browser memory, providing complete authentication immunity."
                                    : lang === 'es'
                                    ? "Sypher AI opera bajo un paradigma de sandbox sin fricciones. Las herramientas típicas de generación de contenido obligan al usuario a registrarse en bases de dados centralizadas y configurar cookies solo para procesar texto. Sypher aisla el estado del usuario por completo. Utilizando contenedores de LocalStorage en el navegador, todos tus borradores e historiales de localización se conservan localmente sin requerir cuentas de usuario externas."
                                    : "O Sypher AI opera sob o paradigma de sandbox sem fricção. Ferramentas tradicionais de escrita exigem cadastros obrigatórios em bancos de dados relacionais e instalação de rastreadores apenas para reescrever uma frase. O Sypher isola o estado operacional do usuário. Através de LocalStorage persistente no navegador, todos os rascunhos, histórico e seleções de idioma rodam de forma privada e imediata no seu cliente, oferecendo imunidade completa de autenticação."}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                                  <div className="bg-[#08080b] border border-white/[0.02] p-4 space-y-2">
                                    <h4 className="text-[11px] font-sans font-bold uppercase text-white tracking-wider flex items-center gap-1.5">
                                      <Zap className="w-3.5 h-3.5 text-red-500" />
                                      {lang === 'en' ? "Authentication Immunity" : lang === 'es' ? "Inmunidad de Autenticación" : "Imunidade de Autenticação"}
                                    </h4>
                                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                                      {lang === 'en'
                                        ? "Zero registration interfaces. No identity providers, session cookies, or telemetry trackers. Access the workspace and compile assets in milliseconds."
                                        : lang === 'es'
                                        ? "Cero pantallas de login. Sin cookies de seguimiento ni proveedores de identidad externos. Accede y procesa tus textos en milisegundos."
                                        : "Fricção zero de cadastro. Sem provedores de identidade, gerenciadores de senhas ou cookies invasivos. Entre e processe rascunhos em milissegundos."}
                                    </p>
                                  </div>

                                  <div className="bg-[#08080b] border border-white/[0.02] p-4 space-y-2">
                                    <h4 className="text-[11px] font-sans font-bold uppercase text-white tracking-wider flex items-center gap-1.5">
                                      <Shield className="w-3.5 h-3.5 text-red-500" />
                                      {lang === 'en' ? "Sovereign State Storage" : lang === 'es' ? "Persistencia Soberana" : "Armazenamento Soberano"}
                                    </h4>
                                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                                      {lang === 'en'
                                        ? "Draft data is saved in local browser sandboxes. Clearing cache or using private tabs completely flushes active document segments."
                                        : lang === 'es'
                                        ? "Los borradores se almacenan exclusivamente en la sandbox local. Limpiar la caché elimina de manera permanente todo historial."
                                        : "Persistência local e segura. Limpar o histórico ou cache do seu navegador apaga instantaneamente todos os rascunhos ativos."}
                                    </p>
                                  </div>
                                </div>
                              </section>
                            )}

                            {/* 2. Core Context Engine */}
                            {chapter.id === "ch2" && (
                              <section 
                                id="ch2" 
                                ref={(el) => { sectionRefs.current["ch2"] = el; }}
                                className="scroll-mt-24 space-y-6 text-left"
                              >
                                <h2 className="text-2xl sm:text-3xl font-sans font-black text-white uppercase tracking-wider">
                                  {lang === 'en' ? "2. Ingestion Limits & Model Fallback Hierarchy" : lang === 'es' ? "2. Límites de Ingesta y Cascada de Modelos" : "2. Ingestão de Contexto e Cascata de Modelos"}
                                </h2>

                                <p className="text-xs text-zinc-400 leading-relaxed">
                                  {lang === 'en'
                                    ? "To guarantee optimal semantic density, Sypher enforces a strict maximum input threshold of 500 characters. Large-document Large Language Models (LLMs) often exhibit contextual drift, diluting stylistic requirements or ignoring custom directives under long token configurations. Compelling raw notes into a 500-character payload forces logical conciseness. On the server side, the pipeline operates a redundant cascaded model architecture to handle high server traffic and rate limits seamlessly."
                                    : lang === 'es'
                                    ? "Para garantizar una densidad semántica ideal, Sypher impone un límite estricto de 500 caracteres de entrada. Las inteligencias artificiales expuestas a miles de palabras tienden a divagar o ignorar las pautas del usuario. Restringir la entrada a 500 caracteres obliga a la concisión. En el servidor, implementamos una cascada redundante para gestionar el tráfico sin caídas."
                                    : "Para garantir máxima densidade semântica, o Sypher impõe um limite estrito de até 500 caracteres na caixa inicial. Modelos expostos a inputs gigantescos frequentemente desviam do tom estipulado ou ignoram diretrizes de formatação. O limite de 500 caracteres força a concisão do rascunho de origem. No backend, o pipeline opera uma cascata redundante de modelos para evitar quedas por sobrecarga ou limites de taxa."}
                                </p>

                                {/* Step-by-Step Cascading diagram */}
                                <div className="bg-[#08080b] border border-white/[0.02] p-5 space-y-4">
                                  <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest block">Cascading Processing Pipeline:</span>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] font-mono text-zinc-400">
                                    <div className="border border-white/[0.04] p-3 space-y-1.5">
                                      <div className="text-white font-bold">TIER 1 &mdash; PRIMARY</div>
                                      <p className="text-zinc-500 leading-relaxed">Runs on <strong className="text-red-400">gemini-3.5-flash</strong>. Selected for advanced speed, high-end instruction-following, and natural structure styling.</p>
                                    </div>
                                    <div className="border border-white/[0.04] p-3 space-y-1.5">
                                      <div className="text-white font-bold">TIER 2 &mdash; FALLBACK</div>
                                      <p className="text-zinc-500 leading-relaxed">Triggers if Tier 1 times out or raises a 429/503 exception. Automatically routes query to <strong className="text-amber-400">gemini-2.5-flash</strong>.</p>
                                    </div>
                                    <div className="border border-white/[0.04] p-3 space-y-1.5">
                                      <div className="text-white font-bold">TIER 3 &mdash; SANDBOX</div>
                                      <p className="text-zinc-500 leading-relaxed">Runs offline local heuristics <strong className="text-sky-400">simulateResponse</strong> if keys are missing, autocompleting cutoffs and selecting themed matrices.</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="border border-white/[0.03] bg-[#070709] p-4 text-left font-mono">
                                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 mb-3 border-b border-white/[0.02] pb-1.5">
                                    <Terminal className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                                    <span>SERVER_CASCADE_LOGIC.js</span>
                                  </div>
                                  <pre className="text-[9px] sm:text-[10px] text-zinc-500 leading-relaxed overflow-x-auto">
                                  {`try {
                                    // Tier 1 execution
                                    generatedText = await callGeminiWithRetry(ai, { model: "gemini-3.5-flash", ... });
                                  } catch (primaryErr) {
                                    // Tier 2 cascading transition
                                    generatedText = await callGeminiWithRetry(ai, { model: "gemini-2.5-flash", ... });
                                  } catch (fallbackErr) {
                                    // Tier 3 Offline Rule Engine failover
                                    generatedText = simulateResponse(format, tone, content);
                                  }`}
                                  </pre>
                                </div>
                              </section>
                            )}

                            {/* 3. Format Spec Compilers */}
                            {chapter.id === "ch3" && (
                              <section 
                                id="ch3" 
                                ref={(el) => { sectionRefs.current["ch3"] = el; }}
                                className="scroll-mt-24 space-y-6 text-left"
                              >
                                <h2 className="text-2xl sm:text-3xl font-sans font-black text-white uppercase tracking-wider">
                                  {lang === 'en' ? "3. Formatting Matrices & AST Generation" : lang === 'es' ? "3. Matrices de Formato y Sintaxis" : "3. Matrizes de Formatação e Compilação"}
                                </h2>

                                <p className="text-xs text-zinc-400 leading-relaxed">
                                  {lang === 'en'
                                    ? "Sypher does not simply apply superficial text wrapping. The generation parser operates on structured system instructions that act as formatting compilers. They dictate how layout tags, headers, bullet alignments, and whitespace behave per output channel. The model is commanded to structure outputs conforming to strict Abstract Syntax Tree (AST) visual guidelines."
                                    : lang === 'es'
                                    ? "Sypher no realiza un simple formateo estético. Nuestro motor utiliza instrucciones del sistema que actúan como compiladores estructurales, dictando el comportamiento de saltos de línea, jerarquías visuales y espaciados según el canal de destino seleccionado."
                                    : "O Sypher não faz apenas uma quebra de linha cosmética. O processamento do modelo é direcionado por instruções sistêmicas rígidas que operam como compiladores estruturais, especificando como cada canal de distribuição deve organizar parágrafos, marcadores e quebras de linhas de forma nativa."}
                                </p>

                                <div className="grid grid-cols-1 gap-3">
                                  {[
                                    {
                                      id: "linkedin_post",
                                      title: lang === 'en' ? "LinkedIn High-Engagement Spec" : lang === 'es' ? "Especificación de LinkedIn" : "LinkedIn High-Engagement Spec",
                                      details: lang === 'en' 
                                        ? "Strict double-line break hooks to capture visual attention. No continuous paragraphs larger than 2 lines. Limits hashtags to exactly 3 highly specific keywords." 
                                        : "Saltos de línea dobles para capturar atención en feed. Evita bloques de texto continuos mayores a 2 líneas. Hashtags limitados a 3 palabras claves."
                                    },
                                    {
                                      id: "professional_email",
                                      title: lang === 'en' ? "Corporate SMTP Spec" : lang === 'es' ? "Especificación SMTP Corporativa" : "Corporate SMTP Spec",
                                      details: lang === 'en'
                                        ? "Injects 'Assunto:' SMTP subject header followed by a double line-break, structured greeting, highly concise core value body, and flawless corporate sign-off."
                                        : "Inserta cabecera 'Assunto:' clara, seguida de saludo formal, cuerpo del mensagem centrado en objetivos específicos y despedida profissional."
                                    },
                                    {
                                      id: "blog_draft",
                                      title: lang === 'en' ? "Markdown AST Article Outline" : lang === 'es' ? "Borrador de Blog Markdown" : "Esboço de Blog Markdown",
                                      details: lang === 'en'
                                        ? "Outputs correct Markdown syntax mapping `#` for title, `##` for structural subtitles, bullet list formatting, and blockquotes for raw draft insertion."
                                        : "Genera sintaxis pura Markdown mapping con títulos (#), subtítulos estruturados (##), listas con viñetas y bloques de citas preformateados."
                                    },
                                    {
                                      id: "social_thread",
                                      title: lang === 'en' ? "Sequential Micro-Chuncking Spec" : lang === 'es' ? "Hilo de Micro-Mensajes Secuenciales" : "Sequential Micro-Chuncking Spec",
                                      details: lang === 'en'
                                        ? "Splits text automatically into individual sequential numbered blocks (1/, 2/) restricted to character caps with high-energy hook lines in every segment."
                                        : "Segmenta el rascunho de origen en tuits numerados secuencialmente (1/, 2/) con enganche inicial y brevedad absoluta en cada elemento."
                                    },
                                    {
                                      id: "executive_summary",
                                      title: lang === 'en' ? "Dense Executive Layout" : lang === 'es' ? "Resumen Ejecutivo de Alta Densidade" : "Dense Executive Layout",
                                      details: lang === 'en'
                                        ? "Outputs formatted high-density blocks focusing strictly on Core Background, Central Dilemma, Milestones, and Recommended Action Points."
                                        : "Estructura bloques corporativos altamente densos enfocados en Contexto, Dilema Central, Hitos de Avance e Indicadores de Acción."
                                    }
                                  ].map((item, idx) => (
                                    <div key={idx} className="bg-[#08080b] border border-white/[0.02] p-4 text-left space-y-1.5">
                                      <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                        <span className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">{item.title}</span>
                                      </div>
                                      <p className="text-[10px] text-zinc-500 leading-relaxed pl-3">{item.details}</p>
                                    </div>
                                  ))}
                                </div>
                              </section>
                            )}

                            {/* 4. Entropy & Preset Tuning */}
                            {chapter.id === "ch4" && (
                              <section 
                                id="ch4" 
                                ref={(el) => { sectionRefs.current["ch4"] = el; }}
                                className="scroll-mt-24 space-y-6 text-left"
                              >
                                <h2 className="text-2xl sm:text-3xl font-sans font-black text-white uppercase tracking-wider">
                                  {lang === 'en' ? "4. Semantic Entropy & Vocal Register Tuning" : lang === 'es' ? "4. Entropía Semántica y Ajuste de Voz" : "4. Entropia Semântica e Tuning de Presets"}
                                </h2>

                                <p className="text-xs text-zinc-400 leading-relaxed">
                                  {lang === 'en'
                                    ? "Writing style is heavily dictated by lexical variety and phrasing randomness. In modern LLM processing, this variability is controlled by the Temperature parameter. Sypher uses precise temperature parameters across its endpoints to ensure a balanced output. For primary draft generations, our endpoint uses a temperature of 0.7, allowing creative expansion and authentic copywriting. For micro-refinements, the endpoint is tuned down to 0.6 to restrict linguistic drift and strictly apply user instructions."
                                    : lang === 'es'
                                    ? "El estilo de juego y redacción está determinado por la variedad de vocabulario y la sintaxis. En inteligencia artificial, esto se regula mediante la Temperatura. Sypher utiliza valores calibrados para cada tarea: 0.7 en generación inicial para fomentar la creatividad de copia, y 0.6 en refinamientos para enfocar el modelo estrictamente en tus correcciones."
                                    : "O estilo de escrita é determinado pela variedade lexical e aleatoriedade das sentenças. Em inteligência artificial, essa variabilidade é regulada pelo parâmetro de Temperatura. O Sypher opera sob valores finamente calibrados: nossa rota de geração inicial utiliza temperatura de 0.7, permitindo riqueza criativa, enquanto a rota de refinamento opera sob temperatura de 0.6 para garantir foco absolut nas correções."}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="border border-white/[0.03] bg-[#070709] p-4 text-left font-mono">
                                    <div className="text-[9px] text-zinc-400 mb-2 font-bold uppercase tracking-widest text-red-500">GENERATION PARAMS (T=0.7)</div>
                                    <p className="text-[10px] text-zinc-500 leading-relaxed">Enables high vocabulary expansion, allows natural storytelling structures, and leverages creative styling to turn chaotic notes into elegant, convincing messaging.</p>
                                  </div>
                                  <div className="border border-white/[0.03] bg-[#070709] p-4 text-left font-mono">
                                    <div className="text-[9px] text-zinc-400 mb-2 font-bold uppercase tracking-widest text-red-500">REFINEMENT PARAMS (T=0.6)</div>
                                    <p className="text-[10px] text-zinc-500 leading-relaxed">Limits random word selection, reduces structural drift, and focuses strictly on modifying specific segments of text outlined by your custom prompt.</p>
                                  </div>
                                </div>
                              </section>
                            )}

                            {/* 5. Clientside Blob Exporter */}
                            {chapter.id === "ch5" && (
                              <section 
                                id="ch5" 
                                ref={(el) => { sectionRefs.current["ch5"] = el; }}
                                className="scroll-mt-24 space-y-6 text-left"
                              >
                                <h2 className="text-2xl sm:text-3xl font-sans font-black text-white uppercase tracking-wider">
                                  {lang === 'en' ? "5. Clientside Blob Compilation & Zero-Egress Export" : lang === 'es' ? "5. Compilación de Blobs sin Egresos" : "5. Compilação de Blobs no Cliente (Zero-Egress)"}
                                </h2>

                                <p className="text-xs text-zinc-400 leading-relaxed">
                                  {lang === 'en'
                                    ? "Sypher compiles files directly in the user browser using native Web APIs. Standard web tools usually initiate backend egress tasks to create files, slowing down downloading performance and risking server data leaks. Sypher transforms string outputs into raw data payloads, instantiates MIME-typed Blob objects, and triggers programmatic clicks on virtual DOM anchors to download files instantly."
                                    : lang === 'es'
                                    ? "Sypher compila tus documentos en caliente en el navegador mediante APIs nativas de HTML5. Las plataformas habituales realizan peticiones de descarga al servidor, ralentizando la descarga y comprometiendo la privacidad de los textos. Sypher ensambla los Blobs localmente en memoria."
                                    : "O Sypher compila e monta seus arquivos em tempo de execução diretamente no navegador utilizando as Web APIs do HTML5. Ferramentas tradicionais geram relatórios no servidor, o que atrasa a entrega e expõe seus textos a falhas de vazamento. O Sypher transforma os dados em objetos Blob binários em tempo real."}
                                </p>

                                <div className="border border-white/[0.03] bg-[#070709] p-4 text-left font-mono">
                                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 mb-3 border-b border-white/[0.02] pb-1.5">
                                    <Code className="w-3.5 h-3.5 text-red-500" />
                                    <span>CLIENT_BLOB_COMPILER.ts</span>
                                  </div>
                                  <pre className="text-[9px] sm:text-[10px] text-zinc-500 leading-relaxed overflow-x-auto">
                                  {`// Generate transient file URLs via clientside memory blocks
                                  const blob = new Blob([content], { type: "text/markdown" });
                                  const url = URL.createObjectURL(blob);
                                  const link = document.createElement("a");
                                  link.href = url;
                                  link.download = "sypher-export.md";
                                  link.click();
                                  URL.revokeObjectURL(url); // Immediately garbage collect virtual files`}
                                  </pre>
                                </div>
                              </section>
                            )}

                            {/* 6. Security Proxy & Backoff */}
                            {chapter.id === "ch6" && (
                              <section 
                                id="ch6" 
                                ref={(el) => { sectionRefs.current["ch6"] = el; }}
                                className="scroll-mt-24 space-y-6 text-left"
                              >
                                <h2 className="text-2xl sm:text-3xl font-sans font-black text-white uppercase tracking-wider">
                                  {lang === 'en' ? "6. Security Proxying & Exponential Backoff Retries" : lang === 'es' ? "6. Proxy de Seguridad y Reintentos" : "6. Proxy de Segurança e Retentativa com Backoff"}
                                </h2>

                                <p className="text-xs text-zinc-400 leading-relaxed">
                                  {lang === 'en'
                                    ? "Operating LLM integrations directly on client-side environments exposes sensitive configurations like internal system instructions and Gemini API credentials. To shield intellectual property, Sypher implements a secure full-stack backend proxy. Client requests are routed directly to our server endpoints, where credentials are kept hidden. Furthermore, to survive transient cloud anomalies, network jitter, or rate limit spikes, our server implements an exponential backoff retrying pattern."
                                    : lang === 'es'
                                    ? "Ejecutar peticiones directamente desde el cliente compromete credenciales importantes como claves de API o instrucciones de sistema. Para asegurar tus datos, Sypher encamina las peticiones a un proxy seguro del servidor, que además implementa un mecanismo de reintentos con retraso exponencial (Backoff) para mitigar errores de congestión."
                                    : "Executar chamadas diretamente do navegador expõe credenciais sigilosas, como chaves de API e instruções sistêmicas. Para blindar a propriedade intelectual, o Sypher roteia todas as requisições através de um proxy seguro no backend, que encapsula as credenciais e executa retentativas automáticas sob o algoritmo de Backoff Exponencial para lidar com picos de carga de rede."}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 text-[10px] leading-relaxed text-zinc-500">
                                  <div className="bg-[#08080b] border border-white/[0.02] p-4 space-y-2">
                                    <span className="font-mono text-red-500 font-bold uppercase tracking-wider">Cloud Run Proxy Wrapper</span>
                                    <p>No direct browser queries to Google API. DevTools inspector can never access backend keys or custom prompt structures, eliminating prompt injection risks.</p>
                                  </div>
                                  <div className="bg-[#08080b] border border-white/[0.02] p-4 space-y-2">
                                    <span className="font-mono text-red-500 font-bold uppercase tracking-wider">Exponential Backoff Formula</span>
                                    <p>Transient anomalies like 503 are processed automatically using a mathematical exponential delay formula (Delay = 1500ms * 2^(attempt - 1)), avoiding immediate crashes.</p>
                                  </div>
                                </div>
                              </section>
                            )}

                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* 7. ISOLATED CHANGELOG SECTION */}
                {matchChapter(changelogChapter.id, searchQuery) && (
                  <div className="pt-10 mt-10 border-t-2 border-dashed border-white/[0.08] space-y-10">
                    <div className="flex items-center gap-3 pb-3 border-b border-white/[0.05]">
                      <div className="p-2 bg-zinc-900 border border-zinc-700/20">
                        <BookOpen className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono font-bold text-zinc-500 tracking-widest uppercase">
                          {lang === 'en' ? "ISOLATED RELEASES" : lang === 'es' ? "HISTORIAL DE VERSIONES" : "HISTÓRICO ISOLADO"}
                        </span>
                        <h3 className="text-sm font-sans font-black text-white uppercase tracking-wider">
                          {lang === 'en' ? "Official Changelog Suite" : lang === 'es' ? "Registro de Cambios" : "Changelog Oficial"}
                        </h3>
                      </div>
                    </div>

                    <section 
                      id="ch7" 
                      ref={(el) => { sectionRefs.current["ch7"] = el; }}
                      className="scroll-mt-24 space-y-6 text-left"
                    >
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        {lang === 'en'
                          ? "All notable changes to the Sypher SaaS project are documented below. This file conforms strictly to the Keep a Changelog standard and complies with Semantic Versioning guidelines."
                          : lang === 'es'
                          ? "Todos los cambios relevantes de la plataforma Sypher están registrados abajo. Este documento sigue los estándares técnicos de Keep a Changelog y control de versiones Semántico."
                          : "Todas as atualizações relevantes da plataforma Sypher estão registradas abaixo. Este documento cumpre estritamente com os padrões técnicos do Keep a Changelog e Versionamento Semântico."}
                      </p>

                      {/* Changelog Node Container */}
                      <div className="border border-white/[0.03] bg-[#070709] p-6 font-mono text-[11px] leading-relaxed text-zinc-400 space-y-6">
                        <div className="border-b border-white/[0.04] pb-4">
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                            <span className="text-white font-bold text-xs uppercase tracking-wider">[1.0.0] - 2026-07-02</span>
                            <span className="bg-red-500/10 border border-red-500/20 text-red-500 text-[8px] font-bold px-2 py-0.5 uppercase">Initial Live Release</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 mb-3">Lançamento inicial da plataforma SaaS de alta fidelidade para refinar e estruturar rascunhos de escrita.</p>
                          
                          <div className="space-y-3">
                            <div>
                              <span className="text-emerald-400 font-bold block text-[9px] uppercase tracking-wider mb-1">&bull; Added</span>
                              <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-400 text-[10px]">
                                <li>Core context parsing pipelines processing 5 unique target formats: LinkedIn, Email, Blog, Threads and Executive Summaries.</li>
                                <li>Cascaded server-side API hierarchy failing over recursively from <strong className="text-zinc-200">gemini-3.5-flash</strong> to <strong className="text-zinc-200">gemini-2.5-flash</strong>.</li>
                                <li>Exponential backoff algorithm handling 429 and 503 server rate limit rate boundaries.</li>
                                <li>Local offline sandbox simulator utilizing auto-complete heuristics to compile drafts without API keys.</li>
                                <li>Clientside Blob compiling engine generating in-memory exports for MD, TXT, HTML and structured JSON.</li>
                              </ul>
                            </div>

                            <div>
                              <span className="text-sky-400 font-bold block text-[9px] uppercase tracking-wider mb-1">&bull; Changed</span>
                              <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-400 text-[10px]">
                                <li>Upgraded LocalStorage state-saving container to avoid traditional relational database latency.</li>
                              </ul>
                            </div>

                            <div>
                              <span className="text-amber-400 font-bold block text-[9px] uppercase tracking-wider mb-1">&bull; Security</span>
                              <ul className="list-disc list-inside pl-2 space-y-1 text-zinc-400 text-[10px]">
                                <li>Isolated API credentials on secure Cloud Run environment proxies, completely preventing client-side DevTools exposures.</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                )}
              </>
            )}
          </main>

        </div>
      </div>

      {/* COMPREHENSIVE FOOTER */}
      <footer className="border-t border-white/[0.04] bg-[#030304] py-10 text-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-sans text-zinc-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase tracking-widest text-[9px]">SYPHER AI</span>
            <span>&bull;</span>
            <span>Technical Documentation Suite</span>
          </div>
          <div>
            <p className="uppercase tracking-wider font-semibold">Sypher AI &copy; 2026. Precision SaaS Content Engineering.</p>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => onNavigate('landing')} className="hover:text-white transition-colors cursor-pointer uppercase font-bold tracking-widest text-[9px] text-zinc-500">
              LANDING PAGE
            </button>
            <span>&bull;</span>
            <button type="button" onClick={() => onNavigate('app')} className="hover:text-white transition-colors cursor-pointer uppercase font-bold tracking-widest text-[9px] text-zinc-500">
              WORKSPACE APP
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}