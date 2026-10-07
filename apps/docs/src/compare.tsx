// Temporary: compare fonts column by column, moment by moment.
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { GridForm } from 'formulaire-ui';
import 'formulaire-ui/styles.css';
import './demo.css';
import { loadFont, mono, monoStack, sans, sansStack } from './audition';

const sansNames = ['Mori', 'Geist', ...sans.map((s) => s.family)];
const monoNames = ['Montreal Mono', ...mono.map((m) => m.family)];
const DEFAULTS: Array<[string, string]> = [
  ['Mori', 'Montreal Mono'],
  ['Host Grotesk', 'Fragment Mono'],
  ['Instrument Sans', 'Geist Mono'],
  ['Onest', 'Fragment Mono'],
];

const stocks = [
  { value: 'portra', label: 'Kodak Portra 400' },
  { value: 'hp5', label: 'Ilford HP5 Plus' },
];
const formats = [
  { value: '35', label: '35mm' },
  { value: '120', label: '120' },
  { value: '4x5', label: '4×5' },
];

const code = `<GridForm.Root onFormSubmit={placeOrder}>
  <GridForm.Section legend="Customer">
    <GridForm.Row>
      <GridForm.Field name="name" label="Full name" span={2}>
        <GridForm.Input required autoComplete="name" />
      </GridForm.Field>`;

const moments: Array<{ name: string; render: () => React.ReactNode }> = [
  {
    name: 'Hero',
    render: () => (
      <h1 className="cmp-h1">
        Formulaire
        <span>Forms on a grid.</span>
      </h1>
    ),
  },
  {
    name: 'Intro',
    render: () => (
      <p className="cmp-body">
        A modern take on FormKeep’s <a href="#">Gridforms</a>: dense forms laid
        out on a grid, with labels inside the cells and rows that wrap on their
        own when space runs out.
      </p>
    ),
  },
  {
    name: 'Section',
    render: () => (
      <div className="cmp-body">
        <h2 className="cmp-h2">Edit and filled</h2>
        <p>
          Set <code>mode="filled"</code> and the form renders as a completed
          document, for review steps, receipts and admin views.
        </p>
      </div>
    ),
  },
  {
    name: 'Form',
    render: () => (
      <GridForm.Root render={<div />}>
        <GridForm.Section legend="Rolls">
          <GridForm.Row>
            <GridForm.Field label="Film stock" span={2}>
              <GridForm.Select items={stocks} defaultValue="portra" />
            </GridForm.Field>
            <GridForm.Field label="Rolls">
              <GridForm.Number defaultValue={3} />
            </GridForm.Field>
          </GridForm.Row>
          <GridForm.Row>
            <GridForm.Field label="Format" span={2}>
              <GridForm.Choice options={formats} defaultValue="120" />
            </GridForm.Field>
            <GridForm.Field label="Email" invalid>
              <GridForm.Input defaultValue="ada@" />
            </GridForm.Field>
          </GridForm.Row>
        </GridForm.Section>
        <GridForm.Actions>
          <GridForm.Button>Reset</GridForm.Button>
          <GridForm.Button variant="primary">Place order</GridForm.Button>
        </GridForm.Actions>
      </GridForm.Root>
    ),
  },
  {
    name: 'Filled',
    render: () => (
      <GridForm.Root mode="filled" render={<div />}>
        <GridForm.Row>
          <GridForm.Field label="Full name" span={2}>
            <GridForm.Input defaultValue="Ada Lovelace" />
          </GridForm.Field>
          <GridForm.Field label="Rolls">
            <GridForm.Number defaultValue={3} />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Root>
    ),
  },
  { name: 'Code', render: () => <pre className="cmp-code">{code}</pre> },
  {
    name: 'Small',
    render: () => (
      <div className="cmp-small">
        <span className="control-label">Density</span>
        <div className="seg">
          <button type="button">Compact</button>
          <button type="button" aria-checked="true">
            Default
          </button>
          <button type="button">Roomy</button>
        </div>
        <span className="control-note">or drag the form’s edges</span>
      </div>
    ),
  },
];

function Picker({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

function stackFor(family: string, kind: 'sans' | 'mono') {
  if (family === 'Mori') return "'Mori', system-ui, sans-serif";
  if (family === 'Montreal Mono') return "'Montreal Mono', ui-monospace, monospace";
  return kind === 'sans' ? sansStack(family) : monoStack(family);
}

function Compare() {
  const [cols, setCols] = React.useState(DEFAULTS);
  React.useEffect(() => {
    [...sans, ...mono, { family: 'Geist', weights: '400;500;600', note: '' }].forEach(loadFont);
  }, []);
  const set = (i: number, which: 0 | 1, v: string) =>
    setCols((c) => c.map((col, j) => (j === i ? (which === 0 ? [v, col[1]] : [col[0], v]) : col)) as typeof c);

  return (
    <main className="cmp" style={{ '--cols': cols.length } as React.CSSProperties}>
      <div className="cmp-row cmp-head">
        <span className="cmp-rowname" />
        {cols.map(([s, m], i) => (
          <div key={i} className="cmp-pickers">
            <Picker label="Sans" value={s} options={sansNames} onChange={(v) => set(i, 0, v)} />
            <Picker label="Mono" value={m} options={monoNames} onChange={(v) => set(i, 1, v)} />
            {s !== 'Mori' && (
              <a href={`/?sans=${encodeURIComponent(s)}&mono=${encodeURIComponent(m)}`}>Full page ↗</a>
            )}
            {cols.length > 1 && (
              <button
                type="button"
                className="cmp-remove"
                aria-label={`Remove ${s} column`}
                onClick={() => setCols((c) => c.filter((_, j) => j !== i))}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {cols.length < 6 && (
          <button
            type="button"
            className="cmp-add"
            onClick={() => {
              const used = new Set(cols.map(([s]) => s));
              const next = sansNames.find((n) => !used.has(n)) ?? sansNames[0];
              setCols((c) => [...c, [next, 'Fragment Mono']]);
            }}
          >
            + Column
          </button>
        )}
      </div>
      {moments.map((moment) => (
        <div key={moment.name} className="cmp-row">
          <span className="cmp-rowname">{moment.name}</span>
          {cols.map(([s, m], i) => (
            <div
              key={i}
              className="cmp-cell"
              style={{ '--sans': stackFor(s, 'sans'), '--mono': stackFor(m, 'mono') } as React.CSSProperties}
            >
              {moment.render()}
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<Compare />);
