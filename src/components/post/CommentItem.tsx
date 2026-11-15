"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { formatRelativeTime } from "@/lib/format";
import { updateComment, deleteComment, type CommentActionState } from "@/lib/actions/comments";
import type { Comment } from "@/types";

export function CommentItem({
  comment,
  postId,
  isOwner,
}: {
  comment: Comment;
  postId: string;
  isOwner: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const updateAction = async (prevState: CommentActionState, formData: FormData) => {
    const result = await updateComment(comment.id, postId, prevState, formData);
    if (!result) setEditing(false);
    return result;
  };
  const [state, formAction, pending] = useActionState(updateAction, null);

  if (editing) {
    return (
      <div className="flex gap-3 py-3">
        <Avatar username={comment.author.username} avatarUrl={comment.author.avatarUrl} size={32} />
        <form action={formAction} className="flex flex-1 flex-col gap-1.5">
          <input
            name="content"
            defaultValue={comment.content}
            maxLength={1000}
            required
            className="h-9 w-full rounded-full border border-border bg-surface px-3 text-[14px] outline-none focus:border-accent"
          />
          {state?.error && <p className="text-[12px] text-danger">{state.error}</p>}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={pending}>
              저장
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setEditing(false)}>
              취소
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex gap-3 py-3">
      <Link href={`/users/${comment.author.id}`}>
        <Avatar username={comment.author.username} avatarUrl={comment.author.avatarUrl} size={32} />
      </Link>
      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <Link href={`/users/${comment.author.id}`} className="text-[13px] font-semibold text-text">
              {comment.author.username}
            </Link>
            <span className="text-[12px] text-text-secondary">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          {isOwner && (
            <div className="flex items-center gap-2 text-[12px] font-medium text-text-secondary">
              <button type="button" onClick={() => setEditing(true)} className="hover:text-text">
                수정
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("댓글을 삭제하시겠습니까?")) {
                    deleteComment(comment.id, postId);
                  }
                }}
                className="hover:text-danger"
              >
                삭제
              </button>
            </div>
          )}
        </div>
        <p className="mt-0.5 text-[14px] leading-relaxed text-text">{comment.content}</p>
      </div>
    </div>
  );
}
