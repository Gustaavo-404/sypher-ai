import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import * as THREE from "three";
import {
    Linkedin,
    Twitter,
    Mail,
    Wand2,
    Cpu,
    Copy,
    Check,
    Activity,
    FileText,
    Slack,
    Inbox,
    Globe,
    BookOpen,
    CornerDownRight,
    Terminal as TerminalIcon,
    Flame,
    Settings
} from "lucide-react";

type Language = "pt" | "en" | "es";

interface BentoGridSectionProps {
    lang: Language;
}

/* ============================================================ */
/* Conteúdo Localizado                                          */
/* ============================================================ */
const COPY: Record<
    Language,
    {
        // Card 1
        sandboxTitle: string;
        sandboxDesc: string;
        sandboxActivePreset: string;
        // Card 2
        vectorTitle: string;
        vectorDesc: string;
        vectorStatus: string;
        // Card 3
        metricsTitle: string;
        metricsDesc: string;
        metricLabel1: string;
        metricLabel2: string;
        // Card 4
        filtersTitle: string;
        filtersDesc: string;
        filtersList: string[];
        // Card 5
        deliveryTitle: string;
        deliveryDesc: string;
        copiedLabel: string;
    }
> = {
    pt: {
        sandboxTitle: "Presets de Integração",
        sandboxDesc: "A IA adapta-se instantaneamente às regras e algoritmos invisíveis de cada plataforma profissional.",
        sandboxActivePreset: "PRESET ATIVO",
        vectorTitle: "Mapeamento Semântico",
        vectorDesc: "Seu texto convertido em coordenadas vetoriais. Palavras agrupadas por intenção, eliminando clichês robóticos.",
        vectorStatus: "ESPAÇO VETORIAL ATIVO",
        metricsTitle: "Métricas de Retenção",
        metricsDesc: "Passe o mouse sobre o gráfico para analisar a curva de retenção simulada em tempo real.",
        metricLabel1: "Engajamento Estimado",
        metricLabel2: "Curva de Leitura",
        filtersTitle: "Regras Heurísticas",
        filtersDesc: "Filtros rígidos aplicados na camada final de otimização.",
        filtersList: ["Evitar clichês de IA", "Remover superlativos", "Parágrafos escaneáveis", "Ganchos de abertura"],
        deliveryTitle: "Output Engine",
        deliveryDesc: "Marcações técnicas limpas prontas para exportação imediata.",
        copiedLabel: "Copiado!"
    },
    en: {
        sandboxTitle: "Integration Presets",
        sandboxDesc: "The AI instantly adapts to the invisible rules and algorithms of each professional platform.",
        sandboxActivePreset: "ACTIVE PRESET",
        vectorTitle: "Semantic Mapping",
        vectorDesc: "Your text converted into vector coordinates. Words grouped by real intent, eliminating robotic clichés.",
        vectorStatus: "VECTOR SPACE ACTIVE",
        metricsTitle: "Retention Analytics",
        metricsDesc: "Hover over the chart to analyze the simulated retention curve in real-time.",
        metricLabel1: "Estimated Engagement",
        metricLabel2: "Readership Curve",
        filtersTitle: "Heuristic Rules",
        filtersDesc: "Rigid micro-constraints applied in the final optimization layer.",
        filtersList: ["No AI jargon", "Strip superlatives", "High scannability", "Pattern interrupt hook"],
        deliveryTitle: "Output Engine",
        deliveryDesc: "Clean technical markup ready for immediate export.",
        copiedLabel: "Copied!"
    },
    es: {
        sandboxTitle: "Presets de Integración",
        sandboxDesc: "La IA se adapta instantáneamente a las reglas invisibles y algoritmos de cada plataforma profesional.",
        sandboxActivePreset: "PRESET ACTIVO",
        vectorTitle: "Mapeo Semántico",
        vectorDesc: "Tu texto transformado en coordenadas vectoriales. Palabras agrupadas por intención, eliminando clichés robóticos.",
        vectorStatus: "ESPACIO VECTORIAL ACTIVO",
        metricsTitle: "Métricas de Retención",
        metricsDesc: "Pasa el cursor sobre el gráfico para analizar la curva de retención simulada en tempo real.",
        metricLabel1: "Engagement Estimado",
        metricLabel2: "Curva de Lectura",
        filtersTitle: "Regras Heurísticas",
        filtersDesc: "Micro-restricciones rígidas aplicadas en la capa de optimización final.",
        filtersList: ["Evitar clichés de IA", "Eliminar superlativos", "Alta legibilidad", "Gancho de apertura"],
        deliveryTitle: "Output Engine",
        deliveryDesc: "Marcas técnicas limpias listas para exportación inmediata.",
        copiedLabel: "Copied!"
    }
};

