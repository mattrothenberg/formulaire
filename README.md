<img src="apps/docs/public/favicon.svg" width="64" height="64" alt="">

# Formulaire

A modern take on FormKeep's [Gridforms](https://formkeep.com/gridforms): the densest forms you'll actually enjoy filling in. Labels live in the cells, rows wrap on their own, and it works anywhere: one stylesheet for plain HTML, or React components built on [Base UI](https://base-ui.com).

```sh
npm install formulaire-ui @base-ui/react
```

**Live demo and docs: [formulaire.mattrothenberg.com](https://formulaire.mattrothenberg.com)**

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
3. Merge that PR. The release workflow's `stage` job then waits for approval of the `npm` environment in GitHub.
4. Approve it. The job builds `formulaire-ui` and stages it on npm.
5. Approve the staged version on npmjs.com (or `npm stage approve <id>`) with 2FA. That's what publishes it.

Publishing uses npm [trusted publishing](https://docs.npmjs.com/trusted-publishers), limited to [staged publishing](https://docs.npmjs.com/staged-publishing): npm trusts `release.yml` in this repo through OIDC, so there's no npm token in the repo's secrets, and nothing goes live without a maintainer's approval. See [SECURITY.md](SECURITY.md) for the full setup.
