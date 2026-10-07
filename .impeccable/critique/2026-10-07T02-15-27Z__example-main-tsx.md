---
target: landing page
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 4
target_identity: "file:/Users/mattrothenberg/workspace/oss/bordereau/example/main.tsx"
target_fingerprint: "sha256:7e9a5a2bdaa8e0621fadcd5d3392bba02aec78e29d90fa68d70efbbd863eb9f5"
target_path: /Users/mattrothenberg/workspace/oss/bordereau/example/main.tsx
timestamp: 2026-10-07T02-15-27Z
slug: example-main-tsx
---
# Critique: Formulaire landing page (example/main.tsx)

Method: dual-agent (A design review, B detector + browser)

## Design health: 29/40 (Good)
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Submitted JSON lands below the 26rem code panel |
| 2 | Match real world | 4 | Film-lab order and paper-form metaphor |
| 3 | User control | 3 | Theme choice not saved |
| 4 | Consistency | 2 | Bar vs Cells primary differ; "Default"=comfortable; GitHub links to profile |
| 5 | Error prevention | 3 | X-ray tags collide with errors |
| 6 | Recognition vs recall | 2 | X-ray hover-only, hint far from control and truncated on mobile |
| 7 | Flexibility | 3 | Keyboard-operable resize handles |
| 8 | Aesthetic/minimalist | 3 | Heavy TSX block right after the demo |
| 9 | Error recovery | 3 | Every message says "Required" |
| 10 | Help/docs | 3 | No repo/npm/API link |

## Design specificity
Mostly authored (film-lab order, tab-order logo, filled mode, print, X-ray); the section order is a generic library-site template. The main claim (no breakpoints) is only shown by two scrollbar-like pills.
Detector: CLI clean. Browser: 17x undersized-ui-text (compact bento labels, intentional), layout-transition (handle pill), clipped-overflow (intentional), text-overflow on the code-tabs hint at 390px (real).

## Priority issues
1. [P1] X-ray tag overlaps error message (shared grid-area). Fix: hide the tag on invalid cells. polish
2. [P1] GitHub link points to profile; no repo/npm. Fix: repo link + quiet mono metadata line. clarify
3. [P1] Resize handles read as scrollbars; main claim unseen. Fix: width presets or a visible resting width tag. clarify/delight
4. [P1] Mori/Montreal Mono are local()-only; visitors see Geist (incl. 300 weight). Fix: self-host licensed woff2; drop Geist 300. typeset
5. [P2] Configurator: 6 flat controls; above the form on mobile. Fix: group X-ray as Inspect; form first on narrow screens. layout
6. [P2] X-ray undiscoverable, no touch support, hint truncated. Fix: caption under the control; tap to peek. clarify/adapt
7. [P2] Accent invisible in Bar mode. Fix: accent the Bar primary or tint more. colorize
8. [P3] Code panel heavy; submit result hidden. Fix: cap ~12rem + Expand; show result under the form. distill

## Persona red flags
Jordan: pills unrecognized, X-ray hover undiscovered, GitHub goes to profile, Bar/Cells unclear.
Riley: X-ray+errors overlap; Filled while invalid shows errors; Density control overflows its column; X-ray tags truncate labels at 320px.
Casey: a screen of controls before the form; spans make no sense when every cell is full width; no peek; truncated hint; 2000px bento stack.

## Minor
Lowercase <title>; dark --paper equals --well; theme not saved; Checks tile wraps; compact labels are 10px.

## Questions
Resize as the hero? Bento vs a mono index? Open on a filled-in order?