/* Ícones das Plataformas (Card 1) */
const PLATFORMS_DATA = [
    { id: "linkedin", label: "LinkedIn", icon: Linkedin, desc: "Algoritmo de Autoridade Profissional" },
    { id: "twitter", label: "X / Twitter", icon: Twitter, desc: "Algoritmo de Engajamento Rápido" },
    { id: "gmail", label: "Gmail", icon: Mail, desc: "Algoritmo de Filtros de Entrada" },
    { id: "outlook", label: "Outlook", icon: Inbox, desc: "Otimização Corporativa de Emails" },
    { id: "notion", label: "Notion", icon: FileText, desc: "Otimização de Rascunho / Wiki" },
    { id: "medium", label: "Medium", icon: BookOpen, desc: "SEO e Tempo de Leitura" },
    { id: "wordpress", label: "WordPress", icon: Globe, desc: "SEO e Indexação de Artigos" },
    { id: "slack", label: "Slack", icon: Slack, desc: "Síntese Corporativa de Informações" }
];

/* Curva matemática crescente (Métricas do Card 3) */
const getCurveY = (x: number) => {
    return 85 - (x * 0.34) - 5 * Math.sin(x * 0.08);
};

export default function BentoGridSection({ lang }: BentoGridSectionProps) {
    const t = COPY[lang] || COPY.en;

    const sectionRef = useRef<HTMLDivElement>(null);
    const threeContainerRef = useRef<HTMLDivElement>(null);
    const graphContainerRef = useRef<HTMLDivElement>(null);

    // State virtual para permitir rolagem infinita contínua em uma única direção
    const [virtualIdx, setVirtualIdx] = useState<number>(PLATFORMS_DATA.length);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(true);

    const selectedPlatIdx = virtualIdx % PLATFORMS_DATA.length;
    const selectedPlat = PLATFORMS_DATA[selectedPlatIdx];

    // Duplicação tripla dos dados para suportar a ilusão de carrossel infinito sem quebra visual
    const EXTENDED_PLATFORMS = useMemo(() => {
        return [...PLATFORMS_DATA, ...PLATFORMS_DATA, ...PLATFORMS_DATA];
    }, []);

    // States para o Card 3 (Métricas Interativas)
    const [hoverMetric, setHoverMetric] = useState<{ x: number; val: number; dateLabel: string; viewsLabel: string } | null>(null);

    // States para o Card 4 (Filtros)
    const [activeFilters, setActiveFilters] = useState<boolean[]>([true, true, false, true]);

    // States para o Card 5 (Cópia de código)
    const [copied, setCopied] = useState<boolean>(false);

    /* Efeito de Rotação Automática Infinita do Carrossel (Card 1) */
    useEffect(() => {
        const autoScrollTimer = setInterval(() => {
            setIsTransitioning(true);
            setVirtualIdx((prev: number) => prev + 1);
        }, 2200);

        return () => clearInterval(autoScrollTimer);
    }, []);

    /* Realiza o reset de posição de forma imperceptível quando chega ao final da segunda lista */
    useEffect(() => {
        if (virtualIdx >= PLATFORMS_DATA.length * 2) {
            const snapTimeout = setTimeout(() => {
                setIsTransitioning(false);
                setVirtualIdx(PLATFORMS_DATA.length + (virtualIdx % PLATFORMS_DATA.length));
            }, 500); // Sincronizado com a duração do transition-transform do slider

            return () => clearTimeout(snapTimeout);
        }
    }, [virtualIdx]);

    /* Geração dinâmica da linha do gráfico (Card 3) */
    const svgPathString = useMemo(() => {
        let d = `M 0 ${getCurveY(0)}`;
        for (let x = 1; x <= 200; x++) {
            d += ` L ${x} ${getCurveY(x)}`;
        }
        return d;
    }, []);

    /* ============================================================ */
    /* Three.js - Inicialização do Olho Minimalista (Card 2)        */
    /* ============================================================ */
    useEffect(() => {
        if (typeof window === "undefined" || !threeContainerRef.current) return;
        const container = threeContainerRef.current;

        const width = container.clientWidth || 280;
        const height = container.clientHeight || 280;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0, 3.2);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // 1. Pálpebras Minimalistas estruturadas usando curvas de Bezier 3D
        const topLidPath = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-0.95, 0, 0),
            new THREE.Vector3(0, 0.55, 0.15),
            new THREE.Vector3(0.95, 0, 0)
        );
        const botLidPath = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-0.95, 0, 0),
            new THREE.Vector3(0, -0.55, 0.15),
            new THREE.Vector3(0.95, 0, 0)
        );

        const topLidGeo = new THREE.TubeGeometry(topLidPath, 40, 0.014, 6, false);
        const botLidGeo = new THREE.TubeGeometry(botLidPath, 40, 0.014, 6, false);

        const lidMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.22
        });

        const topLid = new THREE.Mesh(topLidGeo, lidMat);
        const botLid = new THREE.Mesh(botLidGeo, lidMat);
        scene.add(topLid, botLid);

        // 2. Rig do Globo Ocular Interno (Sem esfera de fundo "sclera" para evitar poluição visual)
        const eyeballRig = new THREE.Group();
        scene.add(eyeballRig);

        // Íris (Anel Vermelho técnico)
        const irisGeo = new THREE.TorusGeometry(0.24, 0.012, 4, 32);
        const irisMat = new THREE.MeshBasicMaterial({
            color: 0xef4444,
            transparent: true,
            opacity: 0.35
        });
        const iris = new THREE.Mesh(irisGeo, irisMat);
        iris.position.z = 0.36; // Ligeiramente à frente na superfície interna
        eyeballRig.add(iris);

        // Pupila (Bolinha central do olho)
        const pupilGeo = new THREE.SphereGeometry(0.1, 16, 16);
        const pupilMat = new THREE.MeshBasicMaterial({
            color: 0xef4444
        });
        const pupil = new THREE.Mesh(pupilGeo, pupilMat);
        pupil.position.z = 0.38; // Posicionado à frente da íris
        eyeballRig.add(pupil);

        let animationFrameId: number;
        let targetRotationX = 0;
        let targetRotationY = 0;

        const onMouseMove = (event: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            // Mapeia coordenadas normalizadas entre -0.5 e 0.5
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            // Armazena alvos rotacionais
            targetRotationY = x * 1.0;
            targetRotationX = y * 1.0;
        };
        container.addEventListener("mousemove", onMouseMove);

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            // Limites rotacionais para evitar que a pupila escape ou atravesse as pálpebras
            const maxRotationY = 0.52;
            const maxRotationX = 0.32;

            const clampedTargetY = Math.max(-maxRotationY, Math.min(maxRotationY, targetRotationY));
            const clampedTargetX = Math.max(-maxRotationX, Math.min(maxRotationX, targetRotationX));

            // Suavização da rotação do globo ocular (Lerp) para olhar o cursor do mouse
            eyeballRig.rotation.y += (clampedTargetY - eyeballRig.rotation.y) * 0.08;
            eyeballRig.rotation.x += (clampedTargetX - eyeballRig.rotation.x) * 0.08;

            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            container.removeEventListener("mousemove", onMouseMove);
            cancelAnimationFrame(animationFrameId);
            topLidGeo.dispose();
            botLidGeo.dispose();
            lidMat.dispose();
            irisGeo.dispose();
            irisMat.dispose();
            pupilGeo.dispose();
            pupilMat.dispose();
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    /* ============================================================ */
    /* Captura de Dados Interativos do Gráfico (Card 3)            */
    /* ============================================================ */
    const handleGraphMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!graphContainerRef.current) return;
        const rect = graphContainerRef.current.getBoundingClientRect();

        // Calcula x relativo exatamente dentro da viewport do gráfico
        const relativeX = (e.clientX - rect.left) / rect.width;
        const xClamped = Math.max(0, Math.min(1, relativeX));
        const x = xClamped * 200; // Mapeia para o viewBox (0 a 200)

        // Obtém o valor real de Y na curva crescente
        const yVal = getCurveY(x);

        // Calcula dia de janeiro baseado no progresso (01/01/2026 até 31/01/2026)
        const day = Math.floor(1 + xClamped * 30);
        const dateLabel = `dia ${String(day).padStart(2, "0")}/01/2026`;

        // Mapeia visualizações crescentes (de 30 views até 25.000 views)
        const viewsVal = Math.round(30 + Math.pow(xClamped, 2.3) * 24970);
        const viewsLabel = `${viewsVal.toLocaleString()} views`;

        setHoverMetric({
            x: x,
            val: yVal,
            dateLabel,
            viewsLabel
        });
    };

    const handleCopyCode = () => {
        const jsonPayload = `{
        "engine": "gemini-3.5-flash",
        "sentiment": "98.5_persuasive",
        "format": "multi_platform_restructure",
        "scannability_index": "0.94"
        }`;
        navigator.clipboard.writeText(jsonPayload);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-[#030304] text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >

            {/* Bento Grid Container */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">

                {/* ============================================================ */}
                {/* CARD 1: PLATFORM CAROUSEL (Grande - 2 Colunas)               */}
                {/* ============================================================ */}
                <div className="relative lg:col-span-2 min-h-[500px] bg-[#050507]/95 border border-white/[0.04] p-6 sm:p-8 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-red-500/15">
                    <div>
                        <span className="text-[9px] font-mono font-semibold text-zinc-600 tracking-widest uppercase">SYS::INTEGRATIONS</span>
                        <h3 className="text-xl sm:text-2xl font-sans font-black uppercase tracking-wide text-white mt-1">
                            {t.sandboxTitle}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed max-w-md">
                            {t.sandboxDesc}
                        </p>
                    </div>

                    {/* Seção Central do Carrossel de Alta Fidelidade (Automático e Sem Glow) */}
                    <div className="my-8 flex flex-col">

                        <div className="relative w-full flex items-center justify-between">
                            {/* Janela de Recorte do Slider */}
                            <div className="overflow-hidden w-full py-3">
                                <div
                                    className={`flex gap-4 ${isTransitioning ? "transition-transform duration-500 ease-out" : ""}`}
                                    style={{
                                        transform: `translateX(calc(50% - ${virtualIdx * (80 + 16) + 40}px))`
                                    }}
                                >
                                    {EXTENDED_PLATFORMS.map((plat, idx) => {
                                        // Verifica se o item renderizado é exatamente o que está centralizado no loop
                                        const isCentered = virtualIdx === idx;
                                        const Icon = plat.icon;

                                        return (
                                            <div
                                                key={`${plat.id}-${idx}`}
                                                className={`flex-shrink-0 w-20 h-20 border flex flex-col items-center justify-center transition-all duration-300 relative rounded-none shadow-none ${isCentered
                                                        ? "bg-red-950/40 border-red-500 text-white scale-110 z-10"
                                                        : "bg-[#030304] border-white/[0.04] text-zinc-500 hover:text-white"
                                                    }`}
                                            >
                                                {/* Ícones com espessura de traço reduzida (strokeWidth=1.2) para ficarem mais finos */}
                                                <Icon strokeWidth={1.2} className={`w-8 h-8 transition-transform duration-300 ${isCentered ? "scale-110" : ""}`} />
                                                <span className="text-[9px] font-mono mt-2 opacity-85 select-none">{plat.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Nome vermelho embaixo do selecionado */}
                        <div className="text-center mt-6 h-6 select-none">
                            <span className="text-red-500 font-mono font-bold tracking-widest uppercase text-xs">
                                {selectedPlat.label}
                            </span>
                        </div>

                    </div>

                    <div className="mt-4 flex items-center gap-2 text-[9px] font-mono text-zinc-600 border-t border-white/[0.03] pt-4 uppercase">
                        <Cpu className="w-3.5 h-3.5 text-red-500 animate-spin" style={{ animationDuration: '6s' }} />
                        <span>sypher_integration_bus // core_connected</span>
                    </div>
                </div>

                {/* ============================================================ */}
                {/* CARD 2: SPACE GRAPHICS (Médio - 1 Coluna)                    */}
                {/* ============================================================ */}
                <div className="relative min-h-[500px] bg-[#050507] border border-white/[0.04] p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-red-500/15">
                    <div>
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-semibold text-zinc-600 tracking-widest uppercase">SYS::VECTORS</span>
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                        </div>

                        <h3 className="text-xl font-sans font-black uppercase tracking-wide text-white mt-2">
                            {t.vectorTitle}
                        </h3>

                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                            {t.vectorDesc}
                        </p>
                    </div>

                    {/* Módulo de Renderização do Canvas do Three.js */}
                    <div className="relative w-full aspect-square flex items-center justify-center my-4 overflow-visible">

                        {/* Grade Técnica Ampliada 2x2 com Losango Central */}
                        <div className="absolute w-[300px] h-[300px] pointer-events-none z-0 flex items-center justify-center">
                            <svg viewBox="0 0 300 300" className="w-full h-full select-none pointer-events-none opacity-40">
                                {/* Linhas da Grade 2x2 preenchendo as extremidades */}
                                <line x1="0" y1="100" x2="300" y2="100" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                                <line x1="0" y1="200" x2="300" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                                <line x1="100" y1="0" x2="100" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                                <line x1="200" y1="0" x2="200" y2="300" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                                {/* Eixos cruzados de marcação central */}
                                <line x1="150" y1="0" x2="150" y2="300" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2 4" />
                                <line x1="0" y1="150" x2="300" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2 4" />

                                {/* Losango Central Tracejado */}
                                <polygon
                                    points="150,50 250,150 150,250 50,150"
                                    fill="none"
                                    stroke="#ef4444"
                                    strokeWidth="1.2"
                                    strokeDasharray="4 4"
                                />
                            </svg>
                        </div>

                        {/* Container do Olho Minimalista Interactável */}
                        <div ref={threeContainerRef} className="w-[280px] h-[280px] z-10 pointer-events-none" />
                    </div>

                    <div className="flex justify-between items-center border-t border-white/[0.03] pt-4">
                        <span className="text-[9px] font-mono text-zinc-500 tracking-wider">
                            {t.vectorStatus}
                        </span>
                        <span className="text-[9px] font-mono text-red-500">
                            CORE_3D_GRID
                        </span>
                    </div>
                </div>

                {/* ============================================================ */}
                {/* CARD 3: RETENTION METRICS (Pequeno - 1 Coluna)               */}
                {/* ============================================================ */}
                <div
                    className="relative min-h-[440px] bg-[#050507] border border-white/[0.04] p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-red-500/15"
                >
                    <div>
                        <span className="text-[9px] font-mono font-semibold text-zinc-600 tracking-widest uppercase">SYS::METRICS</span>
                        <h3 className="text-xl font-sans font-black uppercase tracking-wide text-white mt-1">
                            {t.metricsTitle}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                            {t.metricsDesc}
                        </p>
                    </div>

                    {/* Área interativa e 100% transparente para renderização do gráfico */}
                    <div
                        ref={graphContainerRef}
                        onMouseMove={handleGraphMouseMove}
                        onMouseLeave={() => setHoverMetric(null)}
                        className="w-full h-40 relative flex items-end my-4 select-none cursor-crosshair bg-transparent"
                    >
                        <svg viewBox="0 0 200 100" className="w-full h-full text-red-500" preserveAspectRatio="none">

                            {/* HUD Grid de Fundo */}
                            <line x1="0" y1="10" x2="200" y2="10" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" strokeDasharray="1 3" />
                            <line x1="0" y1="50" x2="200" y2="50" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" strokeDasharray="1 3" />
                            <line x1="0" y1="90" x2="200" y2="90" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" strokeDasharray="1 3" />

                            {/* Linha do Gráfico Crescente Matemática */}
                            <path
                                d={svgPathString}
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="1.2"
                            />

                            {/* Linha de Scanner vertical e ponto exato na curva */}
                            {hoverMetric && (
                                <g>
                                    <line
                                        x1={hoverMetric.x}
                                        y1="0"
                                        x2={hoverMetric.x}
                                        y2="100"
                                        stroke="rgba(239, 68, 68, 0.25)"
                                        strokeWidth="0.8"
                                        strokeDasharray="2 2"
                                    />
                                    <circle
                                        cx={hoverMetric.x}
                                        cy={hoverMetric.val}
                                        r="3.5"
                                        fill="#ffffff"
                                        stroke="#ef4444"
                                        strokeWidth="1"
                                    />
                                </g>
                            )}
                        </svg>

                        {/* Informações flutuantes baseadas na data e views solicitadas */}
                        {hoverMetric && (
                            <div
                                className="absolute bg-black/95 border border-red-500/30 p-2 font-mono text-[9px] pointer-events-none transition-all duration-75 shadow-xl"
                                style={{
                                    left: `${Math.max(10, Math.min(50, (hoverMetric.x / 200) * 100))}%`,
                                    bottom: "12px"
                                }}
                            >
                                <div className="text-zinc-500">{hoverMetric.dateLabel}</div>
                                <div className="text-white font-bold mt-0.5">{hoverMetric.viewsLabel}</div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-mono border-t border-white/[0.03] pt-4">
                        <span className="text-zinc-600 flex items-center gap-1">
                            <Activity className="w-3 h-3 text-red-500" />
                            {t.metricLabel2}
                        </span>
                        <span className="text-emerald-400 font-bold">OPTIMIZED</span>
                    </div>
                </div>

                {/* ============================================================ */}
                {/* CARD 4: HEURISTIC RULES (Pequeno - 1 Coluna)                 */}
                {/* ============================================================ */}
                <div
                    className="relative min-h-[440px] bg-[#050507] border border-white/[0.04] p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-red-500/15"
                >
                    <div>
                        <span className="text-[9px] font-mono font-semibold text-zinc-600 tracking-widest uppercase">SYS::FILTERS</span>
                        <h3 className="text-xl font-sans font-black uppercase tracking-wide text-white mt-1">
                            {t.filtersTitle}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                            {t.filtersDesc}
                        </p>
                    </div>

                    {/* Lista de Toggles Interativos */}
                    <div className="space-y-2 my-4">
                        {t.filtersList.map((filterName, index) => {
                            const active = activeFilters[index];
                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        const next = [...activeFilters];
                                        next[index] = !next[index];
                                        setActiveFilters(next);
                                    }}
                                    className="w-full flex items-center justify-between p-2.5 bg-[#030304] border border-white/[0.03] hover:border-white/[0.08] transition-all duration-300 text-left group"
                                >
                                    <span className="text-[10px] font-mono tracking-wide text-zinc-300 group-hover:text-white transition-colors">
                                        {filterName}
                                    </span>

                                    {/* Chave de Toggle Reduzida */}
                                    <div className={`w-7 h-4 rounded-full p-0.5 transition-colors duration-300 ${active ? "bg-red-500" : "bg-zinc-800"
                                        }`}>
                                        <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-300 ${active ? "translate-x-3" : "translate-x-0"
                                            }`} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-mono border-t border-white/[0.03] pt-4 text-zinc-500">
                        <span>HEURISTIC_PARSER</span>
                        <span className="text-zinc-600">STRICT_MODE</span>
                    </div>
                </div>

                {/* ============================================================ */}
                {/* CARD 5: OUTPUT TERMINAL Beautified (Médio - 1 Coluna)        */}
                {/* ============================================================ */}
                <div className="relative min-h-[440px] bg-[#050507] border border-white/[0.04] p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-red-500/15">
                    <div>
                        <span className="text-[9px] font-mono font-semibold text-zinc-600 tracking-widest uppercase">SYS::OUTPUT</span>
                        <h3 className="text-xl font-sans font-black uppercase tracking-wide text-white mt-1">
                            {t.deliveryTitle}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                            {t.deliveryDesc}
                        </p>
                    </div>

                    {/* Terminal IDE completo de Alta Fidelidade */}
                    <div className="border border-white/[0.04] bg-[#030304] rounded-none overflow-hidden my-4 flex flex-col h-44 shadow-2xl">
                        {/* Header da IDE */}
                        <div className="flex bg-[#070709] border-b border-white/[0.04] px-3 py-2 justify-between items-center select-none">
                            <div className="flex gap-2 items-center">
                                <div className="flex gap-1.5 mr-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
                                </div>

                                {/* Tab Ativa */}
                                <span className="text-[9px] font-mono text-zinc-300 flex items-center gap-1.5">
                                    <TerminalIcon className="w-3 h-3 text-red-500" />
                                    payload.json
                                </span>
                            </div>

                            {/* Botão de cópia técnica */}
                            <button
                                onClick={handleCopyCode}
                                className="flex items-center gap-1.5 px-2 py-0.5 bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all border border-white/[0.04] rounded-none text-[8.5px] font-mono"
                            >
                                {copied ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                                <span>{copied ? t.copiedLabel : "Copy"}</span>
                            </button>
                        </div>

                        {/* Conteúdo com Syntax Highlighting e linhas */}
                        <div className="p-3 bg-[#030304]/95 font-mono text-[9px] leading-relaxed text-zinc-400 overflow-y-auto flex-1 flex gap-3">
                            {/* Linhas de numeração do código */}
                            <div className="text-zinc-600 text-right select-none pr-1">
                                <div>01</div>
                                <div>02</div>
                                <div>03</div>
                                <div>04</div>
                                <div>05</div>
                                <div>06</div>
                            </div>

                            {/* Código json formatado */}
                            <div className="space-y-0.5 flex-1 select-text">
                                <div><span className="text-zinc-500">&#123;</span></div>
                                <div className="pl-3"><span className="text-rose-400">"engine"</span>: <span className="text-emerald-400">"gemini-3.5-flash"</span>,</div>
                                <div className="pl-3"><span className="text-rose-400">"sentiment"</span>: <span className="text-emerald-400">"98.5_persuasive"</span>,</div>
                                <div className="pl-3"><span className="text-rose-400">"format"</span>: <span className="text-emerald-400">"multi_platform"</span>,</div>
                                <div className="pl-3"><span className="text-rose-400">"scannability"</span>: <span className="text-amber-400">0.94</span></div>
                                <div><span className="text-zinc-500">&#125;</span></div>
                            </div>
                        </div>

                        {/* Rodapé da IDE com Informações de Estado */}
                        <div className="flex bg-[#070709] border-t border-white/[0.04] px-3 py-1 justify-between text-[8px] font-mono text-zinc-600 select-none">
                            <span className="flex items-center gap-1">
                                <Settings className="w-2.5 h-2.5 text-zinc-500" />
                                UTF-8
                            </span>
                            <span className="flex items-center gap-1">
                                <Flame className="w-2.5 h-2.5 text-red-500" />
                                Sypher-Engine-v3.5
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-[9px] font-mono border-t border-white/[0.03] pt-4">
                        <span className="text-emerald-500 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            FORMAT_READY
                        </span>
                        <span className="text-zinc-600">MD | JSON | TEXT</span>
                    </div>
                </div>

            </div>
        </section>
    );
}