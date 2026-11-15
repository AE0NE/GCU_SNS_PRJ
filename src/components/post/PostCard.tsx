import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { MoreIcon } from "@/components/ui/icons";
import { PostLikeArea } from "@/components/post/PostLikeArea";
import { formatRelativeTime } from "@/lib/format";
import type { Post } from "@/types";

export function PostCard({ post, currentUserId }: { post: Post; currentUserId: string | null }) {
  return (
    <article className="border-b border-border bg-bg-elevated sm:rounded-card sm:border sm:shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href={`/users/${post.author.id}`} className="flex items-center gap-3">
          <Avatar username={post.author.username} avatarUrl={post.author.avatarUrl} size={36} />
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-text">{post.author.username}</span>
            <span className="text-[12px] text-text-secondary">
              {formatRelativeTime(post.createdAt)}
              {post.updatedAt && " · 수정됨"}
            </span>
          </div>
        </Link>

        {currentUserId === post.author.id && (
          <Link
            href={`/posts/${post.id}/edit`}
            aria-label="게시글 수정"
            className="p-1 text-text-secondary hover:text-text"
          >
            <MoreIcon size={20} />
          </Link>
        )}
      </div>

      <Link href={`/posts/${post.id}`} className="block px-4 pb-3 text-[15px] leading-relaxed text-text">
        {post.content}
      </Link>

      <PostLikeArea
        postId={post.id}
        imageUrl={post.imageUrl}
        imageAlt={`${post.author.username}의 게시글 이미지`}
        initialLiked={post.likedByMe}
        initialLikeCount={post.likeCount}
        commentCount={post.commentCount}
        isLoggedIn={currentUserId !== null}
      />

      {post.commentCount > 0 && (
        <Link
          href={`/posts/${post.id}`}
          className="block px-4 pb-4 text-[13px] text-text-secondary hover:text-text"
        >
          댓글 {post.commentCount}개 모두 보기
        </Link>
      )}
    </article>
  );
}
