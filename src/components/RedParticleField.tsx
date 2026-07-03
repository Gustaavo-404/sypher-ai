import { useEffect, useRef } from "react";
import gsap from "gsap";

interface RedParticleFieldProps {
  /** Triggers the "curtain" burst-in animation when it flips to true. */
  burst: boolean;
}

interface Particle {
  x: number;
  y: number;
  baseR: number;
  r: number;
  phase: number;
  speed: number;
  driftX: number;
  driftY: number;
  opacity: number;
  targetOpacity: number;
}

/**
 * Subtle ambient red dot field rendered on a canvas, sitting behind the
 * 3D model and content. Particles drift slowly and pulse in size/opacity.
 * On `burst`, opacity ramps up briefly (curtain reveal) then settles low.
 */
export default function RedParticleField({ burst }: RedParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const intensityRef = useRef({ value: 0.18 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId = 0;
    let width = 0;
    let height = 0;

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      const count = Math.round((width * height) / 18000);
      particlesRef.current = Array.from({ length: Math.max(28, Math.min(count, 70)) }, () => {
        const baseR = 0.6 + Math.random() * 2.2;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          baseR,
          r: baseR,
          phase: Math.random() * Math.PI * 2,
          speed: 0.15 + Math.random() * 0.3,
          driftX: (Math.random() - 0.5) * 0.08,
          driftY: (Math.random() - 0.5) * 0.08,
          opacity: 0,
          targetOpacity: 0.08 + Math.random() * 0.22,
        };
      });
    };

    init();

    const handleResize = () => init();
    window.addEventListener("resize", handleResize);

    let t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.016;
      ctx.clearRect(0, 0, width, height);

      const intensity = intensityRef.current.value;

      for (const p of particlesRef.current) {
        p.x += p.driftX;
        p.y += p.driftY;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        const pulse = Math.sin(t * p.speed + p.phase) * 0.5 + 0.5;
        p.r = p.baseR * (0.7 + pulse * 0.6);
        p.opacity += (p.targetOpacity * intensity - p.opacity) * 0.04;

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, `rgba(239, 68, 68, ${p.opacity})`);
        grad.addColorStop(1, "rgba(239, 68, 68, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!burst) return;
    gsap.fromTo(
      intensityRef.current,
      { value: 0.15 },
      {
        value: 1,
        duration: 1.1,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(intensityRef.current, {
            value: 0.32,
            duration: 1.8,
            ease: "power2.inOut",
          });
        },
      }
    );
  }, [burst]);

  return (
    <canvas
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] w-full h-full"
    />
  );
}
