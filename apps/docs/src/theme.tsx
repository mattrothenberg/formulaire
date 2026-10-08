import * as React from 'react';

export type Theme = 'system' | 'light' | 'dark';

export function ThemeToggle({
  theme,
  onChange,
}: {
  theme: Theme;
  onChange: (theme: Theme) => void;
}) {
  // Starts on the system theme; one click flips to the other one.
  const dark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light' : 'Dark'}
      onClick={() => onChange(dark ? 'light' : 'dark')}
    >
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
        {dark ? (
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <circle cx="10" cy="10" r="3.5" />
            <path d="M10 2v1.5M10 16.5V18M2 10h1.5M16.5 10H18M4.3 4.3l1.1 1.1M14.6 14.6l1.1 1.1M4.3 15.7l1.1-1.1M14.6 5.4l1.1-1.1" />
          </g>
        ) : (
          <path
            d="M16.5 12.2A7 7 0 0 1 7.8 3.5a7 7 0 1 0 8.7 8.7Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

/** Mirror the chosen theme onto <html>, where the page and form tokens read it. */
export function useThemeAttribute(theme: Theme) {
  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
  }, [theme]);
}
