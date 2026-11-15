import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// PRD 3장: 글쓰기/수정, 프로필(내 정보) 조회·수정만 로그인 필요.
// 피드/게시글 상세/타인 프로필은 비로그인도 조회 가능하므로 보호 대상에서 제외.
function isProtectedPath(pathname: string) {
  if (pathname.startsWith("/profile")) return true;
  if (pathname === "/posts/new") return true;
  if (/^\/posts\/[^/]+\/edit$/.test(pathname)) return true;
  return false;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and supabase.auth.getClaims().
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user && isProtectedPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
