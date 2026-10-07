---
"formulaire-ui": minor
---

`GridForm.Field` takes an `error` prop for messages from outside the browser's own validation (react-hook-form, Zod, a server). Errors passed to `<GridForm.Root errors>` now show their message in the cell, and clear when the user edits that field. Long messages wrap within the cell instead of pushing the label out.
