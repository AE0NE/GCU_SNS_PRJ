"use client";

import { useActionState, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ImageIcon, XIcon } from "@/components/ui/icons";
import type { PostActionState } from "@/lib/actions/posts";

const MAX_LENGTH = 2000;

type PostComposerProps = {
  initialContent?: string;
  initialImageUrl?: string | null;
  submitLabel?: string;
  action: (prevState: PostActionState, formData: FormData) => Promise<PostActionState>;
};

export function PostComposer({
  initialContent = "",
  initialImageUrl = null,
  submitLabel = "게시하기",
  action,
}: PostComposerProps) {
  const [content, setContent] = useState(initialContent);
  const [preview, setPreview] = useState<string | null>(initialImageUrl);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState(action, null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setRemoveImage(false);
    setPreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setPreview(null);
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 px-4 py-5 sm:px-0">
      <textarea
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
        placeholder="무슨 생각을 하고 계신가요?"
        rows={6}
        className="w-full resize-none rounded-card border border-border bg-white p-4 text-[15px] leading-relaxed text-text outline-none placeholder:text-text-secondary/70 focus:border-accent"
      />
      <div className="flex justify-end text-[12px] text-text-secondary">
        {content.length} / {MAX_LENGTH}
      </div>

      {preview ? (
        <div
          className="relative aspect-square overflow-hidden rounded-card bg-surface bg-cover bg-center"
          style={{ backgroundImage: `url(${preview})` }}
        >
          <button
            type="button"
            onClick={handleRemoveImage}
            aria-label="이미지 제거"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white"
          >
            <XIcon size={16} />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-card border border-dashed border-border py-8 text-text-secondary transition-colors hover:border-accent hover:text-accent">
          <ImageIcon size={20} />
          <span className="text-[14px] font-medium">이미지 추가 (선택)</span>
          <input
            ref={fileInputRef}
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}

      {removeImage && <input type="hidden" name="removeImage" value="true" />}

      {state?.error && <p className="text-[13px] text-danger">{state.error}</p>}

      <Button
        type="submit"
        size="lg"
        disabled={content.trim().length === 0 || pending}
        className="mt-2 w-full"
      >
        {pending ? "처리 중..." : submitLabel}
      </Button>
    </form>
  );
}
