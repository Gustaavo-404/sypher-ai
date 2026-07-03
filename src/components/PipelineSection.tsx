import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type Language = "pt" | "en" | "es";

interface PipelineSectionProps {
    lang: Language;
}

/* ============================================================ */
/* Conteúdo localizado                                           */
/* ============================================================ */

const COPY: Record<
    Language,
    {
        pipelineTitle: string;
        pipelineHeadline: string;
        pipelineSub: string;
        introTag: string;
        introTitle: string;
        introDesc: string;
        layer1Tag: string;
        layer1Title: string;
        layer1Desc: string;
        layer2Tag: string;
        layer2Title: string;
        layer2Desc: string;
        layer3Tag: string;
        layer3Title: string;
        layer3Desc: string;
        activeText: string;
        scrollHint: string;
    }
> = {
    pt: {
        pipelineTitle: "ARQUITETURA SYPHER",
        pipelineHeadline: "POR DENTRO DO NÚCLEO",
        pipelineSub: "Três camadas de processamento trabalhando em conjunto para refinar cada palavra.",
        introTag: "SYS::INIT",
        introTitle: "Uma arquitetura,\ntrês camadas",
        introDesc: "Cada texto que você escreve passa por um núcleo de processamento dividido em camadas independentes. Continue rolando para ver cada uma se separar.",
        layer1Tag: "CAMADA 01 · NÚCLEO",
        layer1Title: "Core Process",
        layer1Desc: "Motor Gemini 3.5 dedicado à geração de texto. Interpreta intenção, contexto e tom a partir do seu rascunho bruto em milissegundos.",
        layer2Tag: "CAMADA 02 · ANÁLISA",
        layer2Title: "Context Engine",
        layer2Desc: "Camada de análise semântica que entende plataforma, audiência e objetivo, ajustando estrutura e ritmo do texto automaticamente.",
        layer3Tag: "CAMADA 03 · ENTREGA",
        layer3Title: "Output Layer",
        layer3Desc: "Camada final de validação e formatação. Aplica suas regras, remove ruído e exporta o resultado pronto para publicação.",
        activeText: "EM PROCESSAMENTO",
        scrollHint: "SCROLL PARA EXPLORAR",
    },
    en: {
        pipelineTitle: "SYPHER ARCHITECTURE",
        pipelineHeadline: "INSIDE THE CORE",
        pipelineSub: "Three processing layers working together to refine every word.",
        introTag: "SYS::INIT",
        introTitle: "One architecture,\nthree layers",
        introDesc: "Every text you write passes through a processing core split into independent layers. Keep scrolling to see each one separate.",
        layer1Tag: "LAYER 01 · CORE",
        layer1Title: "Core Process",
        layer1Desc: "Gemini 3.5 engine dedicated to text generation. Reads intent, context and tone from your raw draft in milliseconds.",
        layer2Tag: "LAYER 02 · ANALYSIS",
        layer2Title: "Context Engine",
        layer2Desc: "Semantic analysis layer that understands platform, audience and goal, adjusting structure and rhythm automatically.",
        layer3Tag: "LAYER 03 · DELIVERY",
        layer3Title: "Output Layer",
        layer3Desc: "Final validation and formatting layer. Applies your rules, strips noise and exports a publish-ready result.",
        activeText: "PROCESSING",
        scrollHint: "SCROLL TO EXPLORE",
    },
    es: {
        pipelineTitle: "ARQUITECTURA SYPHER",
        pipelineHeadline: "DENTRO DEL NÚCLEO",
        pipelineSub: "Tres capas de procesamiento trabajando juntas para refinar cada palabra.",
        introTag: "SYS::INIT",
        introTitle: "Una arquitectura,\ntres capas",
        introDesc: "Cada texto que escribes pasa por un núcleo de procesamiento dividido em capas independientes. Sigue desplazándote para ver cómo se separan.",
        layer1Tag: "CAPA 01 · NÚCLEO",
        layer1Title: "Core Process",
        layer1Desc: "Motor Gemini 3.5 dedicado a la geração de texto. Interpreta intención, contexto y tono de tu borrador em milisegundos.",
        layer2Tag: "CAPA 02 · ANÁLISIS",
        layer2Title: "Context Engine",
        layer2Desc: "Capa de análisis semántico que entiende plataforma, audiencia y objetivo, ajustando estructura y ritmo del texto.",
        layer3Tag: "CAPA 03 · ENTREGA",
        layer3Title: "Output Layer",
        layer3Desc: "Capa final de validación y formato. Aplica tus regras, elimina ruído y exporta el resultado listo para publicar.",
        activeText: "PROCESANDO",
        scrollHint: "DESPLÁZATE PARA EXPLORAR",
    },
};

const LAYER_KEYS = ["layer1", "layer2", "layer3"] as const;

/* ============================================================ */
/* Terminais de Código Estilizados (Sub-componentes)             */
/* ============================================================ */

