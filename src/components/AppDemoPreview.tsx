import { useLayoutEffect, useRef } from "react";
import {
    Linkedin,
    Mail,
    FileText,
    Twitter,
    Briefcase,
    Wand2,
    Copy,
    Check,
    Loader2,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Language } from "../translations";
import { WiredGridBackground } from "./WiredGridBackground";

gsap.registerPlugin(ScrollTrigger);

interface AppDemoPreviewProps {
    lang: Language;
}

/* ============================================================ */
/* Conteúdo mockado e localizado da demonstração                */
/* ============================================================ */

const COPY: Record<
    Language,
    {
        label: string;
        heading: string;
        disclaimer: string;
        chromeUrl: string;
        chromeBadge: string;
        labelDraft: string;
        labelFormat: string;
        labelTone: string;
        labelGuidelines: string;
        labelOutput: string;
        draftText: string;
        instructionText: string;
        generateLabel: string;
        loadingSteps: string[];
        outputText: string;
        copiedLabel: string;
        formats: string[];
        tones: string[];
    }
> = {
    pt: {
        label: "DEMONSTRAÇÃO AUTOMATIZADA",
        heading: "VEJA O SYPHER EM AÇÃO",
        disclaimer: "Demonstração automática — nenhuma interação é necessária",
        chromeUrl: "sypher.ai/workspace",
        chromeBadge: "READ_ONLY // PREVIEW",
        labelDraft: "RASCUNHO BRUTO",
        labelFormat: "FORMATO",
        labelTone: "TOM DE VOZ",
        labelGuidelines: "DIRETRIZES",
        labelOutput: "SAÍDA SYPHER",
        draftText:
            "fechamos hoje um contrato novo com a Delta. o segredo foi ouvir antes de falar preço.",
        instructionText: "sem emojis, máx. 3 parágrafos",
        generateLabel: "Polir com Sypher",
        loadingSteps: [
            "Sypher analisando o rascunho...",
            "Calibrando tom persuasivo...",
            "Formatando para LinkedIn...",
        ],
        outputText:
            "Hoje fechamos uma parceria estratégica com a Delta.\n\nO diferencial não foi o preço — foi ouvir antes de falar. Entender a dor do cliente mudou todo o rumo da negociação.\n\nLição para quem vende: escute primeiro, posicione depois.",
        copiedLabel: "Copiado",
        formats: [
            "LinkedIn Post",
            "E-mail Profissional",
            "Rascunho de Blog",
            "Thread no X",
            "Resumo Executivo",
        ],
        tones: ["CORPORATIVO", "PERSUASIVO", "CASUAL", "TÉCNICO", "ENTUSIASTA"],
    },
    en: {
        label: "AUTOMATED PREVIEW",
        heading: "SEE SYPHER IN ACTION",
        disclaimer: "Automated demo — no interaction required",
        chromeUrl: "sypher.ai/workspace",
        chromeBadge: "READ_ONLY // PREVIEW",
        labelDraft: "RAW DRAFT",
        labelFormat: "FORMAT",
        labelTone: "TONE",
        labelGuidelines: "GUIDELINES",
        labelOutput: "SYPHER OUTPUT",
        draftText:
            "just closed a new deal with Delta today. the secret was listening before talking pricing.",
        instructionText: "no emojis, max 3 paragraphs",
        generateLabel: "Polish with Sypher",
        loadingSteps: [
            "Sypher parsing the draft...",
            "Calibrating persuasive tone...",
            "Formatting for LinkedIn...",
        ],
        outputText:
            "Today we closed a strategic partnership with Delta.\n\nThe real differentiator wasn't price — it was listening first. Understanding the client's pain before pitching changed the entire negotiation.\n\nLesson for anyone in sales: listen first, position second.",
        copiedLabel: "Copied",
        formats: [
            "LinkedIn Post",
            "Professional Email",
            "Blog Draft",
            "X Thread",
            "Executive Summary",
        ],
        tones: ["CORPORATE", "PERSUASIVE", "CASUAL", "TECHNICAL", "ENTHUSIAST"],
    },
    es: {
        label: "VISTA PREVIA AUTOMÁTICA",
        heading: "VE A SYPHER EN ACCIÓN",
        disclaimer: "Demostración automática — no requiere interacción",
        chromeUrl: "sypher.ai/workspace",
        chromeBadge: "READ_ONLY // PREVIEW",
        labelDraft: "BORRADOR CRUDO",
        labelFormat: "FORMATO",
        labelTone: "TONO",
        labelGuidelines: "PAUTAS",
        labelOutput: "SALIDA SYPHER",
        draftText:
            "hoy cerramos un contrato nuevo con Delta. el secreto fue escuchar antes de hablar de precio.",
        instructionText: "sin emojis, máx. 3 párrafos",
        generateLabel: "Pulir con Sypher",
        loadingSteps: [
            "Sypher analizando el borrador...",
            "Calibrando tono persuasivo...",
            "Formateando para LinkedIn...",
        ],
        outputText:
            "Hoy cerramos una alianza estratégica con Delta.\n\nEl verdadero diferencial no fue el precio — fue escuchar primero. Entender el dolor del cliente cambió el rumbo de la negociación.\n\nLección para quien vende: escucha primero, posiciona después.",
        copiedLabel: "Copiado",
        formats: [
            "LinkedIn Post",
            "Correo Profesional",
            "Borrador de Blog",
            "Hilo en X",
            "Resumen Ejecutivo",
        ],
        tones: ["CORPORATIVO", "PERSUASIVO", "CASUAL", "TÉCNICO", "ENTUSIASTA"],
    },
};

