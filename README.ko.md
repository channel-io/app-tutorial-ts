# Channel App 튜토리얼 — TypeScript

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md)

공식 [Channel App SDK](https://github.com/channel-io/app-sdk)로 만든 최소 end-to-end App Store
앱입니다. Token 교환, Extension 등록, signature 검증, WAM bridge를 직접 구현하지 않고 현재 SDK
사용법을 보여 줍니다.

이 저장소는 바로 실행할 수 있는 예제로 사용하고 계약과 설계 원칙은 SDK 문서를 확인하세요.

- [첫 앱 만들기 Quickstart](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ko/quickstart.md)
- [앱 개발 전체 가이드](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ko/app-development.md)
- [Function, Extension, WAM, 인증 핵심 개념](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ko/concepts.md)
- [Extension 전체 가이드](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ko/extensions.md)
- [TypeScript 인증과 token](https://github.com/channel-io/app-sdk/blob/main/docs/reference/typescript/AUTH-AND-TOKENS.md)
- [TypeScript architecture](https://github.com/channel-io/app-sdk/blob/main/docs/reference/typescript/ARCHITECTURE.md)
- [Command Extension](https://github.com/channel-io/app-sdk/blob/main/docs/reference/typescript/extensions/command.md)
- [WAM SDK](https://github.com/channel-io/app-sdk/blob/main/docs/reference/typescript/WAM.md)

## 이 앱에서 확인할 수 있는 것

- `@channel.io/app-sdk-server`와 `@channel.io/app-sdk-wam` `0.17.2`
- 자동 탐색·등록되는 `command` Extension
- Zod input/output schema를 가진 typed app Function
- SDK가 관리하는 app/channel token cache와 refresh
- SDK signature guard를 통한 HMAC 요청 검증
- `@channel.io/app-sdk-wam` hook을 사용하는 React WAM
- Server와 WAM이 함께 쓰는 Zod contract package
- `@channel.io/bezier-react/beta`의 Bezier 4 component
- AppStore가 전달할 수 있는 nullable command field 정규화

그룹 대화에서 `/tutorial` Desk command를 실행하면 WAM이 열립니다. WAM은 app bot을 사용하는
server-side app Function 또는 현재 manager 권한을 사용하는 WAM native Function으로 team chat
message를 보냅니다. 지원하지 않는 chat type에서는 조용히 닫지 않고 오류 상태를 보여 줍니다.

코드에서 핵심 개념은 다음과 대응합니다.

- **Extension**: `CommandExtension`이 versioned `command` capability metadata를 공개합니다.
- **Function**: `tutorial.open`과 `tutorial.sendAsBot`은 command와 WAM이 참조하는 standalone typed operation입니다.
- **WAM**: React UI는 `/resource/wam/tutorial`에서 제공됩니다. `useCallFunction`은 app server를, `useNativeFunction`은 현재 manager 주체로 Channel을 호출합니다.
- **인증**: `SignatureGuard`가 수신 요청을 검증하고 `TokenManager`가 bot 경로의 channel token을 cache합니다. Server는 허용된 group target에 짧은 signature를 붙여 WAM에 전달하며 manager authorization은 Channel host가 관리합니다.

## SDK 계약

이 튜토리얼은 공개 SDK runtime 계약을 따릅니다.

- NestJS와 `ChannelAppModule`
- Decorator와 schema가 있는 Function
- `PUT /functions/:version`과 command의 `/functions/v1`
- SDK/AppStore를 통한 Extension discovery와 등록
- System version이 없는 `PUT /functions` 요청을 같은 signature 검증이 적용되는 `v1` handler로 연결하는 좁은 compatibility mapping

재현 가능한 build를 위해 SDK `0.17.2`를 고정하고 app process 시작 시 auto-registration을
실행합니다. WAM은 공개 SDK hook과 Bezier API만 사용합니다.

## 준비 사항

- Node.js 20.11 이상
- Corepack을 통한 pnpm 9.15.4
- App ID, App Secret, Signing Key가 있는 개발용 private Channel App

앱이 아직 없다면 SDK의
[첫 앱 만들기 Quickstart](https://github.com/channel-io/app-sdk/blob/main/docs/guides/ko/quickstart.md)부터
따라 하세요. Private app 생성, server-side credential, 최소 permission, endpoint root, test channel
설치를 한 흐름으로 설명합니다.

**인증 및 권한** 설정에서 다음 permission을 활성화합니다.

- Channel: `writeGroupMessage`
- Manager: `writeGroupMessageAsManager`

## Clone

```sh
git clone https://github.com/channel-io/app-tutorial-ts.git
cd app-tutorial-ts
corepack enable
```

## 환경 변수

```sh
cp server/.env.example server/.env
```

`APP_ID`, `APP_SECRET`, hex-encoded `SIGNING_KEY`를 입력합니다. Secret을 Git에 commit하지 마세요.

## HTTPS endpoint

Local port `3000`을 연결하는 HTTPS tunnel을 준비하고 개발자 포털에 다음 root를 저장합니다.

- Function Endpoint: `https://YOUR_HOST/functions`
- WAM Endpoint: `https://YOUR_HOST/resource/wam`

`/v1`이나 `/tutorial`을 덧붙이지 않습니다. Credential, permission, endpoint를 server 시작 뒤
바꿨다면 auto-registration이 다시 실행되도록 server를 재시작하세요.

SDK route는 versioned path를 사용합니다. 현재 command execution은 system version 없이 설정된
Function Endpoint를 호출할 수 있으므로 튜토리얼은 bare `PUT /functions`도 같은
`/functions/v1` SDK handler와 signature 검증으로 연결합니다.

## 설치와 build

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm build
corepack pnpm test
corepack pnpm typecheck
```

## 실행

```sh
corepack pnpm start
```

| 설정              | URL                                           |
| ----------------- | --------------------------------------------- |
| Function Endpoint | `https://YOUR_HOST/functions`                 |
| WAM Endpoint      | `https://YOUR_HOST/resource/wam`              |
| Local WAM         | `http://localhost:3000/resource/wam/tutorial` |

Server가 시작되고 Extension 등록이 성공하면 test channel에서 private app을 설치하거나 새로고침한
뒤 그룹 대화에서 `/tutorial`을 실행하세요. 두 sender button과 permission failure를 모두
확인합니다. `SKIP_SIGNATURE_VERIFICATION=true`는 local debugging 밖에서 사용하지 마세요.

## 프로젝트 구조

```text
server/
  src/app.module.ts          SDK module, auto-registration, signature guard
  src/function-endpoint.ts   bare Function Endpoint to v1 mapping
  src/tutorial.functions.ts command metadata와 typed app Function
  src/target-token.ts        bot 경로용 짧은 수명의 signed group target
packages/shared/
  src/index.ts               WAM data와 app/native Function wire contract
wam/
  src/hooks/                 shared Zod contract로 host data 검증
  src/pages/Send/Send.tsx    app/native call용 WAM SDK hook
```

현재 계약은 SDK guide와 reference에서 확인하고, 완성된 server/WAM 구현은 이 저장소에서
확인하세요. SDK Quickstart도 실행 가능한 TypeScript 코드가 필요한 단계에서 이 튜토리얼을
연결합니다.
