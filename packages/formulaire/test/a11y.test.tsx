import axe from 'axe-core';
import { afterEach, describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { GridForm, type Mode } from '../src';
import './helpers';

const stocks = [
  { value: 'portra', label: 'Kodak Portra 400' },
  { value: 'hp5', label: 'Ilford HP5 Plus' },
];
const formats = [
  { value: '35', label: '35mm' },
  { value: '120', label: '120' },
];
const extras = [
  { value: 'prints', label: 'Prints' },
  { value: 'negs', label: 'Return negs' },
];

/** Every control, a description, required fields and an action row. */
function KitchenSink({
  mode = 'edit',
  errors,
}: {
  mode?: Mode;
  errors?: Record<string, string>;
}) {
  return (
    <GridForm.Root mode={mode} errors={errors}>
      <GridForm.Section legend="Customer">
        <GridForm.Row>
          <GridForm.Field name="name" label="Full name" span={2}>
            <GridForm.Input required defaultValue={mode === 'filled' ? 'Ada' : ''} />
          </GridForm.Field>
          <GridForm.Field name="email" label="Email" span={2}>
            <GridForm.Input type="email" required />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Section>
      <GridForm.Section legend="Rolls">
        <GridForm.Row>
          <GridForm.Field name="stock" label="Film stock" span={2}>
            <GridForm.Select items={stocks} required />
          </GridForm.Field>
          <GridForm.Field name="rolls" label="Rolls">
            <GridForm.Number defaultValue={1} min={1} />
          </GridForm.Field>
        </GridForm.Row>
        <GridForm.Row>
          <GridForm.Field name="format" label="Format" span={2}>
            <GridForm.Choice options={formats} defaultValue="35" />
          </GridForm.Field>
          <GridForm.Field name="extras" label="Extras" span={2}>
            <GridForm.Checks options={extras} defaultValue={['negs']} />
          </GridForm.Field>
        </GridForm.Row>
        <GridForm.Row>
          <GridForm.Field
            name="notes"
            label="Notes"
            span={4}
            description="Anything we should know."
          >
            <GridForm.Textarea />
          </GridForm.Field>
        </GridForm.Row>
      </GridForm.Section>
      <GridForm.Actions>
        <GridForm.Button>Reset</GridForm.Button>
        <GridForm.Button type="submit" variant="primary">
          Place order
        </GridForm.Button>
      </GridForm.Actions>
    </GridForm.Root>
  );
}

async function violations(container: Element) {
  const result = await axe.run(container, {
    runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
    // A single component on a test page has no landmarks or page heading.
    rules: { region: { enabled: false }, 'page-has-heading-one': { enabled: false } },
  });
  return result.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`
  );
}

afterEach(() => {
  delete document.documentElement.dataset.theme;
});

describe.each(['light', 'dark'])('axe, %s theme', (theme) => {
  test('untouched form', async () => {
    document.documentElement.dataset.theme = theme;
    const screen = await render(<KitchenSink />);
    expect(await violations(screen.container)).toEqual([]);
  });

  test('after an invalid submit', async () => {
    document.documentElement.dataset.theme = theme;
    const screen = await render(<KitchenSink />);
    await screen.getByRole('button', { name: 'Place order' }).click();
    await expect
      .element(screen.getByRole('textbox', { name: /^Full name/ }))
      .toHaveAttribute('aria-invalid', 'true');
    expect(await violations(screen.container)).toEqual([]);
  });

  test('with external errors, short and long', async () => {
    document.documentElement.dataset.theme = theme;
    const screen = await render(
      <KitchenSink
        errors={{
          email: 'That email is already registered to another lab account',
          name: 'Taken',
        }}
      />
    );
    expect(await violations(screen.container)).toEqual([]);
  });

  test('filled mode', async () => {
    document.documentElement.dataset.theme = theme;
    const screen = await render(<KitchenSink mode="filled" />);
    expect(await violations(screen.container)).toEqual([]);
  });
});