function CoreTerminal() {
    return (
        <div className="terminal-code font-mono text-[11px] sm:text-[11.5px] leading-relaxed text-zinc-400 space-y-1.5">
            <div className="terminal-line"><span className="text-rose-500">async function</span> <span className="text-sky-400">runCore</span>(draft: <span className="text-amber-400">string</span>) &#123;</div>
            <div className="terminal-line pl-3"><span className="text-rose-500">const</span> prompt = <span className="text-emerald-400">{"`[Sypher Engine v3.5] ${draft}`"}</span>;</div>
            <div className="terminal-line pl-3"><span className="text-rose-500">try</span> &#123;</div>
            <div className="terminal-line pl-6"><span className="text-rose-500">return await</span> <span className="text-sky-400">callGeminiWithRetry</span>(ai, &#123;</div>
            <div className="terminal-line pl-9">model: <span className="text-emerald-400">"gemini-3.5-flash"</span>,</div>
            <div className="terminal-line pl-9">contents: prompt</div>
            <div className="terminal-line pl-6">&#125;);</div>
            <div className="terminal-line pl-3">&#125; <span className="text-rose-500">catch</span> (err) &#123;</div>
            <div className="terminal-line pl-6"><span className="text-rose-500">return await</span> <span className="text-sky-400">fallbackToLite</span>(ai, prompt);</div>
            <div className="terminal-line pl-3">&#125;</div>
            <div className="terminal-line">&#125;</div>
        </div>
    );
}

function HeuristicsTerminal() {
    return (
        <div className="terminal-code font-mono text-[11px] sm:text-[11.5px] leading-relaxed text-zinc-400 space-y-1.5">
            <div className="terminal-line"><span className="text-rose-500">function</span> <span className="text-sky-400">analyzeContext</span>(text: <span className="text-amber-400">string</span>) &#123;</div>
            <div className="terminal-line pl-3"><span className="text-rose-500">const</span> lower = text.<span className="text-sky-400">toLowerCase</span>();</div>
            <div className="terminal-line pl-3"><span className="text-rose-500">const</span> isTech = lower.<span className="text-sky-400">includes</span>(<span className="text-emerald-400">"dev"</span>) || lower.<span className="text-sky-400">includes</span>(<span className="text-emerald-400">"vaga"</span>);</div>
            <div className="terminal-line pl-3"><span className="text-rose-500">const</span> isBiz = lower.<span className="text-sky-400">includes</span>(<span className="text-emerald-400">"leads"</span>) || lower.<span className="text-sky-400">includes</span>(<span className="text-emerald-400">"sales"</span>);</div>
            <div className="terminal-line pl-3"><span className="text-rose-500">const</span> theme = isTech ? <span className="text-emerald-400">"tech_career"</span> : isBiz ? <span className="text-emerald-400">"business"</span> : <span className="text-emerald-400">"general"</span>;</div>
            <div className="terminal-line pl-3"><span className="text-rose-500">return</span> &#123;</div>
            <div className="terminal-line pl-6">theme,</div>
            <div className="terminal-line pl-6">tone: <span className="text-emerald-400">"PERSUASIVO"</span>,</div>
            <div className="terminal-line pl-6">confidence: <span className="text-sky-400">0.98</span></div>
            <div className="terminal-line pl-3">&#125;;</div>
            <div className="terminal-line">&#125;</div>
        </div>
    );
}

function PayloadTerminal() {
    return (
        <div className="terminal-code font-mono text-[11px] sm:text-[11.5px] leading-relaxed text-zinc-400 space-y-1.5">
            <div className="terminal-line">&#123;</div>
            <div className="terminal-line pl-3"><span className="text-sky-400">"status"</span>: <span className="text-emerald-400">"success"</span>,</div>
            <div className="terminal-line pl-3"><span className="text-sky-400">"format"</span>: <span className="text-emerald-400">"linkedin_post"</span>,</div>
            <div className="terminal-line pl-3"><span className="text-sky-400">"latency"</span>: <span className="text-emerald-400">"142ms"</span>,</div>
            <div className="terminal-line pl-3"><span className="text-sky-400">"data"</span>: &#123;</div>
            <div className="terminal-line pl-6"><span className="text-sky-400">"text"</span>: <span className="text-emerald-400">"Hoje fechamos uma parceria com a Delta..."</span>,</div>
            <div className="terminal-line pl-6"><span className="text-sky-400">"isSimulated"</span>: <span className="text-rose-500">false</span>,</div>
            <div className="terminal-line pl-6"><span className="text-sky-400">"engine"</span>: <span className="text-emerald-400">"gemini-3.5-flash"</span></div>
            <div className="terminal-line pl-3">&#125;</div>
            <div className="terminal-line">&#125;</div>
        </div>
    );
}

/* ============================================================ */
/* Three.js — Construção manual do modelo do processador         */
/* ============================================================ */

function createChipOutline(size: number, notch: number): THREE.Shape {
    const s = size / 2;
    const n = notch;
    const shape = new THREE.Shape();

    shape.moveTo(-s + n, -s);
    shape.lineTo(s - n, -s);
    shape.lineTo(s, -s + n);
    shape.lineTo(s, s * 0.05);
    shape.lineTo(s - n * 0.7, s * 0.05);
    shape.lineTo(s - n * 0.7, s * 0.35);
    shape.lineTo(s, s * 0.35);
    shape.lineTo(s, s - n);
    shape.lineTo(s - n, s);
    shape.lineTo(-s + n, s);
    shape.lineTo(-s, s - n);
    shape.lineTo(-s, -s + n);
    shape.closePath();

    return shape;
}

interface ChipLayer {
    group: THREE.Group;
    solid: THREE.Mesh;
    wire: THREE.LineSegments;
}

function buildChipLayer(
    size: number,
    thickness: number,
    notch: number,
    solidColor: number,
    wireColor: number,
    wireOpacity: number
): ChipLayer {
    const shape = createChipOutline(size, notch);
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: thickness,
        bevelEnabled: true,
        bevelThickness: 0.015,
        bevelSize: 0.015,
        bevelSegments: 1,
        curveSegments: 1,
    };
    const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geo.rotateX(-Math.PI / 2);
    geo.translate(0, -thickness / 2, 0);

    const solidMat = new THREE.MeshBasicMaterial({
        color: solidColor,
        transparent: true,
        opacity: 0.97,
    });
    const solid = new THREE.Mesh(geo, solidMat);

    const edgesGeo = new THREE.EdgesGeometry(geo, 1);
    const lineMat = new THREE.LineBasicMaterial({
        color: wireColor,
        transparent: true,
        opacity: wireOpacity,
    });
    const wire = new THREE.LineSegments(edgesGeo, lineMat);

    const group = new THREE.Group();
    group.add(solid);
    group.add(wire);

    return { group, solid, wire };
}

