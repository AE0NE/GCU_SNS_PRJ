"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GradientImage } from "@/components/ui/GradientImage";
import { HeartIcon, CommentIcon } from "@/components/ui/icons";
import { formatCount } from "@/lib/format";
import { toggleLike } from "@/lib/actions/likes";

type PostLikeAreaProps = {
  postId: string;
  imageUrl: string | null;
  imageAlt: string;
  initialLiked: boolean;
  initialLikeCount: number;
  commentCount: number;
  isLoggedIn: boolean;
  onOpenComments?: () => void;
};

export function PostLikeArea({
  postId,
  imageUrl,
  imageAlt,
  initialLiked,
  initialLikeCount,
  commentCount,
  isLoggedIn,
  onOpenComments,
}: PostLikeAreaProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialLikeCount);
  const [bounce, setBounce] = useState(false);
  const [burst, setBurst] = useState(false);
  const [pending, setPending] = useState(false);

  function applyOptimistic(next: boolean) {
    setLiked(next);
    setCount((prev) => (next ? prev + 1 : prev - 1));
  }

  async function commitToggle(next: boolean) {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (pending) return;
    applyOptimistic(next);
    setPending(true);
    const result = await toggleLike(postId);
    setPending(false);
    if ("error" in result) {
      applyOptimistic(!next);
    }
  }

  function toggleLikeClick() {
    commitToggle(!liked);
    setBounce(true);
    window.setTimeout(() => setBounce(false), 350);
  }

  function handleDoubleClick() {
    if (!liked) commitToggle(true);
    setBurst(true);
    window.setTimeout(() => setBurst(false), 600);
  }

  return (
    <div>
      {imageUrl && (
        <div className="relative select-none" onDoubleClick={handleDoubleClick}>
          <GradientImage imageUrl={imageUrl} alt={imageAlt} className="aspect-square w-full" />
          {burst && (
            <HeartIcon
              size={88}
              filled
              className="pointer-events-none absolute inset-0 m-auto animate-heart-bounce text-white drop-shadow-lg"
            />
          )}
        </div>
      )}

      <div className="flex items-center gap-4 px-4 py-3">
        <button
          type="button"
          onClick={toggleLikeClick}
          aria-pressed={liked}
          aria-label={liked ? "좋아요 취소" : "좋아요"}
          className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
        >
          <HeartIcon
            size={24}
            filled={liked}
            className={`${liked ? "text-accent" : "text-text"} ${bounce ? "animate-heart-bounce" : ""}`}
          />
          <span className="text-[14px] font-medium tabular-nums text-text">{formatCount(count)}</span>
        </button>

        <button
          type="button"
          onClick={onOpenComments}
          aria-label="댓글 보기"
          className="flex items-center gap-1.5 text-text transition-opacity hover:opacity-70"
        >
          <CommentIcon size={23} />
          <span className="text-[14px] font-medium tabular-nums">{formatCount(commentCount)}</span>
        </button>
      </div>
    </div>
  );
}
