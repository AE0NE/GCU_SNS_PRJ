import { redirect } from "next/navigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PostGrid } from "@/components/profile/PostGrid";
import { LogoutButton } from "@/components/profile/LogoutButton";
import { getCurrentUser, getPostsByAuthor } from "@/lib/data";

export default async function MyProfilePage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  const posts = await getPostsByAuthor(currentUser.id);
  const totalLikes = posts.reduce((sum, p) => sum + p.likeCount, 0);

  return (
    <div>
      <ProfileHeader profile={currentUser} postCount={posts.length} totalLikes={totalLikes} isOwner />
      <div className="flex justify-center pb-4">
        <LogoutButton />
      </div>
      <PostGrid posts={posts} />
    </div>
  );
}