function buildCoreSymbol(radius: number, color: number): THREE.Group {
    const group = new THREE.Group();
    const armCount = 3;
    const armGeo = new THREE.BoxGeometry(radius * 2, 0.045, 0.07);

    for (let i = 0; i < armCount; i++) {
        const mat = new THREE.MeshBasicMaterial({ color });
        const arm = new THREE.Mesh(armGeo, mat);
        arm.rotation.y = (Math.PI / armCount) * i;
        group.add(arm);
    }
    return group;
}

/* ============================================================ */
/* Componente Principal                                          */
/* ============================================================ */

export default function PipelineSection({ lang }: PipelineSectionProps) {
    const t = COPY[lang] || COPY.en;

    const sectionRef = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const particleCanvasRef = useRef<HTMLCanvasElement>(null);
    const bgOverlayRef = useRef<HTMLDivElement>(null); // Ref para a camada preta progressiva
    const introTextRef = useRef<HTMLDivElement>(null);
    const layerTextRefs = useRef<(HTMLDivElement | null)[]>([]);
    const barRefs = useRef<(HTMLSpanElement | null)[]>([]); 
    const scrollHintRef = useRef<HTMLDivElement>(null);

    // Ref para rastrear a fase atual do background (0: Binário, 1: Decimal, 2: Partículas, 3: Limpo)
    const activePhaseRef = useRef<number>(0);

    const langRef = useRef(lang);
    langRef.current = lang;

    /* ---------------- Three.js, ScrollTrigger & Background Canvas ---------------- */
    useLayoutEffect(() => {
        // Ignora toda a inicialização do Three.js e do GSAP no mobile
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        const container = canvasContainerRef.current;
        const pinEl = pinRef.current;
        const sectionEl = sectionRef.current;
        const canvas = particleCanvasRef.current;
        const bgOverlay = bgOverlayRef.current;
        if (!container || !pinEl || !sectionEl || !canvas || !bgOverlay) return;

        const reducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        let width = container.clientWidth || 1;
        let height = container.clientHeight || 1;

        /* ---------------- Cena, câmera, renderer (Three.js) ---------------- */
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
        const ISO_POS = new THREE.Vector3(5.4, 4.6, 5.4);
        const FRONT_POS = new THREE.Vector3(0, 0, 7.2);
        camera.position.copy(ISO_POS);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        const rig = new THREE.Group();
        rig.scale.set(0.58, 0.58, 0.58);
        scene.add(rig);
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        /* ---------------- Camadas do chip ---------------- */
        const SOLID_COLOR = 0x0a0a0d;
        const WIRE_COLOR = 0xf2f2f2;

        const layerSize = 4.6;
        const layerThickness = 0.16;
        const notch = 0.55;

        const layerTop = buildChipLayer(layerSize, layerThickness, notch, SOLID_COLOR, WIRE_COLOR, 0.55);
        const layerMid = buildChipLayer(layerSize * 0.93, layerThickness, notch * 0.9, SOLID_COLOR, WIRE_COLOR, 0.4);
        const layerBot = buildChipLayer(layerSize * 0.86, layerThickness, notch * 0.8, SOLID_COLOR, WIRE_COLOR, 0.3);

        const STACK_GAP = 0.22;
        layerTop.group.position.y = STACK_GAP;
        layerMid.group.position.y = 0;
        layerBot.group.position.y = -STACK_GAP;

        rig.add(layerTop.group, layerMid.group, layerBot.group);

        const symbol = buildCoreSymbol(0.65, 0xef4444);
        symbol.position.y = layerThickness / 2 + 0.04;
        layerTop.group.add(symbol);

        const layers = [layerTop, layerMid, layerBot];

        /* ---------------- Configuração do Canvas de Fundo ---------------- */
        const ctx = canvas.getContext("2d");
        let bgWidth = (canvas.width = canvas.offsetWidth);
        let bgHeight = (canvas.height = canvas.offsetHeight);

        // Chuva digital estilo Matrix (Fases 0 e 1)
        const fontSize = 11;
        let columns = Math.floor(bgWidth / 24);
        let drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * -15));

        // Partículas sutil de Redes Neurais (Fase 2)
        const particleCount = 65;
        const particles: Array<{
            x: number;
            y: number;
            vx: number;
            vy: number;
            radius: number;
            color: string;
        }> = [];

        for (let i = 0; i < particleCount; i++) {
            const isRed = Math.random() > 0.35;
            particles.push({
                x: Math.random() * bgWidth,
                y: Math.random() * bgHeight,
                vx: (Math.random() - 0.5) * 0.32,
                vy: (Math.random() - 0.5) * 0.32,
                radius: Math.random() * 1.5 + 0.8,
                color: isRed ? "rgba(239, 68, 68, 0.4)" : "rgba(255, 255, 255, 0.2)",
            });
        }

        /* ---------------- Resize comum ---------------- */
        const onResize = () => {
            width = container.clientWidth;
            height = container.clientHeight;
            if (width === 0 || height === 0) return;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);

            if (canvas) {
                bgWidth = canvas.width = canvas.offsetWidth;
                bgHeight = canvas.height = canvas.offsetHeight;
                columns = Math.floor(bgWidth / 24);
                drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * -15));
            }
        };
        window.addEventListener("resize", onResize);

        /* ---------------- Render loop unificado (3D + Background Canvas) ---------------- */
        let rafId: number;
        let currentTransitionAlpha = 1.0;
        let currentRenderedPhase = 0;

        const renderLoop = () => {
            // Renderiza cena Three.js
            renderer.render(scene, camera);

            // Renderiza Canvas de Fundo se houver contexto ativo
            if (ctx && canvas) {
                ctx.clearRect(0, 0, bgWidth, bgHeight);

                // Gerenciador de esmaecimento suave (cross-fade) na troca de fases
                if (currentRenderedPhase !== activePhaseRef.current) {
                    currentTransitionAlpha -= 0.05; // Fade-out do plano de fundo anterior
                    if (currentTransitionAlpha <= 0) {
                        currentRenderedPhase = activePhaseRef.current;
                        currentTransitionAlpha = 0;
                    }
                } else if (currentTransitionAlpha < 1) {
                    currentTransitionAlpha += 0.05; // Fade-in do novo plano de fundo
                    if (currentTransitionAlpha > 1) currentTransitionAlpha = 1;
                }

                ctx.globalAlpha = currentTransitionAlpha;

                if (currentRenderedPhase === 0 || currentRenderedPhase === 1) {
                    // Chuva Digital Matrix Sutil (Fase 0: Binário | Fase 1: Decimal)
                    ctx.font = `bold ${fontSize}px monospace`;
                    for (let i = 0; i < columns; i++) {
                        const headY = drops[i];
                        for (let j = 0; j < 12; j++) {
                            const currentY = Math.floor(headY) - j;
                            if (currentY < 0 || currentY * fontSize > bgHeight) continue;

                            // Esmaecimento ao longo da cauda
                            const alpha = (1 - j / 12) * 0.08;
                            ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`;

                            const char = currentRenderedPhase === 0
                                ? ((currentY + i) % 2 === 0 ? "1" : "0") // Binário
                                : ((currentY + i) % 10).toString();      // Decimal

                            ctx.fillText(char, i * 24, currentY * fontSize);
                        }

                        drops[i] += 0.35; // Deslocamento lento e sutil
                        if (drops[i] * fontSize > bgHeight && Math.random() > 0.975) {
                            drops[i] = -12; // Reseta acima da tela para suavizar o surgimento
                        }
                    }
                } else if (currentRenderedPhase === 2) {
                    // Partículas de Rede Neural Simplificado e Sutil
                    ctx.lineWidth = 0.65;
                    for (let i = 0; i < particleCount; i++) {
                        const p1 = particles[i];
                        for (let j = i + 1; j < particleCount; j++) {
                            const p2 = particles[j];
                            const dx = p1.x - p2.x;
                            const dy = p1.y - p2.y;
                            const dist = Math.sqrt(dx * dx + dy * dy);

                            if (dist < 115) {
                                const alpha = (1 - dist / 115) * 0.12;
                                ctx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
                                ctx.beginPath();
                                ctx.moveTo(p1.x, p1.y);
                                ctx.lineTo(p2.x, p2.y);
                                ctx.stroke();
                            }
                        }
                    }

                    for (let i = 0; i < particleCount; i++) {
                        const p = particles[i];
                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                        ctx.fill();

                        p.x += p.vx;
                        p.y += p.vy;

                        if (p.x < 0 || p.x > bgWidth) p.vx *= -1;
                        if (p.y < 0 || p.y > bgHeight) p.vy *= -1;
                    }
                } else if (currentRenderedPhase === 3) {
                    // Fase 3: Fundo limpo (Não desenha nada, mantém canvas limpo)
                }

                ctx.globalAlpha = 1.0;
            }

            rafId = requestAnimationFrame(renderLoop);
        };
        renderLoop();

        /* ---------------- GSAP ScrollTrigger ---------------- */
        const textBlocks = layerTextRefs.current.filter(Boolean) as HTMLDivElement[];
        const bars = barRefs.current.filter(Boolean) as HTMLSpanElement[];

        let gsapCtx: gsap.Context | null = null;

        if (reducedMotion) {
            gsap.set(textBlocks, { opacity: 0 });
            gsap.set(bars, { scaleX: 1 });
            if (textBlocks[0]) gsap.set(textBlocks[0], { opacity: 1 });
            if (introTextRef.current) gsap.set(introTextRef.current, { opacity: 0 });
            gsap.set(bgOverlay, { opacity: 1 });
        } else {
            gsapCtx = gsap.context(() => {
                const mm = gsap.matchMedia();

                mm.add("(min-width: 768px)", () => {
                    gsap.set(textBlocks, { opacity: 0, y: 24 });
                    gsap.set(bars, { scaleX: 0 });
                    gsap.set(bgOverlay, { opacity: 0 });
                    if (scrollHintRef.current) gsap.set(scrollHintRef.current, { opacity: 1 });
                    if (introTextRef.current) gsap.set(introTextRef.current, { opacity: 1, y: 0 });

                    const CENTER_Y = 0;
                    const WAIT_BELOW_Y = -2.6;
                    const EXIT_ABOVE_Y = 4.2;

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: pinEl,
                            start: "top top",
                            end: "+=400%",
                            scrub: 1,
                            pin: true,
                            anticipatePin: 1,
                            refreshPriority: 2,
                            // Atualização das fases do background sincronizadas com a rolagem
                            onUpdate: (self) => {
                                const progress = self.progress;
                                if (progress < 0.28) {
                                    activePhaseRef.current = 0; // Matrix Binário (SYS::INIT)
                                } else if (progress < 0.56) {
                                    activePhaseRef.current = 1; // Matrix Decimal (Core Process)
                                } else if (progress < 0.82) {
                                    activePhaseRef.current = 2; // Partículas (Context Engine)
                                } else {
                                    activePhaseRef.current = 3; // Limpo (Output Layer)
                                }
                            }
                        },
                    });

                    // Escurecimento progressivo do fundo (do início ao fim do timeline) [4]
                    tl.to(bgOverlay, {
                        opacity: 1,
                        duration: 1.0,
                        ease: "none"
                    }, 0);

                    // FASE 0 (0 -> 0.12): card de abertura ativo.
                    if (introTextRef.current) {
                        tl.to(introTextRef.current, { opacity: 0, y: -16, duration: 0.06 }, 0.06);
                    }
                    if (scrollHintRef.current) {
                        tl.to(scrollHintRef.current, { opacity: 0, duration: 0.05 }, 0);
                    }

                    // FASE 1 (0.10 -> 0.26): separação vertical das 3 camadas.
                    tl.to(layerTop.group.position, { y: 1.05, duration: 0.16, ease: "power2.inOut" }, 0.10);
                    tl.to(layerMid.group.position, { y: 0, duration: 0.16, ease: "power2.inOut" }, 0.10);
                    tl.to(layerBot.group.position, { y: -1.05, duration: 0.16, ease: "power2.inOut" }, 0.10);
                    tl.to(symbol.scale, { x: 0, y: 0, z: 0, duration: 0.08, ease: "power1.in" }, 0.10);

                    // FASE 2 (0.28 -> 0.44): câmera vai para frontal; camada 1 assume o centro.
                    tl.to(camera.position, {
                        x: FRONT_POS.x,
                        y: FRONT_POS.y,
                        z: FRONT_POS.z,
                        duration: 0.16,
                        ease: "power2.inOut",
                        onUpdate: () => camera.lookAt(0, 0, 0),
                    }, 0.28);

                    tl.to(layerTop.group.position, { y: CENTER_Y, duration: 0.16, ease: "power2.inOut" }, 0.28);
                    tl.to(layerTop.group.rotation, { y: "+=" + Math.PI * 2, duration: 0.16, ease: "power2.inOut" }, 0.28);
                    tl.to(layerMid.group.position, { y: WAIT_BELOW_Y, duration: 0.16, ease: "power2.inOut" }, 0.28);
                    tl.to(layerBot.group.position, { y: WAIT_BELOW_Y, duration: 0.16, ease: "power2.inOut" }, 0.28);

                    if (textBlocks[0]) {
                        tl.to(textBlocks[0], { opacity: 1, y: 0, duration: 0.08 }, 0.38);
                        const lines = textBlocks[0].querySelectorAll('.terminal-line');
                        if (lines.length) {
                            tl.to(lines, { opacity: 1, x: 0, stagger: 0.01, duration: 0.08 }, 0.40);
                        }
                    }
                    // Preenchimento da barra do Card 1 conforme o progresso do scroll de sua fase
                    if (bars[0]) {
                        tl.fromTo(bars[0], { scaleX: 0 }, { scaleX: 1, duration: 0.16, ease: "none" }, 0.38);
                    }

                    // FASE 4 (0.54 -> 0.72): camada 1 sai; camada 2 assume o centro.
                    if (textBlocks[0]) {
                        tl.to(textBlocks[0], { opacity: 0, y: -24, duration: 0.06 }, 0.54);
                    }
                    tl.to(layerTop.group.position, { y: EXIT_ABOVE_Y, duration: 0.16, ease: "power2.inOut" }, 0.56);
                    tl.to(layerTop.group.rotation, { y: "+=" + -Math.PI * 2, duration: 0.16, ease: "power1.in" }, 0.56);

                    tl.to(layerMid.group.position, { y: CENTER_Y, duration: 0.16, ease: "power2.inOut" }, 0.56);
                    tl.to(layerMid.group.rotation, { y: "+=" + Math.PI * 2, duration: 0.16, ease: "power2.inOut" }, 0.56);

                    if (textBlocks[1]) {
                        tl.to(textBlocks[1], { opacity: 1, y: 0, duration: 0.08 }, 0.66);
                        const lines = textBlocks[1].querySelectorAll('.terminal-line');
                        if (lines.length) {
                            tl.to(lines, { opacity: 1, x: 0, stagger: 0.01, duration: 0.08 }, 0.68);
                        }
                    }
                    // Preenchimento da barra do Card 2 conforme o progresso do scroll de sua fase
                    if (bars[1]) {
                        tl.fromTo(bars[1], { scaleX: 0 }, { scaleX: 1, duration: 0.14, ease: "none" }, 0.66);
                    }

                    // FASE 6 (0.80 -> 0.98): camada 2 sai; camada 3 assume o centro.
                    if (textBlocks[1]) {
                        tl.to(textBlocks[1], { opacity: 0, y: -24, duration: 0.06 }, 0.80);
                    }
                    tl.to(layerMid.group.position, { y: EXIT_ABOVE_Y, duration: 0.16, ease: "power2.inOut" }, 0.82);
                    tl.to(layerMid.group.rotation, { y: "+=" + -Math.PI * 2, duration: 0.16, ease: "power1.in" }, 0.82);

                    tl.to(layerBot.group.position, { y: CENTER_Y, duration: 0.16, ease: "power2.inOut" }, 0.82);
                    tl.to(layerBot.group.rotation, { y: "+=" + Math.PI * 2, duration: 0.16, ease: "power2.inOut" }, 0.82);

                    if (textBlocks[2]) {
                        tl.to(textBlocks[2], { opacity: 1, y: 0, duration: 0.08 }, 0.92);
                        const lines = textBlocks[2].querySelectorAll('.terminal-line');
                        if (lines.length) {
                            tl.to(lines, { opacity: 1, x: 0, stagger: 0.01, duration: 0.08 }, 0.94);
                        }
                    }
                    // Preenchimento da barra do Card 3 conforme o progresso do scroll de sua fase
                    if (bars[2]) {
                        tl.fromTo(bars[2], { scaleX: 0 }, { scaleX: 1, duration: 0.08, ease: "none" }, 0.92);
                    }

                    return () => {
                        tl.kill();
                    };
                });
            }, sectionEl);

            requestAnimationFrame(() => ScrollTrigger.refresh());
        }

        /* ---------------- Cleanup ---------------- */
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", onResize);
            gsapCtx?.revert();
            layers.forEach(({ solid, wire }) => {
                solid.geometry.dispose();
                (solid.material as THREE.Material).dispose();
                wire.geometry.dispose();
                (wire.material as THREE.Material).dispose();
            });
            renderer.dispose();
            if (renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative w-full bg-[#230607] overflow-hidden"
        >

            {/* Gradiente de transição no rodapé com z-10 (ficará posicionado atrás do pinRef) e altura reduzida */}
            <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-[#030304] via-[#030304]/80 to-transparent pointer-events-none z-10" />
            
            {/* Cabeçalho */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-4 pb-4 relative z-20 w-full flex justify-center">
                <div className="flex items-center gap-4 max-w-2xl">
                    <img
                        src="/img/icons/cs3.png"
                        alt=""
                        className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain opacity-60 select-none pointer-events-none flex-shrink-0"
                    />
                    <div className="text-left">
                        <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-red-500">
                            {t.pipelineTitle}
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-black tracking-wider text-white uppercase mt-2">
                            {t.pipelineHeadline}
                        </h2>
                        <p className="text-xs text-zinc-400 mt-2">{t.pipelineSub}</p>
                    </div>
                </div>
            </div>

            {/* Área de conteúdo - H-SCREEN apenas no Desktop para fixação, auto no Mobile */}
            <div 
                ref={pinRef} 
                className="relative h-auto md:h-screen w-full overflow-visible md:overflow-hidden z-30 bg-gradient-to-b from-[#230607] to-[#030304]"
            >
                {/* Camada preta de sobreposição que realiza o fade-in progressivo para preto (#030304) [4] */}
                <div 
                    ref={bgOverlayRef}
                    className="absolute inset-0 bg-[#030304] pointer-events-none z-0 opacity-0"
                />

                {/* Canvas de Fundo Unificado (z-1 posicionado sobre o overlay preto de fundo para manter os efeitos brilhando) */}
                <canvas 
                    ref={particleCanvasRef} 
                    className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-0"
                />

                <div className="relative h-auto md:h-full w-full flex flex-col md:flex-row items-center justify-center py-10 md:py-0">
                    
                    {/* Container do Canvas Three.js + HUD Holográfico de Fundo - Ocultado em Mobile */}
                    <div className="hidden md:flex relative w-full md:w-[42%] h-[46vh] md:h-full flex-shrink-0 items-center justify-center md:-translate-x-8 lg:-translate-x-12">
                        
                        {/* HUD DE BACKGROUND DO MODELO 3D */}
                        <div className="absolute w-[360px] h-[360px] md:w-[480px] md:h-[480px] pointer-events-none z-0 flex items-center justify-center">
                            <svg viewBox="0 0 300 300" className="w-full h-full select-none pointer-events-none">
                                {/* Cantoneiras HUD de mira do Radar */}
                                <path d="M 12 24 L 12 12 L 24 12" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
                                <path d="M 288 24 L 288 12 L 276 12" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
                                <path d="M 12 276 L 12 288 L 24 288" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
                                <path d="M 288 276 L 288 288 L 276 288" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />

                                {/* Eixos do Radar */}
                                <line x1="150" y1="20" x2="150" y2="280" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="3 9" />
                                
                                {/* Linhas horizontais de grade técnica */}
                                <line x1="60" x2="240" y1="80" y2="80" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 5" />
                                <line x1="20" x2="280" y1="150" y2="150" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="1 3" />
                                <line x1="60" x2="240" y1="220" y2="220" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 5" />

                                {/* Anéis de Rotação Concéntricos */}
                                <g className="animate-slow-spin origin-center">
                                    <circle
                                        cx="150"
                                        cy="150"
                                        r="128"
                                        fill="none"
                                        stroke="rgba(239, 68, 68, 0.42)"
                                        strokeWidth="1.2"
                                        strokeDasharray="3 14"
                                    />
                                    <circle
                                        cx="150"
                                        cy="150"
                                        r="110"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.14)"
                                        strokeWidth="1"
                                        strokeDasharray="40 15"
                                    />
                                </g>

                                {/* Anel Principal Estático de Referência e Anel Auxiliar de Contra-Rotação */}
                                <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
                                <circle 
                                    cx="150" 
                                    cy="150" 
                                    r="120" 
                                    fill="none" 
                                    stroke="rgba(239, 68, 68, 0.48)" 
                                    strokeWidth="1.5" 
                                    strokeDasharray="80 180" 
                                    className="animate-slow-reverse origin-center" 
                                />
                            </svg>
                        </div>

                        {/* Elemento de Render do Three.js */}
                        <div
                            ref={canvasContainerRef}
                            className="relative w-full h-full flex-shrink-0 z-10"
                        />
                    </div>

                    {/* Container de Texto Responsivo */}
                    <div className="relative w-full md:w-[55%] px-4 sm:px-6 lg:px-8 xl:px-12 max-w-xl md:max-w-3xl h-auto md:h-full flex items-center justify-center z-20 py-8 md:py-0">
                        <div className="relative w-full h-auto md:h-full flex flex-col justify-start md:flex md:items-center">
                            
                            {/* Bloco de Abertura - Centralizado apenas no celular */}
                            <div ref={introTextRef} className="relative md:absolute md:inset-0 md:flex md:items-center mb-8 md:mb-0">
                                <div className="relative px-4 md:px-0 md:pl-6 lg:pl-8 py-2 w-full flex flex-col items-center md:items-start text-center md:text-left">
                                    
                                    <span className="text-[11px] font-mono font-black uppercase tracking-[0.3em] text-red-500 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                        {t.introTag}
                                    </span>
                                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black text-white uppercase tracking-wider mt-4 leading-[1.15] max-w-2xl whitespace-pre-line">
                                        {t.introTitle}
                                    </h3>
                                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans mt-5 max-w-2xl">
                                        {t.introDesc}
                                    </p>

                                    {/* 3 mini-cards sem background divididos por barras verticais - Centralizados apenas no celular */}
                                    <div className="mt-8 flex items-center justify-center md:justify-start divide-x divide-white/[0.08] select-none">
                                        <div className="pr-5 flex flex-col">
                                            <span className="font-mono text-[9px] text-red-500 font-bold tracking-widest uppercase">L01</span>
                                            <span className="text-xs font-sans font-black text-white uppercase tracking-wider mt-1">Core</span>
                                        </div>
                                        <div className="px-5 flex flex-col">
                                            <span className="font-mono text-[9px] text-red-500 font-bold tracking-widest uppercase">L02</span>
                                            <span className="text-xs font-sans font-black text-white uppercase tracking-wider mt-1">Context</span>
                                        </div>
                                        <div className="pl-5 flex flex-col">
                                            <span className="font-mono text-[9px] text-red-500 font-bold tracking-widest uppercase">L03</span>
                                            <span className="text-xs font-sans font-black text-white uppercase tracking-wider mt-1">Output</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cards das 3 camadas */}
                            {LAYER_KEYS.map((key, i) => (
                                <div
                                    key={key}
                                    ref={(el) => {
                                        layerTextRefs.current[i] = el;
                                    }}
                                    className="relative md:absolute md:inset-0 md:flex md:items-center mt-6 md:mt-0 w-full max-w-xl md:max-w-2xl mx-auto"
                                >
                                    <div className="w-full border border-white/[0.06] bg-[#0a0a0d]/90 backdrop-blur-sm p-5 sm:p-6 relative overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.65)]">
                                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-red-600/[0.05] rounded-full blur-2xl pointer-events-none" />

                                        {/* Container do Indicador */}
                                        <div className="absolute top-5 right-5 flex flex-col items-end gap-1.5 pointer-events-none select-none">
                                            {/* Quadrados */}
                                            <div className="flex gap-1.5">
                                                {[0, 1, 2].map((stepIdx) => {
                                                    const isFilled = stepIdx <= i;
                                                    return (
                                                        <div
                                                            key={stepIdx}
                                                            className={`w-2 h-2 border transition-all duration-300 ${
                                                                isFilled
                                                                    ? "bg-red-500 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                                                                    : "bg-transparent border-zinc-800"
                                                            }`}
                                                        />
                                                    );
                                                })}
                                            </div>

                                            {/* Número outline puro e sem glow */}
                                            <span
                                                className="text-[20px] font-mono font-black leading-none opacity-40 select-none mt-1 tracking-wider"
                                                style={{
                                                    color: "transparent",
                                                    WebkitTextStroke: "1px rgba(239, 68, 68, 0.5)",
                                                }}
                                            >
                                                {String(i + 1).padStart(2, "0")}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div>
                                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-500">
                                                    {t[`${key}Tag` as keyof typeof t]}
                                                </span>
                                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-sans font-black text-white uppercase tracking-wide mt-2 leading-tight">
                                                    {t[`${key}Title` as keyof typeof t]}
                                                </h3>
                                            </div>
                                        </div>

                                        <p className="text-sm text-zinc-400 leading-relaxed font-sans mt-3 max-w-lg">
                                            {t[`${key}Desc` as keyof typeof t]}
                                        </p>

                                        {/* TERMINAL DE CÓDIGO */}
                                        <div className="mt-4 border border-white/[0.05] bg-[#030304]/90 rounded overflow-hidden shadow-[inset_0_1px_8px_rgba(0,0,0,0.8)]">
                                            {/* Cabeçalho do Editor */}
                                            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.05] bg-[#070709] select-none">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
                                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/40" />
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
                                                </div>
                                                <span className="text-[8px] font-mono text-zinc-500 tracking-wider font-semibold uppercase">
                                                    {i === 0 ? "core.ts" : i === 1 ? "heuristics.ts" : "payload.json"}
                                                </span>
                                            </div>
                                            {/* Área de Visualização */}
                                            <div className="p-4 bg-[#030304]/95 overflow-x-auto min-h-[125px] flex items-center">
                                                {i === 0 && <CoreTerminal />}
                                                {i === 1 && <HeuristicsTerminal />}
                                                {i === 2 && <PayloadTerminal />}
                                            </div>
                                        </div>

                                        {/* Barra de Progresso Scroll-Sync e Status no Rodapé */}
                                        <div className="relative mt-5 pt-4">
                                            <div className="absolute top-0 left-0 w-full h-px bg-white/[0.06]" />
                                            <span
                                                ref={(el) => {
                                                    barRefs.current[i] = el;
                                                }}
                                                className="absolute top-0 left-0 h-px bg-red-500 w-full origin-left"
                                                style={{ transform: "scaleX(1)" }}
                                            />
                                            <div className="flex justify-between items-center">
                                                <span className="text-[8px] font-mono text-emerald-500 font-bold tracking-widest uppercase flex items-center gap-1.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    ONLINE
                                                </span>
                                                <span className="text-[8px] font-mono text-zinc-600">{t.activeText}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Hint de scroll */}
                <div
                    ref={scrollHintRef}
                    className="hidden md:flex absolute bottom-10 left-0 right-0 justify-center items-center gap-2 z-20 select-none pointer-events-none"
                >
                    <span className="font-mono text-[9px] text-zinc-500 tracking-[0.2em] uppercase">
                        {t.scrollHint}
                    </span>
                    <span className="w-px h-6 bg-gradient-to-b from-red-500/60 to-transparent" />
                </div>
            </div>

            <style>{`
                @keyframes slow-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-slow-spin {
                    animation: slow-spin 80s linear infinite;
                }
                @keyframes slow-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .animate-slow-reverse {
                    animation: slow-reverse 60s linear infinite;
                }
                
                /* Define a opacidade inicial invisível para a animação GSAP somente no desktop */
                @media (min-width: 768px) {
                    .terminal-line {
                        opacity: 0;
                        transform: translateX(-4px);
                    }
                }
            `}</style>
        </section>
    );
}