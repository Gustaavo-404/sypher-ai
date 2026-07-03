import { useLayoutEffect, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import StartNowButton from "./StartNowButton";

gsap.registerPlugin(ScrollTrigger);

type Language = "pt" | "en" | "es";

interface NoiseToOrderSectionProps {
    lang: Language;
    onNavigate: (view: 'landing' | 'app' | 'docs' | 'about') => void;
}

/* ============================================================ */
/* Conteúdo localizado                                           */
/* ============================================================ */

const COPY: Record<
    Language,
    {
        finalPostLines: string[];
        decoys: string[];
        subtitle: string;
        noLoginNote: string;
    }
> = {
    pt: {
        finalPostLines: [
            "O segredo não é escrever mais.",
            "É escrever com clareza absoluta.",
            "Menos ruído, mais conversão."
        ],
        decoys: [
            "bloqueio", "algoritmo", "caos", "vazio", "chato", "clichê",
            "sem tempo", "esforço", "esquecido", "confuso", "rascunho",
            "estagnado", "spam", "ruído", "procrastinar", "tentativa",
            "erro", "vago", "perdido", "métrica", "likes", "copiar"
        ],
        subtitle: "Sua escrita com clareza absoluta e livre de ruídos.",
        noLoginNote: "Acesse agora — sem login ou cadastro."
    },
    en: {
        finalPostLines: [
            "The secret is not writing more.",
            "It is writing with absolute clarity.",
            "Less noise, more conversion."
        ],
        decoys: [
            "block", "algorithm", "chaos", "blank", "boring", "cliche",
            "no time", "struggle", "forgotten", "confused", "draft",
            "stagnant", "spam", "noise", "procrastinate", "trial",
            "error", "vague", "lost", "metric", "likes", "copy"
        ],
        subtitle: "Your writing with absolute clarity, free of noise.",
        noLoginNote: "Access now — no login required."
    },
    es: {
        finalPostLines: [
            "El secreto no es escribir más.",
            "Es escribir con absoluta claridad.",
            "Menos ruido, más conversión."
        ],
        decoys: [
            "bloqueo", "algoritmo", "caos", "vacío", "aburrido", "cliché",
            "sin tempo", "esfuerzo", "olvidado", "confuso", "borrador",
            "estancado", "spam", "ruido", "procrastinar", "intento",
            "error", "vago", "perdido", "métrica", "likes", "copiar"
        ],
        subtitle: "Tu escritura con absoluta claridad y libre de ruidos.",
        noLoginNote: "Accede ahora — sin login ni registro."
    }
};

/* ============================================================ */
/* Shader do "Horizonte de Evento" (anel com glow radial)        */
/* ============================================================ */
const ringVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ringFragmentShader = /* glsl */ `
  uniform float uIntensity;   
  uniform float uTime;        
  uniform vec3 uColor;        
  uniform vec3 uColorHot;     
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 centered = (vUv - 0.5) * 2.0;
    float dist = length(centered);

    float wobble = noise(vec2(dist * 9.0, uTime * 0.35)) * 0.02;

    float ringRadius = 0.38 + wobble;
    float pulse = sin(uTime * 1.1) * 0.01 + sin(uTime * 2.7) * 0.005;
    ringRadius += pulse;
    float ringWidth = 0.035;

    float darkCore = 1.0 - smoothstep(ringRadius - 0.22, ringRadius - 0.04, dist);

    float hotEdge = 1.0 - smoothstep(0.0, ringWidth * 0.5, abs(dist - ringRadius));
    hotEdge = pow(hotEdge, 2.2);

    float glow1 = 1.0 - smoothstep(0.0, 0.16, dist - ringRadius);
    glow1 = pow(glow1, 1.4);

    float glow2 = smoothstep(ringRadius + 0.42, ringRadius - 0.05, dist);
    glow2 = max(glow2 - hotEdge, 0.0);

    float glow3 = smoothstep(ringRadius + 0.85, ringRadius - 0.1, dist);
    glow3 = max(glow3 - glow2 * 0.6 - hotEdge, 0.0) * 0.55;

    float innerGlow = smoothstep(ringRadius, ringRadius - 0.32, dist) * (1.0 - darkCore * 0.85);
    innerGlow = max(innerGlow - hotEdge, 0.0) * 0.4;

    float brightness = hotEdge * 2.0
                      + glow1 * 1.3
                      + glow2 * 0.8
                      + glow3 * 0.6
                      + innerGlow;

    vec3 color = mix(uColor, uColorHot, clamp(hotEdge * 1.2, 0.0, 0.6));
    color *= brightness;

    float alpha = clamp(brightness, 0.0, 1.0) * uIntensity;

    alpha *= mix(1.0, 0.05, darkCore * step(dist, ringRadius - 0.06));

    gl_FragColor = vec4(color, alpha);
  }
`;

const atmosphereFragmentShader = /* glsl */ `
  uniform float uIntensity;
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 centered = (vUv - 0.5) * 2.0;
    float dist = length(centered);

    float pulse = 1.0 + sin(uTime * 0.9) * 0.04;
    float falloff = 1.0 - smoothstep(0.0, 1.0 * pulse, dist);
    falloff = pow(falloff, 1.8);

    vec3 color = uColor * falloff;
    float alpha = falloff * uIntensity * 0.4;

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function NoiseToOrderSection({ lang, onNavigate }: NoiseToOrderSectionProps) {
    const t = COPY[lang] || COPY.en;

    const sectionRef = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);
    const threeContainerRef = useRef<HTMLDivElement>(null);

    const postContainerRef = useRef<HTMLDivElement>(null);
    const sypherContainerRef = useRef<HTMLDivElement>(null);
    const sypherTitleRef = useRef<HTMLHeadingElement>(null);
    const sypherSubtitleRef = useRef<HTMLParagraphElement>(null);
    const sypherBtnRef = useRef<HTMLDivElement>(null);

    const decoyRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const signalWordRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const scrollProgressRef = useRef<number>(0);
    
    // Armazena o multiplicador de escala dinâmica do anel
    const ringScaleRef = useRef({ value: 1.0 });

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    /* ============================================================ */
    /* Inicialização do Three.js (Desktop somente)                  */
    /* ============================================================ */
    useEffect(() => {
        if (isMobile) return; // 🛡️ Não inicializa Three.js no celular
        if (typeof window === "undefined" || !threeContainerRef.current) return;
        const container = threeContainerRef.current;

        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;

        const scene = new THREE.Scene();
        const fov = 50;
        const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100);
        camera.position.z = 8;

        const renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            powerPreference: "high-performance"
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        container.appendChild(renderer.domElement);

        const getVisibleHeightAtZ = (cam: THREE.PerspectiveCamera, z: number) => {
            const vFov = (cam.fov * Math.PI) / 180;
            return 2 * Math.tan(vFov / 2) * Math.abs(z - cam.position.z);
        };
        let visibleHeight = getVisibleHeightAtZ(camera, 0);
        let visibleWidth = visibleHeight * (width / height);

        /* ------------------------------------------------------------ */
        /* Configuração das Partículas                                  */
        /* ------------------------------------------------------------ */
        let geometry1: THREE.BufferGeometry | undefined;
        let material1: THREE.PointsMaterial | undefined;
        let particleSystem1: THREE.Points | undefined;

        let initialRadii1: Float32Array | undefined;
        let speeds1: Float32Array | undefined;
        let angles1: Float32Array | undefined;
        let yOffsets1: Float32Array | undefined;
        let isResidual: Uint8Array | undefined;

        let geometry2: THREE.BufferGeometry | undefined;
        let material2: THREE.PointsMaterial | undefined;
        let particleSystem2: THREE.Points | undefined;

        let radii2: Float32Array | undefined;
        let speeds2: Float32Array | undefined;
        let angles2: Float32Array | undefined;
        let yOffsets2: Float32Array | undefined;
        let spiralFactors2: Float32Array | undefined;

        /* Sistema de Partículas 1 (Ruído inicial que colapsa) */
        const particleCount1 = 1200;
        geometry1 = new THREE.BufferGeometry();
        const positions1 = new Float32Array(particleCount1 * 3);
        initialRadii1 = new Float32Array(particleCount1);
        speeds1 = new Float32Array(particleCount1);
        angles1 = new Float32Array(particleCount1);
        yOffsets1 = new Float32Array(particleCount1);

        isResidual = new Uint8Array(particleCount1);
        const residualRatio = 0.12;

        for (let i = 0; i < particleCount1; i++) {
            angles1[i] = Math.random() * Math.PI * 2;
            initialRadii1[i] = Math.random() * 4.0 + 0.5;
            speeds1[i] = Math.random() * 0.025 + 0.005;
            yOffsets1[i] = (Math.random() - 0.5) * 2.0;
            isResidual[i] = Math.random() < residualRatio ? 1 : 0;

            const x = Math.cos(angles1[i]) * initialRadii1[i];
            const z = Math.sin(angles1[i]) * initialRadii1[i];
            const y = yOffsets1[i];

            positions1[i * 3] = x;
            positions1[i * 3 + 1] = y;
            positions1[i * 3 + 2] = z;
        }

        geometry1.setAttribute("position", new THREE.BufferAttribute(positions1, 3));

        material1 = new THREE.PointsMaterial({
            color: 0xb02020,
            size: 0.022,
            transparent: true,
            opacity: 0.55,
            blending: THREE.AdditiveBlending,
        });

        particleSystem1 = new THREE.Points(geometry1, material1);
        scene.add(particleSystem1);

        /* Sistema de Partículas 2 (Sucção estilo Buraco Negro) */
        const particleCount2 = 1200;
        geometry2 = new THREE.BufferGeometry();
        const positions2 = new Float32Array(particleCount2 * 3);
        radii2 = new Float32Array(particleCount2);
        speeds2 = new Float32Array(particleCount2);
        angles2 = new Float32Array(particleCount2);
        yOffsets2 = new Float32Array(particleCount2);
        spiralFactors2 = new Float32Array(particleCount2);

        for (let i = 0; i < particleCount2; i++) {
            angles2[i] = Math.random() * Math.PI * 2;
            radii2[i] = Math.random() * 5.0 + 0.5;
            speeds2[i] = Math.random() * 0.025 + 0.015;
            yOffsets2[i] = (Math.random() - 0.5) * 2.5; 
            spiralFactors2[i] = Math.random() * 0.04 + 0.012;

            const x = Math.cos(angles2[i]) * radii2[i];
            const z = Math.sin(angles2[i]) * radii2[i];
            const y = yOffsets2[i];

            positions2[i * 3] = x;
            positions2[i * 3 + 1] = y;
            positions2[i * 3 + 2] = z;
        }

        geometry2.setAttribute("position", new THREE.BufferAttribute(positions2, 3));

        material2 = new THREE.PointsMaterial({
            color: 0xc22020,
            size: 0.024,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
        });

        particleSystem2 = new THREE.Points(geometry2, material2);
        scene.add(particleSystem2);

        /* ------------------------------------------------------------ */
        /* Configuração do Anel e Atmosfera                            */
        /* ------------------------------------------------------------ */
        const ringPlaneSize = Math.max(visibleWidth, visibleHeight) * 1.15;
        const ringGeom = new THREE.PlaneGeometry(ringPlaneSize, ringPlaneSize);
        const ringMat = new THREE.ShaderMaterial({
            vertexShader: ringVertexShader,
            fragmentShader: ringFragmentShader,
            uniforms: {
                uIntensity: { value: 0 },
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(0x6b0000) },
                uColorHot: { value: new THREE.Color(0xb01818) },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.renderOrder = 10;
        scene.add(ringMesh);

        const atmospherePlaneSize = Math.max(visibleWidth, visibleHeight) * 1.7;
        const atmosphereGeom = new THREE.PlaneGeometry(atmospherePlaneSize, atmospherePlaneSize);
        const atmosphereMat = new THREE.ShaderMaterial({
            vertexShader: ringVertexShader,
            fragmentShader: atmosphereFragmentShader,
            uniforms: {
                uIntensity: { value: 0 },
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(0x8a0f0f) },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        const atmosphereMesh = new THREE.Mesh(atmosphereGeom, atmosphereMat);
        atmosphereMesh.renderOrder = 9;
        scene.add(atmosphereMesh);

        let ringBaseScale = 1;
        let atmosphereBaseScale = 1;

        let animationFrameId: number;
        let elapsed = 0;

        // Intersection Observer para pausar a renderização quando fora da tela
        let isSectionVisible = true;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                isSectionVisible = entry.isIntersecting;
            });
        }, { threshold: 0.01 });

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            if (!isSectionVisible) return; // Economia instantânea de processador se fora de vista

            elapsed += 0.016;
            const progress = scrollProgressRef.current;

            const ringFormProgress = THREE.MathUtils.clamp((progress - 0.4) / 0.22, 0, 1);
            const atmosphereFormProgress = THREE.MathUtils.clamp((progress - 0.55) / 0.35, 0, 1);
            const residualPullProgress = THREE.MathUtils.clamp((progress - 0.65) / 0.35, 0, 1);

            /* ------------------------------------------------------------ */
            /* Atualização do Sistema 1                                    */
            /* ------------------------------------------------------------ */
            if (geometry1 && material1 && angles1 && speeds1 && initialRadii1 && yOffsets1 && isResidual) {
                const positionsAttr1 = geometry1.attributes.position.array as Float32Array;
                const contractionFactor = Math.max(0.01, 1 - progress * 1.05);
                const ringRadiusWorld = 0.38 * (ringPlaneSize / 2) * ringBaseScale;
                const particleCount1 = 1200;

                for (let i = 0; i < particleCount1; i++) {
                    angles1[i] += speeds1[i] * (1 + progress * 4);

                    const angle = angles1[i];
                    const cosVal = Math.cos(angle);
                    const sinVal = Math.sin(angle);

                    if (isResidual[i] === 1 && residualPullProgress > 0) {
                        const orbitRadius = THREE.MathUtils.lerp(
                            initialRadii1[i] * contractionFactor,
                            ringRadiusWorld + Math.sin(elapsed * 2 + i) * 0.03,
                            residualPullProgress
                        );
                        const x = cosVal * orbitRadius;
                        const z = sinVal * orbitRadius;
                        const y = THREE.MathUtils.lerp(
                            yOffsets1[i] * contractionFactor,
                            Math.sin(elapsed * 1.5 + i) * 0.04,
                            residualPullProgress
                        );

                        positionsAttr1[i * 3] = x;
                        positionsAttr1[i * 3 + 1] = y;
                        positionsAttr1[i * 3 + 2] = z;
                    } else {
                        const currentRadius = initialRadii1[i] * contractionFactor;
                        const x = cosVal * currentRadius;
                        const z = sinVal * currentRadius;
                        const y = yOffsets1[i] * contractionFactor;

                        positionsAttr1[i * 3] = x;
                        positionsAttr1[i * 3 + 1] = y;
                        positionsAttr1[i * 3 + 2] = z;
                    }
                }
                geometry1.attributes.position.needsUpdate = true;

                const system1FadeOut = THREE.MathUtils.clamp((progress - 0.65) / 0.15, 0, 1);
                material1.opacity = 0.55 * (1 - system1FadeOut);
            }

            /* ------------------------------------------------------------ */
            /* Atualização do Sistema 2                                    */
            /* ------------------------------------------------------------ */
            if (geometry2 && material2 && radii2 && speeds2 && spiralFactors2 && angles2 && yOffsets2) {
                const system2FadeIn = THREE.MathUtils.clamp((progress - 0.6) / 0.2, 0, 1);
                material2.opacity = 0.65 * system2FadeIn;

                if (system2FadeIn > 0) {
                    const positionsAttr2 = geometry2.attributes.position.array as Float32Array;
                    const particleCount2 = 1200;

                    for (let i = 0; i < particleCount2; i++) {
                        radii2[i] -= speeds2[i];

                        const orbitalVelocity = spiralFactors2[i] / (radii2[i] + 0.15);
                        angles2[i] += orbitalVelocity;

                        const normalizedRadius = THREE.MathUtils.clamp(radii2[i] / 5.0, 0, 1);
                        const currentY = yOffsets2[i] * normalizedRadius;

                        if (radii2[i] <= 0.1) {
                            radii2[i] = 5.0 + Math.random() * 2.0;
                            angles2[i] = Math.random() * Math.PI * 2;
                            yOffsets2[i] = (Math.random() - 0.5) * 2.5;
                        }

                        const angle2 = angles2[i];
                        const x = Math.cos(angle2) * radii2[i];
                        const z = Math.sin(angle2) * radii2[i];

                        positionsAttr2[i * 3] = x;
                        positionsAttr2[i * 3 + 1] = currentY;
                        positionsAttr2[i * 3 + 2] = z;
                    }
                    geometry2.attributes.position.needsUpdate = true;
                }
            }

            if (particleSystem1) {
                particleSystem1.rotation.y += 0.0015;
                particleSystem1.rotation.x = progress * 0.4;
            }
            if (particleSystem2) {
                particleSystem2.rotation.y += 0.0015;
                particleSystem2.rotation.x = progress * 0.4;
            }

            ringMesh.quaternion.copy(camera.quaternion);
            ringMesh.rotation.z = progress * 0.12;
            atmosphereMesh.quaternion.copy(camera.quaternion);
            atmosphereMesh.rotation.z = progress * 0.06;

            ringMat.uniforms.uIntensity.value = ringFormProgress;
            ringMat.uniforms.uTime.value = elapsed;

            atmosphereMat.uniforms.uIntensity.value = atmosphereFormProgress;
            atmosphereMat.uniforms.uTime.value = elapsed;

            const backOut = (x: number) => {
                const c1 = 2.2;
                const c3 = c1 + 1;
                return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
            };
            const overshootScale = 0.5 + backOut(ringFormProgress) * 0.5;

            const currentRingScaleMultiplier = ringScaleRef.current.value;

            const breathing = (1 + Math.sin(elapsed * 1.2) * 0.035 * residualPullProgress)
                * overshootScale * ringBaseScale * currentRingScaleMultiplier;
            ringMesh.scale.set(breathing, breathing, 1);

            const atmosphereOvershoot = 0.7 + backOut(atmosphereFormProgress) * 0.3;
            const atmosphereBreathing = (1 + Math.sin(elapsed * 0.7 + 1.3) * 0.06 * atmosphereFormProgress)
                * atmosphereOvershoot * atmosphereBaseScale * currentRingScaleMultiplier;
            atmosphereMesh.scale.set(atmosphereBreathing, atmosphereBreathing, 1);

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

            visibleHeight = getVisibleHeightAtZ(camera, 0);
            visibleWidth = visibleHeight * (w / h);
            const newRingSize = Math.max(visibleWidth, visibleHeight) * 1.15;
            const newAtmosphereSize = Math.max(visibleWidth, visibleHeight) * 1.7;
            ringBaseScale = newRingSize / ringPlaneSize;
            atmosphereBaseScale = newAtmosphereSize / atmospherePlaneSize;
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
            geometry1?.dispose();
            material1?.dispose();
            geometry2?.dispose();
            material2?.dispose();
            ringGeom.dispose();
            ringMat.dispose();
            atmosphereGeom.dispose();
            atmosphereMat.dispose();
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [isMobile]);

    /* ============================================================ */
    /* Orquestração GSAP ScrollTrigger (Desktop somente)           */
    /* ============================================================ */
    useLayoutEffect(() => {
        if (isMobile) return; // 🛡️ Não executa timeline de scroll no mobile

        const reducedMotion =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        const decoys = decoyRefs.current.filter(Boolean) as HTMLSpanElement[];
        const signalWords = signalWordRefs.current.filter(Boolean) as HTMLSpanElement[];
        const postContainer = postContainerRef.current;
        const sypherContainer = sypherContainerRef.current;
        const sypherTitle = sypherTitleRef.current;
        const sypherSubtitle = sypherSubtitleRef.current;
        const sypherBtn = sypherBtnRef.current;

        if (reducedMotion) {
            gsap.set(decoys, { opacity: 0 });
            gsap.set(signalWords, { opacity: 0 });
            gsap.set(postContainer, { opacity: 0, scale: 0.95 });
            gsap.set(sypherContainer, { opacity: 1, scale: 1, pointerEvents: "auto" });
            gsap.set([sypherTitle, sypherSubtitle, sypherBtn], { opacity: 1, y: 0 });
            ringScaleRef.current.value = 1.4;
            return;
        }

        const ctx = gsap.context(() => {
            signalWords.forEach((word) => {
                const randomX = (Math.random() - 0.5) * window.innerWidth * 0.9;
                const randomY = (Math.random() - 0.5) * window.innerHeight * 0.9;
                const randomRotate = (Math.random() - 0.5) * 140;
                const randomScale = Math.random() * 2.0 + 0.4;

                gsap.set(word, {
                    x: randomX,
                    y: randomY,
                    rotation: randomRotate,
                    scale: randomScale,
                    opacity: 0,
                    display: "inline-block",
                    force3D: true
                });
            });

            decoys.forEach((decoy) => {
                const randomX = (Math.random() - 0.5) * window.innerWidth * 0.85;
                const randomY = (Math.random() - 0.5) * window.innerHeight * 0.75;
                const randomRotate = (Math.random() - 0.5) * 60;

                gsap.set(decoy, {
                    x: randomX,
                    y: randomY,
                    rotation: randomRotate,
                    opacity: Math.random() * 0.25 + 0.08,
                    scale: Math.random() * 0.5 + 0.7,
                    force3D: true
                });
            });

            gsap.set(sypherContainer, { opacity: 1, pointerEvents: "none" });
            gsap.set([sypherTitle, sypherSubtitle, sypherBtn], { opacity: 0, y: 30 });
            gsap.set(ringScaleRef.current, { value: 1.0 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: pinRef.current,
                    start: "top top",
                    end: () => `+=${window.innerHeight * 3.8}`,
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        scrollProgressRef.current = self.progress;
                    }
                }
            });

            tl.to(decoys, {
                x: 0,
                y: 0,
                rotation: () => (Math.random() - 0.5) * 360,
                scale: 0,
                opacity: 0,
                duration: 2.5,
                ease: "power2.in",
                stagger: {
                    amount: 1.2,
                    from: "random"
                }
            }, 0);

            tl.to(signalWords, {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 1,
                opacity: 1,
                duration: 3,
                ease: "power4.out",
                stagger: {
                    amount: 1.4,
                    from: "center"
                }
            }, 1.0);

            tl.to(postContainer, {
                opacity: 0,
                scale: 0.95,
                duration: 1.2,
                ease: "power2.inOut"
            }, 5.3);

            tl.to(sypherTitle, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out"
            }, 6.2);

            tl.to(sypherSubtitle, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out"
            }, 7.0);

            tl.to(sypherBtn, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out"
            }, 7.8);

            tl.set(sypherContainer, { pointerEvents: "auto" }, 7.8);

            tl.to(ringScaleRef.current, {
                value: 1.45,
                duration: 2.8,
                ease: "power2.out"
            }, 6.2);

        }, sectionRef);

        return () => {
            ctx.revert();
        };
    }, [lang, isMobile]);

    const renderInteractivePost = () => {
        let wordIdx = 0;
        return t.finalPostLines.map((line, lineIdx) => (
            <div key={lineIdx} className="block mb-3 sm:mb-4 last:mb-0 text-center">
                {line.split(" ").map((word, wordIdxInLine) => {
                    const currentIdx = wordIdx++;
                    return (
                        <span
                            key={wordIdxInLine}
                            ref={(el) => {
                                signalWordRefs.current[currentIdx] = el;
                            }}
                            className="inline-block mr-2 sm:mr-3 md:mr-4 text-white font-sans font-black text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl uppercase tracking-tight leading-none select-none will-change-transform drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]"
                        >
                            {word}
                        </span>
                    );
                })}
            </div>
        ));
    };

    /* ============================================================ */
    /* Renderização do Layout Estático (Mobile somente)             */
    /* ============================================================ */
    if (isMobile) {
        return (
            <section ref={sectionRef} className="relative bg-[#030304] h-screen w-full flex items-center justify-center overflow-hidden">
                {/* HUD DE BACKGROUND DO VÓRTICE (Órbitas Concéntricas) */}
                <div className="absolute w-[320px] h-[360px] pointer-events-none z-0 flex items-center justify-center opacity-40">
                    <svg viewBox="0 0 300 300" className="w-full h-full select-none pointer-events-none">
                        <line x1="150" y1="10" x2="150" y2="290" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 5" />
                        <line x1="10" y1="150" x2="290" y2="150" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 5" />
                        <circle cx="150" cy="150" r="142" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                        <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(255,255,255,0.03)" strokeDasharray="6 8" strokeWidth="1" />
                        <circle cx="150" cy="150" r="115" fill="none" stroke="rgba(239,68,68,0.03)" strokeWidth="1" />
                        <circle cx="150" cy="150" r="100" fill="none" stroke="rgba(255,255,255,0.02)" strokeDasharray="2 4" strokeWidth="1" />
                        <circle cx="150" cy="150" r="85" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                        <circle cx="150" cy="150" r="70" fill="none" stroke="rgba(239,68,68,0.04)" strokeDasharray="4 6" strokeWidth="1" />
                        <circle cx="150" cy="150" r="55" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <circle cx="150" cy="150" r="40" fill="none" stroke="rgba(255,255,255,0.02)" strokeDasharray="1 3" strokeWidth="1" />
                        <circle cx="150" cy="150" r="25" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    </svg>
                </div>

                {/* Círculo vermelho com glow em CSS nativo (Altamente leve, sem travamentos) */}
                <div className="absolute w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full border border-[#b01818]/40 bg-[#030304] shadow-[0_0_55px_rgba(176,24,24,0.4),inset_0_0_28px_rgba(176,24,24,0.2)] flex flex-col items-center justify-center z-10 pointer-events-none" />

                {/* Conteúdo Centralizado */}
                <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
                    <h2 className="text-white font-sans font-black text-5xl sm:text-6xl uppercase tracking-tighter mb-6">
                        Sypher AI
                    </h2>
                    <div className="pointer-events-auto">
                        <StartNowButton 
                            lang={lang}
                            onClick={() => onNavigate('app')} 
                        />
                    </div>
                </div>
            </section>
        );
    }

    /* ============================================================ */
    /* Renderização do Layout Animado (Desktop somente)             */
    /* ============================================================ */
    return (
        <section ref={sectionRef} className="relative bg-[#030304] overflow-hidden w-full">

            <div ref={pinRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden z-10">

                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
                    {t.decoys.map((word, idx) => (
                        <span
                            key={idx}
                            ref={(el) => {
                                decoyRefs.current[idx] = el;
                            }}
                            className="absolute font-mono text-zinc-500 tracking-wider text-xs sm:text-sm select-none uppercase will-change-transform"
                        >
                            {word}
                        </span>
                    ))}
                </div>

                <div className="absolute w-[360px] h-[360px] md:w-[600px] md:h-[600px] pointer-events-none z-0 flex items-center justify-center">
                    <svg viewBox="0 0 300 300" className="w-full h-full select-none pointer-events-none opacity-45">
                        <line x1="150" y1="10" x2="150" y2="290" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 5" />
                        <line x1="10" y1="150" x2="290" y2="150" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 5" />
                        <circle cx="150" cy="150" r="142" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                        <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(255,255,255,0.03)" strokeDasharray="6 8" strokeWidth="1" />
                        <circle cx="150" cy="150" r="115" fill="none" stroke="rgba(239,68,68,0.03)" strokeWidth="1" />
                        <circle cx="150" cy="150" r="100" fill="none" stroke="rgba(255,255,255,0.02)" strokeDasharray="2 4" strokeWidth="1" />
                        <circle cx="150" cy="150" r="85" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                        <circle cx="150" cy="150" r="70" fill="none" stroke="rgba(239,68,68,0.04)" strokeDasharray="4 6" strokeWidth="1" />
                        <circle cx="150" cy="150" r="55" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                        <circle cx="150" cy="150" r="40" fill="none" stroke="rgba(255,255,255,0.02)" strokeDasharray="1 3" strokeWidth="1" />
                        <circle cx="150" cy="150" r="25" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    </svg>
                </div>

                <div ref={threeContainerRef} className="absolute inset-0 pointer-events-none z-10 w-full h-full" />

                <div className="relative z-20 w-[95%] max-w-5xl mx-auto flex flex-col justify-center items-center pointer-events-none">
                    
                    <div ref={postContainerRef} className="w-full flex flex-col items-center justify-center will-change-transform">
                        {renderInteractivePost()}
                    </div>

                    <div 
                        ref={sypherContainerRef} 
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none will-change-transform text-center px-4"
                    >
                        <h2 ref={sypherTitleRef} className="text-white font-sans font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tighter mb-8">
                            Sypher AI
                        </h2>

                        <div ref={sypherBtnRef} className="pointer-events-auto">
                            <StartNowButton 
                                lang={lang}
                                onClick={() => onNavigate('app')} 
                            />
                        </div>
                    </div>

                </div>

            </div>

        </section>
    );
}