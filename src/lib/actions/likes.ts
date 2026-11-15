"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleLike(
  postId: string,
): Promise<{ liked: boolean } | { error: string }> {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  if (!userId) return { error: "로그인이 필요합니다." };

  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("likes").delete().eq("id", existing.id);
    if (error) return { error: "좋아요 취소에 실패했습니다." };
    revalidatePath("/");
    revalidatePath(`/posts/${postId}`);
    return { liked: false };
  }

  const { error } = await supabase.from("likes").insert({ post_id: postId, user_id: userId });
  if (error) return { error: "좋아요에 실패했습니다." };

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  return { liked: true };
}
