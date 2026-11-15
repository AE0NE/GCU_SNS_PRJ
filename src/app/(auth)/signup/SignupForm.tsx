"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { signup } from "@/lib/actions/auth";

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, null);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-4 rounded-card border border-border bg-white p-6">
        <TextField
          id="username"
          name="username"
          label="닉네임"
          type="text"
          placeholder="표시될 이름"
          autoComplete="nickname"
          required
        />
        <TextField
          id="email"
          name="email"
          label="이메일"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <TextField
          id="password"
          name="password"
          label="비밀번호"
          type="password"
          placeholder="8자 이상 입력하세요"
          autoComplete="new-password"
          hint="최소 8자 이상이어야 합니다."
          required
          minLength={8}
        />

        {state && "error" in state && <p className="text-[13px] text-danger">{state.error}</p>}
        {state && "message" in state && (
          <p className="text-[13px] text-accent">{state.message}</p>
        )}

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={pending}>
          {pending ? "가입 중..." : "회원가입"}
        </Button>
      </form>

      <p className="text-center text-[14px] text-text-secondary">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-semibold text-accent">
          로그인
        </Link>
      </p>
    </div>
  );
}
