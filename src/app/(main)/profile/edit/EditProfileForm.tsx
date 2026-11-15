"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { ChevronLeftIcon } from "@/components/ui/icons";
import { updateProfile } from "@/lib/actions/profile";
import type { Profile } from "@/types";

export function EditProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState(updateProfile, null);
  const [preview, setPreview] = useState<string | null>(profile.avatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  return (
    <div className="px-4 sm:px-0 sm:pt-6">
      <div className="flex items-center gap-3 border-b border-border py-4 sm:border-0 sm:pb-6">
        <Link
          href="/profile"
          aria-label="뒤로 가기"
          className="flex h-8 w-8 items-center justify-center rounded-full text-text hover:bg-surface sm:hidden"
        >
          <ChevronLeftIcon size={20} />
        </Link>
        <h1 className="text-[20px] font-bold text-text">프로필 수정</h1>
      </div>

      <form action={formAction} className="flex flex-col gap-6 py-6">
        <div className="flex flex-col items-center gap-3">
          <Avatar username={profile.username} avatarUrl={preview} size={88} />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[14px] font-semibold text-accent"
          >
            프로필 사진 변경
          </button>
          <input
            ref={fileInputRef}
            type="file"
            name="avatar"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="username" className="text-[13px] font-medium text-text-secondary">
            닉네임
          </label>
          <input
            id="username"
            name="username"
            type="text"
            defaultValue={profile.username}
            maxLength={30}
            required
            className="h-12 rounded-control border border-border bg-white px-4 text-[15px] text-text outline-none focus:border-accent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="bio" className="text-[13px] font-medium text-text-secondary">
            자기소개
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={profile.bio ?? ""}
            maxLength={300}
            placeholder="자신을 소개해보세요"
            className="resize-none rounded-control border border-border bg-white p-4 text-[15px] text-text outline-none placeholder:text-text-secondary/70 focus:border-accent"
          />
        </div>

        {state?.error && <p className="text-[13px] text-danger">{state.error}</p>}

        <Button type="submit" size="lg" className="mt-2 w-full" disabled={pending}>
          {pending ? "저장 중..." : "저장하기"}
        </Button>
      </form>
    </div>
  );
}
