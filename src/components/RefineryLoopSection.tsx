import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Sparkles, CornerDownRight, Cpu, Layers, ShieldCheck } from "lucide-react";
import { Language } from "../translations";
import { WiredGridBackground } from "./WiredGridBackground";

interface RefineryLoopSectionProps {
    lang: Language;
}

/* ============================================================ */
/* Conteúdo localizado                                           */
/* ============================================================ */

const COPY: Record<
    Language,
    {
        tag: string;
        headline: string;
        sub: string;
        rawTitle: string;
        refineryTitle: string;
        polishedTitle: string;
        rawTokens: { text: string; isFiller: boolean }[];
        polishedLines: string[];
    }
> = {
    pt: {
        tag: "SYS::REFINERY_CORE",
        headline: "REFINAMENTO EM TEMPO REAL",
        sub: "Assista à inteligência artificial isolar o ruído, remover termos vagos e estruturar o sinal em tempo real.",
        rawTitle: "SYS::RAW_INPUT (DRAFT)",
        refineryTitle: "PIPELINE::PROCESSOR",
        polishedTitle: "SYS::SIGNAL_OUTPUT (REFINED)",
        rawTokens: [
            { text: "então tipo... ", isFiller: true },
            { text: "a gente acabou de fechar ", isFiller: false },
            { text: "hum... ", isFiller: true },
            { text: "um contrato gigante com a Delta... ", isFiller: false },
            { text: "sabe? ", isFiller: true },
            { text: "acho que foi porque ouvimos eles em vez de só falar de preço... ", isFiller: false },
            { text: "sei lá.", isFiller: true }
        ],
        polishedLines: [
            "Parceria estratégica fechada com a Delta.",
            "O diferencial? Ouvir antes de falar de preço.",
            "Escute primeiro, posicione depois."
        ]
    },
    en: {
        tag: "SYS::REFINERY_CORE",
        headline: "REAL-TIME REFINERY",
        sub: "Watch the artificial intelligence isolate noise, strip filler words, and structure clean signal in real-time.",
        rawTitle: "SYS::RAW_INPUT (DRAFT)",
        refineryTitle: "PIPELINE::PROCESSOR",
        polishedTitle: "SYS::SIGNAL_OUTPUT (REFINED)",
        rawTokens: [
            { text: "so like... ", isFiller: true },
            { text: "we just closed ", isFiller: false },
            { text: "uhm... ", isFiller: true },
            { text: "a huge deal with Delta... ", isFiller: false },
            { text: "you know? ", isFiller: true },
            { text: "I guess it was because we actually listened instead of just talking pricing... ", isFiller: false },
            { text: "whatever.", isFiller: true }
        ],
        polishedLines: [
            "Strategic partnership closed with Delta.",
            "The key? Listening before talking pricing.",
            "Listen first, position second."
        ]
    },
    es: {
        tag: "SYS::REFINERY_CORE",
        headline: "REFINERÍA EN TIEMPO REAL",
        sub: "Observe cómo la inteligencia artificial aísla el ruido, elimina las muletillas y estructura el mensaje en tiempo real.",
        rawTitle: "SYS::RAW_INPUT (BORRADOR)",
        refineryTitle: "PIPELINE::PROCESSOR",
        polishedTitle: "SYS::SIGNAL_OUTPUT (REFINADO)",
        rawTokens: [
            { text: "o sea... ", isFiller: true },
            { text: "acabamos de cerrar ", isFiller: false },
            { text: "este... ", isFiller: true },
            { text: "un acuerdo gigante con Delta... ", isFiller: false },
            { text: "¿sabes? ", isFiller: true },
            { text: "creo que fue porque escuchamos en lugar de solo hablar de precios... ", isFiller: false },
            { text: "qué sé yo.", isFiller: true }
        ],
        polishedLines: [
            "Alianza estratégica cerrada con Delta.",
            "¿La clave? Escuchar antes de hablar de precios.",
            "Escucha primero, posiciona después."
        ]
    }
};

