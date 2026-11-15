"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = { error: string } | { message: string } | null;

export async function login(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  if (!email || !password) {
    return { error: "이메일과 비밀번호를 입력해주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo || "/");
}

export async function signup(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !email || !password) {
    return { error: "모든 항목을 입력해주세요." };
  }
  if (password.length < 8) {
    return { error: "비밀번호는 최소 8자 이상이어야 합니다." };
  }
  if (username.length > 30) {
    return { error: "닉네임은 30자 이내로 입력해주세요." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) {
    if (error.code === "user_already_exists" || error.code === "email_exists") {
      return { error: "이미 가입된 이메일입니다." };
    }
    return { error: "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  // 이메일 확인이 활성화된 프로젝트에서는 세션 없이 가입만 완료된다.
  if (!data.session) {
    return { message: "가입이 완료되었습니다. 이메일로 발송된 확인 링크를 클릭한 뒤 로그인해주세요." };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
