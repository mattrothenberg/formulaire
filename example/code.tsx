import * as React from 'react';
import { createHighlighter, type Highlighter } from 'shiki/bundle/web';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

export type Lang = 'tsx' | 'html' | 'bash';

/*
 * Page-matched themes: component names in the form accent, attributes in
 * plum, keywords in raspberry, values in a warm brown. Only punctuation
 * recedes to gray. Every color clears 4.5:1 against the paper behind it.
 */
type Palette = {
  ink: string;
  muted: string;
  tag: string;
  attr: string;
  keyword: string;
  value: string;
};

const makeTheme = (name: string, type: 'light' | 'dark', c: Palette) => ({
  name,
  type,
  colors: { 'editor.foreground': c.ink, 'editor.background': '#00000000' },
  settings: [
    { settings: { foreground: c.ink } },
    {
      scope: ['punctuation', 'meta.brace', 'keyword.operator'],
      settings: { foreground: c.muted },
    },
    {
      scope: ['keyword', 'storage', 'keyword.control'],
      settings: { foreground: c.keyword },
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: c.attr },
    },
    {
      scope: ['entity.name.tag', 'support.class.component', 'entity.name.type'],
      settings: { foreground: c.tag },
    },
    {
      scope: ['string', 'constant.numeric', 'constant.language', 'constant.other'],
      settings: { foreground: c.value },
    },
    // Quotes and = belong to the value and attribute they surround.
    {
      scope: ['punctuation.definition.string', 'string punctuation'],
      settings: { foreground: c.value },
    },
    { scope: ['comment'], settings: { foreground: c.muted, fontStyle: 'italic' } },
  ],
});

const lightTheme = makeTheme('formulaire-light', 'light', {
  ink: '#1d2027',
  muted: '#6e7179',
  tag: '#1f55c9',
  attr: '#7b3fa8',
  keyword: '#b8264f',
  value: '#a24a0a',
});

const darkTheme = makeTheme('formulaire-dark', 'dark', {
  ink: '#ecebe7',
  muted: '#9b9ea6',
  tag: '#8fb3ff',
  attr: '#d3a8f5',
  keyword: '#ff8fab',
  value: '#eab27a',
});

let highlighter: Promise<Highlighter> | null = null;
const getHighlighter = () =>
  (highlighter ??= createHighlighter({
    themes: [lightTheme, darkTheme],
    langs: ['tsx', 'html', 'bash'],
    engine: createJavaScriptRegexEngine(),
  }));

export function useHighlighted(code: string, lang: Lang) {
  const [html, setHtml] = React.useState<string | null>(null);
  React.useEffect(() => {
    let live = true;
    getHighlighter().then((h) => {
      if (!live) return;
      const html = h.codeToHtml(code, {
        lang,
        themes: { light: lightTheme.name, dark: darkTheme.name },
        defaultColor: false,
      });
      // Lines render as blocks, so the newlines between them would add gaps.
      setHtml(html.replace(/<\/span>\n<span class="line">/g, '</span><span class="line">'));
    });
    return () => {
      live = false;
    };
  }, [code, lang]);
  return html;
}

/** Copy to the clipboard, and say so to screen readers too. */
export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      className="code-copy"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        });
      }}
    >
      {copied ? 'Copied' : label}
      <span className="visually-hidden" role="status">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </button>
  );
}

/** A one-line shell command with a copy button. */
export function Command({ code }: { code: string }) {
  const html = useHighlighted(code, 'bash');
  return (
    <div className="command">
      <span className="command-prompt" aria-hidden>
        $
      </span>
      {html ? (
        <div className="command-code" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre className="command-code shiki">
          <code>{code}</code>
        </pre>
      )}
      <CopyButton text={code} />
    </div>
  );
}

export interface CodeTab {
  id: string;
  label: string;
  lang: Lang;
  code: string;
  /** 1-based inclusive line range to spotlight. */
  highlight?: [number, number] | null;
}

export function CodeTabs({
  tabs,
  hint,
  maxHeight,
  className,
  value,
  onValueChange,
}: {
  tabs: CodeTab[];
  hint?: React.ReactNode;
  maxHeight?: string;
  className?: string;
  value?: string;
  onValueChange?: (id: string) => void;
}) {
  const [ownId, setOwnId] = React.useState(tabs[0].id);
  const activeId = value ?? ownId;
  const setActiveId = (id: string) => {
    setOwnId(id);
    onValueChange?.(id);
  };
  const baseId = React.useId();
  const tab = tabs.find((t) => t.id === activeId) ?? tabs[0];
  const html = useHighlighted(tab.code, tab.lang);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [start, end] = tab.highlight ?? [0, 0];

  // Spotlight the linked lines and bring them into view.
  React.useEffect(() => {
    const scroller = scrollRef.current;
    const pre = scroller?.querySelector('pre');
    if (!scroller || !pre) return;
    const lines = pre.querySelectorAll<HTMLElement>('.line');
    lines.forEach((line, i) =>
      line.classList.toggle('is-active', i + 1 >= start && i + 1 <= end)
    );
    pre.toggleAttribute('data-has-active', start > 0);
    const first = lines[start - 1];
    if (first && scroller.scrollHeight > scroller.clientHeight) {
      scroller.scrollTo({
        top: Math.max(0, first.offsetTop - scroller.clientHeight / 3),
        behavior: 'smooth',
      });
    }
  }, [html, start, end]);

  return (
    <div className={['code-tabs', className].filter(Boolean).join(' ')}>
      <div className="code-tabs-bar">
        {/* WAI-ARIA tabs: one tab stop, arrow keys move between tabs. */}
        <div
          role="tablist"
          className="code-tabs-list"
          onKeyDown={(event) => {
            const i = tabs.findIndex((t) => t.id === tab.id);
            const next =
              event.key === 'ArrowRight' ? (i + 1) % tabs.length
              : event.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length
              : event.key === 'Home' ? 0
              : event.key === 'End' ? tabs.length - 1
              : null;
            if (next === null) return;
            event.preventDefault();
            setActiveId(tabs[next].id);
            event.currentTarget
              .querySelectorAll<HTMLElement>('[role="tab"]')
              [next]?.focus();
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              id={`${baseId}-tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={t.id === tab.id}
              aria-controls={`${baseId}-panel`}
              tabIndex={t.id === tab.id ? 0 : -1}
              onClick={() => setActiveId(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        {hint != null && <span className="code-tabs-hint">{hint}</span>}
        <CopyButton text={tab.code} />
      </div>
      <div
        ref={scrollRef}
        id={`${baseId}-panel`}
        className="code-scroll"
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${tab.id}`}
        tabIndex={0}
        style={{ maxHeight }}
      >
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="shiki">
            <code>{tab.code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

/** A small, read-only card showing one field's code, anchored to its cell. */
export function CodePeek({
  code,
  lang,
  name,
  langLabel,
  style,
  placement,
}: {
  code: string;
  lang: Lang;
  name: string;
  langLabel: string;
  style: React.CSSProperties;
  placement: 'above' | 'below';
}) {
  const html = useHighlighted(code, lang);
  return (
    <div className="peek" data-placement={placement} style={style} aria-hidden="true">
      <div className="peek-bar">
        <span>
          name=<b>"{name}"</b>
        </span>
        <span>{langLabel}</span>
      </div>
      <div className="code-scroll">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="shiki">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
