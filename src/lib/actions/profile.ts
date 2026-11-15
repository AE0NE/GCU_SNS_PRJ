"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const MAX_BIO_LENGTH = 300;
const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type ProfileActionState = { error: string } | null;

export async function updateProfile(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const avatar = formData.get("avatar");

  if (!username) return { error: "닉네임을 입력해주세요." };
  if (username.length > 30) return { error: "닉네임은 30자 이내로 입력해주세요." };
  if (bio.length > MAX_BIO_LENGTH) return { error: `자기소개는 최대 ${MAX_BIO_LENGTH}자까지 입력할 수 있습니다.` };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims.sub;
  if (!userId) return { error: "로그인이 필요합니다." };

  let avatarUrl: string | undefined;
  if (avatar instanceof File && avatar.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(avatar.type)) {
      return { error: "jpg, png, webp 형식의 이미지만 업로드할 수 있습니다." };
    }
    if (avatar.size > MAX_AVATAR_BYTES) {
      return { error: "이미지 용량은 5MB를 초과할 수 없습니다." };
    }

    const ext = avatar.name.split(".").pop() ?? "jpg";
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatar, { contentType: avatar.type });
    if (uploadError) return { error: "프로필 이미지 업로드에 실패했습니다." };

    avatarUrl = supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl;
  }

  const { error } = await supabase
    .from("profiles")
    .update({ username, bio: bio || null, ...(avatarUrl ? { avatar_url: avatarUrl } : {}) })
    .eq("id", userId);

  if (error) {
    if (error.code === "23505") return { error: "이미 사용 중인 닉네임입니다." };
    return { error: "프로필 수정에 실패했습니다." };
  }

  revalidatePath("/", "layout");
  redirect("/profile");
}
