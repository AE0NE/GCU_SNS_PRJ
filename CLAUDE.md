# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

Apple의 미니멀한 톤과 Instagram의 피드/인터랙션 구조를 결합한 SNS 웹 서비스. 전체 제품 요구사항은 `PRD.md`에 정의되어 있으며, 기능을 구현하기 전에 반드시 참고할 것 (로그인/회원가입, 게시글 CRUD, 댓글, 좋아요, 프로필, 화면별 IA, DB 스키마, RLS 정책, 디자인 가이드라인 등).

**현재 상태**: Supabase Auth/DB/Storage 연동 및 실제 CRUD 로직까지 구현 완료됨. `profiles`/`posts`/`comments`/`likes` 테이블과 RLS 정책, `handle_new_user` 트리거, storage 정책, `post_feed` 뷰가 마이그레이션으로 적용되어 있다. `src/lib/data.ts`가 실제 Supabase 쿼리로 피드/게시글/프로필을 조회하고, `src/lib/actions/`의 Server Action(`auth`/`posts`/`comments`/`likes`/`profile`)이 로그인/회원가입/글 작성·수정·삭제(이미지 업로드 포함)/댓글/좋아요/프로필 수정을 처리한다. `src/proxy.ts`(미들웨어)가 세션을 갱신한다. `src/lib/mock-data.ts`는 더 이상 데이터 조회에 쓰이지 않고 `gradientFor`(이미지 placeholder 그라디언트)만 남아 있다.

## 명령어

```bash
npm run dev      # 개발 서버 (Turbopack, 기본 포트 3000)
npm run build    # 프로덕션 빌드 (타입 체크 포함)
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
npx tsc --noEmit # 타입만 체크 (단, LayoutProps/PageProps 등 Next.js 전역 타입은 `next dev`나 `next build`를 한 번 실행해야 생성됨)
```

테스트 스위트는 아직 없다.

## 기술 스택 및 핵심 설정

- **Next.js 16 (App Router, Turbopack)** + React 19 + TypeScript (strict)
- **Tailwind CSS v4** — 별도 `tailwind.config.*` 파일 없이 `src/app/globals.css`의 `@theme inline` 블록으로 토큰을 정의하는 CSS-first 방식
- **Next.js 16 주의사항**: `node_modules/next/dist/docs/`에 이 버전 전용 문서가 포함되어 있다. 학습 데이터의 Next.js 지식과 API/컨벤션이 다를 수 있으므로, 익숙하지 않은 동작을 마주치면 먼저 이 문서를 확인할 것.
  - `next.config.ts`에는 `cacheComponents`를 켜지 않았다 — Dynamic Route(`params`를 쓰는 페이지)를 `<Suspense>`나 `"use cache"` 없이 프리렌더하려다 빌드가 깨지는 문제가 있어 비활성화한 상태. 다시 켤 경우 모든 동적 라우트에 캐싱 전략을 명시해야 한다.
  - 페이지/레이아웃 props는 커스텀 타입을 선언하지 않고 Next.js가 자동 생성하는 전역 헬퍼 타입 `PageProps<'/posts/[id]'>`, `LayoutProps<'/'>`를 사용한다 (`params`는 Promise이므로 `await params`로 풀어야 함). 이 타입들은 `next dev`/`next build` 실행 시 생성되므로, 받자마자 `tsc --noEmit`만 돌리면 해당 타입을 못 찾는다는 에러가 날 수 있다.

## 아키텍처

### 라우트 구조 (App Router, 두 개의 Route Group)

- `src/app/(auth)/` — 로그인/회원가입. `layout.tsx`가 네비게이션 없는 중앙 정렬 레이아웃 제공.
- `src/app/(main)/` — 그 외 전체 화면(피드, 글쓰기, 게시글 상세/수정, 프로필, 타인 프로필). `layout.tsx`가 상단 `Header`(데스크탑) + 하단 `BottomTabBar`(모바일)를 포함한 공용 셸을 제공.
- 두 그룹 모두 URL 세그먼트에 영향을 주지 않으므로, 실제 경로는 PRD 3장의 IA 테이블과 1:1 대응한다 (`/`, `/login`, `/signup`, `/posts/new`, `/posts/[id]`, `/posts/[id]/edit`, `/profile`, `/profile/edit`, `/users/[id]`).
- 라우트 추가/이동 시 route group 분류 기준(인증 전 화면인지, 메인 셸이 필요한 화면인지)을 유지할 것.

### 컴포넌트 레이어링

