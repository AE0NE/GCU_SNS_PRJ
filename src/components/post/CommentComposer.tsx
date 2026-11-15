"use client";

import { useActionState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createComment, type CommentActionState } from "@/lib/actions/comments";

export function CommentComposer({ postId, isLoggedIn }: { postId: string; isLoggedIn: boolean }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const action = async (_prevState: CommentActionState, formData: FormData) => {
    const result = await createComment(postId, _prevState, formData);
    if (!result) formRef.current?.reset();
    return result;
  };
  const [state, formAction, pending] = useActionState(action, null);

  if (!isLoggedIn) {
    return (
      <button
        type="button"
        onClick={() => router.push("/login")}
        className="sticky bottom-0 flex w-full items-center justify-center border-t border-border bg-bg-elevated/95 px-4 py-3 text-[14px] font-medium text-text-secondary backdrop-blur-xl"
      >
        로그인 후 댓글을 남길 수 있습니다
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="sticky bottom-0 flex flex-col gap-1 border-t border-border bg-bg-elevated/95 px-4 py-3 backdrop-blur-xl"
    >
      <div className="flex items-center gap-2">
        <input
          name="content"
          placeholder="댓글을 입력하세요..."
          maxLength={1000}
          required
          className="h-10 flex-1 rounded-full border border-border bg-surface px-4 text-[14px] outline-none focus:border-accent"
        />
        <Button type="submit" size="sm" disabled={pending}>
          게시
        </Button>
      </div>
      {state?.error && <p className="px-1 text-[12px] text-danger">{state.error}</p>}
    </form>
  );
}
