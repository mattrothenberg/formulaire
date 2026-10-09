# formulaire-ui

## 0.4.0

### Minor Changes

- f8397ea: Section legends are now styled through tokens: `--gf-legend-font`, `-size`, `-weight`, `-tracking`, `-case`, `-color`, `-bg`, `-pad-top`, `-pad-bottom`, `-rule` and `-rule-color`. Defaults keep the current band. A `--gf-legend-rule` replaces the hairline under the legend instead of stacking on it.

  `GridForm.Section` takes `legendProps`, passed to Base UI's `Fieldset.Legend` (className, style, render).

  Fixed: a native `<legend class="gf-legend">` in plain HTML now spans the full width instead of shrinking to its text.

## 0.3.0

### Minor Changes

- 45d5714: Two focus styles that differ only in where the line goes: along the bottom (default) or all round with `data-focus="ring"`. Both tint the cell. The `underline` style, which dropped the tint, is gone.
- c1cf814: Removes the `data-actions="cells"` button style. `GridForm.Actions` always renders as a right-aligned footer bar.

### Patch Changes

- 3448525: In plain HTML, `.gf-input` and `.gf-choices` sit under their label without the `gf-control` class. Before, a control without it landed beside the label.

## 0.2.0

### Minor Changes

- 6e440d3: `GridForm.Field` takes an `error` prop for messages from outside the browser's own validation (react-hook-form, Zod, a server). Errors passed to `<GridForm.Root errors>` now show their message in the cell, and clear when the user edits that field. Long messages wrap within the cell instead of pushing the label out.

### Patch Changes

- ab45599: Autofilled inputs (browser autofill, 1Password, LastPass, Dashlane) keep the cell's look instead of the autofill tint.

## 0.1.1

### Patch Changes

- 8882a73: Link the live docs site, formulaire.mattrothenberg.com, from the README and the package's homepage field.
