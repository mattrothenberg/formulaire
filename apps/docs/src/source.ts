// Source shown beside the demo. Keep in sync with the form in main.tsx.

interface RootOptions {
  mode: string;
  density: string;
  focus: string;
}

export function demoTsx({ mode, density, focus }: RootOptions) {
  const props = [
    mode !== 'edit' && `mode="${mode}"`,
    density !== 'comfortable' && `density="${density}"`,
    focus === 'ring' && 'data-focus="ring"',
    'onFormSubmit={placeOrder}',
  ].filter(Boolean);

  return `import { GridForm } from 'formulaire-ui';
import 'formulaire-ui/styles.css';

<GridForm.Root ${props.join(' ')}>
  <GridForm.Section legend="Customer">
    <GridForm.Row>
      <GridForm.Field name="name" label="Full name" span={2}>
        <GridForm.Input required autoComplete="name" />
      </GridForm.Field>
      <GridForm.Field name="email" label="Email" span={2}>
        <GridForm.Input required type="email" autoComplete="email" />
      </GridForm.Field>
      <GridForm.Field name="phone" label="Phone">
        <GridForm.Input type="tel" autoComplete="tel" />
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
        <GridForm.Input inputMode="numeric" pattern="\\d{5}" />
      </GridForm.Field>
    </GridForm.Row>
    <GridForm.Row>
      <GridForm.Field
        name="notes"
        label="Notes for the lab"
        span={4}
        description="Expired film, pushed in camera, light leaks…"
      >
        <GridForm.Textarea />
      </GridForm.Field>
    </GridForm.Row>
  </GridForm.Section>

  <GridForm.Actions>
    <GridForm.Button type="reset">Reset</GridForm.Button>
    <GridForm.Button type="submit" variant="primary">Place order</GridForm.Button>
  </GridForm.Actions>
</GridForm.Root>`;
}

