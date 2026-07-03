import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Language } from "../translations";

interface NeuralCubeSceneProps {
  onReady?: () => void;
  reducedMotion?: boolean;
  lang: Language;
}

/* ============================================================ */
/* Pool de frases para as caixas de texto digitadas nos nós,    */
/* localizadas por idioma. Tema: refinamento de texto com IA    */
/* para LinkedIn, X e e-mail.                                   */
/* ============================================================ */
const LABEL_PHRASES: Record<Language, string[]> = {
  pt: [
    "Refinando tom para LinkedIn...",
    "Ajustando clareza do post...",
    "Sintetizando ideia em 1 thread",
    "Removendo ruído do texto",
    "Calibrando persuasão...",
    "Formatando para publicação",
    "Polindo parágrafo final",
    "Detectando tom corporativo",
  ],
  en: [
    "Refining tone for LinkedIn...",
    "Sharpening post clarity...",
    "Condensing idea into 1 thread",
    "Removing noise from text",
    "Calibrating persuasion...",
    "Formatting for publishing",
    "Polishing final paragraph",
    "Detecting corporate tone",
  ],
  es: [
    "Refinando tono para LinkedIn...",
    "Ajustando claridad del post...",
    "Sintetizando idea en 1 hilo",
    "Eliminando ruido del texto",
    "Calibrando persuasión...",
    "Formateando para publicar",
    "Puliendo párrafo final",
    "Detectando tono corporativo",
  ],
};

type NodeLabel = {
  id: number; // chave estável para a div React
  nodeIndex: number; // índice do nó no array de nós
  text: string;
};

const MAX_LABELS_PER_CYCLE = 5;
const MIN_LABELS_PER_CYCLE = 3;

