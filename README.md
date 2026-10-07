# Formulaire

Forms on a grid. A modern take on FormKeep's [Gridforms](https://formkeep.com/gridforms).

This is the monorepo. The library's own docs live in [`packages/formulaire`](packages/formulaire/README.md).

| Path | What | Published |
|---|---|---|
| `packages/formulaire` | The library: CSS core plus React components on Base UI | `formulaire-ui` on npm |
| `apps/docs` | The landing page and live demo (Vite) | No |

## Develop

```sh
pnpm install
pnpm dev          # docs site on http://localhost:5317
pnpm build        # library: dist/ (ESM, CJS, types, styles.css)
pnpm build:docs   # static docs site in apps/docs/dist
pnpm typecheck    # every package
```

The docs site imports the library's source through Vite aliases (`apps/docs/vite.config.ts`), so edits in `packages/formulaire/src` hot-reload without a build. The library build runs [publint](https://publint.dev) and [are-the-types-wrong](https://arethetypeswrong.github.io) and fails on type resolution problems.

## Releasing

Releases use [Changesets](https://github.com/changesets/changesets):

1. Run `pnpm changeset` with your change, pick the bump and write one changelog line.
2. Merge to `main`. The release workflow opens (or updates) a "Version packages" PR.
3. Merge that PR. The workflow builds and publishes `formulaire-ui` to npm with provenance.

The release workflow needs an `NPM_TOKEN` repository secret.
