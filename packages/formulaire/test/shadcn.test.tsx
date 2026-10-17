import { afterEach, expect, test } from 'vitest';
import '../src/styles.css';
import '../src/shadcn.css';

// A cut-down shadcn theme: variables on :root, overridden under .dark.
const theme = document.createElement('style');
theme.textContent = `
  :root { --background: rgb(255, 255, 255); --foreground: rgb(10, 10, 10);
    --muted: rgb(245, 245, 245); --muted-foreground: rgb(115, 115, 115);
    --border: rgb(229, 229, 229); --primary: rgb(23, 23, 23);
    --accent: rgb(240, 240, 240); --destructive: rgb(220, 38, 38);
    --radius: 10px; }
  .dark { --background: rgb(10, 10, 10); --foreground: rgb(250, 250, 250); }
`;
document.head.append(theme);

afterEach(() => {
  document.body.innerHTML = '';
  document.documentElement.classList.remove('dark');
  document.documentElement.removeAttribute('data-theme');
});

const form = () => {
  document.body.innerHTML = '<form class="gf"></form>';
  return getComputedStyle(document.querySelector('.gf')!);
};

test('the form takes its colors and radius from the shadcn theme', () => {
  const style = form();
  expect(style.backgroundColor).toBe('rgb(229, 229, 229)');
  expect(style.color).toBe('rgb(10, 10, 10)');
  expect(style.borderRadius).toBe('10px');
});

test("the form follows shadcn's .dark class", () => {
  document.documentElement.classList.add('dark');
  expect(form().color).toBe('rgb(250, 250, 250)');
});

test("the core's own dark tokens don't override the shadcn ones", () => {
  document.documentElement.dataset.theme = 'dark';
  expect(form().color).toBe('rgb(10, 10, 10)');
});
