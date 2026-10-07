import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { GridForm, type Density, type Mode } from '../src';
import '../src/styles.css';
import { CodePeek, CodeTabs, Command } from './code';
import { Mark } from './mark';
import { ComponentBento } from './bento';
import { MaskedInput, phoneMask, zipMask } from './masks';
import { demoHtml, demoTsx, fieldSnippet, installCode } from './source';
import './demo.css';

const stocks = [
  { value: 'portra-400', label: 'Kodak Portra 400' },
  { value: 'portra-800', label: 'Kodak Portra 800' },
  { value: 'ektar-100', label: 'Kodak Ektar 100' },
  { value: 'gold-200', label: 'Kodak Gold 200' },
  { value: 'cinestill-800t', label: 'CineStill 800T' },
  { value: 'hp5', label: 'Ilford HP5 Plus' },
  { value: 'tri-x', label: 'Kodak Tri-X 400' },
  { value: 'delta-3200', label: 'Ilford Delta 3200' },
];

const processes = [
  { value: 'c41', label: 'C-41' },
  { value: 'bw', label: 'B&W' },
  { value: 'e6', label: 'E-6' },
  { value: 'ecn2', label: 'ECN-2' },
];

const pushPull = [
  { value: '-1', label: 'Pull 1' },
  { value: '0', label: 'Box speed' },
  { value: '+1', label: 'Push 1' },
  { value: '+2', label: 'Push 2' },
  { value: '+3', label: 'Push 3' },
];

const scans = [
  { value: 'std', label: '3000px' },
  { value: 'lg', label: '6000px' },
  { value: 'tiff', label: '16-bit TIFF' },
];

const formats = [
  { value: '35', label: '35mm' },
  { value: '120', label: '120' },
  { value: '4x5', label: '4×5' },
];

const extras = [
  { value: 'prints', label: '4×6 prints' },
  { value: 'contact', label: 'Contact sheet' },
  { value: 'negs', label: 'Return negs' },
];

const states = ['CA', 'NY', 'OR', 'TX', 'WA'].map((s) => ({
  value: s,
  label: s,
}));

const MIN_WIDTH = 320;
const MAX_WIDTH = 1088;

// One-click widths, so "no breakpoints" shows without finding the handles.
const WIDTHS = { sidebar: 340, half: 600 } as const;
type WidthPreset = 'sidebar' | 'half' | 'full';

type Theme = 'system' | 'light' | 'dark';
type Focus = 'fill' | 'ring' | 'underline';
type ActionsStyle = 'bar' | 'cells';
type Accent = 'blue' | 'red' | 'green' | 'graphite';

const accents: Array<{ value: Accent; label: string }> = [
  { value: 'blue', label: 'Blue ink' },
  { value: 'red', label: 'Red pencil' },
  { value: 'green', label: 'Ledger green' },
  { value: 'graphite', label: 'Graphite' },
];

/** A segmented control that sits inside a configurator cell. */
function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | null;
  options: Array<{ value: T; label: React.ReactNode }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Grip handles on both edges of the centered stage. The stage stays centered,
 * so dragging one edge moves both: width changes by twice the pointer delta.
 */