- `src/components/ui/` — 범용 프리미티브 (`Avatar`, `Button`/`LinkButton`, `TextField`, `GradientImage`, `icons.tsx`). 디자인 토큰에만 의존, 도메인 타입을 모른다.
- `src/components/post/` — 게시글/댓글 관련 (`PostCard`, `PostComposer`, `PostLikeArea`, `CommentItem`, `CommentComposer`).
- `src/components/profile/` — 프로필 관련 (`ProfileHeader`, `PostGrid`).
- `src/components/layout/` — 전역 셸 (`Header`, `BottomTabBar`).
- 좋아요 인터랙션(하트 토글 + 이미지 더블클릭 좋아요 + bounce 애니메이션)은 `PostLikeArea` 하나에 묶여 있다. 피드 카드와 게시글 상세 페이지가 이 컴포넌트를 공유하므로, 좋아요 관련 동작을 바꿀 때는 두 화면 모두에 영향을 준다는 점을 고려할 것.

### 데이터 레이어

- `src/types/index.ts` — `Profile` / `Post` / `Comment` 도메인 타입. `src/types/database.ts`가 Supabase에서 생성한 스키마 타입(`Tables<"...">`)을 제공하며, `src/lib/data.ts`의 `toProfile`/`toComment`/`toPost`가 DB row를 도메인 타입으로 매핑한다. `Post`의 `likeCount`/`commentCount`/`likedByMe`는 `post_feed` 뷰에서 집계되어 내려온다.
- `src/lib/data.ts` — 서버 컴포넌트에서 쓰는 비동기 조회 함수 모음(`getCurrentUser`/`getFeedPosts`/`getPostById`/`getProfileById`/`getPostsByAuthor`). 내부적으로 `src/lib/supabase/server.ts`의 `createClient()`로 Supabase 서버 클라이언트를 만들어 쿼리한다. `getCurrentUser`는 `react`의 `cache()`로 요청당 1회만 호출되도록 메모이즈되어 있다.
- `src/lib/actions/` — Server Action(`"use server"`) 모음. `auth.ts`(로그인/회원가입/로그아웃), `posts.ts`(작성/수정/삭제, `post-images` 버킷 업로드 포함), `comments.ts`, `likes.ts`(토글), `profile.ts`(닉네임/바이오/아바타 수정, `avatars` 버킷 업로드 포함). 각 액션은 `supabase.auth.getClaims()`로 로그인 여부를 확인하고, 본인 소유 리소스인지 `author_id`/`user_id` 비교로 검증한 뒤 `revalidatePath`로 관련 경로를 갱신한다.
- `src/lib/supabase/` — `client.ts`(브라우저용), `server.ts`(서버 컴포넌트/액션용), `proxy.ts`(미들웨어의 세션 갱신 로직, `src/proxy.ts`에서 호출됨).
- `src/lib/mock-data.ts` — 이제 `gradientFor(seed)`만 남아 있다. `GradientImage`가 실제 이미지 업로드 전 `imageUrl`이 `"gradient:{seed}"` 형식일 때 시드 기반 그라디언트 블록을 렌더링하는 데 쓰인다(Storage에 실제 이미지가 있으면 일반 `<img>`로 렌더링).
- `src/lib/format.ts` — 상대 시간/가입일/숫자 포맷 헬퍼. `formatRelativeTime`은 `new Date()` 기준으로 상대 시간을 계산한다.

### 디자인 시스템

- 색상/반경 토큰은 `src/app/globals.css`의 `:root`(CSS 변수) → `@theme inline`(Tailwind 유틸리티로 노출)에서 정의한다. 새 색상이나 radius를 추가할 때는 두 곳 모두 갱신해야 Tailwind 클래스(`bg-accent`, `rounded-card` 등)로 쓸 수 있다.
- 폰트는 Pretendard Variable을 `public/fonts/PretendardVariable.woff2`에서 직접 `@font-face`로 로드한다 (next/font의 Google Fonts 프리셋 대신 로컬 variable font 사용).
- PRD 4장(디자인 가이드라인)에 정의된 accent 컬러(`#ff375f`), 카드 radius(20px), 피드 최대폭(`--feed-max-width: 470px`) 등의 수치는 임의로 바꾸지 말고 PRD와 동기화할 것.

## Supabase

- `.mcp.json`에 등록된 `supabase` MCP 서버와 `supabase`, `supabase-postgres-best-practices` 스킬(`.agents/skills/`)을 사용할 것 — RLS 정책, 스키마 마이그레이션, 보안 검토에 대한 세부 가이드가 포함되어 있다. 스키마나 정책을 바꿀 때는 마이그레이션으로 적용하고 `mcp__supabase__get_advisors`로 보안/성능 advisor를 확인할 것.
- 적용된 마이그레이션: `create_core_tables` → `enable_rls_and_policies` → `handle_new_user_trigger` → `storage_policies` → `post_feed_view`. 테이블 구조를 바꿀 때는 이 순서와 의존관계(트리거가 `profiles` 생성에 의존, 뷰가 집계 컬럼에 의존)를 참고할 것.
- 테스트 스위트가 없으므로, 로직을 바꾼 뒤에는 `npm run build`로 타입 체크 + 프리렌더가 깨지지 않는지 확인하고 가능하면 `npm run dev`로 해당 화면을 직접 눌러볼 것.
