# Channel App tutorial — TypeScript

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md)

A minimal Channel App Store app built with the official
[Channel App SDK](https://github.com/channel-io/app-sdk). It demonstrates the current SDK path
instead of implementing token exchange, extension registration, signature verification, and WAM
bindings by hand.

Use this repository for a runnable end-to-end app. Use the SDK repository for the API contract and
design guidance:

- [English first-app quickstart](https://github.com/channel-io/app-sdk/blob/main/docs/guides/en/quickstart.md)
- [English app-development guide](https://github.com/channel-io/app-sdk/blob/main/docs/guides/en/app-development.md)
- [English concepts: Function, Extension, WAM, and authentication](https://github.com/channel-io/app-sdk/blob/main/docs/guides/en/concepts.md)
- [English Extension guide](https://github.com/channel-io/app-sdk/blob/main/docs/guides/en/extensions.md)
- [한국어 앱 개발 전체 가이드](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ko/app-development.md)
- [한국어 핵심 개념](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ko/concepts.md)
- [한국어 Extension 전체 가이드](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ko/extensions.md)
- [日本語アプリ開発完全ガイド](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ja/app-development.md)
- [日本語の基本概念](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ja/concepts.md)
- [日本語 Extension 完全ガイド](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ja/extensions.md)
- [Authentication and tokens](https://github.com/channel-io/app-sdk/blob/main/docs/reference/typescript/AUTH-AND-TOKENS.md)
- [TypeScript architecture](https://github.com/channel-io/app-sdk/blob/main/docs/reference/typescript/ARCHITECTURE.md)
- [Command extension](https://github.com/channel-io/app-sdk/blob/main/docs/reference/typescript/extensions/command.md)
- [WAM SDK](https://github.com/channel-io/app-sdk/blob/main/docs/reference/typescript/WAM.md)

## What this app demonstrates

- `@channel.io/app-sdk-server` and `@channel.io/app-sdk-wam` `0.17.2`
- a `command` extension discovered and registered automatically
- typed app functions with Zod input/output schemas
- SDK-managed app/channel token caching and refresh
- HMAC request verification with the SDK signature guard
- a React WAM using `@channel.io/app-sdk-wam` hooks
- a shared Zod contract package used by both the server and React WAM
- redesigned Bezier components from `@channel.io/bezier-react/beta`
- normalization of nullable optional command fields currently emitted by AppStore

Run the `/tutorial` desk command in a group chat to open a WAM. The WAM can send a team-chat message
either through the app bot (server-side app function) or as the current manager (WAM native
function). Other chat types show an explicit unsupported message instead of silently closing.

Concepts in this repository map to concrete code as follows:

- **Extension**: `CommandExtension` publishes command metadata as the versioned `command` capability.
- **Function**: `tutorial.open` and `tutorial.sendAsBot` are standalone typed operations referenced by the command and WAM.
- **WAM**: the React UI is served at `/resource/wam/tutorial`; `useCallFunction` calls the app server and `useNativeFunction` acts as the current manager.
- **Authentication**: `SignatureGuard` verifies inbound requests, `TokenManager` caches the channel token used by the bot path, the server signs the allowed group-chat target before giving it to the WAM, and the Channel host owns manager authorization.

## SDK contract alignment

This tutorial follows the public SDK runtime contract:

- NestJS with `ChannelAppModule`
- decorated, schema-backed functions
- `PUT /functions/:version` (`/functions/v1` for the command extension)
- extension discovery and registration through the SDK/AppStore
- a narrow ingress compatibility mapping from bare `PUT /functions` calls to the same verified
  `v1` handler when the caller does not carry a system version

This tutorial pins `0.17.2` for reproducible builds and enables SDK auto-registration in the app
process. Its WAM uses only public SDK hooks and Bezier APIs.

## Prerequisites

- Node.js 20.11 or newer
- pnpm 9.15.4 through Corepack
- a private Channel App with an App ID, App Secret, and Signing Key

If you do not have an app yet, start with the SDK's
[first-app quickstart](https://github.com/channel-io/app-sdk/blob/main/docs/guides/en/quickstart.md). It covers private-app creation, server-side credentials, minimum permissions, endpoint roots, and test-channel installation.

Enable these permissions in the app's **Authentication and permissions** settings:

- Channel: `writeGroupMessage`
- Manager: `writeGroupMessageAsManager`

## Clone

```sh
git clone https://github.com/channel-io/app-tutorial-ts.git
cd app-tutorial-ts
corepack enable
```

## Configure

```sh
cp server/.env.example server/.env
```

Fill in `APP_ID`, `APP_SECRET`, and the hex-encoded `SIGNING_KEY`. Keep secrets out of Git.

## Prepare HTTPS endpoints

Start or reserve an HTTPS tunnel to local port `3000`, then save these roots in the developer portal
before starting the auto-registering server:

- Function Endpoint: `https://YOUR_HOST/functions`
- WAM Endpoint: `https://YOUR_HOST/resource/wam`

Do not append `/v1` or `/tutorial`. If credentials, permissions, or endpoints change after the
server starts, restart the server so auto-registration runs again.

The SDK route itself remains versioned. The tutorial also accepts bare `PUT /functions` and maps it
to `/functions/v1` because current command execution can call the configured Function Endpoint
without a system-version suffix. Both paths reuse the same SDK handler and signature verification.

## Install and build

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm build
corepack pnpm test
corepack pnpm typecheck
```

## Run

```sh
corepack pnpm start
```

The defaults expose:

| Setting           | URL                                           |
| ----------------- | --------------------------------------------- |
| Function Endpoint | `https://YOUR_HOST/functions`                 |
| WAM Endpoint      | `https://YOUR_HOST/resource/wam`              |
| Local WAM         | `http://localhost:3000/resource/wam/tutorial` |

After the server reports successful startup and extension registration, install or refresh the
private app in the test channel and run `/tutorial` in a group chat. Verify both sender buttons and
a permission-failure case. Do not set `SKIP_SIGNATURE_VERIFICATION=true` outside local debugging.

## Project map

```text
server/
  src/app.module.ts          SDK module, auto-registration, signature guard
  src/function-endpoint.ts   bare Function Endpoint to v1 ingress mapping
  src/tutorial.functions.ts command metadata and typed app functions
  src/target-token.ts        short-lived signed group target for the bot path
packages/shared/
  src/index.ts               WAM data and app/native function wire contracts
wam/
  src/hooks/                 validates host data with the shared Zod contract
  src/pages/Send/Send.tsx    WAM SDK hooks for app/native calls
```

Use the SDK guides and references for the current contract, and use this repository for its complete
server-and-WAM implementation. The SDK quickstart links here when runnable TypeScript code is useful.
