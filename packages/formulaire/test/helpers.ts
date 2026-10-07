import '../src/styles.css';

// Note: Vitest's own accessible-name calculation reads the required
// asterisk's CSS alt text (\`content: ' *' / ''\`) literally, so required
// fields come out as 'Full name *" / "'. Chrome's real accessibility tree
// says 'Full name'. Locate required fields by name prefix (/^Full name/).

/** The text a screen reader gets from an element's aria-describedby. */
export function description(element: Element) {
  return (element.getAttribute('aria-describedby') ?? '')
    .split(' ')
    .map((id) => document.getElementById(id)?.textContent ?? '')
    .join(' ')
    .trim();
}

/** Visible error messages in a container (not the hidden measuring copy). */
export function errorsIn(container: Element) {
  return [...container.querySelectorAll('.gf-error:not(.gf-error-measure)')].map(
    (e) => e.textContent
  );
}

export const nextFrame = () =>
  new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
