import { describe, expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { GridForm } from '../src';
import { description, errorsIn, wait } from './helpers';

const stocks = [
  { value: 'portra', label: 'Kodak Portra 400' },
  { value: 'hp5', label: 'Ilford HP5 Plus' },
];

describe('built-in validation', () => {
  test('an empty required field says "Required", is invalid, described, and focused', async () => {
    const screen = await render(
      <GridForm.Root>
        <GridForm.Field name="name" label="Full name">
          <GridForm.Input required />
        </GridForm.Field>
        <GridForm.Actions>
          <GridForm.Button type="submit" variant="primary">
            Send
          </GridForm.Button>
        </GridForm.Actions>
      </GridForm.Root>
    );
    await screen.getByRole('button', { name: 'Send' }).click();

    const input = screen.getByRole('textbox', { name: /^Full name/ });
    await expect.element(input).toHaveAttribute('aria-invalid', 'true');
    expect(errorsIn(screen.container)).toEqual(['Required']);
    expect(description(input.element())).toBe('Required');
    expect(document.activeElement).toBe(input.element());
  });
});

describe('the error prop', () => {
  test('marks the field invalid and replaces the built-in messages', async () => {
    const screen = await render(
      <GridForm.Root>
        <GridForm.Field name="email" label="Email" error="Already registered">
          <GridForm.Input type="email" required />
        </GridForm.Field>
      </GridForm.Root>
    );
    const input = screen.getByRole('textbox', { name: /^Email/ });
    await expect.element(input).toHaveAttribute('aria-invalid', 'true');
    expect(errorsIn(screen.container)).toEqual(['Already registered']);
    expect(description(input.element())).toBe('Already registered');
  });

  test('a message too long for the label row moves under the control', async () => {
    const screen = await render(
      <div style={{ width: 320 }}>
        <GridForm.Root>
          <GridForm.Row>
            <GridForm.Field
              name="phone"
              label="Phone"
              error="Use a number the courier can text on the day of delivery"
            >
              <GridForm.Input />
            </GridForm.Field>
          </GridForm.Row>
          <GridForm.Row>
            <GridForm.Field name="unit" label="Unit" error="Too long">
              <GridForm.Input />
            </GridForm.Field>
          </GridForm.Row>
        </GridForm.Root>
      </div>
    );
    const cell = (name: string) =>
      screen.container.querySelector(`[data-field="${name}"]`)!;
    await expect.poll(() => cell('phone').hasAttribute('data-error-below')).toBe(true);
    expect(cell('unit').hasAttribute('data-error-below')).toBe(false);
  });
});

describe('form-level errors', () => {
  test('show in their cells, and editing a field clears only its error', async () => {
    const screen = await render(
      <GridForm.Root errors={{ email: 'Taken', zip: "We don't ship there" }}>
        <GridForm.Field name="email" label="Email">
          <GridForm.Input defaultValue="ada@post.fr" />
        </GridForm.Field>
        <GridForm.Field name="zip" label="ZIP">
          <GridForm.Input defaultValue="99999" />
        </GridForm.Field>
      </GridForm.Root>
    );
    expect(errorsIn(screen.container)).toEqual(['Taken', "We don't ship there"]);

    await userEvent.fill(screen.getByRole('textbox', { name: 'ZIP' }), '10001');
    await expect.poll(() => errorsIn(screen.container)).toEqual(['Taken']);
    await expect
      .element(screen.getByRole('textbox', { name: 'ZIP' }))
      .not.toHaveAttribute('aria-invalid');
  });
});

describe('choices', () => {
  test('radios and checkboxes are named by their labels', async () => {
    const screen = await render(
      <GridForm.Root>
        <GridForm.Field name="format" label="Format">
          <GridForm.Choice
            options={[
              { value: '35', label: '35mm' },
              { value: '120', label: '120' },
            ]}
          />
        </GridForm.Field>
        <GridForm.Field name="extras" label="Extras">
          <GridForm.Checks options={[{ value: 'negs', label: 'Return negs' }]} />
        </GridForm.Field>
      </GridForm.Root>
    );
    await expect.element(screen.getByRole('radiogroup', { name: 'Format' })).toBeVisible();
    await expect.element(screen.getByRole('radio', { name: '120' })).toBeVisible();
    await expect.element(screen.getByRole('checkbox', { name: 'Return negs' })).toBeVisible();
  });

  test('filled mode is read-only', async () => {
    const screen = await render(
      <GridForm.Root mode="filled">
        <GridForm.Field name="format" label="Format">
          <GridForm.Choice
            defaultValue="35"
            options={[
              { value: '35', label: '35mm' },
              { value: '120', label: '120' },
            ]}
          />
        </GridForm.Field>
      </GridForm.Root>
    );
    await screen.getByText('120').click();
    await expect.element(screen.getByRole('radio', { name: '35mm' })).toBeChecked();
    await expect.element(screen.getByRole('radio', { name: '120' })).not.toBeChecked();
  });
});

describe('select', () => {
  test('the cell keeps its focus style while the menu opens and closes', async () => {
    const screen = await render(
      <GridForm.Root>
        <GridForm.Field name="stock" label="Film stock">
          <GridForm.Select items={stocks} />
        </GridForm.Field>
      </GridForm.Root>
    );
    const cell = screen.container.querySelector<HTMLElement>('[data-field="stock"]')!;
    await screen.getByRole('combobox', { name: 'Film stock' }).click();
    await expect.element(screen.getByRole('option', { name: 'Ilford HP5 Plus' })).toBeVisible();

    // Sample the cell's focus line every frame across the pick and close.
    const samples: string[] = [];
    let sampling = true;
    const sample = () => {
      samples.push(getComputedStyle(cell).boxShadow);
      if (sampling) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
    await screen.getByRole('option', { name: 'Ilford HP5 Plus' }).click();
    await wait(500);
    sampling = false;

    expect(samples.length).toBeGreaterThan(10);
    expect(samples.filter((s) => s === 'none')).toEqual([]);
  });
});