function ResizeHandle({
  side,
  width,
  stageRef,
  onResize,
  onDragChange,
}: {
  side: 'left' | 'right';
  width: number;
  stageRef: React.RefObject<HTMLDivElement | null>;
  onResize: (width: number) => void;
  onDragChange: (dragging: boolean) => void;
}) {
  const start = React.useRef<{ x: number; width: number; max: number } | null>(
    null
  );
  const sign = side === 'right' ? 1 : -1;

  const resizeBy = (delta: number) => {
    const stage = stageRef.current;
    const max = stage?.parentElement?.clientWidth ?? MAX_WIDTH;
    const width = stage?.offsetWidth ?? MAX_WIDTH;
    onResize(Math.max(MIN_WIDTH, Math.min(max, MAX_WIDTH, width + delta)));
  };

  return (
    <div
      className="handle"
      data-side={side}
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize form from the ${side}`}
      aria-valuenow={width}
      aria-valuemin={MIN_WIDTH}
      aria-valuemax={MAX_WIDTH}
      aria-valuetext={`${width} pixels wide`}
      tabIndex={0}
      onPointerDown={(event) => {
        const stage = stageRef.current;
        if (!stage) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        start.current = {
          x: event.clientX,
          width: stage.offsetWidth,
          max: Math.min(stage.parentElement?.clientWidth ?? MAX_WIDTH, MAX_WIDTH),
        };
        onDragChange(true);
      }}
      onPointerMove={(event) => {
        if (!start.current) return;
        const { x, width, max } = start.current;
        const next = width + sign * 2 * (event.clientX - x);
        onResize(Math.round(Math.max(MIN_WIDTH, Math.min(max, next))));
      }}
      onPointerUp={() => {
        start.current = null;
        onDragChange(false);
      }}
      onPointerCancel={() => {
        start.current = null;
        onDragChange(false);
      }}
      onKeyDown={(event) => {
        const step = event.shiftKey ? 80 : 16;
        if (event.key === 'ArrowLeft') resizeBy(-sign * step);
        if (event.key === 'ArrowRight') resizeBy(sign * step);
      }}
    />
  );
}

function useElementWidth(ref: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = React.useState(0);
  React.useLayoutEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.borderBoxSize[0].inlineSize))
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

const usageTsx = `import { GridForm } from 'formulaire-ui';
import 'formulaire-ui/styles.css';

export function Customer() {
  return (
    <GridForm.Root onFormSubmit={save}>
      <GridForm.Section legend="Customer">
        <GridForm.Row>
          <GridForm.Field name="name" label="Full name" span={2}>
            <GridForm.Input required />
          </GridForm.Field>
          <GridForm.Field name="phone" label="Phone">
            <GridForm.Input type="tel" />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Section>
    </GridForm.Root>
  );
}`;

const usageHtml = `<form class="gf">
  <fieldset class="gf-section">
    <div class="gf-legend">Customer</div>
    <div class="gf-row">
      <div class="gf-field" data-span="2">
        <label class="gf-label" for="name">Full name</label>
        <input class="gf-input" id="name" name="name" required>
      </div>
      <div class="gf-field">
        <label class="gf-label" for="phone">Phone</label>
        <input class="gf-input" id="phone" name="phone" type="tel">
      </div>
    </div>
  </fieldset>
</form>`;

function ThemeToggle({
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
          <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
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

function App() {
  const [mode, setMode] = React.useState<Mode>('edit');
  const [density, setDensity] = React.useState<Density>('comfortable');
  const [focus, setFocus] = React.useState<Focus>('fill');
  const [actions, setActions] = React.useState<ActionsStyle>('bar');
  const [accent, setAccent] = React.useState<Accent>('blue');
  const [theme, setTheme] = React.useState<Theme>('system');
  const [stageWidth, setStageWidth] = React.useState<number | null>(null);
  const [xray, setXray] = React.useState(false);
  const [codeLang, setCodeLang] = React.useState<'react' | 'html'>('react');
  const [peek, setPeek] = React.useState<{
    name: string;
    style: React.CSSProperties;
    placement: 'above' | 'below';
  } | null>(null);
  const peekTimer = React.useRef<number | undefined>(undefined);
  const pendingPeek = React.useRef<string | null>(null);
  // After a click into a cell, stay quiet until the pointer reaches another.
  const quietCell = React.useRef<string | null>(null);

  const [submitted, setSubmitted] = React.useState<object | null>(null);
  const [formKey, setFormKey] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const width = useElementWidth(stageRef);

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    root.dataset.accent = accent;
  }, [theme, accent]);

  React.useEffect(() => {
    document.body.classList.toggle('is-resizing', dragging);
  }, [dragging]);

  const cellOf = (target: EventTarget) =>
    (target as HTMLElement).closest<HTMLElement>('[data-field]');

  // Anchor the card under the cell (or above, near the bottom of the screen),
  // aligned to whichever side of the stage the cell sits on.
  const showPeek = (cell: HTMLElement) => {
    const stage = stageRef.current;
    if (!stage) return;
    const s = stage.getBoundingClientRect();
    const c = cell.getBoundingClientRect();
    const above = c.bottom + 240 > window.innerHeight && c.top > 240;
    const style: React.CSSProperties = {
      top: above ? c.top - s.top - 8 : c.bottom - s.top + 8,
    };
    if (c.left - s.left > s.width / 2) style.right = s.right - c.right;
    else style.left = c.left - s.left;
    setPeek({ name: cell.dataset.field!, style, placement: above ? 'above' : 'below' });
  };

  const hidePeek = () => {
    window.clearTimeout(peekTimer.current);
    pendingPeek.current = null;
    setPeek(null);
  };

  // Hover content must be dismissible without moving the pointer (WCAG 1.4.13).
  React.useEffect(() => {
    if (!peek) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hidePeek();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [peek]);

  const rootOptions = { mode, density, focus, actions };
  const tsx = demoTsx(rootOptions);
  const html = demoHtml(rootOptions);

  const handleProps = {
    width,
    stageRef,
    onResize: setStageWidth,
    onDragChange: setDragging,
  };

  return (
    <main className="page">
      <header className="masthead wide">
        <nav className="masthead-nav">
          <ThemeToggle theme={theme} onChange={setTheme} />
          <a className="masthead-link" href="https://github.com/mattrothenberg">
            GitHub
          </a>
        </nav>
      </header>

      <section className="intro">
        <Mark size={72} className="hero-mark" />
        <h1>
          Formulaire
          <span>Forms on a grid.</span>
        </h1>
        <p>
          A modern take on FormKeep's{' '}
          <a href="https://formkeep.com/gridforms">Gridforms</a>: dense forms
          laid out on a grid, with labels inside the cells and rows that wrap on
          their own when space runs out. It's a CSS core that works on plain
          HTML, plus React components built on{' '}
          <a href="https://base-ui.com">Base UI</a>.
        </p>
      </section>

      <figure className="demo wide" data-dragging={dragging || undefined}>
        <div className="demo-layout">
          <div className="stage-track">
            <div
              className="stage"
              ref={stageRef}
              style={{ width: stageWidth ?? '100%' }}
            data-xray={xray || undefined}
              onPointerOver={(event) => {
                if (!xray || dragging || event.pointerType === 'touch') return;
                const cell = cellOf(event.target);
                const name = cell?.dataset.field ?? null;
                if (!cell || !name) return;
                if (name !== quietCell.current) quietCell.current = null;
                if (quietCell.current || name === peek?.name) return;
                if (peek) return showPeek(cell);
                if (name === pendingPeek.current) return;
                window.clearTimeout(peekTimer.current);
                pendingPeek.current = name;
                peekTimer.current = window.setTimeout(() => showPeek(cell), 400);
              }}
              onPointerLeave={(event) => {
                // A lifted finger "leaves" too; touch peeks close on a second tap.
                if (event.pointerType === 'touch') return;
                quietCell.current = null;
                hidePeek();
              }}
              onPointerDown={(event) => {
                if (event.pointerType === 'touch') return;
                quietCell.current = cellOf(event.target)?.dataset.field ?? null;
                hidePeek();
              }}
              onPointerUp={(event) => {
                // Touch has no hover: a tap peeks, a second tap closes.
                if (!xray || event.pointerType !== 'touch') return;
                const cell = cellOf(event.target);
                if (!cell?.dataset.field) return;
                if (cell.dataset.field === peek?.name) hidePeek();
                else showPeek(cell);
              }}
            >
              <output className="width-tag" aria-live="polite">
                {width}
                <span>px</span>
              </output>
              <ResizeHandle side="left" {...handleProps} />
              <GridForm.Root
                key={formKey}
                mode={mode}
                density={density}
                data-focus={focus}
                data-actions={actions}
                onFormSubmit={(values) => {
                  setSubmitted(values);
                  setMode('filled');
                }}
              >
                <GridForm.Section legend="Customer">
                  <GridForm.Row>
                    <GridForm.Field name="name" label="Full name" span={2}>
                      <GridForm.Input required autoComplete="name" />
                    </GridForm.Field>
                    <GridForm.Field name="email" label="Email" span={2}>
                      <GridForm.Input required type="email" autoComplete="email" />
                    </GridForm.Field>
                    <GridForm.Field name="phone" label="Phone">
                      <MaskedInput
                        mask={phoneMask}
                        type="tel"
                        autoComplete="tel"
                      />
                    </GridForm.Field>
                  </GridForm.Row>
                </GridForm.Section>

                <GridForm.Section legend="Rolls">
                  <GridForm.Row>
                    <GridForm.Field name="format" label="Format" span={2}>
                      <GridForm.Choice options={formats} defaultValue="35" />
                    </GridForm.Field>
                    <GridForm.Field name="stock" label="Film stock" span={2}>
                      <GridForm.Select items={stocks} required />
                    </GridForm.Field>
                    <GridForm.Field name="rolls" label="Rolls">
                      <GridForm.Number required min={1} max={40} defaultValue={1} />
                    </GridForm.Field>
                  </GridForm.Row>
                  <GridForm.Row>
                    <GridForm.Field name="process" label="Process">
                      <GridForm.Select items={processes} defaultValue="c41" />
                    </GridForm.Field>
                    <GridForm.Field name="push" label="Push / pull">
                      <GridForm.Select items={pushPull} defaultValue="0" />
                    </GridForm.Field>
                    <GridForm.Field name="scan" label="Scan">
                      <GridForm.Select items={scans} defaultValue="std" />
                    </GridForm.Field>
                    <GridForm.Field name="extras" label="Extras" span={2}>
                      <GridForm.Checks options={extras} defaultValue={['negs']} />
                    </GridForm.Field>
                  </GridForm.Row>
                </GridForm.Section>

                <GridForm.Section legend="Return shipping">
                  <GridForm.Row>
                    <GridForm.Field name="street" label="Street address" span={3}>
                      <GridForm.Input autoComplete="address-line1" />
                    </GridForm.Field>
                    <GridForm.Field name="unit" label="Apt / unit">
                      <GridForm.Input autoComplete="address-line2" />
                    </GridForm.Field>
                  </GridForm.Row>
                  <GridForm.Row>
                    <GridForm.Field name="city" label="City" span={2}>
                      <GridForm.Input autoComplete="address-level2" />
                    </GridForm.Field>
                    <GridForm.Field name="state" label="State">
                      <GridForm.Select items={states} placeholder="—" />
                    </GridForm.Field>
                    <GridForm.Field
                      name="zip"
                      label="ZIP"
                      messages={{ patternMismatch: '5 digits' }}
                    >
                      <MaskedInput
                        mask={zipMask}
                        inputMode="numeric"
                        pattern="\d{5}"
                        autoComplete="postal-code"
                      />
                    </GridForm.Field>
                  </GridForm.Row>
                  <GridForm.Row>
                    <GridForm.Field
                      name="notes"
                      label="Notes for the lab"
                      span={4}
                      description="Expired film, pushed in camera, light leaks, anything we should know."
                    >
                      <GridForm.Textarea />
                    </GridForm.Field>
                  </GridForm.Row>
                </GridForm.Section>
                <GridForm.Actions>
                  <GridForm.Button
                    onClick={() => {
                      setSubmitted(null);
                      setMode('edit');
                      setFormKey((k) => k + 1);
                    }}
                  >
                    Reset
                  </GridForm.Button>
                  {mode === 'edit' ? (
                    <GridForm.Button key="submit" type="submit" variant="primary">
                      Place order
                    </GridForm.Button>
                  ) : (
                    <GridForm.Button
                      key="edit"
                      variant="primary"
                      onClick={() => setMode('edit')}
                    >
                      Edit order
                    </GridForm.Button>
                  )}
                </GridForm.Actions>
              </GridForm.Root>
              <ResizeHandle side="right" {...handleProps} />
              {peek && (
                <CodePeek
                  name={peek.name}
                  style={peek.style}
                  placement={peek.placement}
                  lang={codeLang === 'react' ? 'tsx' : 'html'}
                  langLabel={codeLang === 'react' ? 'React' : 'HTML'}
                  code={fieldSnippet(
                    codeLang === 'react' ? tsx : html,
                    peek.name,
                    codeLang === 'react' ? 'tsx' : 'html'
                  )}
                />
              )}
            </div>
          </div>
          <aside className="controls" aria-label="Configure the demo">
            <div className="control">
              <span className="control-label">Width</span>
              <Segmented<WidthPreset>
                label="Width"
                value={
                  stageWidth === null ? 'full'
                  : stageWidth === WIDTHS.sidebar ? 'sidebar'
                  : stageWidth === WIDTHS.half ? 'half'
                  : null
                }
                options={[
                  { value: 'sidebar', label: 'Sidebar' },
                  { value: 'half', label: 'Half' },
                  { value: 'full', label: 'Full' },
                ]}
                onChange={(value) =>
                  setStageWidth(value === 'full' ? null : WIDTHS[value])
                }
              />
              <span className="control-note">or drag the form's edges</span>
            </div>
            <div className="control">
              <span className="control-label">Mode</span>
              <Segmented
                label="Mode"
                value={mode}
                options={[
                  { value: 'edit', label: 'Edit' },
                  { value: 'filled', label: 'Filled' },
                ]}
                onChange={setMode}
              />
            </div>
            <div className="control">
              <span className="control-label">Density</span>
              <Segmented
                label="Density"
                value={density}
                options={[
                  { value: 'compact', label: 'Compact' },
                  { value: 'comfortable', label: 'Default' },
                  { value: 'roomy', label: 'Roomy' },
                ]}
                onChange={setDensity}
              />
            </div>
            <div className="control">
              <span className="control-label">Focus</span>
              <Segmented
                label="Focus"
                value={focus}
                options={[
                  { value: 'fill', label: 'Fill' },
                  { value: 'ring', label: 'Ring' },
                  { value: 'underline', label: 'Line' },
                ]}
                onChange={setFocus}
              />
            </div>
            <div className="control">
              <span className="control-label">Buttons</span>
              <Segmented
                label="Buttons"
                value={actions}
                options={[
                  { value: 'bar', label: 'Bar' },
                  { value: 'cells', label: 'Cells' },
                ]}
                onChange={setActions}
              />
            </div>
            <div className="control">
              <span className="control-label">Accent</span>
              <div className="swatches" role="radiogroup" aria-label="Accent">
                {accents.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={accent === option.value}
                    aria-label={option.label}
                    title={option.label}
                    data-swatch={option.value}
                    onClick={() => setAccent(option.value)}
                  />
                ))}
              </div>
            </div>
            {/* A tool for reading the code, not a style option. */}
            <div className="control control-inspect">
              <span className="control-label">X-ray</span>
              <Segmented
                label="X-ray"
                value={xray ? 'on' : 'off'}
                options={[
                  { value: 'off', label: 'Off' },
                  { value: 'on', label: 'On' },
                ]}
                onChange={(value) => {
                  setXray(value === 'on');
                  if (value === 'off') hidePeek();
                }}
              />
              <span className="control-note">
                Tags each cell, and shows its code on hover or tap
              </span>
            </div>
          </aside>
        </div>


        <CodeTabs
          className="source"
          maxHeight="26rem"
          value={codeLang}
          onValueChange={(id) => setCodeLang(id as 'react' | 'html')}
          tabs={[
            { id: 'react', label: 'React', lang: 'tsx', code: tsx },
            { id: 'html', label: 'HTML', lang: 'html', code: html },
          ]}
        />

        {submitted && (
          <pre className="code" aria-label="Submitted values">
            {JSON.stringify(submitted, null, 2)}
          </pre>
        )}
      </figure>

      <article className="prose">
        <h2>Adapts to its container</h2>
        <p>
          There are no breakpoints. Each cell asks for its span times a minimum
          column width, and a row wraps when the container can't fit it. The
          same form works in a sidebar and across a full page.
        </p>

        <h2>Edit and filled</h2>
        <p>
          Set <code>mode="filled"</code> and the form renders as a completed
          document, for review steps, receipts and admin views. Values read
          like pen on paper, and empty fields get a dash. It prints well, too.
        </p>

        <h2>Base UI underneath</h2>
        <p>
          Labels, descriptions, validation and focus state come from Base UI.
          Formulaire only adds the grid and the look, so every cell is as
          accessible as the primitive inside it.
        </p>

      </article>

      <section className="components wide">
        <h2>Components</h2>
        <ComponentBento />
      </section>

      <article className="prose">
        <h2>Usage</h2>
        <p>Install it alongside Base UI.</p>
        <Command code={installCode} />
        <p>
          Then build forms out of sections, rows and fields. The CSS works
          without React, too.
        </p>
        <CodeTabs
          className="usage"
          tabs={[
            { id: 'react', label: 'React', lang: 'tsx', code: usageTsx },
            { id: 'html', label: 'HTML', lang: 'html', code: usageHtml },
          ]}
        />
      </article>

      <footer className="colophon">
        <p>
          Made by Matt Rothenberg, after{' '}
          <a href="https://formkeep.com/gridforms">Gridforms</a> by FormKeep.
        </p>
      </footer>

    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
