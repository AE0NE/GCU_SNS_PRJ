"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const MAX_LENGTH = 2000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type PostActionState = { error: string } | null;

async function uploadPostImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  image: File,
): Promise<string> {
  const ext = image.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("post-images").upload(path, image, {
    contentType: image.type,
  });
  if (error) throw new Error("이미지 업로드에 실패했습니다.");

  const { data } = supabase.storage.from("post-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function createPost(
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const content = String(formData.get("content") ?? "").trim();
  const image = formData.get("image");

  if (!content) return { error: "내용을 입력해주세요." };
  if (content.length > MAX_LENGTH) return { error: `본문은 최대 ${MAX_LENGTH}자까지 입력할 수 있습니다.` };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  if (!userId) return { error: "로그인이 필요합니다." };

  let imageUrl: string | null = null;
  if (image instanceof File && image.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
      return { error: "jpg, png, webp 형식의 이미지만 업로드할 수 있습니다." };
    }
    if (image.size > MAX_IMAGE_BYTES) {
      return { error: "이미지 용량은 5MB를 초과할 수 없습니다." };
    }
    try {
      imageUrl = await uploadPostImage(supabase, userId, image);
    } catch (e) {
      return { error: e instanceof Error ? e.message : "이미지 업로드에 실패했습니다." };
    }
  }

  const { data: post, error } = await supabase
    .from("posts")
    .insert({ author_id: userId, content, image_url: imageUrl })
    .select("id")
    .single();

  if (error || !post) return { error: "게시글 작성에 실패했습니다." };

  revalidatePath("/");
  redirect(`/posts/${post.id}`);
}

export async function updatePost(
  postId: string,
  _prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const content = String(formData.get("content") ?? "").trim();
  const image = formData.get("image");
  const removeImage = formData.get("removeImage") === "true";

  if (!content) return { error: "내용을 입력해주세요." };
  if (content.length > MAX_LENGTH) return { error: `본문은 최대 ${MAX_LENGTH}자까지 입력할 수 있습니다.` };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  if (!userId) return { error: "로그인이 필요합니다." };

  const { data: existing } = await supabase
    .from("posts")
    .select("author_id, image_url")
    .eq("id", postId)
    .maybeSingle();

  if (!existing || existing.author_id !== userId) {
    return { error: "본인 게시글만 수정할 수 있습니다." };
  }

  let imageUrl = existing.image_url;
  if (image instanceof File && image.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
      return { error: "jpg, png, webp 형식의 이미지만 업로드할 수 있습니다." };
    }
    if (image.size > MAX_IMAGE_BYTES) {
      return { error: "이미지 용량은 5MB를 초과할 수 없습니다." };
    }
    try {
      imageUrl = await uploadPostImage(supabase, userId, image);
    } catch (e) {
      return { error: e instanceof Error ? e.message : "이미지 업로드에 실패했습니다." };
    }
  } else if (removeImage) {
    imageUrl = null;
  }

  const { error } = await supabase
    .from("posts")
    .update({ content, image_url: imageUrl, updated_at: new Date().toISOString() })
    .eq("id", postId);

  if (error) return { error: "게시글 수정에 실패했습니다." };

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}`);
}

export async function deletePost(postId: string) {
  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  if (!userId) redirect("/login");

  const { error } = await supabase.from("posts").delete().eq("id", postId).eq("author_id", userId);
  if (error) throw new Error("게시글 삭제에 실패했습니다.");

  revalidatePath("/");
  redirect("/");
}
