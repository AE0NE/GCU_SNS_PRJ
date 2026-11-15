import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { ChevronLeftIcon } from "@/components/ui/icons";
import { PostLikeArea } from "@/components/post/PostLikeArea";
import { CommentItem } from "@/components/post/CommentItem";
import { CommentComposer } from "@/components/post/CommentComposer";
import { DeletePostButton } from "@/components/post/DeletePostButton";
import { formatRelativeTime } from "@/lib/format";
import { getCurrentUser, getPostById } from "@/lib/data";

export default async function PostDetailPage({ params }: PageProps<"/posts/[id]">) {
  const { id } = await params;
  const [post, currentUser] = await Promise.all([getPostById(id), getCurrentUser()]);
  if (!post) notFound();

  const isOwner = currentUser !== null && post.author.id === currentUser.id;

  return (
    <div className="flex flex-1 flex-col bg-bg-elevated sm:mt-6 sm:rounded-card sm:border sm:border-border">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:rounded-t-card">
        <Link
          href="/"
          aria-label="뒤로 가기"
          className="flex h-8 w-8 items-center justify-center rounded-full text-text hover:bg-surface"
        >
          <ChevronLeftIcon size={20} />
        </Link>
        <span className="text-[15px] font-semibold text-text">게시글</span>
      </div>

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

        {isOwner && (
          <div className="flex items-center gap-3 text-[13px] font-medium">
            <Link href={`/posts/${post.id}/edit`} className="text-text-secondary hover:text-text">
              수정
            </Link>
            <DeletePostButton postId={post.id} />
          </div>
        )}
      </div>

      <p className="px-4 pb-4 text-[15px] leading-relaxed text-text">{post.content}</p>

      <PostLikeArea
        postId={post.id}
        imageUrl={post.imageUrl}
        imageAlt={`${post.author.username}의 게시글 이미지`}
        initialLiked={post.likedByMe}
        initialLikeCount={post.likeCount}
        commentCount={post.commentCount}
        isLoggedIn={currentUser !== null}
      />

      <div className="flex-1 divide-y divide-border px-4">
        {post.comments.length === 0 ? (
          <p className="py-8 text-center text-[14px] text-text-secondary">
            아직 댓글이 없습니다. 첫 댓글을 남겨보세요.
          </p>
        ) : (
          post.comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={post.id}
              isOwner={currentUser !== null && comment.author.id === currentUser.id}
            />
          ))
        )}
      </div>

      <CommentComposer postId={post.id} isLoggedIn={currentUser !== null} />
    </div>
  );
}
