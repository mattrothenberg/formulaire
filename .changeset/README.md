# Changesets

Every change to `formulaire-ui` that users should hear about gets a changeset:

```sh
pnpm changeset
```

Pick the bump (patch / minor / major) and write one line for the changelog.
On `main`, the release workflow collects pending changesets into a
"Version packages" PR; merging that PR publishes to npm.
