// Temporary: compare Google Fonts replacements side by side.
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { GridForm } from 'formulaire-ui';
import 'formulaire-ui/styles.css';
import './demo.css';
import { loadFont, mono, monoStack, sans, sansStack } from './audition';

const references = [
  { family: 'Mori', note: 'current, local only (can’t ship)', local: true },
  { family: 'Geist', note: 'current public fallback', local: true },
];

const formats = [
  { value: '35', label: '35mm' },
  { value: '120', label: '120' },
  { value: '4x5', label: '4×5' },
];

const code = `<GridForm.Field name="stock" label="Film stock" span={2}>
  <GridForm.Select items={stocks} />
</GridForm.Field>`;

function Specimen({ family, note, monoFamily }: { family: string; note: string; monoFamily: string }) {
  const href = `/?sans=${encodeURIComponent(family)}&mono=${encodeURIComponent(monoFamily)}`;
  return (
    <section
      className="specimen"
      style={{ '--sans': sansStack(family), '--mono': monoStack(monoFamily) } as React.CSSProperties}
    >
      <header className="specimen-head">
        <span>
          {family} <em>{note}</em>
        </span>
        {family !== 'Mori' && family !== 'Geist' && <a href={href}>See it on the page</a>}
      </header>
      <h1>
        Formulaire
        <span>Forms on a grid.</span>
      </h1>
      <p>
        A modern take on FormKeep’s Gridforms: dense forms laid out on a grid,
        with labels inside the cells and rows that wrap on their own.
      </p>
      <GridForm.Root density="comfortable" render={<div />}>
        <GridForm.Row>
          <GridForm.Field label="Full name" span={2}>
            <GridForm.Input defaultValue="Ada Lovelace" />
          </GridForm.Field>
          <GridForm.Field label="Rolls">
            <GridForm.Number defaultValue={3} />
          </GridForm.Field>
        </GridForm.Row>
        <GridForm.Row>
          <GridForm.Field label="Format" span={3}>
            <GridForm.Choice options={formats} defaultValue="120" />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Root>
      <pre className="specimen-code">{code}</pre>
    </section>
  );
}

function Audition() {
  const [monoFamily, setMonoFamily] = React.useState(mono[0].family);
  React.useEffect(() => {
    [...sans, ...mono, { family: 'Geist', weights: '400;500;600', note: '' }].forEach(loadFont);
  }, []);
  return (
    <main className="audition">
      <div className="audition-bar" role="radiogroup" aria-label="Mono for labels and code">
        <span>Mono for labels and code</span>
        {mono.map((m) => (
          <button
            key={m.family}
            type="button"
            role="radio"
            aria-checked={m.family === monoFamily}
            title={m.note}
            style={{ fontFamily: monoStack(m.family) }}
            onClick={() => setMonoFamily(m.family)}
          >
            {m.family}
          </button>
        ))}
      </div>
      {references.map((r) => (
        <Specimen key={r.family} family={r.family} note={r.note} monoFamily={monoFamily} />
      ))}
      {sans.map((s) => (
        <Specimen key={s.family} family={s.family} note={s.note} monoFamily={monoFamily} />
      ))}
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<Audition />);
