// Temporary: Google Fonts candidates to replace PP Mori and Neue Montreal
// Mono, which can't ship (licensing). Delete once a pair is picked.

export interface Candidate {
  family: string;
  /** Google Fonts weight query, or null for a single-weight family. */
  weights: string | null;
  note: string;
}

export const sans: Candidate[] = [
  { family: 'Instrument Sans', weights: '400;500;600', note: 'crisp grotesk, slightly condensed, sharp details' },
  { family: 'Host Grotesk', weights: '400;500;600', note: 'friendly grotesk, open shapes' },
  { family: 'Hanken Grotesk', weights: '400;500;600', note: 'clean, a little geometric' },
  { family: 'Schibsted Grotesk', weights: '400;500;600', note: 'newspaper grotesk, sturdy' },
  { family: 'Familjen Grotesk', weights: '400;500;600', note: 'quirky ink-trap grotesk' },
  { family: 'Mona Sans', weights: '400;500;600', note: "GitHub's grotesk, strong and even" },
  { family: 'Funnel Sans', weights: '400;500;600', note: 'soft, rounded terminals' },
  { family: 'Onest', weights: '400;500;600', note: 'warm, slightly geometric' },
  { family: 'Bricolage Grotesque', weights: '400;500;600', note: 'the most character; opsz-aware' },
];

export const mono: Candidate[] = [
  { family: 'Geist Mono', weights: '400;500', note: 'neutral, current fallback' },
  { family: 'Fragment Mono', weights: null, note: 'Helvetica-style mono' },
  { family: 'JetBrains Mono', weights: '400;500', note: 'tall, technical' },
  { family: 'IBM Plex Mono', weights: '400;500', note: 'humanist, typewriter warmth' },
  { family: 'DM Mono', weights: '400;500', note: 'soft, friendly' },
  { family: 'Martian Mono', weights: '400;500', note: 'wide, distinctive' },
  { family: 'Spline Sans Mono', weights: '400;500', note: 'round, modern' },
];

/** Adds a Google Fonts stylesheet for one family, once. */
export function loadFont({ family, weights }: Candidate) {
  const query = family.replace(/ /g, '+') + (weights ? `:wght@${weights}` : '');
  const href = `https://fonts.googleapis.com/css2?family=${query}&display=swap`;
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.append(link);
}

const stack = (family: string, fallback: string) => `'${family}', ${fallback}`;
export const sansStack = (family: string) => stack(family, 'system-ui, sans-serif');
export const monoStack = (family: string) => stack(family, 'ui-monospace, monospace');

/** /?sans=Instrument+Sans&mono=Fragment+Mono previews the whole site. */
export function applyFromUrl() {
  const params = new URLSearchParams(location.search);
  const root = document.documentElement.style;
  const s = sans.find((c) => c.family === params.get('sans'));
  const m = mono.find((c) => c.family === params.get('mono'));
  if (s) {
    loadFont(s);
    root.setProperty('--sans', sansStack(s.family));
  }
  if (m) {
    loadFont(m);
    root.setProperty('--mono', monoStack(m.family));
  }
}
