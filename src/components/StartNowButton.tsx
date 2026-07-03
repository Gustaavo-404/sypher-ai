import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

type Language = "pt" | "en" | "es";

interface StartNowButtonProps {
  lang: Language;
  onClick: () => void;
}

const TEXTS: Record<Language, string> = {
  pt: "Começar Agora",
  en: "Start Now",
  es: "Empezar Ahora",
};

export default function StartNowButton({ lang, onClick }: StartNowButtonProps) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const arrowRightRef = useRef<HTMLSpanElement>(null);
  const arrowLeftRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const label = TEXTS[lang] || TEXTS.en;
  const letters = label.split("");

  lettersRef.current = [];

  const handleEnter = () => {
    tlRef.current?.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    tl.to(arrowRightRef.current, {
      opacity: 0,
      x: 10,
      duration: 0.25,
      ease: "power2.in",
    })
      .to(
        lettersRef.current,
        {
          x: 6,
          duration: 0.32,
          ease: "power2.out",
          stagger: 0.018,
        },
        0
      )
      .fromTo(
        arrowLeftRef.current,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
        0.08
      );
  };

  const handleLeave = () => {
    tlRef.current?.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;

    tl.to(arrowLeftRef.current, {
      opacity: 0,
      x: -10,
      duration: 0.22,
      ease: "power2.in",
    })
      .to(
        lettersRef.current,
        {
          x: 0,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.015,
        },
        0
      )
      .fromTo(
        arrowRightRef.current,
        { opacity: 0, x: 10 },
        { opacity: 1, x: 0, duration: 0.28, ease: "power2.out" },
        0.06
      );
  };

  return (
    <button
      ref={rootRef}
      type="button"
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      onTouchEnd={() => setTimeout(handleLeave, 400)}
      className="group relative inline-flex items-center gap-1.5 sm:gap-2.5 bg-white text-[#030304] px-5 py-3 sm:px-7 sm:py-3.5 text-[11px] sm:text-[13px] font-sans font-bold uppercase tracking-[0.15em] cursor-pointer overflow-hidden select-none whitespace-nowrap max-w-full justify-center"
    >
      {/* Seta esquerda responsiva */}
      <span
        ref={arrowLeftRef}
        className="inline-flex items-center opacity-0 shrink-0"
        style={{ transform: "translateX(-10px)" }}
      >
        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </span>

      {/* Contêiner das letras sem quebra de linha interna */}
      <span className="inline-flex whitespace-nowrap">
        {letters.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) lettersRef.current[i] = el;
            }}
            className="inline-block"
            style={{ whiteSpace: char === " " ? "pre" : "normal" }}
          >
            {char}
          </span>
        ))}
      </span>

      {/* Seta direita responsiva */}
      <span
        ref={arrowRightRef}
        className="inline-flex items-center shrink-0"
      >
        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </span>
    </button>
  );
}