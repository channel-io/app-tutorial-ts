# WAM

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md)

이 React frontend는 WAM bridge에
[`@channel.io/app-sdk-wam`](https://github.com/channel-io/app-sdk/tree/main/ts/packages/wam)을,
WAM 전용 theme, navigation, 상태 화면, 높이 동기화에
[`@channel.io/app-sdk-wam-ui`](https://github.com/channel-io/app-sdk/tree/main/ts/packages/wam-ui)를
사용합니다. 일반 UI component는 `@channel.io/bezier-react/beta`에서 직접 가져옵니다.

Server와 WAM은 모두 `@tutorial/shared`에 의존합니다. Zod schema와 inferred type이 WAM data,
app/native Function input, WAM name, Function name을 일치시킵니다. Secret, token, server-only
runtime state는 shared package에 넣지 않습니다.

예제는 Bezier React `4.0.0-next.13`과 Bezier Icons `0.60.0`을 고정합니다. Bezier React 4는
아직 prerelease이므로 버전을 명시적으로 고정하고 upgrade 전에
[SDK WAM UI 가이드](https://github.com/channel-io/app-sdk/blob/main/docs/reference/typescript/WAM-UI.md)를
확인하세요.

## 설정

Node.js 20.11 이상을 설치하고 Corepack으로 pnpm을 활성화합니다.

```sh
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install --frozen-lockfile
```

Repository root에서 WAM 개발 server를 실행합니다.

```sh
pnpm dev:wam
```

전체 workspace를 build합니다.

```sh
pnpm build
```

Build 결과는 `wam/dist/`에 생성되고 tutorial server가
`/resource/wam/tutorial`에서 제공합니다.
