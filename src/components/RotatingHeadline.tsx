import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface RotatingHeadlineProps {
  prefix: string;
  words: string[];
}

/**
 * Small top-left hero headline: a static prefix ("Developed to") followed
 * by a word that cycles continuously with a clip-reveal animation.
 */
export default function RotatingHeadline({ prefix, words }: RotatingHeadlineProps) {
  const [index, setIndex] = useState(0);
  const wordRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [words.length]);

  useEffect(() => {
    if (!wordRef.current) return;
    gsap.fromTo(
      wordRef.current,
      { yPercent: 100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.55, ease: "power3.out" }
    );
  }, [index]);

  return (
    <h1 className="text-center sm:text-left">
      <span className="block text-sm sm:text-base font-sans font-semibold uppercase tracking-[0.2em] text-zinc-500">
        {prefix}
      </span>
      <span className="block overflow-hidden h-14 sm:h-16 lg:h-20 mt-1">
        <span
          ref={wordRef}
          className="block text-4xl sm:text-5xl lg:text-6xl font-sans font-black uppercase tracking-wide text-red-500"
        >
          {words[index]}
        </span>
      </span>
    </h1>
  );
}