const FORMAT_ICONS = [Linkedin, Mail, FileText, Twitter, Briefcase];

const BASE_BORDER = "rgba(255,255,255,0.05)";
const BASE_BG = "#08080a";
const ACTIVE_BORDER = "#ef4444";
const ACTIVE_BG = "rgba(239,68,68,0.07)";
const IDLE_TEXT = "#71717a";

export default function AppDemoPreview({ lang }: AppDemoPreviewProps) {
    const c = COPY[lang] || COPY.en;

    const sectionRef = useRef<HTMLDivElement>(null);
    const screenRef = useRef<HTMLDivElement>(null);

    // refs da UI fictícia
    const draftBlockRef = useRef<HTMLDivElement>(null);
    const draftTextRef = useRef<HTMLSpanElement>(null);
    const formatRefs = useRef<(HTMLDivElement | null)[]>([]);
    const toneRefs = useRef<(HTMLDivElement | null)[]>([]);
    const guidelinesBlockRef = useRef<HTMLDivElement>(null);
    const guidelinesTextRef = useRef<HTMLSpanElement>(null);
    const generateBtnRef = useRef<HTMLDivElement>(null);
    const spinnerRef = useRef<HTMLDivElement>(null);
    const statusTextRef = useRef<HTMLSpanElement>(null);
    const outputPanelRef = useRef<HTMLDivElement>(null);
    const outputTextRef = useRef<HTMLDivElement>(null);
    const copyButtonRef = useRef<HTMLDivElement>(null);
    const copyIconRef = useRef<HTMLDivElement>(null);
    const checkIconRef = useRef<HTMLDivElement>(null);
    const copiedLabelRef = useRef<HTMLSpanElement>(null);

    // cursor fictício
    const cursorRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const reducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        if (reducedMotion || !screenRef.current || !cursorRef.current) {
            return;
        }

        const screen = screenRef.current;

        // posição de um elemento relativa ao container da "tela"
        const relPos = (target: HTMLElement | null) => {
            if (!target) return { x: 0, y: 0 };
            const t = target.getBoundingClientRect();
            const s = screen.getBoundingClientRect();
            return {
                x: t.left - s.left + t.width / 2,
                y: t.top - s.top + t.height / 2,
            };
        };

        gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50, opacity: 0 });
        gsap.set(ringRef.current, { opacity: 0, scale: 0.5 });

        const resetAll = () => {
            const idleBlocks = [draftBlockRef.current, guidelinesBlockRef.current, outputPanelRef.current].filter(
                Boolean
            ) as HTMLElement[];
            const chips = [...formatRefs.current, ...toneRefs.current].filter(Boolean) as HTMLElement[];

            gsap.set(idleBlocks, { borderColor: BASE_BORDER, backgroundColor: BASE_BG, opacity: 1 });
            gsap.set(chips, { borderColor: BASE_BORDER, backgroundColor: BASE_BG, color: IDLE_TEXT, opacity: 1 });
            gsap.set(generateBtnRef.current, { borderColor: "rgba(239,68,68,0.3)" });
            gsap.set(spinnerRef.current, { opacity: 0 });
            gsap.set(copyIconRef.current, { opacity: 1, scale: 1 });
            gsap.set(checkIconRef.current, { opacity: 0, scale: 0.6 });
            gsap.set(copiedLabelRef.current, { opacity: 0 });
            gsap.set(cursorRef.current, { opacity: 0 });

            if (draftTextRef.current) draftTextRef.current.textContent = "";
            if (guidelinesTextRef.current) guidelinesTextRef.current.textContent = "";
            if (outputTextRef.current) outputTextRef.current.textContent = "";
            if (statusTextRef.current) statusTextRef.current.textContent = "";
        };

        // efeito de "digitação"
        const typeInto = (tl: gsap.core.Timeline, el: HTMLElement | null, text: string, duration: number) => {
            if (!el) return tl;
            const proxy = { chars: 0 };
            return tl.to(proxy, {
                chars: text.length,
                duration,
                ease: "none",
                onUpdate: () => {
                    el.textContent = text.slice(0, Math.round(proxy.chars));
                },
            });
        };

        // move o cursor até o alvo e dispara o "ripple" de clique
        const clickAt = (tl: gsap.core.Timeline, target: HTMLElement | null) => {
            tl.to(cursorRef.current, {
                x: () => relPos(target).x,
                y: () => relPos(target).y,
                opacity: 1,
                duration: 0.85,
                ease: "power2.inOut",
            });
            tl.fromTo(
                ringRef.current,
                { opacity: 0.7, scale: 0.5 },
                { opacity: 0, scale: 2.2, duration: 0.5, ease: "power2.out" }
            );
            return tl;
        };

        // acende a borda/texto de um elemento
        const highlightOn = (tl: gsap.core.Timeline, el: HTMLElement | null) => {
            tl.to(el, { borderColor: ACTIVE_BORDER, backgroundColor: ACTIVE_BG, color: "#ffffff", duration: 0.3 }, "<");
            return tl;
        };

        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });

        tl.call(resetAll);

        // ---------- Etapa 1: rascunho bruto ----------
        clickAt(tl, draftBlockRef.current);
        highlightOn(tl, draftBlockRef.current);
        typeInto(tl, draftTextRef.current, c.draftText, 1.7);
        tl.to(draftBlockRef.current, { borderColor: BASE_BORDER, backgroundColor: BASE_BG, duration: 0.3 }, "+=0.2");

        // ---------- Etapa 2: formato (LinkedIn Post) ----------
        clickAt(tl, formatRefs.current[0]);
        highlightOn(tl, formatRefs.current[0]);

        // ---------- Etapa 3: tom de voz (Persuasivo) ----------
        clickAt(tl, toneRefs.current[1]);
        highlightOn(tl, toneRefs.current[1]);

        // ---------- Etapa 4: diretrizes de estilo ----------
        clickAt(tl, guidelinesBlockRef.current);
        highlightOn(tl, guidelinesBlockRef.current);
        typeInto(tl, guidelinesTextRef.current, c.instructionText, 1.0);
        tl.to(guidelinesBlockRef.current, { borderColor: BASE_BORDER, backgroundColor: BASE_BG, duration: 0.3 }, "+=0.2");

        // ---------- Etapa 5: gerar / loading ----------
        clickAt(tl, generateBtnRef.current);
        tl.to(generateBtnRef.current, { borderColor: ACTIVE_BORDER, duration: 0.2 }, "<");
        tl.to(spinnerRef.current, { opacity: 1, duration: 0.2 });

        c.loadingSteps.forEach((step) => {
            tl.call(() => {
                if (statusTextRef.current) statusTextRef.current.textContent = step;
            });
            tl.to({}, { duration: 0.7 });
        });

        tl.to(spinnerRef.current, { opacity: 0, duration: 0.2 });
        tl.to(generateBtnRef.current, { borderColor: "rgba(239,68,68,0.3)", duration: 0.2 }, "<");
        tl.call(() => {
            if (statusTextRef.current) statusTextRef.current.textContent = "";
        });

        // ---------- Etapa 6: saída revelada ----------
        tl.to(outputPanelRef.current, { borderColor: ACTIVE_BORDER, duration: 0.25 });
        typeInto(tl, outputTextRef.current, c.outputText, 1.9);
        tl.to(outputPanelRef.current, { borderColor: BASE_BORDER, duration: 0.3 }, "+=0.2");

        // ---------- Etapa 7: copiar ----------
        clickAt(tl, copyButtonRef.current);
        tl.to(copyIconRef.current, { opacity: 0, scale: 0.6, duration: 0.2 }, "<");
        tl.to(checkIconRef.current, { opacity: 1, scale: 1, duration: 0.25 }, "<0.05");
        tl.to(copiedLabelRef.current, { opacity: 1, duration: 0.25 });

        tl.to({}, { duration: 1.4 });

        tl.to(
            [draftTextRef.current, guidelinesTextRef.current, outputTextRef.current, outputPanelRef.current].filter(
                Boolean
            ),
            { opacity: 0, duration: 0.6 }
        );
        tl.to(cursorRef.current, { opacity: 0, duration: 0.3 }, "<");

        const st = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top 85%",
            end: "bottom top",
            onEnter: () => tl.play(),
            onEnterBack: () => tl.play(),
            onLeave: () => tl.pause(),
            onLeaveBack: () => tl.pause(),
        });

        const raf = requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            if (st.isActive) {
                tl.play();
            } else {
                tl.pause();
            }
        });

        return () => {
            cancelAnimationFrame(raf);
            tl.kill();
            st.kill();
        };
    }, [lang]);

    return (
        <section
            id="demo"
            ref={sectionRef}
            className="relative py-16 sm:py-24 border-t border-white/[0.04] bg-[#030304] overflow-hidden"
        >
            {/* WiredGridBackground como fundo da seção inteira (fora do preview) */}
            <div className="absolute inset-0 z-0">
                <WiredGridBackground opacity={1} wireOpacity={0.42} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex justify-end">
                    <div className="w-full max-w-5xl">
                        {/* TÍTULO — acima do preview, alinhado à esquerda com a imagem ao lado */}
                        <div className="flex items-center gap-4 mb-6 sm:mb-8 text-left">
                            {/* Imagem cs1.png à esquerda do título */}
                            <img
                                src="/img/icons/cs1.png"
                                alt=""
                                className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain opacity-60 select-none pointer-events-none flex-shrink-0"
                            />

                            <div>
                                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-red-500">
                                    {c.label}
                                </span>
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-black tracking-wider text-white uppercase mt-2">
                                    {c.heading}
                                </h2>
                            </div>
                        </div>

                        <div
                            ref={screenRef}
                            className="relative bg-[#0a0a0c] border border-white/[0.08] shadow-[0_40px_100px_rgba(0,0,0,0.55)] overflow-hidden"
                        >
                            {/* barra superior técnica */}
                            <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 border-b border-white/[0.04] bg-[#070708]">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    <span className="text-[9px] font-mono text-zinc-500 tracking-wider">{c.chromeUrl}</span>
                                </div>
                                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest hidden sm:inline">
                                    {c.chromeBadge}
                                </span>
                            </div>

                            {/* corpo fictício do app */}
                            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {/* coluna esquerda */}
                                <div className="space-y-4">
                                    {/* rascunho bruto */}
                                    <div ref={draftBlockRef} className="p-3 border border-white/[0.05] bg-[#08080a]">
                                        <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-zinc-500">
                                            {c.labelDraft}
                                        </span>
                                        <div className="mt-2 min-h-[3.4em]">
                                            <span
                                                ref={draftTextRef}
                                                className="text-[10px] sm:text-[11px] text-zinc-300 font-sans leading-relaxed"
                                            />
                                            <span className="inline-block w-[1px] h-3 bg-red-500/70 align-middle ml-0.5 animate-pulse" />
                                        </div>
                                    </div>

                                    {/* formato */}
                                    <div>
                                        <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-zinc-500 block mb-1.5">
                                            {c.labelFormat}
                                        </span>
                                        <div className="space-y-1.5">
                                            {c.formats.map((label, i) => {
                                                const Icon = FORMAT_ICONS[i] || FileText;
                                                return (
                                                    <div
                                                        key={i}
                                                        ref={(el) => {
                                                            formatRefs.current[i] = el;
                                                        }}
                                                        className="flex items-center gap-2 px-2.5 py-2 border border-white/[0.04] bg-[#08080a] text-zinc-500"
                                                    >
                                                        <Icon className="w-3 h-3 shrink-0" />
                                                        <span className="text-[10px] font-sans font-medium truncate">{label}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* coluna direita */}
                                <div className="space-y-4">
                                    {/* tom de voz */}
                                    <div>
                                        <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-zinc-500 block mb-1.5">
                                            {c.labelTone}
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {c.tones.map((tone, i) => (
                                                <div
                                                    key={i}
                                                    ref={(el) => {
                                                        toneRefs.current[i] = el;
                                                    }}
                                                    className="px-2.5 py-1.5 border border-white/[0.04] bg-[#08080a] text-zinc-500"
                                                >
                                                    <span className="text-[9px] font-mono font-semibold">{tone}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* diretrizes */}
                                    <div ref={guidelinesBlockRef} className="p-2.5 border border-white/[0.04] bg-[#08080a]">
                                        <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-zinc-500">
                                            {c.labelGuidelines}
                                        </span>
                                        <div className="mt-1 min-h-[1.4em]">
                                            <span ref={guidelinesTextRef} className="text-[10px] text-zinc-300 font-sans" />
                                        </div>
                                    </div>

                                    {/* botão de gerar */}
                                    <div
                                        ref={generateBtnRef}
                                        className="flex items-center justify-center gap-2 border border-red-500/30 bg-black py-2.5 text-red-500"
                                    >
                                        <Wand2 className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-sans font-bold uppercase tracking-widest">
                                            {c.generateLabel}
                                        </span>
                                        <div ref={spinnerRef} style={{ opacity: 0 }} className="ml-1">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                        </div>
                                    </div>
                                    <div className="-mt-1.5 h-3">
                                        <span ref={statusTextRef} className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider" />
                                    </div>

                                    {/* saída */}
                                    <div ref={outputPanelRef} className="border border-white/[0.04] bg-black p-3 min-h-[120px]">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-zinc-500">
                                                {c.labelOutput}
                                            </span>
                                            <div
                                                ref={copyButtonRef}
                                                className="flex items-center gap-1.5 border border-white/[0.06] bg-[#0d0d0f] px-2 py-1"
                                            >
                                                <div className="relative w-3 h-3">
                                                    <div ref={copyIconRef} className="absolute inset-0 flex items-center justify-center">
                                                        <Copy className="w-3 h-3 text-zinc-500" />
                                                    </div>
                                                    <div ref={checkIconRef} className="absolute inset-0 flex items-center justify-center">
                                                        <Check className="w-3 h-3 text-emerald-500" />
                                                    </div>
                                                </div>
                                                <span
                                                    ref={copiedLabelRef}
                                                    className="text-[8px] font-mono text-emerald-500 uppercase tracking-wider"
                                                >
                                                    {c.copiedLabel}
                                                </span>
                                            </div>
                                        </div>
                                        <div
                                            ref={outputTextRef}
                                            className="text-[10px] text-zinc-300 leading-relaxed whitespace-pre-line"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div ref={cursorRef} className="absolute left-0 top-0 z-30 pointer-events-none will-change-transform">
                                <div className="relative w-4 h-4">
                                    <div ref={ringRef} className="absolute inset-0 rounded-full border border-red-500" />
                                    <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.85)]" />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider">{c.disclaimer}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}