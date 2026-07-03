import { useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface WiredGridBackgroundProps {
  /** Opacidade das linhas neutras do grid (zinc). Default 0.15 */
  opacity?: number;
  /** Opacidade dos "fios" vermelhos animados. Default 0.25 */
  wireOpacity?: number;
  /** Opacidade máxima do brilho vermelho de reflexo ao final do scroll. Default 0.9 */
  reflectionOpacity?: number;
  /** Opacidade máxima do gradiente escuro inferior ao final do scroll. Default 0.85 */
  fadeOpacity?: number;
}

/**
 * Mesma lógica de geração de linhas do AbstractGridBackground original:
 * grid não-uniforme, simétrico a partir do centro, com espaçamento
 * crescente em direção às bordas.
 */
function generateLines(totalGaps: number, baseGap: number, growth: number): number[] {
  const positions: number[] = [50];
  let gap = baseGap;
  let right = 50;
  let left = 50;

  for (let i = 0; i < totalGaps; i++) {
    right += gap;
    left -= gap;
    if (right <= 100) positions.push(right);
    if (left >= 0) positions.unshift(left);
    gap *= growth;
  }

  return [...new Set(positions.map((p) => Math.round(p * 100) / 100))].sort(
    (a, b) => a - b
  );
}

/**
 * A partir do array de linhas geradas, escolhe algumas posições (por fração
 * 0..1 ao longo do array) para servirem de "trilho" para os fios vermelhos.
 * Sempre retorna valores válidos, independente do tamanho do array.
 */
function pickByFraction(lines: number[], fractions: number[]): number[] {
  const picked = fractions.map((f) => {
    const idx = Math.min(lines.length - 1, Math.max(0, Math.round(f * (lines.length - 1))));
    return lines[idx];
  });
  return [...new Set(picked)];
}

export function WiredGridBackground({
  opacity = 0.15,
  wireOpacity = 0.25,
  reflectionOpacity = 1,
  fadeOpacity = 0.85,
}: WiredGridBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // máscara que revela a camada vermelha de cima pra baixo, com cauda suave
  const reflectionMaskStopRef = useRef<SVGStopElement>(null);
  const reflectionMaskTailStopRef = useRef<SVGStopElement>(null);
  // camada vermelha (cópia das mesmas linhas, só que tingidas)
  const reflectionGroupRef = useRef<SVGGElement>(null);
  // gradiente escuro fixo na base, cuja intensidade reage ao scroll
  const fadeRef = useRef<HTMLDivElement>(null);

  const { cols, rows } = useMemo(() => {
    return {
      cols: generateLines(5, 4, 1.35),
      rows: generateLines(4, 6, 1.3),
    };
  }, []);

  const wireCols = useMemo(() => pickByFraction(cols, [0.28, 0.52, 0.74]), [cols]);
  const wireRows = useMemo(() => pickByFraction(rows, [0.22, 0.62]), [rows]);

  useLayoutEffect(() => {
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !rootRef.current) return;

    // estado inicial: nada de vermelho revelado, fade na base ainda apagado
    gsap.set(reflectionGroupRef.current, { opacity: reflectionOpacity });
    gsap.set([reflectionMaskStopRef.current, reflectionMaskTailStopRef.current], {
      attr: { offset: '0%' },
    });
    gsap.set(fadeRef.current, { opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: rootRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 0.4,
      },
    });

    // a "frente" da onda e a cauda dela descem juntas, defasadas,
    // criando o rastro vermelho mais forte conforme avança
    tl.to(
      reflectionMaskStopRef.current,
      { attr: { offset: '100%' }, ease: 'none', duration: 1 },
      0
    ).to(
      reflectionMaskTailStopRef.current,
      { attr: { offset: '100%' }, ease: 'none', duration: 1 },
      0.18 // a cauda fica 18% do scroll atrás da frente da onda
    );

    // gradiente escuro da base: já existe fixo, só ganha intensidade com o scroll
    tl.to(fadeRef.current, { opacity: fadeOpacity, ease: 'none', duration: 1 }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reflectionOpacity, fadeOpacity]);

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          {/* máscara vertical: revela a camada vermelha de cima pra baixo,
              com uma cauda defasada que sustenta o rastro mais forte atrás da onda */}
          <linearGradient id="sypherReflectionMask" x1="0" y1="0" x2="0" y2="1">
            <stop ref={reflectionMaskTailStopRef} offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop ref={reflectionMaskStopRef} offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="sypherReflectionMaskTarget">
            <rect x="0" y="0" width="100" height="100" fill="url(#sypherReflectionMask)" />
          </mask>
          {/* glow leve aplicado só na camada de reflexo vermelho */}
          <filter id="sypherReflectionGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid neutro de base, igual ao original */}
        {cols.map((x, i) => (
          <line
            key={`col-${i}`}
            x1={x}
            y1={0}
            x2={x}
            y2={100}
            stroke="currentColor"
            strokeWidth="0.05"
            vectorEffect="non-scaling-stroke"
            className="text-zinc-500"
            style={{ opacity }}
          />
        ))}
        {rows.map((y, i) => (
          <line
            key={`row-${i}`}
            x1={0}
            y1={y}
            x2={100}
            y2={y}
            stroke="currentColor"
            strokeWidth="0.05"
            vectorEffect="non-scaling-stroke"
            className="text-zinc-500"
            style={{ opacity }}
          />
        ))}

        {/* Camada de reflexo: as MESMAS linhas do grid, tingidas de vermelho,
            reveladas progressivamente pela máscara conforme o scroll avança.
            Fica restrita às linhas do grid — nunca cobre área fora delas. */}
        <g ref={reflectionGroupRef} mask="url(#sypherReflectionMaskTarget)" filter="url(#sypherReflectionGlow)">
          {cols.map((x, i) => (
            <line
              key={`reflect-col-${i}`}
              x1={x}
              y1={0}
              x2={x}
              y2={100}
              stroke="#ef4444"
              strokeWidth="0.12"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {rows.map((y, i) => (
            <line
              key={`reflect-row-${i}`}
              x1={0}
              y1={y}
              x2={100}
              y2={y}
              stroke="#ef4444"
              strokeWidth="0.12"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {/* Fios vermelhos — pulsos sutis percorrendo linhas específicas do grid */}
        {wireCols.map((x, i) => (
          <line
            key={`wire-col-${i}`}
            x1={x}
            y1={0}
            x2={x}
            y2={100}
            stroke="#ef4444"
            strokeWidth="0.12"
            strokeDasharray="2 14"
            vectorEffect="non-scaling-stroke"
            style={{
              opacity: wireOpacity,
              animation: `sypherWireFlow ${7 + i * 1.6}s linear infinite`,
              animationDelay: `${i * 0.9}s`,
            }}
          />
        ))}
        {wireRows.map((y, i) => (
          <line
            key={`wire-row-${i}`}
            x1={0}
            y1={y}
            x2={100}
            y2={y}
            stroke="#ef4444"
            strokeWidth="0.12"
            strokeDasharray="2 14"
            vectorEffect="non-scaling-stroke"
            style={{
              opacity: wireOpacity,
              animation: `sypherWireFlow ${8 + i * 1.4}s linear infinite`,
              animationDelay: `${i * 1.2}s`,
            }}
          />
        ))}

        <style>{`
          @keyframes sypherWireFlow {
            to { stroke-dashoffset: -160; }
          }
          @media (prefers-reduced-motion: reduce) {
            line[style*="sypherWireFlow"] { animation: none !important; }
          }
        `}</style>
      </svg>

      {/* Gradiente escuro fixo na base — cobre só esta camada (a grade),
          nunca o conteúdo real à frente, pois fica dentro do mesmo container
          absolute inset-0 do grid. Intensidade reage ao scroll. */}
      <div
        ref={fadeRef}
        className="absolute inset-x-0 bottom-0 h-4/5"
        style={{
          background: 'linear-gradient(to top, #030304 0%, rgba(3,3,4,0.6) 45%, transparent 100%)',
          opacity: 0,
        }}
      />
    </div>
  );
}