export function demoHtml({ mode, density, focus }: RootOptions) {
  const attrs = [
    'class="gf"',
    mode !== 'edit' && `data-mode="${mode}"`,
    density !== 'comfortable' && `data-density="${density}"`,
    focus === 'ring' && 'data-focus="ring"',
  ].filter(Boolean);

  return `<link rel="stylesheet" href="formulaire-ui/styles.css">

<form ${attrs.join(' ')}>
  <fieldset class="gf-section">
    <div class="gf-legend">Customer</div>
    <div class="gf-row">
      <div class="gf-field" data-span="2">
        <label class="gf-label" for="name">Full name</label>
        <input class="gf-input" id="name" name="name" required>
      </div>
      <div class="gf-field" data-span="2">
        <label class="gf-label" for="email">Email</label>
        <input class="gf-input" id="email" name="email" type="email" required>
      </div>
      <div class="gf-field">
        <label class="gf-label" for="phone">Phone</label>
        <input class="gf-input" id="phone" name="phone" type="tel">
      </div>
    </div>
  </fieldset>

  <fieldset class="gf-section">
    <div class="gf-legend">Rolls</div>
    <div class="gf-row">
      <div class="gf-field" data-span="2">
        <span class="gf-label">Format</span>
        <div class="gf-choices">
          <label class="gf-choice"><input type="radio" name="format" value="35" checked> 35mm</label>
          <label class="gf-choice"><input type="radio" name="format" value="120"> 120</label>
          <label class="gf-choice"><input type="radio" name="format" value="4x5"> 4×5</label>
        </div>
      </div>
      <div class="gf-field" data-span="2">
        <label class="gf-label" for="stock">Film stock</label>
        <select class="gf-input" id="stock" name="stock" required>…</select>
      </div>
      <div class="gf-field">
        <label class="gf-label" for="rolls">Rolls</label>
        <input class="gf-input" id="rolls" name="rolls" type="number" min="1" max="40" value="1" required>
      </div>
    </div>
    <div class="gf-row">
      <div class="gf-field">
        <label class="gf-label" for="process">Process</label>
        <select class="gf-input" id="process" name="process">…</select>
      </div>
      <div class="gf-field">
        <label class="gf-label" for="push">Push / pull</label>
        <select class="gf-input" id="push" name="push">…</select>
      </div>
      <div class="gf-field">
        <label class="gf-label" for="scan">Scan</label>
        <select class="gf-input" id="scan" name="scan">…</select>
      </div>
      <div class="gf-field" data-span="2">
        <span class="gf-label">Extras</span>
        <div class="gf-choices">
          <label class="gf-choice"><input type="checkbox" name="extras" value="prints"> 4×6 prints</label>
          <label class="gf-choice"><input type="checkbox" name="extras" value="contact"> Contact sheet</label>
          <label class="gf-choice"><input type="checkbox" name="extras" value="negs" checked> Return negs</label>
        </div>
      </div>
    </div>
  </fieldset>

  <fieldset class="gf-section">
    <div class="gf-legend">Return shipping</div>
    <div class="gf-row">
      <div class="gf-field" data-span="3">
        <label class="gf-label" for="street">Street address</label>
        <input class="gf-input" id="street" name="street">
      </div>
      <div class="gf-field">
        <label class="gf-label" for="unit">Apt / unit</label>
        <input class="gf-input" id="unit" name="unit">
      </div>
    </div>
    <div class="gf-row">
      <div class="gf-field" data-span="2">
        <label class="gf-label" for="city">City</label>
        <input class="gf-input" id="city" name="city">
      </div>
      <div class="gf-field">
        <label class="gf-label" for="state">State</label>
        <select class="gf-input" id="state" name="state">…</select>
      </div>
      <div class="gf-field">
        <label class="gf-label" for="zip">ZIP</label>
        <input class="gf-input" id="zip" name="zip" inputmode="numeric" pattern="\\d{5}">
      </div>
    </div>
    <div class="gf-row">
      <div class="gf-field" data-span="4">
        <label class="gf-label" for="notes">Notes for the lab</label>
        <textarea class="gf-input gf-textarea" id="notes" name="notes"></textarea>
        <p class="gf-description">Expired film, pushed in camera, light leaks…</p>
      </div>
    </div>
  </fieldset>

  <div class="gf-actions">
    <button class="gf-button" type="reset">Reset</button>
    <button class="gf-button" data-variant="primary" type="submit">Place order</button>
  </div>
</form>`;
}

/**
 * Finds the 1-based, inclusive line range of a field in either source.
 * Each field starts at the opening line before its `name` and ends at the
 * first closing line at the same indentation.
 */
export function fieldLines(
  code: string,
  name: string,
  lang: 'tsx' | 'html'
): [number, number] | null {
  const lines = code.split('\n');
  const open = lang === 'tsx' ? '<GridForm.Field' : '<div class="gf-field"';
  const nameLine = lines.findIndex((line) => line.includes(`name="${name}"`));
  if (nameLine === -1) return null;

  let start = nameLine;
  while (start > 0 && !lines[start].includes(open)) start--;
  const indent = lines[start].search(/\S/);
  const close = lang === 'tsx' ? '</GridForm.Field>' : '</div>';

  let end = start + 1;
  while (
    end < lines.length &&
    !(lines[end].trim() === close && lines[end].search(/\S/) === indent)
  ) {
    end++;
  }
  return [start + 1, end + 1];
}

export const installCode = `npm install formulaire-ui @base-ui/react`;

/** One field's source, dedented, for the peek card. */
export function fieldSnippet(code: string, name: string, lang: 'tsx' | 'html') {
  const range = fieldLines(code, name, lang);
  if (!range) return '';
  const lines = code.split('\n').slice(range[0] - 1, range[1]);
  const indent = Math.min(
    ...lines.filter((line) => line.trim()).map((line) => line.search(/\S/))
  );
  return lines.map((line) => line.slice(indent)).join('\n');
}
