import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { HomeIcon, PlusSquareIcon, UserIcon } from "@/components/ui/icons";
import { getCurrentUser } from "@/lib/data";

export async function BottomTabBar() {
  const currentUser = await getCurrentUser();

  return (
    <nav
      aria-label="주요 메뉴"
      className="sticky bottom-0 z-30 border-t border-border/80 bg-bg-elevated/90 backdrop-blur-xl sm:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex h-14 max-w-[var(--feed-max-width)] items-center justify-around">
        <Link href="/" aria-label="홈" className="flex h-9 w-9 items-center justify-center text-text">
          <HomeIcon size={24} />
        </Link>
        <Link
          href={currentUser ? "/posts/new" : "/login"}
          aria-label="글쓰기"
          className="flex h-9 w-9 items-center justify-center text-text"
        >
          <PlusSquareIcon size={24} />
        </Link>
        {currentUser ? (
          <Link href="/profile" aria-label="내 프로필" className="flex h-9 w-9 items-center justify-center">
            <Avatar username={currentUser.username} avatarUrl={currentUser.avatarUrl} size={26} />
          </Link>
        ) : (
          <Link href="/login" aria-label="로그인" className="flex h-9 w-9 items-center justify-center text-text">
            <UserIcon size={24} />
          </Link>
        )}
      </div>
    </nav>
  );
}
