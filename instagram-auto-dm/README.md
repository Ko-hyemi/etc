# 인스타그램 댓글 자동 DM

게시물에 특정 키워드로 댓글이 달리면, 댓글 작성자에게 DM을 자동으로 보내는 웹훅 서버예요.
Vercel에 배포해서 써요.

```
댓글 작성 → Meta 웹훅 → /api/webhook → 키워드 확인 → DM 발송 (+ 공개 답글)
```

## 1. 키워드와 메시지 정하기

[`rules.config.js`](./rules.config.js)를 수정하세요.

```js
export const rules = [
  {
    keywords: ['링크', 'link'],
    message: '요청하신 링크예요 👉 https://example.com',
    publicReply: 'DM으로 보내드렸어요! 💌', // 선택
  },
  {
    mediaId: '17900000000000000', // 이 게시물에만 적용 (선택)
    keywords: ['쿠폰'],
    message: '쿠폰 코드: WELCOME10',
  },
];
```

게시물 ID는 그 게시물에 댓글이 달렸을 때 Vercel 로그(`댓글 수신: media=...`)에서 확인할 수 있어요.

## 2. 인스타그램 계정 준비

인스타 앱 → 설정 → 계정 유형 및 도구 → **프로페셔널 계정으로 전환** (비즈니스 또는 크리에이터)

## 3. Meta 앱 만들기

1. [developers.facebook.com](https://developers.facebook.com/apps) → **앱 만들기**
2. 사용 사례에서 **Instagram 메시지 및 콘텐츠 관리**를 선택하고 앱을 만들어요.
3. 왼쪽 메뉴의 **Instagram → API 설정 (Instagram 로그인 사용)**:
   - **"액세스 토큰 생성"** 에서 내 인스타 계정을 추가하고 토큰을 발급해요 → `IG_ACCESS_TOKEN`
   - 같은 페이지 **비즈니스 로그인 설정**의 **Instagram 앱 시크릿 코드** → `IG_APP_SECRET`
4. 권한에 `instagram_business_manage_comments`, `instagram_business_manage_messages`가 들어 있는지 확인해요.

> 내 계정에만 쓸 때는 앱 검수 없이 개발 모드로 동작해요. 다른 사람 계정에도 서비스하려면 앱 검수가 필요해요.

## 4. Vercel 배포

1. [vercel.com/new](https://vercel.com/new)에서 이 레포를 가져와요(Import).
2. **Root Directory**를 `instagram-auto-dm`으로 지정해요.
3. **Environment Variables**에 아래 값을 넣어요 ([`.env.example`](./.env.example) 참고):

   | 이름 | 값 |
   |---|---|
   | `IG_ACCESS_TOKEN` | 3번에서 발급한 토큰 |
   | `IG_APP_SECRET` | 3번의 앱 시크릿 코드 |
   | `WEBHOOK_VERIFY_TOKEN` | 아무 문자열 (예: `my-secret-1234`) |

4. 배포가 끝나면 웹훅 주소는 `https://<프로젝트>.vercel.app/api/webhook`이에요.

## 5. 웹훅 연결

Meta 앱 → **Instagram → API 설정 → 웹훅 구성**:

1. 콜백 URL: `https://<프로젝트>.vercel.app/api/webhook`
2. 토큰 확인: `WEBHOOK_VERIFY_TOKEN`에 넣은 값과 똑같이 입력
3. **확인 및 저장** → 필드 목록에서 **`comments` 구독**을 켜요.
4. 액세스 토큰 생성 칸에서 내 계정의 **웹훅 구독**도 켜져 있는지 확인해요.

이제 다른 계정으로 내 게시물에 키워드를 넣어 댓글을 달아 보세요. (내 계정이 단 댓글은 무시해요.)

## 알아둘 점

- DM은 **댓글 하나당 한 번**, 댓글이 달리고 **7일 안에**만 보낼 수 있어요.
- 상대가 DM에 답장하면 그때부터 24시간 동안 자유롭게 메시지를 주고받을 수 있어요.
- 장기 액세스 토큰은 **60일**마다 만료돼요. 만료 전에 Meta 앱에서 다시 발급해 Vercel 환경변수를 바꿔 주세요.
- 문제가 생기면 Vercel 프로젝트 → **Logs**에서 `DM 발송 실패` 메시지를 확인하세요.

## 개발

```bash
npm test
```
