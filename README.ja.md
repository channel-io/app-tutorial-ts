# Channel App チュートリアル — TypeScript

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md)

公式 [Channel App SDK](https://github.com/channel-io/app-sdk) で作る最小構成の end-to-end App
Store アプリです。Token exchange、Extension registration、signature verification、WAM bridge
を独自実装せず、現在の SDK path を示します。

この repository は実行可能な例として使い、contract と設計原則は SDK 文書を参照してください。

- [最初のアプリ Quickstart](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ja/quickstart.md)
- [アプリ開発完全ガイド](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ja/app-development.md)
- [Function、Extension、WAM、認証の基本概念](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ja/concepts.md)
- [Extension 完全ガイド](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ja/extensions.md)
- [TypeScript authentication と token](https://github.com/channel-io/app-sdk/blob/main/docs/reference/typescript/AUTH-AND-TOKENS.md)
- [TypeScript architecture](https://github.com/channel-io/app-sdk/blob/main/docs/reference/typescript/ARCHITECTURE.md)
- [Command Extension](https://github.com/channel-io/app-sdk/blob/main/docs/reference/typescript/extensions/command.md)
- [WAM SDK](https://github.com/channel-io/app-sdk/blob/main/docs/reference/typescript/WAM.md)

## このアプリで確認できること

- `@channel.io/app-sdk-server` と `@channel.io/app-sdk-wam` `0.17.2`
- 自動 discovery/registration される `command` Extension
- Zod input/output schema を持つ typed app Function
- SDK-managed app/channel token cache と refresh
- SDK signature guard による HMAC request verification
- `@channel.io/app-sdk-wam` hook を使う React WAM
- Server と WAM が共有する Zod contract package
- `@channel.io/bezier-react/beta` の Bezier 4 component
- AppStore が送る nullable command field の normalization

Group chat で `/tutorial` Desk command を実行すると WAM が開きます。WAM は app bot を使う
server-side app Function、または現在の manager authorization を使う WAM native Function で
team-chat message を送信します。対応しない chat type では silent close せず error state を表示します。

コード上の基本概念は次の要素に対応します。

- **Extension**: `CommandExtension` が versioned `command` capability metadata を公開します。
- **Function**: `tutorial.open` と `tutorial.sendAsBot` は command と WAM が参照する standalone typed operation です。
- **WAM**: React UI は `/resource/wam/tutorial` で配信します。`useCallFunction` は app server、`useNativeFunction` は現在の manager として Channel を呼びます。
- **認証**: `SignatureGuard` が inbound request を検証し、`TokenManager` が bot path の channel token を cache します。Server は許可済み group target に短期 signature を付けて WAM に渡し、manager authorization は Channel host が管理します。

## SDK contract

この tutorial は public SDK runtime contract に従います。

- NestJS と `ChannelAppModule`
- Decorator と schema を持つ Function
- `PUT /functions/:version` と command の `/functions/v1`
- SDK/AppStore による Extension discovery と registration
- System version がない `PUT /functions` を同じ signature verification を使う `v1` handler に接続する限定的な compatibility mapping

Reproducible build のため SDK `0.17.2` を固定し、app process 起動時に auto-registration を
実行します。WAM は public SDK hook と Bezier API だけを使います。

## 前提条件

- Node.js 20.11 以上
- Corepack 経由の pnpm 9.15.4
- App ID、App Secret、Signing Key を持つ開発用 private Channel App

アプリがまだない場合は SDK の
[最初のアプリ Quickstart](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ja/quickstart.md)から
始めてください。Private app creation、server-side credential、minimum permission、endpoint
root、test channel installation を一つの flow で説明します。

**Authentication and permissions** で次の permission を有効にします。

- Channel: `writeGroupMessage`
- Manager: `writeGroupMessageAsManager`

## Clone

```sh
git clone https://github.com/channel-io/app-tutorial-ts.git
cd app-tutorial-ts
corepack enable
```

## 環境変数

```sh
cp server/.env.example server/.env
```

`APP_ID`、`APP_SECRET`、hex-encoded `SIGNING_KEY` を入力します。Secret を Git に commit しないでください。

## HTTPS endpoint

Local port `3000` に接続する HTTPS tunnel を準備し、developer portal に次の root を保存します。

- Function Endpoint: `https://YOUR_HOST/functions`
- WAM Endpoint: `https://YOUR_HOST/resource/wam`

`/v1` や `/tutorial` を追加しません。Credential、permission、endpoint を server 起動後に
変更した場合は、auto-registration を再実行するため server を restart してください。

SDK route は versioned path を使います。現在の command execution は system version なしで
設定済み Function Endpoint を呼ぶ場合があるため、tutorial は bare `PUT /functions` も同じ
`/functions/v1` SDK handler と signature verification に接続します。

## Install と build

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm build
corepack pnpm test
corepack pnpm typecheck
```

## 実行

```sh
corepack pnpm start
```

| Setting           | URL                                           |
| ----------------- | --------------------------------------------- |
| Function Endpoint | `https://YOUR_HOST/functions`                 |
| WAM Endpoint      | `https://YOUR_HOST/resource/wam`              |
| Local WAM         | `http://localhost:3000/resource/wam/tutorial` |

Server startup と Extension registration が成功したら、test channel で private app を install
または refresh し、group chat で `/tutorial` を実行してください。2 つの sender button と
permission failure を確認します。`SKIP_SIGNATURE_VERIFICATION=true` は local debugging 以外で
使用しないでください。

## Project map

```text
server/
  src/app.module.ts          SDK module、auto-registration、signature guard
  src/function-endpoint.ts   bare Function Endpoint から v1 への mapping
  src/tutorial.functions.ts command metadata と typed app Function
  src/target-token.ts        bot path 用の短期 signed group target
packages/shared/
  src/index.ts               WAM data と app/native Function wire contract
wam/
  src/hooks/                 shared Zod contract で host data を validation
  src/pages/Send/Send.tsx    app/native call 用 WAM SDK hook
```

現在の contract は SDK guide と reference で確認し、完全な server/WAM implementation はこの
repository で確認してください。SDK Quickstart も実行可能な TypeScript code が必要な step で
この tutorial を参照します。
