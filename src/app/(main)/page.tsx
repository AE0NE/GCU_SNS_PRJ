import { PostCard } from "@/components/post/PostCard";
import { getCurrentUser, getFeedPosts } from "@/lib/data";

export default async function HomePage() {
  const [posts, currentUser] = await Promise.all([getFeedPosts(), getCurrentUser()]);

  if (posts.length === 0) {
    return (
      <p className="py-16 text-center text-[14px] text-text-secondary">
        아직 게시글이 없습니다. 첫 게시글을 작성해보세요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-0 py-0 sm:gap-4 sm:py-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUserId={currentUser?.id ?? null} />
      ))}
    </div>
  );
}
