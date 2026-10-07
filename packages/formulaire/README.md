<img src="https://raw.githubusercontent.com/mattrothenberg/formulaire/main/apps/docs/public/favicon.svg" width="64" height="64" alt="">

# Formulaire

A modern take on FormKeep's [Gridforms](https://formkeep.com/gridforms): the densest forms you'll actually enjoy filling in. Labels live in the cells, rows wrap on their own, and it works anywhere: one stylesheet for plain HTML, or React components built on [Base UI](https://base-ui.com).

> *Formulaire* is French for form, the paper kind you fill out at the post office.

## Install

```sh
npm install formulaire-ui @base-ui/react
```

React 19 and Base UI 1.x are peer dependencies. The stylesheet is plain CSS in `@layer formulaire`, so any unlayered rule of yours overrides it.

## Usage

```tsx
import { GridForm } from 'formulaire-ui';
import 'formulaire-ui/styles.css';

<GridForm.Root mode="edit" density="comfortable" onFormSubmit={save}>
  <GridForm.Section legend="Customer">
    <GridForm.Row>
      <GridForm.Field name="name" label="Full name" span={2}>
        <GridForm.Input required />
      </GridForm.Field>
      <GridForm.Field name="stock" label="Film stock">
        <GridForm.Select items={stocks} />
      </GridForm.Field>
    </GridForm.Row>
  </GridForm.Section>
</GridForm.Root>;
```

## Ideas

- **Container-adaptive, no breakpoints.** A cell asks for `span × --gf-min-col`, and a row wraps when the container can't fit it.
- **Edit and filled modes.** `mode="filled"` renders the same form read-only, like a completed document, with dashes for empty fields.
- **Errors inside the cell.** Short validation messages sit beside the label, so the layout never shifts.
- **Base UI underneath.** Field, Form, Fieldset, Select, Radio and Checkbox handle labelling, validation and focus state.
- **Plain HTML works too.** `.gf > .gf-section > .gf-row > .gf-field[data-span]`.
- **Themeable.** Everything is a `--gf-*` custom property inside `@layer formulaire`.

## Input masks

Formulaire doesn't bundle a mask library. `GridForm.Input` passes its `ref` straight to the `<input>`, so any ref-based masker works. [Maskito](https://maskito.dev) handles the cursor position, pasting and undo well, and `@maskito/phone` formats numbers by country:

```tsx
import { maskitoPhone } from '@maskito/phone';
import { useMaskito } from '@maskito/react';
import metadata from 'libphonenumber-js/min/metadata';

// Module scope, so the mask isn't rebuilt on every render.
const phoneMask = maskitoPhone({ countryIsoCode: 'US', metadata, format: 'NATIONAL' });

function PhoneInput(props: InputProps) {
  const ref = useMaskito({ options: phoneMask });
  return <GridForm.Input ref={ref} type="tel" autoComplete="tel" {...props} />;
}
```

Call `useMaskito` in the same component as the input. If the hook lives in a parent and the input remounts, Maskito drops the mask.
