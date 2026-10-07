# formulaire-ui

## 0.2.0

### Minor Changes

- 6e440d3: `GridForm.Field` takes an `error` prop for messages from outside the browser's own validation (react-hook-form, Zod, a server). Errors passed to `<GridForm.Root errors>` now show their message in the cell, and clear when the user edits that field. Long messages wrap within the cell instead of pushing the label out.

### Patch Changes

- ab45599: Autofilled inputs (browser autofill, 1Password, LastPass, Dashlane) keep the cell's look instead of the autofill tint.

## 0.1.1

### Patch Changes

- 8882a73: Link the live docs site, formulaire.mattrothenberg.com, from the README and the package's homepage field.
