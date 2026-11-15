"use client";

import { deletePost } from "@/lib/actions/posts";

export function DeletePostButton({ postId }: { postId: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (window.confirm("게시글을 삭제하시겠습니까?")) {
          deletePost(postId);
        }
      }}
      className="text-danger hover:opacity-80"
    >
      삭제
    </button>
  );
}
