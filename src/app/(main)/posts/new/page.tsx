import { PostComposer } from "@/components/post/PostComposer";
import { createPost } from "@/lib/actions/posts";

export default function NewPostPage() {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:border-0 sm:px-0 sm:pt-6">
        <h1 className="text-[20px] font-bold text-text">새 게시글</h1>
      </div>
      <PostComposer submitLabel="게시하기" action={createPost} />
    </div>
  );
}
