import { notFound, redirect } from "next/navigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PostGrid } from "@/components/profile/PostGrid";
import { getCurrentUser, getProfileById, getPostsByAuthor } from "@/lib/data";

export default async function UserProfilePage({ params }: PageProps<"/users/[id]">) {
  const { id } = await params;
  const [profile, currentUser] = await Promise.all([getProfileById(id), getCurrentUser()]);
  if (!profile) notFound();

  if (currentUser && currentUser.id === profile.id) {
    redirect("/profile");
  }

  const posts = await getPostsByAuthor(profile.id);
  const totalLikes = posts.reduce((sum, p) => sum + p.likeCount, 0);

  return (
    <div>
      <ProfileHeader profile={profile} postCount={posts.length} totalLikes={totalLikes} isOwner={false} />
      <PostGrid posts={posts} />
    </div>
  );
}
