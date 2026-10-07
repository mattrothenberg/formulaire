import { afterEach, expect, test } from 'vitest';
import '../src/styles.css';

// The plain-HTML markup from the docs: controls carry only their own class
// (gf-input, gf-choices), without the gf-control the React components add.
const markup = `
<form class="gf" style="width: 900px">
  <fieldset class="gf-section">
    <div class="gf-row">
      <div class="gf-field">
        <label class="gf-label" for="name">Full name</label>
        <input class="gf-input" id="name">
      </div>
      <div class="gf-field">
        <label class="gf-label" for="stock">Film stock</label>
        <select class="gf-input" id="stock"><option>Portra 400</option></select>
      </div>
      <div class="gf-field">
        <label class="gf-label" for="notes">Notes</label>
        <textarea class="gf-input gf-textarea" id="notes"></textarea>
      </div>
      <div class="gf-field">
        <span class="gf-label">Format</span>
        <div class="gf-choices">
          <label class="gf-choice"><input type="radio" name="format" checked> 35mm</label>
        </div>
      </div>
    </div>
  </fieldset>
</form>`;

afterEach(() => {
  document.body.innerHTML = '';
});

test('plain-HTML controls sit under their label, full width', () => {
  document.body.innerHTML = markup;
  for (const field of document.querySelectorAll('.gf-field')) {
    const label = field.querySelector('.gf-label')!.getBoundingClientRect();
    const control = field.querySelector('.gf-input, .gf-choices')!.getBoundingClientRect();
    expect(control.top).toBeGreaterThanOrEqual(label.bottom);
    expect(control.left).toBeCloseTo(label.left, 0);
  }
});
