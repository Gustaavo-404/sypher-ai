import { useMemo } from 'react';

interface AbstractGridBackgroundProps {
  opacity?: number; // 0 to 1, default 0.2
}

/**
 * Generates non-uniform grid line positions, symmetric from center,
 * with progressively larger gaps toward the edges.
 */
function generateLines(totalGaps: number, baseGap: number, growth: number): number[] {
  const positions: number[] = [50]; // center at 50%
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

export function AbstractGridBackground({ opacity = 0.2 }: AbstractGridBackgroundProps) {
  const { cols, rows } = useMemo(() => {
    return {
      cols: generateLines(5, 4, 1.35),
      rows: generateLines(4, 6, 1.3),
    };
  }, []);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
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
    </svg>
  );
}