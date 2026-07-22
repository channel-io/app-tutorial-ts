# WAM

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md)

This React frontend uses
[`@channel.io/app-sdk-wam`](https://github.com/channel-io/app-sdk/tree/main/ts/packages/wam)
for the WAM bridge and
[`@channel.io/app-sdk-wam-ui`](https://github.com/channel-io/app-sdk/tree/main/ts/packages/wam-ui)
for WAM-specific theming, navigation, states, and content-height synchronization. Import
general-purpose UI components directly from `@channel.io/bezier-react/beta`.

The server and WAM both depend on `@tutorial/shared`. Its Zod schemas and inferred types keep WAM
data, app-function inputs, native-function inputs, WAM names, and function names aligned. Secrets,
tokens, and server-only runtime state do not belong in the shared package.

The example pins Bezier React `4.0.0-next.13` and Bezier Icons `0.60.0`. Bezier React 4 is still a
prerelease, so keep the selected version explicit and check the
[SDK WAM UI guide](https://github.com/channel-io/app-sdk/blob/main/docs/reference/typescript/WAM-UI.md)
before upgrading it.

## Setup

Install Node.js 20.11 or newer, then enable pnpm through Corepack:

```sh
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install --frozen-lockfile
```

Run the WAM development server from the repository root:

```sh
pnpm dev:wam
```

Build all workspaces from the repository root:

```sh
pnpm build
```

The WAM output is written to `wam/dist/`. The tutorial server exposes that directory below
`/resource/wam/tutorial`.
