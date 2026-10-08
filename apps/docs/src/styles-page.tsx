// Styles: recipes for restyling forms with tokens. Each recipe's CSS is a
// string that's both injected into the page and shown for copying, so what
// you copy is exactly what renders.
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { GridForm } from 'formulaire-ui';
import 'formulaire-ui/styles.css';
import { Snippet } from './code';
import { ThemeToggle, useThemeAttribute, type Theme } from './theme';
import './demo.css';

const REPO_URL = 'https://github.com/mattrothenberg/formulaire';

const stocks = [
  { value: 'portra-400', label: 'Kodak Portra 400' },
  { value: 'hp5', label: 'Ilford HP5 Plus' },
  { value: 'cinestill-800t', label: 'CineStill 800T' },
];

const titles = [
  { value: 'mr', label: 'Mr.' },
  { value: 'mrs', label: 'Mrs.' },
  { value: 'ms', label: 'Ms.' },
];

const nationalities = [
  { value: 'in', label: 'India' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
];

/* ---------------------------------------------------------------- recipes */

const headingCss = `.heading {
  --gf-legend-font: var(--gf-font);
  --gf-legend-size: calc(var(--gf-input-size) * 1.0625);
  --gf-legend-weight: 650;
  --gf-legend-tracking: normal;
  --gf-legend-case: none;
  --gf-legend-bg: var(--gf-paper);
  --gf-legend-pad-top: calc(var(--gf-pad-y) * 1.4);
  --gf-legend-pad-bottom: calc(var(--gf-pad-y) * 0.6);
  --gf-legend-rule: 3px;
}`;

const gridformsCss = `/*
 * FormKeep's Gridforms: cream paper, dark lines, Helvetica, open sides.
 * Paper stays paper, so every color is set, dark theme or not.
 */
.gridforms {
  --gf-paper: oklch(99% 0.035 102);
  --gf-paper-2: var(--gf-paper);
  --gf-hover: oklch(97% 0.06 100);
  --gf-highlight: oklch(95.5% 0.08 100);
  --gf-line: oklch(42% 0 0);
  --gf-ink: oklch(22% 0 0);
  --gf-muted: oklch(30% 0 0);
  --gf-faint: oklch(45% 0 0);
  --gf-accent: oklch(30% 0 0);
  --gf-danger: oklch(50% 0.19 27);
  --gf-danger-bg: oklch(96% 0.03 40);
  --gf-font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --gf-font-label: var(--gf-font);
  --gf-label-size: 0.625rem;
  --gf-radius: 0;

  --gf-legend-font: var(--gf-font);
  --gf-legend-size: 1.0625rem;
  --gf-legend-weight: 700;
  --gf-legend-tracking: normal;
  --gf-legend-case: none;
  --gf-legend-bg: var(--gf-paper);
  --gf-legend-pad-top: calc(var(--gf-pad-y) * 1.4);
  --gf-legend-pad-bottom: calc(var(--gf-pad-y) * 0.6);
  --gf-legend-rule: 3px;
  --gf-legend-rule-color: oklch(30% 0 0);

  border-inline-width: 0;
  border-block-start-width: 0;
}

/* A quieter subheading for one section. */
.gridforms .subhead {
  --gf-legend-weight: 400;
  --gf-legend-rule: 2px;
  --gf-legend-pad-top: var(--gf-pad-y);
}`;

const accentRuleCss = `.accent-rule {
  --gf-legend-font: var(--gf-font);
  --gf-legend-size: calc(var(--gf-input-size) * 1.0625);
  --gf-legend-weight: 650;
  --gf-legend-tracking: normal;
  --gf-legend-case: none;
  --gf-legend-bg: var(--gf-paper);
  --gf-legend-pad-top: calc(var(--gf-pad-y) * 1.4);
  --gf-legend-pad-bottom: calc(var(--gf-pad-y) * 0.6);
  --gf-legend-rule: 2px;
  --gf-legend-rule-color: var(--gf-accent);
}`;

const kickerCss = `.kicker {
  --gf-legend-color: var(--gf-accent);
  --gf-legend-bg: var(--gf-paper);
  --gf-legend-pad-top: calc(var(--gf-pad-y) * 1.4);
  --gf-legend-pad-bottom: calc(var(--gf-pad-y) * 0.6);
  --gf-legend-rule: 1px;
  --gf-legend-rule-color: var(--gf-accent);
}`;

const reactTsx = `// Tokens on one legend
<GridForm.Section
  legend="Shipping"
  legendProps={{
    style: { '--gf-legend-rule': '3px', '--gf-legend-bg': 'var(--gf-paper)' },
  }}
/>

// A recipe class on one section
<GridForm.Section className="heading" legend="Gift message" />

// Your own markup inside the legend
<GridForm.Section
  legend={<span className="split">Notes <small>Optional</small></span>}
/>`;

// Page-only CSS for the custom legend in the React example.
const splitCss = `.split {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}
.split small {
  color: var(--gf-muted);
  font-family: var(--gf-font-label);
  font-size: var(--gf-label-size);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}`;

const tokens: Array<[string, string, string]> = [
  ['--gf-legend-font', 'var(--gf-font-label)', 'Font family'],
  ['--gf-legend-size', 'var(--gf-label-size)', 'Font size'],
  ['--gf-legend-weight', '600', 'Font weight'],
  ['--gf-legend-tracking', '0.08em', 'Letter spacing'],
  ['--gf-legend-case', 'uppercase', 'text-transform'],
  ['--gf-legend-color', 'var(--gf-ink)', 'Text color'],
  ['--gf-legend-bg', 'var(--gf-paper-2)', 'Background'],
  [
    '--gf-legend-pad-top',
    'calc(var(--gf-pad-y) * 0.9)',
    'Space above the text',
  ],
  [
    '--gf-legend-pad-bottom',
    'calc(var(--gf-pad-y) * 0.9)',
    'Space below the text',
  ],
  ['--gf-legend-rule', '0px', 'Rule under the legend; replaces the hairline'],
  ['--gf-legend-rule-color', 'var(--gf-ink)', 'Rule color'],
];

/* ------------------------------------------------------------------ forms */

function OrderForm({ className }: { className?: string }) {
  return (
    <GridForm.Root className={className}>
      <GridForm.Section legend="Customer">
        <GridForm.Row>
          <GridForm.Field name="name" label="Full name" span={2}>
            <GridForm.Input defaultValue="Ada Lovelace" />
          </GridForm.Field>
          <GridForm.Field name="email" label="Email" span={2}>
            <GridForm.Input type="email" />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Section>
      <GridForm.Section legend="Order">
        <GridForm.Row>
          <GridForm.Field name="stock" label="Film stock" span={2}>
            <GridForm.Select items={stocks} />
          </GridForm.Field>
          <GridForm.Field name="rolls" label="Rolls">
            <GridForm.Number defaultValue={3} min={1} />
          </GridForm.Field>
          <GridForm.Field name="push" label="Push / pull">
            <GridForm.Input />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Section>
    </GridForm.Root>
  );
}

function BankForm() {
  return (
    <GridForm.Root className="gridforms">
      <GridForm.Section legend="Please open an account at">
        <GridForm.Row>
          <GridForm.Field name="branch" label="Branch name">
            <GridForm.Input />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Section>
      <GridForm.Section legend="Personal Details (Sole/First Accountholder/Minor)">
        <GridForm.Row>
          <GridForm.Field name="title" label="Title">
            <GridForm.Choice options={titles} />
          </GridForm.Field>
          <GridForm.Field name="fullName" label="Full name" span={3}>
            <GridForm.Input />
          </GridForm.Field>
        </GridForm.Row>
        <GridForm.Row>
          <GridForm.Field name="dob" label="Date of birth" span={2}>
            <GridForm.Input type="date" />
          </GridForm.Field>
          <GridForm.Field name="nationality" label="Nationality" span={2}>
            <GridForm.Select items={nationalities} />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Section>
      <GridForm.Section legend="Residential address" className="subhead">
        <GridForm.Row>
          <GridForm.Field name="flat" label="Flat no. and bldg. name" span={2}>
            <GridForm.Input />
          </GridForm.Field>
          <GridForm.Field name="road" label="Road no./name" span={2}>
            <GridForm.Input />
          </GridForm.Field>
        </GridForm.Row>
        <GridForm.Row>
          <GridForm.Field name="telRes" label="Telephone residence">
            <GridForm.Input type="tel" />
          </GridForm.Field>
          <GridForm.Field name="office" label="Office">
            <GridForm.Input type="tel" />
          </GridForm.Field>
          <GridForm.Field name="city" label="City">
            <GridForm.Input />
          </GridForm.Field>
          <GridForm.Field name="pin" label="Pin code">
            <GridForm.Input inputMode="numeric" />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Section>
    </GridForm.Root>
  );
}

function ReactForm() {
  return (
    <GridForm.Root>
      <GridForm.Section
        legend="Shipping"
        legendProps={{
          style: {
            '--gf-legend-rule': '3px',
            '--gf-legend-bg': 'var(--gf-paper)',
          } as React.CSSProperties,
        }}
      >
        <GridForm.Row>
          <GridForm.Field name="street" label="Street" span={3}>
            <GridForm.Input />
          </GridForm.Field>
          <GridForm.Field name="zip" label="ZIP">
            <GridForm.Input />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Section>
      <GridForm.Section className="heading" legend="Gift message">
        <GridForm.Row>
          <GridForm.Field name="message" label="Message">
            <GridForm.Input />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Section>
      <GridForm.Section
        legend={
          <span className="split">
            Notes <small>Optional</small>
          </span>
        }
      >
        <GridForm.Row>
          <GridForm.Field name="notes" label="For the lab">
            <GridForm.Input />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Section>
    </GridForm.Root>
  );
}

/* ------------------------------------------------------------------- page */

function Recipe({
  title,
  children,
  form,
  code,
  lang = 'css',
}: {
  title: string;
  children: React.ReactNode;
  form: React.ReactNode;
  code?: string;
  lang?: 'css' | 'tsx';
}) {
  return (
    <section className="recipe wide">
      <div className="recipe-text">
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
      {form}
      {code && (
        <Snippet
          lang={lang}
          label={lang === 'css' ? 'CSS' : 'React'}
          code={code}
        />
      )}
    </section>
  );
}

function StylesPage() {
  const [theme, setTheme] = React.useState<Theme>('system');
  useThemeAttribute(theme);

  return (
    <main className="page">
      <style>
        {[headingCss, gridformsCss, accentRuleCss, kickerCss, splitCss].join(
          '\n'
        )}
      </style>

      <header className="masthead wide">
        <nav className="masthead-nav">
          <ThemeToggle theme={theme} onChange={setTheme} />
          <a className="masthead-link" href="/">
            Formulaire
          </a>
          <a className="masthead-link" href={REPO_URL}>
            GitHub
          </a>
        </nav>
      </header>

      <section className="intro">
        <h1>Styles</h1>
        <p>
          Formulaire ships one look and keeps every visual choice in a{' '}
          <code>--gf-*</code> token. These are recipes, not themes you install.
          Copy the CSS into your own stylesheet, rename the class and change
          anything. Your CSS sits outside <code>@layer formulaire</code>, so it
          always wins.
        </p>
      </section>

      <Recipe title="Default" form={<OrderForm />}>
        A tinted band in the label font. No CSS needed.
      </Recipe>

      <Recipe
        title="Heading"
        form={<OrderForm className="heading" />}
        code={headingCss}
      >
        A sans title on paper over a heavy rule, like a printed form. Put the
        class on the form, or on one section.
      </Recipe>

      <Recipe title="Gridforms" form={<BankForm />} code={gridformsCss}>
        FormKeep's <a href="https://formkeep.com/gridforms">Gridforms</a>,
        rebuilt from tokens: cream paper, dark lines, Helvetica throughout,
        square corners and open sides. One section uses a lighter subheading.
      </Recipe>

      <Recipe
        title="Accent rule"
        form={<OrderForm className="accent-rule" />}
        code={accentRuleCss}
      >
        The heading, with a thinner rule in the form's accent color.
      </Recipe>

      <Recipe
        title="Kicker"
        form={<OrderForm className="kicker" />}
        code={kickerCss}
      >
        The default label type in the accent color, on paper over a 1px accent
        rule.
      </Recipe>

      <Recipe
        title="From React"
        form={<ReactForm />}
        code={reactTsx}
        lang="tsx"
      >
        Style one legend with <code>legendProps</code> (className, style or
        render), put a recipe class on one section, or pass your own markup as
        the legend.
      </Recipe>

      <article className="prose">
        <h2>Legend tokens</h2>
        <p>
          Set them on the form, on a section, or on one legend. The defaults
          make the band.
        </p>
        <table className="token-table">
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Default</th>
              <th scope="col">Sets</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map(([name, value, note]) => (
              <tr key={name}>
                <td>
                  <code>{name}</code>
                </td>
                <td>
                  <code>{value}</code>
                </td>
                <td>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StylesPage />
  </React.StrictMode>
);
