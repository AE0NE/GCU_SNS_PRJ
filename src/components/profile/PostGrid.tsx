import Link from "next/link";
import { GradientImage } from "@/components/ui/GradientImage";
import { HeartIcon, CommentIcon } from "@/components/ui/icons";
import { formatCount } from "@/lib/format";
import type { Post } from "@/types";

export function PostGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <p className="py-16 text-center text-[14px] text-text-secondary">
        아직 작성한 게시글이 없습니다.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className="group relative aspect-square overflow-hidden bg-surface"
        >
          {post.imageUrl ? (
            <GradientImage imageUrl={post.imageUrl} alt="" className="h-full w-full" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface p-3">
              <p className="line-clamp-4 text-center text-[12px] leading-snug text-text-secondary">
                {post.content}
              </p>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/0 text-white opacity-0 transition-opacity group-hover:bg-black/30 group-hover:opacity-100">
            <span className="flex items-center gap-1 text-[13px] font-semibold">
              <HeartIcon size={16} filled />
              {formatCount(post.likeCount)}
            </span>
            <span className="flex items-center gap-1 text-[13px] font-semibold">
              <CommentIcon size={16} />
              {formatCount(post.commentCount)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
