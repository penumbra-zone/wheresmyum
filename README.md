# wheresmyum

The `wheresmyum` code leverages [pindexer] to display information about IBC transfers.

## Getting Started

The application is written in [Remix], and uses [pnpm] for package management.
The fastest way to get started on the development environment is to use [Nix]:

```shell
sh <(curl -L https://nixos.org/nix/install)
nix develop
just dev
```

However, you still need a database to connect to.

## Connecting to a database

The wheresmyum application requires a PostgreSQL database containing ABCI event information
as written by [pindexer].
You can set up a local devnet by following the [Penumbra devnet quickstart guide](https://guide.penumbra.zone/dev/devnet-quickstart),
or plug in credentials for an already running database via environment variables:

```
# add these to e.g. `.envrc`:
export PENUMBRA_INDEXER_ENDPOINT="postgresql://<PGUSER>:<PGPASS>@<PGHOST>:<PGPORT>/<PGDATABASE>?sslmode=require""
# optional: if you see "self-signed certificate in certificate chain" errors,
# you'll likely need to export a `ca-cert.pem` file for the DB TLS.
# export PENUMBRA_INDEXER_CA_CERT="$(cat ca-cert.pem)"
```

If you see an error `self-signed certificate in certificate chain`, then you'll need to:

  1. obtain the CA certificate file for the backend database you're connecting to, and export it as `PENUMBRA_INDEXER_CA_CERT`.
  2. _remove_ the `sslmode=require` string on the `PENUMBRA_INDEXER_ENDPOINT` var.

See context in https://github.com/penumbra-zone/dex-explorer/issues/55. After configuring that information, run `just dev` again in the nix shell, and you should have events visible.


## Deployment

Merges to main will automatically build a container, hosted at `ghcr.io/penumbra-zone/wheresmyum`.
In order to run the application, you'll need to [deploy a Penumbra fullnode](https://guide.penumbra.zone/node/pd/running-node),
with [ABCI event indexing enabled](https://guide.penumbra.zone/node/pd/indexing-events).
Furthermore, you'll need to run [`pindexer`] and provide read-only access to that database to the application.
The relevant environment variables you'll want to set are:

  * `PENUMBRA_INDEXER_ENDPOINT`: the URL to a Postgres database, managed by [pindexer]
  * `PENUMBRA_INDEXER_CA_CERT`: optional; if set, the database connection will use the provided certificate authority when validating TLS


## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.

[Nix]: https://nixos.org/download/
[Penumbra]: https://github.com/penumbra-zone/penumbra
[Remix]: https://remix.run/docs
[pindexer]: https://guide.penumbra.zone/node/pd/indexing-events#using-pindexer