export default function NeuralCubeScene({ onReady, reducedMotion, lang }: NeuralCubeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelLayerRef = useRef<HTMLDivElement>(null);
  // refs para as divs de cada label ativo (chave = id do label)
  const labelElRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const [activeLabels, setActiveLabels] = useState<NodeLabel[]>([]);
  
  // Detecção síncrona no cliente (amigável para SSR)
  const [isMobile, setIsMobile] = useState<boolean | null>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return null;
  });

  // Salva uma referência estável da função onReady para evitar recriações de ciclo de vida
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  // 1. Monitora redimensionamento/rotação de tela para atualizar o isMobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    // Se ainda for null (primeiro mount pós-SSR), define o valor atual
    if (isMobile === null) {
      handleResize();
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  // 1.5 🛡️ Se for mobile, dispara o onReady de forma estável para destravar o loading do pai
  useEffect(() => {
    if (isMobile === true) {
      onReadyRef.current?.();
    }
  }, [isMobile]);

  // mantém o idioma atual acessível dentro do loop de animação sem precisar
  // recriar toda a cena 3D (que é cara) a cada troca de idioma
  const langRef = useRef<Language>(lang);
  useEffect(() => {
    langRef.current = lang;
  }, [lang]);

  useEffect(() => {
    // 🛡️ Ignora totalmente a execução em mobile ou durante o estado indefinido (SSR)
    if (isMobile === null || isMobile === true) return;

    // 🛡️ Captura o container com verificação inicial
    const container = containerRef.current;
    if (!container) return;

    let frameId = 0;
    let isMounted = true;

    // ---- Design tokens (inalterados) ----
    const NODE_COUNT = 56;
    const SPHERE_RADIUS = 1.9;
    const ACTIVE_NODE_RATIO = 0.05;
    const PACKET_COUNT = 10;
    const COLOR_STRUCTURE = 0xffffff;
    const COLOR_NODE_DIM = 0x52525b;
    const COLOR_ACCENT = 0xef4444;

    const PROXIMITY_RADIUS_PX = 70;
    const NODE_COOLDOWN_SEC = 0.9;
    const MAX_CONCURRENT_RIPPLES = 5;
    const HOP_DURATION = 0.18;
    const WAVE_SIGMA = 0.65;

    const ROTATE_SENSITIVITY = 0.0045;
    const PITCH_LIMIT = 1.1;
    const INERTIA_DECAY = 0.92;
    const IDLE_ROTATE_SPEED = 0.05;
    const IDLE_WOBBLE_AMPLITUDE = 0.04;

    const FRAGMENT_PERIOD = 9;
    const SCATTER_MIN = 1.0;
    const SCATTER_MAX = 2.6;
    const JITTER_AMPLITUDE = 0.12;

    // ---- Labels de texto ----
    const SPHERE_REST_WINDOW = 0.42;
    let labelCycleKey = -1;
    let nextLabelId = 0;

    // ---- Scene / camera / renderer ----
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 9.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    // ---- Funções de geometria e grafo (inalteradas) ----
    function fibonacciSpherePoints(count: number, radius: number): THREE.Vector3[] {
      const points: THREE.Vector3[] = [];
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = goldenAngle * i;
        const x = Math.cos(theta) * radiusAtY;
        const z = Math.sin(theta) * radiusAtY;
        points.push(new THREE.Vector3(x, y, z).multiplyScalar(radius));
      }
      return points;
    }

    const HUB_INDEX = NODE_COUNT;
    const homePositions: THREE.Vector3[] = fibonacciSpherePoints(NODE_COUNT, SPHERE_RADIUS);
    homePositions.push(new THREE.Vector3(0, 0, 0));
    const totalNodeCount = NODE_COUNT + 1;

    type Edge = { a: number; b: number };
    const edges: Edge[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      edges.push({ a: HUB_INDEX, b: i });
    }

    const adjacency: number[][] = Array.from({ length: totalNodeCount }, () => []);
    edges.forEach(({ a, b }) => {
      adjacency[a].push(b);
      adjacency[b].push(a);
    });

    function computeBFSDepths(startIdx: number) {
      const nodeDepth = new Float32Array(totalNodeCount).fill(-1);
      nodeDepth[startIdx] = 0;
      const queue: number[] = [startIdx];
      let head = 0;
      let maxDepth = 0;
      while (head < queue.length) {
        const current = queue[head++];
        const d = nodeDepth[current];
        for (const neighbor of adjacency[current]) {
          if (nodeDepth[neighbor] === -1) {
            nodeDepth[neighbor] = d + 1;
            if (d + 1 > maxDepth) maxDepth = d + 1;
            queue.push(neighbor);
          }
        }
      }
      return { nodeDepth, maxDepth: Math.max(maxDepth, 1) };
    }

    type RippleEvent = {
      startTime: number;
      nodeDepth: Float32Array;
      maxDepth: number;
    };
    const rippleEvents: RippleEvent[] = [];

    function triggerRipple(startIdx: number, now: number) {
      if (rippleEvents.length >= MAX_CONCURRENT_RIPPLES) rippleEvents.shift();
      const { nodeDepth, maxDepth } = computeBFSDepths(startIdx);
      rippleEvents.push({ startTime: now, nodeDepth, maxDepth });
    }

    // ---- Nós ----
    type NodeEntry = {
      mesh: THREE.Mesh;
      isHub: boolean;
      homePosition: THREE.Vector3;
      chaosOffset: THREE.Vector3;
      fragPhaseOffset: number;
      driftSeed: THREE.Vector3;
      isPermanentActive: boolean;
      pulsePhase: number;
      pulseSpeed: number;
      baseScale: number;
      wasNear: boolean;
      lastTriggerTime: number;
    };

    const nodeGeometry = new THREE.SphereGeometry(1, 10, 10);
    const dimColor = new THREE.Color(COLOR_NODE_DIM);
    const accentColor = new THREE.Color(COLOR_ACCENT);
    const tmpColor = new THREE.Color();

    const nodeEntries: NodeEntry[] = homePositions.map((home, idx) => {
      const isHub = idx === HUB_INDEX;
      const isPermanentActive = isHub ? true : Math.random() < ACTIVE_NODE_RATIO;
      const baseScale = isHub ? 0.1 : isPermanentActive ? 0.07 : 0.04;

      const material = new THREE.MeshBasicMaterial({
        color: isHub ? accentColor : dimColor,
        transparent: true,
        opacity: isHub ? 0.95 : 0.5,
      });

      const mesh = new THREE.Mesh(nodeGeometry, material);
      mesh.position.copy(home);
      mesh.scale.setScalar(baseScale);
      root.add(mesh);

      const randomDir = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ).normalize();
      const scatterDist = SCATTER_MIN + Math.random() * (SCATTER_MAX - SCATTER_MIN);

      return {
        mesh,
        isHub,
        homePosition: home.clone(),
        chaosOffset: isHub ? new THREE.Vector3() : randomDir.multiplyScalar(scatterDist),
        fragPhaseOffset: Math.random() * 0.6,
        driftSeed: new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10),
        isPermanentActive,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.5 + Math.random() * 0.6,
        baseScale,
        wasNear: false,
        lastTriggerTime: -Infinity,
      };
    });

    const labelCandidateIndices: number[] = Array.from({ length: NODE_COUNT }, (_, i) => i);
    for (let i = labelCandidateIndices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [labelCandidateIndices[i], labelCandidateIndices[j]] = [
        labelCandidateIndices[j],
        labelCandidateIndices[i],
      ];
    }

    // ---- Arestas ----
    const edgeCount = edges.length;
    const edgePositionsArr = new Float32Array(edgeCount * 2 * 3);
    const edgeProgressArr = new Float32Array(edgeCount * 2);
    const edgeSeedArr = new Float32Array(edgeCount * 2);
    const edgeFreqArr = new Float32Array(edgeCount * 2);

    edges.forEach((_, idx) => {
      edgeProgressArr[idx * 2] = 0;
      edgeProgressArr[idx * 2 + 1] = 1;
      const seed = Math.random();
      edgeSeedArr[idx * 2] = seed;
      edgeSeedArr[idx * 2 + 1] = seed;
      const freq = 1 + Math.random() * 1.4;
      edgeFreqArr[idx * 2] = freq;
      edgeFreqArr[idx * 2 + 1] = freq;
    });

    const edgeGeometry = new THREE.BufferGeometry();
    const edgePositionAttribute = new THREE.BufferAttribute(edgePositionsArr, 3);
    edgePositionAttribute.setUsage(THREE.DynamicDrawUsage);
    edgeGeometry.setAttribute("position", edgePositionAttribute);
    edgeGeometry.setAttribute("aProgress", new THREE.BufferAttribute(edgeProgressArr, 1));
    edgeGeometry.setAttribute("aSeed", new THREE.BufferAttribute(edgeSeedArr, 1));
    edgeGeometry.setAttribute("aFreq", new THREE.BufferAttribute(edgeFreqArr, 1));

    const edgeMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(COLOR_STRUCTURE) },
        uBaseOpacity: { value: 0.14 },
      },
      vertexShader: `
        attribute float aProgress;
        attribute float aSeed;
        attribute float aFreq;
        uniform float uTime;
        varying float vFlow;
        void main() {
          float wave = 0.5 + 0.5 * sin(aProgress * 6.2831853 * aFreq - uTime * 1.6 + aSeed * 6.2831853);
          vFlow = wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying float vFlow;
        uniform vec3 uColor;
        uniform float uBaseOpacity;
        void main() {
          float opacity = uBaseOpacity * (0.35 + 0.65 * vFlow);
          gl_FragColor = vec4(uColor, clamp(opacity, 0.0, 1.0));
        }
      `,
    });

    const edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    root.add(edgeLines);

    // ---- Pacotes ----
    const packetGeometry = new THREE.SphereGeometry(1, 8, 8);
    const packetMaterial = new THREE.MeshBasicMaterial({
      color: COLOR_ACCENT,
      transparent: true,
      opacity: 0.85,
    });
    const packetMesh = new THREE.InstancedMesh(packetGeometry, packetMaterial, PACKET_COUNT);
    root.add(packetMesh);

    type Packet = { edge: Edge; t: number; speed: number };
    function randomEdge() {
      return edges[Math.floor(Math.random() * edges.length)];
    }
    const packets: Packet[] = Array.from({ length: PACKET_COUNT }, () => ({
      edge: randomEdge(),
      t: Math.random(),
      speed: 0.2 + Math.random() * 0.25,
    }));

    const dummy = new THREE.Object3D();
    const PACKET_SCALE = 0.045;
    const currentPositions: THREE.Vector3[] = homePositions.map((p) => p.clone());

    function updatePackets() {
      if (!isMounted) return;
      packets.forEach((packet, i) => {
        const a = currentPositions[packet.edge.a];
        const b = currentPositions[packet.edge.b];
        dummy.position.lerpVectors(a, b, packet.t);
        dummy.scale.setScalar(PACKET_SCALE);
        dummy.updateMatrix();
        packetMesh.setMatrixAt(i, dummy.matrix);
      });
      packetMesh.instanceMatrix.needsUpdate = true;
    }

    // ---- Rotação e interação ----
    let yaw = 0;
    let pitch = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let dragVelocityYaw = 0;
    let dragVelocityPitch = 0;

    const getContainer = () => containerRef.current;

    function handlePointerDown(e: PointerEvent) {
      const currentContainer = getContainer();
      if (!currentContainer) return;
      isDragging = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      dragVelocityYaw = 0;
      dragVelocityPitch = 0;
      currentContainer.style.cursor = "grabbing";
    }

    function handlePointerUp() {
      const currentContainer = getContainer();
      if (!currentContainer) return;
      isDragging = false;
      currentContainer.style.cursor = "grab";
    }

    const pointer = { x: -9999, y: -9999, active: false };

    function handlePointerMove(e: PointerEvent) {
      const currentContainer = getContainer();
      if (!currentContainer) return;

      const rect = currentContainer.getBoundingClientRect();
      const withinX = e.clientX >= rect.left && e.clientX <= rect.right;
      const withinY = e.clientY >= rect.top && e.clientY <= rect.bottom;
      pointer.active = withinX && withinY;
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;

      if (isDragging) {
        const dx = e.clientX - lastPointerX;
        const dy = e.clientY - lastPointerY;
        yaw += dx * ROTATE_SENSITIVITY;
        pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch + dy * ROTATE_SENSITIVITY));
        dragVelocityYaw = dx * ROTATE_SENSITIVITY;
        dragVelocityPitch = dy * ROTATE_SENSITIVITY;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
      }
    }

    container.style.cursor = "grab";
    container.style.touchAction = "none";
    container.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);

    const handleResize = () => {
      const currentContainer = getContainer();
      if (!currentContainer) return;
      const w = currentContainer.clientWidth;
      const h = currentContainer.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    function smoothstep(t: number) {
      const c = Math.max(0, Math.min(1, t));
      return c * c * (3 - 2 * c);
    }

    function fragmentAmount(cyclePos: number) {
      const REST1_END = 0.42;
      const OUT_END = 0.55;
      const HOLD_END = 0.72;
      const IN_END = 0.86;
      if (cyclePos < REST1_END) return 0;
      if (cyclePos < OUT_END) return smoothstep((cyclePos - REST1_END) / (OUT_END - REST1_END));
      if (cyclePos < HOLD_END) return 1;
      if (cyclePos < IN_END) return 1 - smoothstep((cyclePos - HOLD_END) / (IN_END - HOLD_END));
      return 0;
    }

    function pickRandomCount(min: number, max: number) {
      return min + Math.floor(Math.random() * (max - min + 1));
    }

    function spawnLabelsForCycle() {
      const count = pickRandomCount(MIN_LABELS_PER_CYCLE, MAX_LABELS_PER_CYCLE);
      const shuffled = [...labelCandidateIndices].sort(() => Math.random() - 0.5);
      const chosenIndices = shuffled.slice(0, count);
      const phrasesForLang = LABEL_PHRASES[langRef.current] || LABEL_PHRASES.en;
      const chosenTexts = [...phrasesForLang].sort(() => Math.random() - 0.5);

      const newLabels: NodeLabel[] = chosenIndices.map((nodeIndex, i) => ({
        id: nextLabelId++,
        nodeIndex,
        text: chosenTexts[i % chosenTexts.length],
      }));

      if (isMounted) setActiveLabels(newLabels);
    }

    function clearLabels() {
      if (isMounted) setActiveLabels([]);
    }

    // ---- Loop ----
    const clock = new THREE.Clock();
    let started = false;
    const tempVec = new THREE.Vector3();
    const screenVec = new THREE.Vector3();
    const jitterVec = new THREE.Vector3();
    const nodeActivation = new Float32Array(totalNodeCount);
    const nodeFragAmount = new Float32Array(totalNodeCount);

    const animate = () => {
      if (!isMounted) {
        cancelAnimationFrame(frameId);
        return;
      }
      frameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const now = clock.elapsedTime;

      if (!reducedMotion) {
        // ---- Rotação ----
        if (!isDragging) {
          yaw += dt * IDLE_ROTATE_SPEED;
          if (Math.abs(dragVelocityYaw) > 0.00005 || Math.abs(dragVelocityPitch) > 0.00005) {
            yaw += dragVelocityYaw;
            pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch + dragVelocityPitch));
            dragVelocityYaw *= INERTIA_DECAY;
            dragVelocityPitch *= INERTIA_DECAY;
          }
        }
        root.rotation.y = yaw;
        root.rotation.x = pitch + (isDragging ? 0 : Math.sin(now * 0.12) * IDLE_WOBBLE_AMPLITUDE);

        // ---- Fragmentação ----
        const rawCyclePos = (now % FRAGMENT_PERIOD) / FRAGMENT_PERIOD;
        const cycleNumber = Math.floor(now / FRAGMENT_PERIOD);
        const inRestWindow = rawCyclePos < SPHERE_REST_WINDOW;

        if (inRestWindow && labelCycleKey !== cycleNumber) {
          labelCycleKey = cycleNumber;
          spawnLabelsForCycle();
        } else if (!inRestWindow && labelCycleKey === cycleNumber) {
          labelCycleKey = -1;
          clearLabels();
        }

        nodeEntries.forEach((entry, idx) => {
          if (entry.isHub) {
            entry.mesh.position.copy(entry.homePosition);
            currentPositions[idx].copy(entry.homePosition);
            nodeFragAmount[idx] = 0;
            return;
          }
          const cyclePos = ((now + entry.fragPhaseOffset) % FRAGMENT_PERIOD) / FRAGMENT_PERIOD;
          const amt = fragmentAmount(cyclePos);
          nodeFragAmount[idx] = amt;
          jitterVec
            .set(
              Math.sin(now * 1.7 + entry.driftSeed.x),
              Math.sin(now * 2.1 + entry.driftSeed.y),
              Math.sin(now * 1.3 + entry.driftSeed.z)
            )
            .multiplyScalar(JITTER_AMPLITUDE * amt);
          tempVec.copy(entry.homePosition).addScaledVector(entry.chaosOffset, amt).add(jitterVec);
          entry.mesh.position.copy(tempVec);
          currentPositions[idx].copy(tempVec);
        });

        root.updateMatrixWorld(true);

        // ---- Proximidade do mouse -> ripple ----
        const currentContainer = getContainer();
        if (pointer.active && currentContainer && !isDragging) {
          const containerWidth = currentContainer.clientWidth;
          const containerHeight = currentContainer.clientHeight;

          nodeEntries.forEach((entry, i) => {
            tempVec.setFromMatrixPosition(entry.mesh.matrixWorld);
            screenVec.copy(tempVec).project(camera);
            const px = (screenVec.x * 0.5 + 0.5) * containerWidth;
            const py = (1 - (screenVec.y * 0.5 + 0.5)) * containerHeight;
            const dx = px - pointer.x;
            const dy = py - pointer.y;
            const isNear = dx * dx + dy * dy < PROXIMITY_RADIUS_PX * PROXIMITY_RADIUS_PX;

            if (isNear && !entry.wasNear && now - entry.lastTriggerTime > NODE_COOLDOWN_SEC) {
              triggerRipple(i, now);
              entry.lastTriggerTime = now;
            }
            entry.wasNear = isNear;
          });
        } else {
          nodeEntries.forEach((entry) => { entry.wasNear = false; });
        }

        // ---- Ativação dos pontos ----
        nodeActivation.fill(0);
        for (let e = rippleEvents.length - 1; e >= 0; e--) {
          const ev = rippleEvents[e];
          const elapsed = now - ev.startTime;
          const wavefront = elapsed / HOP_DURATION;
          const lifeLimit = ev.maxDepth + WAVE_SIGMA * 3;
          if (wavefront > lifeLimit) {
            rippleEvents.splice(e, 1);
            continue;
          }
          const envelope = Math.max(0, 1 - wavefront / (ev.maxDepth + 1));
          for (let i = 0; i < totalNodeCount; i++) {
            const depth = ev.nodeDepth[i];
            if (depth < 0) continue;
            const diff = depth - wavefront;
            const contribution = Math.exp(-(diff * diff) / (2 * WAVE_SIGMA * WAVE_SIGMA)) * envelope;
            if (contribution > nodeActivation[i]) nodeActivation[i] = contribution;
          }
        }

        // ---- Aplica cor/escala aos nós ----
        nodeEntries.forEach((entry, i) => {
          const basePulse = entry.isPermanentActive
            ? 0.75 + Math.sin(now * entry.pulseSpeed + entry.pulsePhase) * 0.35
            : 0;
          const level = Math.max(basePulse, nodeActivation[i]);
          const fragFade = 1 - 0.3 * nodeFragAmount[i];
          entry.mesh.scale.setScalar(entry.baseScale * (1 + level * 1.3));
          const mat = entry.mesh.material as THREE.MeshBasicMaterial;
          tmpColor.copy(dimColor).lerp(accentColor, Math.min(level, 1));
          mat.color.copy(entry.isHub ? accentColor : tmpColor);
          mat.opacity = (0.4 + Math.min(level, 1) * 0.55) * fragFade;
        });

        // ---- Atualiza linhas ----
        edges.forEach(({ a, b }, idx) => {
          const pa = currentPositions[a];
          const pb = currentPositions[b];
          edgePositionsArr.set([pa.x, pa.y, pa.z, pb.x, pb.y, pb.z], idx * 6);
        });
        edgePositionAttribute.needsUpdate = true;
        edgeMaterial.uniforms.uTime.value = now;

        // ---- Pacotes ----
        packets.forEach((packet) => {
          packet.t += dt * packet.speed;
          if (packet.t >= 1) {
            packet.t = 0;
            packet.edge = randomEdge();
          }
        });
        updatePackets();

        // ---- Posiciona as caixas de texto ----
        const labelLayer = labelLayerRef.current;
        if (labelLayer) {
          const layerWidth = container.clientWidth;
          const layerHeight = container.clientHeight;

          labelElRefs.current.forEach((el, id) => {
            const nodeIndexAttr = el.dataset.nodeIndex;
            if (nodeIndexAttr === undefined) return;
            const nodeIndex = Number(nodeIndexAttr);
            const entry = nodeEntries[nodeIndex];
            if (!entry) return;

            tempVec.setFromMatrixPosition(entry.mesh.matrixWorld);
            screenVec.copy(tempVec).project(camera);
            const px = (screenVec.x * 0.5 + 0.5) * layerWidth;
            const py = (1 - (screenVec.y * 0.5 + 0.5)) * layerHeight;

            el.style.transform = `translate3d(${px}px, ${py}px, 0)`;
          });
        }
      }

      renderer.render(scene, camera);

      if (!started) {
        started = true;
        onReadyRef.current?.();
      }
    };
    animate();

    // ---- Cleanup ----
    return () => {
      isMounted = false;
      cancelAnimationFrame(frameId);
      container.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      nodeGeometry.dispose();
      edgeGeometry.dispose();
      edgeMaterial.dispose();
      packetGeometry.dispose();
      packetMaterial.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.material instanceof THREE.MeshBasicMaterial) {
          obj.material.dispose();
        }
      });
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion, isMobile]); // Removido onReady das dependências para usar a ref estável e evitar loop de mounts

  // Retorna nulo no render caso seja mobile para evitar montagem do DOM
  if (isMobile) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 flex items-center justify-center"
    >
      {/* Camada 2D sobreposta para as caixas de texto */}
      <div
        ref={labelLayerRef}
        className="absolute inset-0 z-10 pointer-events-none overflow-visible"
      >
        {activeLabels.map((label) => (
          <NodeTextBox
            key={label.id}
            label={label}
            registerEl={(el) => {
              if (el) {
                labelElRefs.current.set(label.id, el);
              } else {
                labelElRefs.current.delete(label.id);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================ */
/* Caixa de texto individual com efeito de digitação.            */
/* Posicionada via transform (atualizado no loop do Three.js).   */
/* ============================================================ */
function NodeTextBox({
  label,
  registerEl,
}: {
  label: NodeLabel;
  registerEl: (el: HTMLDivElement | null) => void;
}) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    let charIndex = 0;
    let cancelled = false;
    const fullText = label.text;
    const msPerChar = 45;

    el.textContent = "";

    function typeNext() {
      if (cancelled) return;
      charIndex++;
      el!.textContent = fullText.slice(0, charIndex);
      if (charIndex < fullText.length) {
        setTimeout(typeNext, msPerChar);
      }
    }
    typeNext();

    return () => {
      cancelled = true;
    };
  }, [label.text]);

  return (
    <div
      ref={(el) => registerEl(el)}
      data-node-index={label.nodeIndex}
      className="absolute will-change-transform"
      style={{ left: 0, top: 0 }}
    >
      <div className="animate-[sypherLabelFadeIn_0.35s_ease-out] -translate-x-1/2 -translate-y-[120%]">
        <div className="px-2 py-1 border border-red-500/30 bg-black/80 backdrop-blur-[2px] whitespace-nowrap shadow-[0_4px_18px_rgba(0,0,0,0.5)]">
          <span
            ref={textRef}
            className="text-[9px] font-mono text-red-400 tracking-wide"
          />
          <span className="inline-block w-[1px] h-2.5 bg-red-500/70 align-middle ml-0.5 animate-pulse" />
        </div>
      </div>
      <style>{`
        @keyframes sypherLabelFadeIn {
          from { opacity: 0; }
        }
      `}</style>
    </div>
  );
}