export default function RefineryLoopSection({ lang }: RefineryLoopSectionProps) {
    const t = COPY[lang] || COPY.en;

    const sectionRef = useRef<HTMLDivElement>(null);
    
    // Refs estruturais
    const rawBoxRef = useRef<HTMLDivElement>(null);
    const polishedBoxRef = useRef<HTMLDivElement>(null);
    const coreNodeRef = useRef<SVGGElement>(null);
    const innerRingRef = useRef<SVGCircleElement>(null);
    const glowCircleRef = useRef<SVGCircleElement>(null);

    // Scanner laser
    const scannerRef = useRef<HTMLDivElement>(null);

    // Linhas de pulso SVG
    const lineLeftRef = useRef<SVGPathElement>(null);
    const lineRightRef = useRef<SVGPathElement>(null);

    // Arrays de refs para tokens e palavras
    const fillerWordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const strikeLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const goodWordRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const polishedWordRefs = useRef<(HTMLSpanElement | null)[]>([]);

    // Console de compilação fictício
    const terminalPanelRef = useRef<HTMLDivElement>(null);
    const terminalLogsRef = useRef<HTMLDivElement>(null);

    // Contadores numéricos
    const clarityCountRef = useRef<HTMLSpanElement>(null);
    const reachCountRef = useRef<HTMLSpanElement>(null);
    const tokenCountRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        const reducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        const fillers = fillerWordRefs.current.filter(Boolean) as HTMLSpanElement[];
        const strikes = strikeLineRefs.current.filter(Boolean) as HTMLSpanElement[];
        const goods = goodWordRefs.current.filter(Boolean) as HTMLSpanElement[];
        const polishedWords = polishedWordRefs.current.filter(Boolean) as HTMLSpanElement[];

        if (reducedMotion) {
            gsap.set(fillers, { opacity: 0.1, textDecoration: "line-through" });
            gsap.set(polishedWords, { opacity: 1 });
            return;
        }

        const ctx = gsap.context(() => {
            
            const resetSystem = () => {
                gsap.set(fillers, { opacity: 0.4, color: "#71717a" });
                gsap.set(strikes, { scaleX: 0 });
                gsap.set(goods, { opacity: 1, color: "#ffffff" });
                gsap.set(polishedWords, { opacity: 0, y: 8 });
                gsap.set(coreNodeRef.current, { rotation: 0 });
                gsap.set(innerRingRef.current, { rotation: 0 });
                gsap.set(glowCircleRef.current, { opacity: 0.05, scale: 1 });
                gsap.set(scannerRef.current, { top: "0%", opacity: 0 });
                gsap.set(terminalPanelRef.current, { opacity: 0, scale: 0.98 });
                
                // Reset de contadores de métricas
                if (clarityCountRef.current) clarityCountRef.current.textContent = "34.2%";
                if (reachCountRef.current) reachCountRef.current.textContent = "1.0x";
                if (tokenCountRef.current) tokenCountRef.current.textContent = "22";

                if (lineLeftRef.current && lineRightRef.current) {
                    gsap.set([lineLeftRef.current, lineRightRef.current], {
                        strokeDashoffset: 140,
                        stroke: "rgba(255, 255, 255, 0.03)"
                    });
                }
            };

            const mainTimeline = gsap.timeline({ repeat: -1, repeatDelay: 2.2 });

            mainTimeline.call(resetSystem);

            // ---------- ETAPA 1: Scanner laser varrendo o rascunho ----------
            mainTimeline.to(scannerRef.current, {
                opacity: 1,
                duration: 0.2
            }, 0.5);

            mainTimeline.to(scannerRef.current, {
                top: "100%",
                duration: 1.4,
                ease: "power1.inOut"
            }, 0.6);

            // Identificação de ruído acompanhando o laser
            mainTimeline.to(fillers, {
                color: "#ef4444",
                opacity: 1,
                duration: 0.4,
                stagger: 0.12,
                ease: "power2.out"
            }, 0.7);

            mainTimeline.to(strikes, {
                scaleX: 1,
                duration: 0.4,
                stagger: 0.12,
                ease: "power1.inOut"
            }, 0.9);

            mainTimeline.to(scannerRef.current, {
                opacity: 0,
                duration: 0.2
            }, 1.9);

            // ---------- ETAPA 2: Dissolvendo ruído e preparando o sinal ----------
            mainTimeline.to(fillers, {
                opacity: 0.02,
                y: -4,
                duration: 0.5,
                ease: "power2.inOut"
            }, 2.1);

            mainTimeline.to(goods, {
                color: "#ef4444",
                duration: 0.5
            }, 2.2);

            // ---------- ETAPA 3: Ativação dos barramentos SVG e do Núcleo ----------
            if (lineLeftRef.current) {
                mainTimeline.to(lineLeftRef.current, {
                    stroke: "#ef4444",
                    strokeDashoffset: 0,
                    duration: 0.9,
                    ease: "power1.inOut"
                }, 2.3);
            }

            mainTimeline.to(coreNodeRef.current, {
                rotation: 360,
                transformOrigin: "50% 50%",
                duration: 1.8,
                ease: "power2.inOut"
            }, 2.4);

            mainTimeline.to(innerRingRef.current, {
                rotation: -360,
                transformOrigin: "50% 50%",
                duration: 1.8,
                ease: "power2.inOut"
            }, 2.4);

            mainTimeline.to(glowCircleRef.current, {
                opacity: 0.85,
                scale: 1.3,
                transformOrigin: "50% 50%",
                duration: 0.8,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            }, 2.5);

            // ---------- ETAPA 4: Envio do sinal e ativação do Terminal de Compilação ----------
            if (lineRightRef.current) {
                mainTimeline.to(lineRightRef.current, {
                    stroke: "#ef4444",
                    strokeDashoffset: 0,
                    duration: 0.9,
                    ease: "power1.inOut"
                }, 3.1);
            }

            // Exibe terminal simulado de compilação antes do texto aparecer
            mainTimeline.to(terminalPanelRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            }, 3.3);

            // Simula logs carregando no terminal de forma rápida
            const logProxy = { progress: 0 };
            mainTimeline.to(logProxy, {
                progress: 100,
                duration: 1.2,
                ease: "none",
                onUpdate: () => {
                    if (terminalLogsRef.current) {
                        const prog = Math.floor(logProxy.progress);
                        let text = `[SYPHER_CORE::INIT] Parsing raw inputs...\n`;
                        if (prog > 20) text += `[PARSER::DETECTOR] Noise detected: filler_words_isolated\n`;
                        if (prog > 45) text += `[REFINERY::CORE] Stripping dirty tokens... latency < 140ms\n`;
                        if (prog > 70) text += `[STABILIZER] Recalibrating tone profile: PERSUASIVE\n`;
                        if (prog > 90) text += `[COMPILE::SUCCESS] Output ready. Projection stable.\n`;
                        terminalLogsRef.current.textContent = text;
                    }
                }
            }, 3.4);

            // Esconde terminal de compilação
            mainTimeline.to(terminalPanelRef.current, {
                opacity: 0,
                scale: 1.02,
                duration: 0.35,
                ease: "power2.in",
                delay: 0.2
            }, 4.7);

            // Ativa borda estabilizada na caixa refinada
            mainTimeline.to(polishedBoxRef.current, {
                borderColor: "rgba(239, 68, 68, 0.25)",
                duration: 0.4
            }, 4.9);

            // ---------- ETAPA 5: Revelação e Escrita do texto refinado ----------
            mainTimeline.to(polishedWords, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.05,
                ease: "power3.out"
            }, 5.1);

            // Escala os contadores de métricas simultaneamente
            const metricsProxy = { clarity: 34.2, reach: 1.0, tokens: 22 };
            mainTimeline.to(metricsProxy, {
                clarity: 98.4,
                reach: 4.8,
                tokens: 14,
                duration: 1.5,
                ease: "power2.out",
                onUpdate: () => {
                    if (clarityCountRef.current) clarityCountRef.current.textContent = `${metricsProxy.clarity.toFixed(1)}%`;
                    if (reachCountRef.current) reachCountRef.current.textContent = `${metricsProxy.reach.toFixed(1)}x`;
                    if (tokenCountRef.current) tokenCountRef.current.textContent = `${Math.floor(metricsProxy.tokens)}`;
                }
            }, 5.2);

            mainTimeline.to(goods, {
                color: "#71717a",
                opacity: 0.3,
                duration: 0.6
            }, 5.4);

            // ---------- ETAPA 6: Reset suave para reiniciar o loop ----------
            mainTimeline.to([rawBoxRef.current, polishedBoxRef.current, coreNodeRef.current, innerRingRef.current], {
                opacity: 0.15,
                duration: 0.9
            }, 10.5);

            mainTimeline.to(polishedWords, {
                opacity: 0,
                duration: 0.7
            }, 10.5);

        }, sectionRef);

        return () => {
            ctx.revert();
        };
    }, [lang]);

    const renderRawTokens = () => {
        let fillerIdx = 0;
        let goodIdx = 0;

        return t.rawTokens.map((token, idx) => {
            if (token.isFiller) {
                const currentFillerIdx = fillerIdx++;
                return (
                    <span key={idx} className="relative inline-block mr-1">
                        <span
                            ref={(el) => {
                                fillerWordRefs.current[currentFillerIdx] = el;
                            }}
                            className="inline-block text-zinc-500 font-sans font-medium text-xs sm:text-sm select-none will-change-transform"
                        >
                            {token.text}
                        </span>
                        <span
                            ref={(el) => {
                                strikeLineRefs.current[currentFillerIdx] = el;
                            }}
                            className="absolute left-0 top-[52%] w-full h-[2px] bg-red-500 origin-left scale-x-0"
                        />
                    </span>
                );
            } else {
                const currentGoodIdx = goodIdx++;
                return (
                    <span
                        key={idx}
                        ref={(el) => {
                            goodWordRefs.current[currentGoodIdx] = el;
                        }}
                        className="inline-block mr-1 text-white font-sans font-medium text-xs sm:text-sm select-none will-change-transform"
                    >
                        {token.text}
                    </span>
                );
            }
        });
    };

    const renderPolishedLines = () => {
        let wordIdx = 0;
        return t.polishedLines.map((line, lineIdx) => (
            <div key={lineIdx} className="block mb-2 last:mb-0">
                <CornerDownRight className="inline w-3 h-3 text-red-500/60 mr-2 shrink-0 align-middle -mt-0.5 animate-pulse" />
                {line.split(" ").map((word, wordIdxInLine) => {
                    const currentIdx = wordIdx++;
                    return (
                        <span
                            key={wordIdxInLine}
                            ref={(el) => {
                                polishedWordRefs.current[currentIdx] = el;
                            }}
                            className="inline-block mr-1.5 text-white font-sans font-semibold text-xs sm:text-sm leading-relaxed select-none will-change-transform"
                        >
                            {word}
                        </span>
                    );
                })}
            </div>
        ));
    };

    return (
        <section ref={sectionRef} className="relative bg-[#000000] overflow-hidden w-full py-16 sm:py-24 border-t border-white/[0.04]">
            
            {/* WiredGridBackground como fundo técnico da seção */}
            <div className="absolute inset-0 z-0">
                <WiredGridBackground opacity={1} wireOpacity={0.15} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Cabeçalho da Seção */}
                <div className="flex flex-col items-center text-center mb-16 max-w-3xl mx-auto select-none">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-red-500 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-red-500 animate-pulse" />
                        {t.tag}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-black tracking-wider text-white uppercase mt-3">
                        {t.headline}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-2 max-w-lg">{t.sub}</p>
                </div>

                {/* Grade Técnica Ampliada de 3 Colunas */}
                <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 items-center max-w-5xl mx-auto">
                    
                    {/* Coluna Esquerda: Rascunho Bruto (Raw Input) */}
                    <div className="md:col-span-5 w-full">
                        <div
                            ref={rawBoxRef}
                            className="w-full bg-[#08080a]/80 border border-white/[0.08] p-6 sm:p-8 rounded relative min-h-[380px] flex flex-col justify-between shadow-[0_15px_50px_rgba(0,0,0,0.85)]"
                        >
                            <span className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-red-500/20 to-transparent" />
                            <span className="absolute top-0 left-0 w-[2px] h-20 bg-red-500/30" />

                            {/* Laser Bar de Scanner */}
                            <div
                                ref={scannerRef}
                                className="absolute left-0 w-full h-[2px] bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.9)] opacity-0 pointer-events-none z-10"
                            />

                            <div>
                                <div className="flex items-center justify-between mb-6 select-none pb-3 border-b border-white/[0.04]">
                                    <span className="text-[8px] font-mono font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
                                        <Layers className="w-3 h-3 text-red-500/50" />
                                        {t.rawTitle}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[7px] font-mono font-semibold text-zinc-500 tracking-wider">
                                            SYS_DIRTY
                                        </span>
                                    </div>
                                </div>

                                <div className="leading-relaxed relative z-20 min-h-[140px]">
                                    {renderRawTokens()}
                                </div>
                            </div>

                            {/* Métricas do Rascunho */}
                            <div className="mt-8 pt-4 border-t border-white/[0.04] grid grid-cols-3 select-none text-zinc-500 font-mono text-[8px] tracking-wider divide-x divide-white/[0.04]">
                                <div className="pr-3">
                                    <span className="block text-[7px] text-zinc-600 mb-1">CLARITY</span>
                                    <span className="block font-bold text-zinc-400">34.2%</span>
                                </div>
                                <div className="px-3">
                                    <span className="block text-[7px] text-zinc-600 mb-1">REACH_INDEX</span>
                                    <span className="block font-bold text-zinc-400">1.0x</span>
                                </div>
                                <div className="pl-3">
                                    <span className="block text-[7px] text-zinc-600 mb-1">TOKENS</span>
                                    <span className="block font-bold text-zinc-400">22</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coluna Central: Wires e Processador Avançado (HUD) */}
                    <div className="md:col-span-2 flex flex-col items-center justify-center h-28 md:h-full select-none pointer-events-none">
                        <svg viewBox="0 0 200 200" className="w-24 h-24 md:w-36 md:h-36">
                            {/* Linha de Dados Esquerda */}
                            <path
                                ref={lineLeftRef}
                                d="M 0 100 L 75 100"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.03)"
                                strokeWidth="2.5"
                                strokeDasharray="140"
                                strokeDashoffset="140"
                            />
                            {/* Linha de Dados Direita */}
                            <path
                                ref={lineRightRef}
                                d="M 125 100 L 200 100"
                                fill="none"
                                stroke="rgba(255, 255, 255, 0.03)"
                                strokeWidth="2.5"
                                strokeDasharray="140"
                                strokeDashoffset="140"
                            />
                            {/* Círculo de Glow Traseiro do Processador */}
                            <circle
                                ref={glowCircleRef}
                                cx="100"
                                cy="100"
                                r="32"
                                fill="none"
                                stroke="rgba(239, 68, 68, 0.15)"
                                strokeWidth="8"
                                className="blur-[8px]"
                            />
                            {/* Elementos concêntricos rotativos */}
                            <g ref={coreNodeRef}>
                                {/* Anel técnico externo */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="28"
                                    fill="none"
                                    stroke="rgba(255, 255, 255, 0.1)"
                                    strokeWidth="1.5"
                                    strokeDasharray="6 4"
                                />
                                {/* Anel de dados interno */}
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="16"
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="1.5"
                                    strokeDasharray="40 10"
                                    className="opacity-70"
                                />
                            </g>
                            {/* Contra-anel rotativo */}
                            <circle
                                ref={innerRingRef}
                                cx="100"
                                cy="100"
                                r="22"
                                fill="none"
                                stroke="rgba(239, 68, 68, 0.4)"
                                strokeWidth="1"
                                strokeDasharray="12 18"
                            />
                            {/* Núcleo do processador central */}
                            <rect
                                x="93"
                                y="93"
                                width="14"
                                height="14"
                                fill="#ef4444"
                                rx="1.5"
                            />
                        </svg>
                        <span className="hidden md:inline font-mono text-[8px] text-zinc-600 tracking-widest uppercase mt-2">
                            {t.refineryTitle}
                        </span>
                    </div>

                    {/* Coluna Direita: Sinal Refinado (Polished Output) */}
                    <div className="md:col-span-5 w-full">
                        <div
                            ref={polishedBoxRef}
                            className="w-full bg-[#08080a]/40 border border-white/[0.08] p-6 sm:p-8 rounded relative min-h-[380px] flex flex-col justify-between shadow-[0_15px_50px_rgba(0,0,0,0.85)] backdrop-blur-sm transition-colors duration-300 overflow-hidden"
                        >
                            <span className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-emerald-500/20 to-transparent" />
                            <span className="absolute top-0 left-0 w-[2px] h-20 bg-emerald-500/30" />

                            {/* Terminal de Compilação de Logs Fictício */}
                            <div
                                ref={terminalPanelRef}
                                className="absolute inset-4 bg-black/95 border border-red-500/20 p-5 font-mono text-[9px] text-red-500/85 overflow-hidden opacity-0 pointer-events-none select-none z-30"
                            >
                                <div className="flex items-center justify-between pb-2 border-b border-red-500/10 mb-3 text-[8px] text-red-500/50 uppercase">
                                    <span>SYPHER_CORE::COMPILE_PROCESS</span>
                                    <span>REF_LTY: 142ms</span>
                                </div>
                                <div ref={terminalLogsRef} className="leading-relaxed whitespace-pre-line text-left">
                                    [SYPHER_CORE::INIT] Parsing raw inputs...
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-6 select-none pb-3 border-b border-white/[0.04]">
                                    <span className="text-[8px] font-mono font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
                                        <Cpu className="w-3 h-3 text-emerald-500/50 animate-pulse" />
                                        {t.polishedTitle}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[7px] font-mono font-semibold text-emerald-500 tracking-wider">
                                            SYS_STABLE
                                        </span>
                                    </div>
                                </div>

                                <div className="leading-relaxed min-h-[140px] text-left">
                                    {renderPolishedLines()}
                                </div>
                            </div>

                            {/* Métricas Finais Refinadas (Com Contagem Dinâmica no GSAP) */}
                            <div className="mt-8 pt-4 border-t border-white/[0.04] grid grid-cols-3 select-none font-mono text-[8px] tracking-wider divide-x divide-white/[0.04] text-zinc-400">
                                <div className="pr-3 text-left">
                                    <span className="block text-[7px] text-zinc-600 mb-1 flex items-center gap-1">
                                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-500/50" />
                                        CLARITY
                                    </span>
                                    <span ref={clarityCountRef} className="block font-bold text-white tabular-nums">
                                        34.2%
                                    </span>
                                </div>
                                <div className="px-3 text-left">
                                    <span className="block text-[7px] text-zinc-600 mb-1">REACH_INDEX</span>
                                    <span ref={reachCountRef} className="block font-bold text-white tabular-nums">
                                        1.0x
                                    </span>
                                </div>
                                <div className="pl-3 text-left">
                                    <span className="block text-[7px] text-zinc-600 mb-1">TOKENS</span>
                                    <span ref={tokenCountRef} className="block font-bold text-white tabular-nums">
                                        22
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}