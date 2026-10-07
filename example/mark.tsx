import * as React from 'react';

/*
 * The cells of the mark's grid, in tab order: [x, y, width, height].
 * The dividers are deliberately offset like a real form's rows, with no
 * centered square or rotational pattern.
 */
const cells = [
  [11, 11, 28, 14],
  [39, 11, 14, 14],
  [11, 25, 14, 14],
  [25, 25, 28, 14],
  [11, 39, 21, 14],
  [32, 39, 21, 14],
] as const;

const REST = 3; // the wide middle cell, as on the favicon

/**
 * Formulaire's mark: a form grid in ink with one cell lit in the focus
 * highlight. On load (and again on hover) the highlight tabs once through
 * every cell and comes back to rest on the wide one. One lap takes under
 * five seconds, so it needs no pause control (WCAG 2.2.2), and it stays
 * still when motion is reduced.
 */
export function Mark({ size = 64, className }: { size?: number; className?: string }) {
  const id = React.useId().replace(/:/g, '');
  const [index, setIndex] = React.useState(REST);
  const timer = React.useRef<number | undefined>(undefined);

  const playLap = React.useCallback(() => {
    if (timer.current !== undefined) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let step = 0;
    timer.current = window.setInterval(() => {
      step += 1;
      setIndex((REST + step) % cells.length);
      if (step === cells.length) {
        window.clearInterval(timer.current);
        timer.current = undefined;
      }
    }, 650);
  }, []);

  React.useEffect(() => {
    const start = window.setTimeout(playLap, 600);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer.current);
      timer.current = undefined;
    };
  }, [playLap]);

  const [x, y, w, h] = cells[index];

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="10 10 44 44"
      role="img"
      aria-label="Formulaire"
      onPointerEnter={playLap}
    >
      <defs>
        <clipPath id={`${id}-frame`}>
          <rect x="11" y="11" width="42" height="42" rx="3.5" />
        </clipPath>
      </defs>
      {/* A unit square moved with a transform, which animates smoothly in
          every browser, unlike x/y/width/height. The clip sits on a parent
          so the transform doesn't scale it too. */}
      <g clipPath={`url(#${id}-frame)`}>
        <rect
          className="mark-fill"
          width="1"
          height="1"
          fill="#FFD94D"
          style={{
            // Scale from the square's own corner, not the viewBox origin.
            transformBox: 'fill-box',
            transformOrigin: '0 0',
            transform: `translate(${x}px, ${y}px) scale(${w}, ${h})`,
          }}
        />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
        <rect x="11" y="11" width="42" height="42" rx="3.5" />
        <path d="M11 25h42M11 39h42M39 11v14M25 25v14M32 39v14" />
      </g>
    </svg>
  );
}
