import { notFound, redirect } from "next/navigation";
import { PostComposer } from "@/components/post/PostComposer";
import { getCurrentUser, getPostById } from "@/lib/data";
import { updatePost } from "@/lib/actions/posts";

export default async function EditPostPage({ params }: PageProps<"/posts/[id]/edit">) {
  const { id } = await params;
  const [post, currentUser] = await Promise.all([getPostById(id), getCurrentUser()]);
  if (!post) notFound();
  if (!currentUser) redirect("/login");
  if (post.author.id !== currentUser.id) notFound();

  const action = updatePost.bind(null, post.id);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:border-0 sm:px-0 sm:pt-6">
        <h1 className="text-[20px] font-bold text-text">게시글 수정</h1>
      </div>
      <PostComposer
        initialContent={post.content}
        initialImageUrl={post.imageUrl}
        submitLabel="수정 완료"
        action={action}
      />
    </div>
  );
}
