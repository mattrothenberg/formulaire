---
'formulaire-ui': minor
---

Section legends are now styled through tokens: `--gf-legend-font`, `-size`, `-weight`, `-tracking`, `-case`, `-color`, `-bg`, `-pad-top`, `-pad-bottom`, `-rule` and `-rule-color`. Defaults keep the current band. A `--gf-legend-rule` replaces the hairline under the legend instead of stacking on it.

`GridForm.Section` takes `legendProps`, passed to Base UI's `Fieldset.Legend` (className, style, render).

Fixed: a native `<legend class="gf-legend">` in plain HTML now spans the full width instead of shrinking to its text.
