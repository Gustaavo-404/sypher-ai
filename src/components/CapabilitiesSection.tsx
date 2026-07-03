import { useLayoutEffect, useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type Language = "pt" | "en" | "es";

interface CapabilitiesSectionProps {
  lang: Language;
}

/* ============================================================ */
/* Conteúdo localizado da seção de capacidades                  */
/* ============================================================ */

const COPY: Record<
  Language,
  {
    capabilitiesTitle: string;
    capabilitiesHeadline: string;
    capabilitiesSub: string;
    capability1Title: string;
    capability1Desc: string;
    capability2Title: string;
    capability2Desc: string;
    capability3Title: string;
    capability3Desc: string;
    capability4Title: string;
    capability4Desc: string;
  }
> = {
  pt: {
    capabilitiesTitle: "CAPACIDADES",
    capabilitiesHeadline: "O QUE O SYPHER ENTREGA",
    capabilitiesSub: "Tudo que você precisa pra transformar rascunhos em conteúdo profissional, em segundos.",
    capability1Title: "Performance",
    capability1Desc:
      "Cada rascunho é reescrito e formatado em menos de 200ms, sem fila de espera e sem travar seu fluxo de trabalho. Do texto bruto ao post pronto pra publicar — no LinkedIn, no X, num e-mail ou num blog — antes que você perca o fio do raciocínio.",
    capability2Title: "Segurança",
    capability2Desc:
      "Seus rascunhos e e-mails nunca são usados pra treinar modelos, nem armazenados além do necessário, nem compartilhados com terceiros. Toda a infraestrutura segue conformidade total com GDPR e práticas de segurança de nível corporativo, do primeiro caractere até a exportação final.",
    capability3Title: "Inteligência",
    capability3Desc:
      "Modelos de ponta calibrados pra entender tom, contexto e intenção — sabem diferenciar um post casual de X de um e-mail formal pra um cliente, ou um resumo executivo de uma thread de LinkedIn. O resultado nunca soa genérico, e nunca soa robótico.",
    capability4Title: "Exportação",
    capability4Desc:
      "Exporte o conteúdo refinado em múltiplos formatos prontos pra publicar — Markdown, HTML, texto puro ou JSON — e leve direto pra qualquer plataforma, sem retrabalho manual de formatação.",
  },
  en: {
    capabilitiesTitle: "CAPABILITIES",
    capabilitiesHeadline: "WHAT SYPHER DELIVERS",
    capabilitiesSub: "Everything you need to turn drafts into professional content, in seconds.",
    capability1Title: "Performance",
    capability1Desc:
      "Every draft gets rewritten and formatted in under 200ms — no queue, no lag, no breaking your flow. From raw text to a publish-ready post for LinkedIn, X, email, or your blog, before you lose your train of thought.",
    capability2Title: "Security",
    capability2Desc:
      "Your drafts and emails are never used to train models, stored longer than necessary, or shared with third parties. The entire pipeline runs on full GDPR compliance and enterprise-grade security, from the first keystroke to the final export.",
    capability3Title: "Intelligence",
    capability3Desc:
      "State-of-the-art models calibrated to understand tone, context, and intent — they know the difference between a casual X post, a formal client email, an executive summary, and a LinkedIn thread. The output never reads generic, and never reads robotic.",
    capability4Title: "Export",
    capability4Desc:
      "Export your refined content in multiple publish-ready formats — Markdown, HTML, plain text, or JSON — and drop it straight into any platform, with zero manual reformatting.",
  },
  es: {
    capabilitiesTitle: "CAPACIDADES",
    capabilitiesHeadline: "LO QUE SYPHER ENTREGA",
    capabilitiesSub: "Todo lo que necesitas para convertir borradores en contenido profesional, en segundos.",
    capability1Title: "Rendimiento",
    capability1Desc:
      "Cada borrador se reescribe y formatea en menos de 200ms, sin cola de espera y sin interrumpir tu fluxo de trabajo. Del texto crudo a la publicación lista para LinkedIn, X, correo o blog, antes de que pierdas el hilo de la idea.",
    capability2Title: "Seguridad",
    capability2Desc:
      "Tus borradores y correos nunca se usan para entrenar modelos, ni se almacenan más de lo necesario, ni se comparten com terceros. Toda la infraestructura cumple totalmente con GDPR y sigue prácticas de segurança de nível corporativo, desde el primer carácter hasta la exportación final.",
    capability3Title: "Inteligencia",
    capability3Desc:
      "Modelos de última generación calibrados para entender tono, contexto e intención — distinguen entre un post casual de X, un correo formal para un cliente, un resumen ejecutivo y un hilo de LinkedIn. El resultado nunca suena genérico, ni suena robótico.",
    capability4Title: "Exportación",
    capability4Desc:
      "Exporta el contenido refinado en múltiples formatos listos para publicar — Markdown, HTML, texto plano o JSON — y llévalo directo a qualquer plataforma, sin retrabajo manual de formato.",
  },
};

const STATS: Record<Language, { label: string; value: string }[][]> = {
  pt: [
    [
      { label: "Latência média", value: "< 200ms" },
      { label: "Formatos simultâneos", value: "6+" },
      { label: "Disponibilidade", value: "99.9%" },
    ],
    [
      { label: "Criptografia", value: "AES-256" },
      { label: "Retenção de dados", value: "Zero" },
      { label: "Conformidade", value: "GDPR" },
    ],
    [
      { label: "Modelo atual", value: "Gemini v3.5" },
      { label: "Tons de voz", value: "12+" },
      { label: "Idiomas", value: "30+" },
    ],
    [
      { label: "Formatos de saída", value: "4" },
      { label: "Integrações", value: "8+" },
      { label: "Templates prontos", value: "20+" },
    ],
  ],
  en: [
    [
      { label: "Avg. latency", value: "< 200ms" },
      { label: "Concurrent formats", value: "6+" },
      { label: "Uptime", value: "99.9%" },
    ],
    [
      { label: "Encryption", value: "AES-256" },
      { label: "Data retention", value: "Zero" },
      { label: "Compliance", value: "GDPR" },
    ],
    [
      { label: "Current model", value: "Gemini v3.5" },
      { label: "Tone presets", value: "12+" },
      { label: "Languages", value: "30+" },
    ],
    [
      { label: "Output formats", value: "4" },
      { label: "Integrations", value: "8+" },
      { label: "Ready templates", value: "20+" },
    ],
  ],
  es: [
    [
      { label: "Latencia media", value: "< 200ms" },
      { label: "Formatos simultáneos", value: "6+" },
      { label: "Disponibilidad", value: "99.9%" },
    ],
    [
      { label: "Cifrado", value: "AES-256" },
      { label: "Retención de dados", value: "Zero" },
      { label: "Conformidad", value: "GDPR" },
    ],
    [
      { label: "Modelo atual", value: "Gemini v3.5" },
      { label: "Tonos de voz", value: "12+" },
      { label: "Idiomas", value: "30+" },
    ],
    [
      { label: "Formatos de saída", value: "4" },
      { label: "Integraciones", value: "8+" },
      { label: "Plantillas listas", value: "20+" },
    ],
  ],
};

const CARDS = [
  { gif: "/gifs/performance.gif", number: "01", sysId: "SYS::PERF", statusLabel: "LIVE", metric: "< 200ms", animatedMetric: true },
  { gif: "/gifs/shield.gif", number: "02", sysId: "SYS::SEC", statusLabel: "SECURE", metric: "GDPR", animatedMetric: false },
  { gif: "/gifs/cpu.gif", number: "03", sysId: "SYS::AI", statusLabel: "ACTIVE", metric: "Gemini v3.5", animatedMetric: false },
  { gif: "/gifs/document.gif", number: "04", sysId: "SYS::EXP", statusLabel: "READY", metric: "MD | HTML | TXT | JSON", animatedMetric: false },
];

const TOTAL = CARDS.length;
const RING_RADIUS = 140;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const RETICLE_MARGIN = 16;
const RETICLE_OFFSETS = [-70, 0, 70]; 

function reticleLine(dy: number) {
  const half = Math.max(0, Math.sqrt(RING_RADIUS ** 2 - dy ** 2) - RETICLE_MARGIN);
  return { x1: 150 - half, x2: 150 + half, y: 150 + dy };
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export default function CapabilitiesSection({ lang }: CapabilitiesSectionProps) {
  const t = COPY[lang] || COPY.en;
  const stats = STATS[lang] || STATS.en;

  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ringRef = useRef<SVGCircleElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);
  const metricRef = useRef<HTMLSpanElement>(null);
  const cueRef = useRef<HTMLSpanElement>(null);
  const threeContainerRef = useRef<HTMLDivElement>(null);
  
  const activeIndexRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  // Monitora a largura da viewport de forma contínua
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Inicialização e gerenciamento do ciclo de vida do Three.js (Apenas em desktop)
  useEffect(() => {
    if (isMobile) return;
    if (typeof window === "undefined" || !threeContainerRef.current) return;
    const container = threeContainerRef.current;
    
    const width = container.clientWidth || 260;
    const height = container.clientHeight || 260;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.0;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ringGeom = new THREE.TorusGeometry(2.3, 0.006, 6, 64);

    const mat1 = new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true, transparent: true, opacity: 0.35 });
    const mat2 = new THREE.MeshBasicMaterial({ color: 0xf87171, wireframe: true, transparent: true, opacity: 0.0 });
    const mat3 = new THREE.MeshBasicMaterial({ color: 0xfca5a5, wireframe: true, transparent: true, opacity: 0.0 });
    const mat4 = new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true, transparent: true, opacity: 0.0 });

    const ringMesh1 = new THREE.Mesh(ringGeom, mat1);
    const ringMesh2 = new THREE.Mesh(ringGeom, mat2);
    const ringMesh3 = new THREE.Mesh(ringGeom, mat3);
    const ringMesh4 = new THREE.Mesh(ringGeom, mat4);

    ringMesh1.rotation.set(Math.PI / 3, 0, 0);
    ringMesh2.rotation.set(0, Math.PI / 4, 0);
    ringMesh3.rotation.set(Math.PI / 6, Math.PI / 6, 0);
    ringMesh4.rotation.set(Math.PI / 2, Math.PI / 12, Math.PI / 4);

    scene.add(ringMesh1);
    scene.add(ringMesh2);
    scene.add(ringMesh3);
    scene.add(ringMesh4);

    const centerGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const centerMat = new THREE.MeshBasicMaterial({ color: 0x121214 });
    const centerMesh = new THREE.Mesh(centerGeom, centerMat);
    scene.add(centerMesh);

    const coreGeom = new THREE.SphereGeometry(0.04, 8, 8);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    scene.add(coreMesh);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const currentActive = activeIndexRef.current;

      const targetOp1 = currentActive >= 0 ? 0.35 : 0.0;
      const targetOp2 = currentActive >= 1 ? 0.45 : 0.0;
      const targetOp3 = currentActive >= 2 ? 0.55 : 0.0;
      const targetOp4 = currentActive >= 3 ? 0.75 : 0.0;

      mat1.opacity += (targetOp1 - mat1.opacity) * 0.08;
      mat2.opacity += (targetOp2 - mat2.opacity) * 0.08;
      mat3.opacity += (targetOp3 - mat3.opacity) * 0.08;
      mat4.opacity += (targetOp4 - mat4.opacity) * 0.08;

      ringMesh1.visible = mat1.opacity > 0.001;
      ringMesh2.visible = mat2.opacity > 0.001;
      ringMesh3.visible = mat3.opacity > 0.001;
      ringMesh4.visible = mat4.opacity > 0.001;

      ringMesh1.rotation.y += 0.005;
      ringMesh1.rotation.x += 0.001;

      ringMesh2.rotation.y -= 0.007;
      ringMesh2.rotation.z += 0.002;

      ringMesh3.rotation.x += 0.009;
      ringMesh3.rotation.y += 0.003;

      ringMesh4.rotation.x -= 0.006;
      ringMesh4.rotation.z -= 0.004;

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
      cancelAnimationFrame(animationFrameId);
      
      ringGeom.dispose();
      mat1.dispose();
      mat2.dispose();
      mat3.dispose();
      mat4.dispose();
      
      centerGeom.dispose();
      centerMat.dispose();
      coreGeom.dispose();
      coreMat.dispose();
      
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isMobile]);

  useLayoutEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const bars = barRefs.current.filter(Boolean) as HTMLSpanElement[];

    let metricTl: gsap.core.Timeline | null = null;
    if (metricRef.current && !reducedMotion) {
      const el = metricRef.current;
      const proxy = { val: 187 };
      metricTl = gsap.timeline({ repeat: -1 });
      [142, 198, 165, 203, 178, 156, 191].forEach((target) => {
        metricTl!.to(proxy, {
          val: target,
          duration: 0.9,
          ease: "power1.inOut",
          onUpdate: () => {
            el.textContent = `< ${Math.round(proxy.val)}ms`;
          },
        });
        metricTl!.to({}, { duration: 1.4 });
      });
    }

    if (reducedMotion || isMobile) {
      gsap.set(cards, { opacity: 1, yPercent: 0, scale: 1, filter: "none" });
      gsap.set(bars, { scaleX: 1 });
      if (indexRef.current) indexRef.current.textContent = `[${pad2(TOTAL)}]`;
      if (ringRef.current) ringRef.current.style.strokeDashoffset = "0";
      return () => {
        metricTl?.kill();
      };
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        gsap.set(cards[0], { yPercent: 0, opacity: 1, scale: 1, filter: "blur(0px)" });
        gsap.set(cards.slice(1), { yPercent: 60, opacity: 0 });
        gsap.set(bars, { scaleX: 0 });

        if (ringRef.current) {
          gsap.set(ringRef.current, {
            strokeDasharray: RING_CIRCUMFERENCE,
            strokeDashoffset: RING_CIRCUMFERENCE,
          });
        }
        if (indexRef.current) indexRef.current.textContent = `[${pad2(1)}]`;

        const introTrigger = ScrollTrigger.create({
          trigger: pinRef.current,
          start: "top top",
          once: true,
          onEnter: () => {
            if (bars[0]) gsap.to(bars[0], { scaleX: 1, duration: 1, ease: "power2.out" });
          },
        });

        const tl = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: 1 },
          scrollTrigger: {
            trigger: pinRef.current,
            start: "top top",
            end: () => `+=${(TOTAL - 1) * window.innerHeight}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            refreshPriority: 3,
            onUpdate: (self) => {
              if (ringRef.current) {
                ringRef.current.style.strokeDashoffset = String(
                  RING_CIRCUMFERENCE * (1 - self.progress)
                );
              }
              const idx = Math.min(TOTAL - 1, Math.floor(self.progress * TOTAL));
              
              activeIndexRef.current = idx;

              if (indexRef.current) {
                indexRef.current.textContent = `[${pad2(idx + 1)}]`;
              }
            },
          },
        });

        cards.forEach((_, i) => {
          if (i === 0) return;
          const pos = i - 1;
          tl.to(cards[i - 1], { yPercent: -10, opacity: 0, scale: 0.94, filter: "blur(6px)" }, pos)
            .fromTo(
              cards[i],
              { yPercent: 60, opacity: 0 },
              { yPercent: 0, opacity: 1, scale: 1, filter: "blur(0px)" },
              pos
            );
          if (bars[i]) {
            tl.fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, pos);
          }
        });

        return () => {
          introTrigger.kill();
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      if (cueRef.current) {
        gsap.to(cueRef.current, {
          scaleY: 1.8,
          opacity: 0.25,
          duration: 0.9,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      metricTl?.kill();
    };
  }, [lang, isMobile]);

  return (
    <section ref={sectionRef} className="relative bg-[#030304] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#230607] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-[#230607] via-[#230607]/50 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-10 sm:pb-16 relative z-10">
        <div className="flex items-center gap-4 max-w-2xl">
          <img
            src="/img/icons/cs2.png"
            alt=""
            className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-contain opacity-60 select-none pointer-events-none flex-shrink-0"
          />
          <div>
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-red-500">
              {t.capabilitiesTitle}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-black tracking-wider text-white uppercase mt-2">
              {t.capabilitiesHeadline}
            </h2>
            <p className="text-xs text-zinc-400 mt-3">{t.capabilitiesSub}</p>
          </div>
        </div>
      </div>

      <div ref={pinRef} className="relative lg:h-screen w-full">
        <div className="max-w-7xl mx-auto h-full w-full px-4 sm:px-6 lg:px-8 py-10 lg:py-0 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 lg:items-center">
          
          {/* Coluna esquerda — stack de cards */}
          <div className="relative flex flex-col gap-6 lg:gap-0 lg:h-[68vh]">
            {CARDS.map((card, i) => {
              const title = t[`capability${i + 1}Title` as keyof typeof t];
              const desc = t[`capability${i + 1}Desc` as keyof typeof t];
              const cardStats = stats[i];
              return (
                <div
                  key={i}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="relative lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center will-change-transform"
                >
                  <div className="w-full bg-[#08080b] border border-white/[0.04] overflow-hidden p-6 sm:p-8 lg:p-9 relative">
                    <div className="absolute -top-16 -right-16 w-48 h-48 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="absolute top-6 right-6 flex flex-col items-end gap-1.5 pointer-events-none select-none">
                      <div className="flex gap-1.5">
                        {[0, 1, 2, 3].map((stepIdx) => {
                          const isFilled = stepIdx <= i;
                          return (
                            <div
                              key={stepIdx}
                              className={`w-2.5 h-2.5 border transition-all duration-300 ${
                                isFilled
                                  ? "bg-red-500 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
                                  : "bg-transparent border-zinc-800"
                              }`}
                            />
                          );
                        })}
                      </div>

                      <span
                        className="text-[22px] font-mono font-black leading-none opacity-50 select-none mt-1 tracking-wider"
                        style={{
                          color: "transparent",
                          WebkitTextStroke: "1px rgba(239, 68, 68, 0.5)",
                        }}
                      >
                        {card.number}
                      </span>
                    </div>

                    <div className="relative text-left">
                      <span className="block text-[9px] font-mono font-semibold text-zinc-600 uppercase tracking-widest mb-4">
                        {card.sysId}
                      </span>

                      <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] flex items-center justify-center mb-6 bg-red-950/30 border border-red-500/20 rounded-md p-2 backdrop-blur-sm shadow-[inset_0_0_12px_rgba(239,68,68,0.05)]">
                        <img src={card.gif} alt="" className="w-full h-full object-contain" />
                      </div>

                      <h4 className="text-lg sm:text-2xl lg:text-3xl font-sans font-black text-white uppercase tracking-wider mb-3">
                        {title}
                      </h4>
                      
                      <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed font-sans max-w-lg">
                        {desc}
                      </p>

                      <div className="mt-6 grid grid-cols-3 divide-x divide-white/[0.07]">
                        {cardStats.map((s, sIdx) => (
                          <div key={sIdx} className={sIdx === 0 ? "pr-3" : "px-3"}>
                            <span className="block text-[8px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">
                              {s.label}
                            </span>
                            <span className="block text-xs sm:text-sm font-mono font-bold text-white tabular-nums">
                              {s.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="relative mt-6 pt-4">
                        <div className="absolute top-0 left-0 w-full h-px bg-white/[0.06]" />
                        <span
                          ref={(el) => {
                            barRefs.current[i] = el;
                          }}
                          className="absolute top-0 left-0 h-px bg-red-500 w-full origin-left"
                          style={{ transform: "scaleX(1)" }}
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-mono text-emerald-500 font-bold tracking-widest uppercase flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-soft-blink" />
                            {card.statusLabel}
                          </span>
                          <span className="text-[8px] font-mono text-zinc-600">|</span>
                          {card.animatedMetric ? (
                            <span ref={metricRef} className="text-[8px] font-mono text-zinc-500 tabular-nums">
                              {card.metric}
                            </span>
                          ) : (
                            <span className="text-[8px] font-mono text-zinc-500">{card.metric}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coluna direita — Omitida completamente no celular via React render check */}
          {!isMobile && (
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative aspect-square" style={{ width: "clamp(320px, 44vw, 620px)" }}>
                
                <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full">
                  <path d="M 12 24 L 12 12 L 24 12" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <path d="M 288 24 L 288 12 L 276 12" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <path d="M 12 276 L 12 288 L 24 288" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <path d="M 288 276 L 288 288 L 276 288" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

                  <line x1="150" y1="20" x2="150" y2="280" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="3 9" />

                  {RETICLE_OFFSETS.map((dy, idx) => {
                    const { x1, x2, y } = reticleLine(dy);
                    return (
                      <line
                        key={idx}
                        x1={x1}
                        x2={x2}
                        y1={y}
                        y2={y}
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="1"
                        strokeDasharray={idx === 1 ? "1 3" : "4 5"}
                      />
                    );
                  })}

                  <g className="animate-slow-spin origin-center">
                    <circle
                      cx="150"
                      cy="150"
                      r={RING_RADIUS + 8}
                      fill="none"
                      stroke="rgba(239, 68, 68, 0.15)"
                      strokeWidth="1"
                      strokeDasharray="2 12"
                    />
                    <circle
                      cx="150"
                      cy="150"
                      r={RING_RADIUS - 10}
                      fill="none"
                      stroke="rgba(255,255,255,0.03)"
                      strokeWidth="1"
                      strokeDasharray="30 15"
                    />
                  </g>

                  <g className="-rotate-90 origin-center">
                    <circle cx="150" cy="150" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    
                    <circle
                      ref={ringRef}
                      cx="150"
                      cy="150"
                      r={RING_RADIUS}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      style={{ strokeDasharray: RING_CIRCUMFERENCE, strokeDashoffset: RING_CIRCUMFERENCE }}
                    />
                  </g>
                </svg>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div ref={threeContainerRef} className="w-[260px] h-[260px]" />
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-between py-12 sm:py-16 pointer-events-none z-20">
                  <div className="font-mono text-xs sm:text-sm tracking-widest text-zinc-400 flex items-center gap-2 select-none">
                    <span ref={indexRef} className="text-red-500 font-bold">
                      [01]
                    </span>
                    <span className="text-zinc-600">/</span>
                    <span>[{pad2(TOTAL)}]</span>
                  </div>

                  <div className="flex flex-col items-center gap-3 select-none">
                    <span ref={cueRef} className="w-px h-6 bg-red-500/50 origin-top" />
                    <span className="font-mono text-[10px] tracking-[0.3em] text-zinc-500 uppercase">SCROLL</span>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @keyframes soft-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .animate-soft-blink {
          animation: soft-blink 2.6s ease-in-out infinite;
        }
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 50s linear infinite;
        }
      `}</style>
    </section>
  );
}