# WAM

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md)

この React frontend は WAM bridge に
[`@channel.io/app-sdk-wam`](https://github.com/channel-io/app-sdk/tree/main/ts/packages/wam)、
WAM 専用 theme、navigation、state、高さ同期に
[`@channel.io/app-sdk-wam-ui`](https://github.com/channel-io/app-sdk/tree/main/ts/packages/wam-ui)
を使います。一般的な UI component は `@channel.io/bezier-react/beta` から直接 import します。

Server と WAM はどちらも `@tutorial/shared` に依存します。Zod schema と inferred type により
WAM data、app/native Function input、WAM name、Function name を一致させます。Secret、token、
server-only runtime state を shared package に入れないでください。

Example は Bezier React `4.0.0-next.13` と Bezier Icons `0.60.0` を固定します。Bezier React 4
はまだ prerelease なので version を明示的に pin し、upgrade 前に
[SDK WAM UI guide](https://github.com/channel-io/app-sdk/blob/main/docs/reference/typescript/WAM-UI.md)
を確認してください。

## Setup

Node.js 20.11 以上を install し、Corepack で pnpm を有効にします。

```sh
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install --frozen-lockfile
```

Repository root で WAM development server を起動します。

```sh
pnpm dev:wam
```

すべての workspace を build します。

```sh
pnpm build
```

Build output は `wam/dist/` に生成され、tutorial server が
`/resource/wam/tutorial` で配信します。
