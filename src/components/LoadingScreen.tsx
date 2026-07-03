import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";

interface LoadingScreenProps {
  ready: boolean;
  onComplete: () => void;
  lang: "en" | "pt" | "es";
}

const STATUS_WORDS: Record<LoadingScreenProps["lang"], string[]> = {
  en: ["Calibrating engine", "Preparing workspace", "Loading refinery", "Ready"],
  pt: ["Calibrando o motor", "Preparando workspace", "Carregando refinaria", "Pronto"],
  es: ["Calibrando el motor", "Preparando workspace", "Cargando refinería", "Listo"],
};

const SQUARE_COUNT = 10;
const FILL_STEPS = Math.ceil(SQUARE_COUNT / 2);

const SHATTER_COLS = 12;
const SHATTER_ROWS = 8;

export default function LoadingScreen({ ready, onComplete, lang }: LoadingScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shatterRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [filledFromEnds, setFilledFromEnds] = useState(0);
  const words = STATUS_WORDS[lang] || STATUS_WORDS.en;

  const shatterCells = useMemo(
    () => Array.from({ length: SHATTER_COLS * SHATTER_ROWS }, (_, i) => i),
    []
  );

  // Reseta os estados visuais caso o idioma mude durante o carregamento
  useEffect(() => {
    wordRefs.current = [];
    setWordIndex(0);
    setFilledFromEnds(0);
  }, [lang]);

  useEffect(() => {
    if (filledFromEnds >= FILL_STEPS) return;
    const t = setTimeout(() => {
      setFilledFromEnds((s) => Math.min(s + 1, FILL_STEPS));
    }, 380);
    return () => clearTimeout(t);
  }, [filledFromEnds]);

  useEffect(() => {
    if (wordIndex >= words.length - 1) return;
    const t = setTimeout(() => {
      setWordIndex((i) => Math.min(i + 1, words.length - 1));
    }, 650);
    return () => clearTimeout(t);
  }, [wordIndex, words.length]);

  // Corrige a sobreposição: limpa opacidades das palavras anteriores antes de animar a nova
  useEffect(() => {
    const currentEl = wordRefs.current[wordIndex];
    if (!currentEl) return;

    // Força todas as outras palavras a ficarem ocultas para evitar sobreposição
    wordRefs.current.forEach((el, idx) => {
      if (el && idx !== wordIndex) {
        gsap.set(el, { opacity: 0, y: 0 });
      }
    });

    gsap.fromTo(
      currentEl,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
  }, [wordIndex, lang]);

  // Sequência de saída: só executa quando o site está pronto E a animação de progresso terminou
  useEffect(() => {
    const isVisualsComplete = filledFromEnds >= FILL_STEPS && wordIndex >= words.length - 1;
    if (!ready || !isVisualsComplete) return;

    const tl = gsap.timeline({
      delay: 0.35,
      onComplete: () => onComplete(),
    });

    tl.to(contentRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power1.out",
    });

    const cells = shatterRef.current?.children;
    if (cells && cells.length) {
      const cellArray = Array.from(cells);
      cellArray.forEach((cell) => {
        gsap.set(cell, { transformOrigin: "center center" });
      });

      tl.to(
        cellArray,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power1.in",
          stagger: {
            each: 0.9 / cellArray.length,
            from: "random",
          },
        },
        0.1
      );
    }

    tl.set(rootRef.current, { display: "none" });

    return () => {
      tl.kill();
    };
  }, [ready, filledFromEnds, wordIndex, words.length, onComplete]);

  const isFilled = (index: number) => {
    const distanceFromNearestEnd = Math.min(index, SQUARE_COUNT - 1 - index);
    return distanceFromNearestEnd < filledFromEnds;
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Grid de transição */}
      <div
        ref={shatterRef}
        className="absolute inset-0 grid pointer-events-none"
        style={{
          gridTemplateColumns: `repeat(${SHATTER_COLS}, 1fr)`,
          gridTemplateRows: `repeat(${SHATTER_ROWS}, 1fr)`,
        }}
      >
        {shatterCells.map((i) => (
          <div key={i} className="bg-[#030304]" />
        ))}
      </div>

      <div ref={contentRef} className="relative flex flex-col items-center">
        {/* Quadrados de carregamento */}
        <div className="flex items-center gap-2">
          {Array.from({ length: SQUARE_COUNT }, (_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 border transition-colors duration-300 ${
                isFilled(i)
                  ? "bg-red-500 border-red-500"
                  : "bg-transparent border-zinc-700"
              }`}
            />
          ))}
        </div>

        {/* Textos de status */}
        <div className="mt-8 h-4 relative overflow-hidden flex items-center justify-center min-w-[180px]">
          {words.map((w, i) => (
            <span
              key={w}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className="absolute text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-zinc-500"
              style={{ opacity: i === 0 ? 1 : 0 }} // Apenas a primeira palavra inicia visível no HTML
            >
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}