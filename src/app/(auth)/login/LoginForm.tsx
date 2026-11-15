"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { login } from "@/lib/actions/auth";

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <div className="flex flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-4 rounded-card border border-border bg-white p-6">
        <input type="hidden" name="redirectTo" value={redirectTo} />
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
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
          required
        />

        {state && "error" in state && <p className="text-[13px] text-danger">{state.error}</p>}

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={pending}>
          {pending ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      <p className="text-center text-[14px] text-text-secondary">
        아직 계정이 없으신가요?{" "}
        <Link href="/signup" className="font-semibold text-accent">
          회원가입
        </Link>
      </p>
    </div>
  );
}
