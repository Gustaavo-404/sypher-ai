import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Globe, 
  Mail, 
  Linkedin, 
  Github, 
  ExternalLink, 
  ChevronDown,
  User,
  Cpu,
  Sparkles,
  Terminal,
  Shield,
  Check
} from "lucide-react";
import { Language } from "../translations";
// @ts-ignore
import sypherLogo from "../assets/images/sypherlogo.png";

interface AboutPageProps {
  lang: Language;
  onNavigate: (view: 'landing' | 'app' | 'docs' | 'about') => void;
  changeLang: (l: Language) => void;
}

export default function AboutPage({ lang, onNavigate, changeLang }: AboutPageProps) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  
  const langDropdownRef = useRef<HTMLDivElement>(null);

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

  const languages = [
    { code: "pt", label: "Português", badge: "PT" },
    { code: "en", label: "English", badge: "EN" },
    { code: "es", label: "Español", badge: "ES" }
  ];

  // Textos traduzidos para consistência de localização
  const t = {
    title: lang === 'en' ? "About the Project" : lang === 'es' ? "Sobre el Proyecto" : "Sobre o Projeto",
    subtitle: lang === 'en' ? "Mission, motivation and technical concept" : lang === 'es' ? "Misión, motivación y concepto técnico" : "Missão, motivação e conceito técnico",
    creatorTitle: lang === 'en' ? "CREATOR & DEVELOPER" : lang === 'es' ? "CREADOR Y DESARROLLADOR" : "CRIADOR & DESENVOLVEDOR",
    motivationHeader: lang === 'en' ? "Why Sypher AI was built?" : lang === 'es' ? "¿Por qué se construyó Sypher AI?" : "Por que o Sypher AI foi construído?",
    motivationText: lang === 'en' 
      ? "Sypher AI was created out of a need to bypass the friction present in modern text-refining tools. Most generation utilities require mandatory accounts, session tracking, and centralized databases simply to format or adjust a paragraph. Sypher isolates this pipeline entirely in the client's local memory. It serves as a private sandbox that converts disorganized notes into structured communication with absolute performance and complete privacy."
      : lang === 'es'
      ? "Sypher AI fue creado a partir de la necesidad de evitar la fricción presente en las herramientas modernas de refinamiento de texto. La mayoría de utilidades de generación imponen registros obligatorios, rastreos y bases de datos centralizadas solo para ajustar un párrafo. Sypher aísla el flujo por completo en la memoria local del navegador, ofreciendo un sandbox privado que convierte notas caóticas en comunicación estructurada."
      : "O Sypher AI nasceu da necessidade de contornar a fricção presente nas ferramentas de escrita modernas. A maioria das utilidades de geração exige cadastros obrigatórios, rastreamento de cookies e bancos de dados centralizados apenas para ajustar um parágrafo. O Sypher isola todo esse fluxo na memória local do cliente, atuando como um sandbox privado e imediato que converte rascunhos caóticos em comunicação estruturada.",
    technicalTitle: lang === 'en' ? "Technical Core Principles" : lang === 'es' ? "Principios Técnicos Base" : "Princípios Técnicos Fundamentais",
    privacyText: lang === 'en' ? "Completely client-side sandboxed states that respect data integrity." : lang === 'es' ? "Estados locales en sandbox que respetan la integridad de tus datos." : "Estados locais em sandbox no cliente que garantem integridade total de dados.",
    redundancyText: lang === 'en' ? "A robust cascading proxy handling model fallbacks seamlessly." : lang === 'es' ? "Proxy con cascada robusta para gestionar la caída de modelos." : "Roteamento via proxy com cascata redundante de modelos resilientes.",
    contactTitle: lang === 'en' ? "CONNECTIVITY MATRIX" : lang === 'es' ? "MATRIZ DE CONEXIÓN" : "MATRIZ DE CONECTIVIDADE",
    backBtn: lang === 'en' ? "BACK TO SAFETY" : lang === 'es' ? "VOLVER A INICIO" : "VOLTAR AO INÍCIO"
  };

  return (
    <div className="min-h-screen bg-[#030304] text-zinc-300 font-sans selection:bg-red-500/30 selection:text-white">
      {/* Decorative accent grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111115_1px,transparent_1px),linear-gradient(to_bottom,#111115_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />

      {/* FIXED HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.04] bg-[#030304]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Back Link with Divider + "About" */}
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
                About
              </span>
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
              <span>{lang === 'en' ? "OPEN WORKSPACE" : "ABRIR WORKSPACE"}</span>
            </button>
          </div>

        </div>
      </header>

      {/* CONTAINER LAYOUT */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* TOP SECTION HEADER */}
        <div className="text-left space-y-3 mb-12">
          <span className="text-[10px] font-mono font-bold tracking-widest text-red-500 uppercase">
            {lang === 'en' ? "SYSTEM OVERVIEW" : "VISÃO GERAL DO SISTEMA"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-sans font-black text-white uppercase tracking-wider">
            {t.title}
          </h1>
          <p className="text-xs text-zinc-500 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
          <div className="h-[2px] w-16 bg-red-500 mt-2" />
        </div>

        {/* MAIN ABOUT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: BIO & CONTACT BLOCK */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Creator Profile Card */}
            <div className="bg-[#08080b] border border-white/[0.03] p-6 text-left space-y-4">
              <span className="text-[9px] font-mono font-bold text-red-500 tracking-widest uppercase block">
                {t.creatorTitle}
              </span>
              <div>
                <h2 className="text-lg font-sans font-black text-white uppercase tracking-wide">
                  Gustavo Medeiros de Barros
                </h2>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mt-0.5">
                  Full Stack Software Engineer
                </span>
              </div>

              {/* Developer Spec Terminal Box */}
              <div className="border border-white/[0.03] bg-[#030304] p-3 text-left font-mono">
                <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 mb-2 border-b border-white/[0.02] pb-1">
                  <Terminal className="w-3 h-3 text-red-500" />
                  <span>gustavo_specs.sh</span>
                </div>
                <div className="text-[10px] space-y-1 text-zinc-400">
                  <p><span className="text-red-500">ROOT:</span> ~dev/gustavo</p>
                  <p><span className="text-red-500">ENV:</span> React / Node.js / TS</p>
                  <p><span className="text-red-500">LOC:</span> São Paulo, BR</p>
                </div>
              </div>
            </div>

            {/* Contacts & Socials Card */}
            <div className="bg-[#08080b] border border-white/[0.03] p-6 text-left space-y-4">
              <span className="text-[9px] font-mono font-bold text-red-500 tracking-widest uppercase block">
                {t.contactTitle}
              </span>
              
              <div className="flex flex-col gap-2.5">
                {/* Email */}
                <a 
                  href="mailto:gustmb2005@gmail.com"
                  className="flex items-center justify-between p-2.5 bg-[#030304] border border-white/[0.02] hover:border-red-500/30 hover:bg-[#070709] transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-500 transition-colors" />
                    <span className="text-[11px] font-mono text-zinc-400 group-hover:text-white transition-colors">
                      gustmb2005@gmail.com
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
                </a>

                {/* Portfolio */}
                <a 
                  href="https://www.gustavodev.net.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 bg-[#030304] border border-white/[0.02] hover:border-red-500/30 hover:bg-[#070709] transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-500 transition-colors" />
                    <span className="text-[11px] font-mono text-zinc-400 group-hover:text-white transition-colors">
                      gustavodev.net.br
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
                </a>

                {/* GitHub */}
                <a 
                  href="https://github.com/Gustaavo-404" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 bg-[#030304] border border-white/[0.02] hover:border-red-500/30 hover:bg-[#070709] transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Github className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-500 transition-colors" />
                    <span className="text-[11px] font-mono text-zinc-400 group-hover:text-white transition-colors">
                      Gustaavo-404
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://www.linkedin.com/in/gustavo-medeiros-de-barros-092230279/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 bg-[#030304] border border-white/[0.02] hover:border-red-500/30 hover:bg-[#070709] transition-all group"
                >
                  <div className="flex items-center gap-2.5">
                    <Linkedin className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-500 transition-colors" />
                    <span className="text-[11px] font-mono text-zinc-400 group-hover:text-white transition-colors">
                      LinkedIn Profile
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT: PROJECT ORIGIN & MISSION */}
          <div className="md:col-span-7 space-y-8">
            
            {/* The Motivation Text Segment */}
            <div className="space-y-4 text-left">
              <h3 className="text-xl font-sans font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-500" />
                {t.motivationHeader}
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {t.motivationText}
              </p>
            </div>

            {/* Core Tech Stack Section */}
            <div className="space-y-4 text-left">
              <h3 className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">
                {t.technicalTitle}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-white/[0.03] bg-[#08080b] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white font-sans font-bold text-xs uppercase tracking-wide">
                    <Shield className="w-4 h-4 text-red-500" />
                    <span>Sovereign Storage</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    {t.privacyText}
                  </p>
                </div>

                <div className="border border-white/[0.03] bg-[#08080b] p-4 space-y-2">
                  <div className="flex items-center gap-2 text-white font-sans font-bold text-xs uppercase tracking-wide">
                    <Cpu className="w-4 h-4 text-red-500" />
                    <span>Redundancy Pipeline</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    {t.redundancyText}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick System Diagnostics Box */}
            <div className="border border-white/[0.03] bg-[#08080b] p-5 text-left font-mono text-[10px] text-zinc-400 space-y-3">
              <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider block">
                [ DIAGNOSTIC REPORT ]
              </span>
              <div className="space-y-2">
                <p>&gt; sys_integrity: <span className="text-emerald-500">PASS (100% Client Sovereign)</span></p>
                <p>&gt; core_transfers: <span className="text-emerald-500">PASS (Zero relational backend leakage)</span></p>
                <p>&gt; endpoint_security: <span className="text-emerald-500">SECURE (Credentials Proxy Wrapper)</span></p>
              </div>
            </div>

            {/* Action Return Button */}
            <div className="text-left pt-4">
              <button
                type="button"
                onClick={() => onNavigate('landing')}
                className="px-5 py-3 border border-white/[0.06] hover:border-red-500/40 bg-[#08080a] text-zinc-400 hover:text-white font-sans font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t.backBtn}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* COMPREHENSIVE FOOTER */}
      <footer className="border-t border-white/[0.04] bg-[#030304] py-10 text-center relative z-10 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] font-sans text-zinc-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase tracking-widest text-[9px]">SYPHER AI</span>
            <span>&bull;</span>
            <span>About Profile Hub</span>
          </div>
          <div>
            <p className="uppercase tracking-wider font-semibold">Sypher AI &copy; 2026. Precision SaaS Content Engineering.</p>
          </div>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => onNavigate('landing')} className="hover:text-white transition-colors cursor-pointer uppercase font-bold tracking-widest text-[9px] text-zinc-500">
              LANDING PAGE
            </button>
            <span>&bull;</span>
            <button type="button" onClick={() => onNavigate('docs')} className="hover:text-white transition-colors cursor-pointer uppercase font-bold tracking-widest text-[9px] text-zinc-500">
              DOCS
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}