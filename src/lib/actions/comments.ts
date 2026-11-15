"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const MAX_LENGTH = 1000;

export type CommentActionState = { error: string } | null;

export async function createComment(
  postId: string,
  _prevState: CommentActionState,
  formData: FormData,
): Promise<CommentActionState> {
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return { error: "댓글을 입력해주세요." };
  if (content.length > MAX_LENGTH) return { error: `댓글은 최대 ${MAX_LENGTH}자까지 입력할 수 있습니다.` };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  if (!userId) return { error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("comments")
    .insert({ post_id: postId, author_id: userId, content });

  if (error) return { error: "댓글 작성에 실패했습니다." };

  revalidatePath(`/posts/${postId}`);
  revalidatePath("/");
  return null;
}

export async function updateComment(
  commentId: string,
  postId: string,
  _prevState: CommentActionState,
  formData: FormData,
): Promise<CommentActionState> {
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return { error: "댓글을 입력해주세요." };
  if (content.length > MAX_LENGTH) return { error: `댓글은 최대 ${MAX_LENGTH}자까지 입력할 수 있습니다.` };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  if (!userId) return { error: "로그인이 필요합니다." };

  const { error } = await supabase
    .from("comments")
    .update({ content, updated_at: new Date().toISOString() })
    .eq("id", commentId)
    .eq("author_id", userId);

  if (error) return { error: "댓글 수정에 실패했습니다." };

  revalidatePath(`/posts/${postId}`);
  return null;
}

export async function deleteComment(commentId: string, postId: string) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  if (!userId) redirect("/login");

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("author_id", userId);

  if (error) throw new Error("댓글 삭제에 실패했습니다.");

  revalidatePath(`/posts/${postId}`);
  revalidatePath("/");
}
