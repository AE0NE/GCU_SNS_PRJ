import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { HomeIcon, PlusSquareIcon } from "@/components/ui/icons";
import { getCurrentUser } from "@/lib/data";

export async function Header() {
  const currentUser = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-bg-elevated/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[var(--feed-max-width)] items-center justify-between px-4 sm:max-w-3xl sm:px-6">
        <Link href="/" className="text-[20px] font-bold tracking-tight text-text">
          Moment
        </Link>

        <nav className="hidden items-center gap-2 sm:flex">
          <Link
            href="/"
            aria-label="홈"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text transition-colors hover:bg-surface"
          >
            <HomeIcon size={22} />
          </Link>
          <Link
            href="/posts/new"
            aria-label="글쓰기"
            className="flex h-9 w-9 items-center justify-center rounded-full text-text transition-colors hover:bg-surface"
          >
            <PlusSquareIcon size={22} />
          </Link>
          {currentUser ? (
            <Link href="/profile" aria-label="내 프로필" className="ml-1">
              <Avatar username={currentUser.username} avatarUrl={currentUser.avatarUrl} size={30} />
            </Link>
          ) : (
            <Link
              href="/login"
              className="ml-1 rounded-full bg-accent px-4 py-1.5 text-[13px] font-semibold text-white hover:opacity-90"
            >
              로그인
            </Link>
          )}
        </nav>

        {currentUser ? (
          <Link href="/posts/new" aria-label="글쓰기" className="sm:hidden">
            <PlusSquareIcon size={24} />
          </Link>
        ) : (
          <Link href="/login" aria-label="로그인" className="text-[14px] font-semibold text-accent sm:hidden">
            로그인
          </Link>
        )}
      </div>
    </header>
  );
}
