import { Avatar } from "@/components/ui/Avatar";
import { LinkButton } from "@/components/ui/Button";
import { formatCount, formatJoinDate } from "@/lib/format";
import type { Profile } from "@/types";

type ProfileHeaderProps = {
  profile: Profile;
  postCount: number;
  totalLikes: number;
  isOwner: boolean;
};

export function ProfileHeader({ profile, postCount, totalLikes, isOwner }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 pt-8 pb-6 text-center sm:pt-6">
      <Avatar username={profile.username} avatarUrl={profile.avatarUrl} size={88} />

      <div>
        <h1 className="text-[20px] font-bold text-text">{profile.username}</h1>
        {profile.bio && <p className="mt-1 text-[14px] text-text-secondary">{profile.bio}</p>}
        <p className="mt-1 text-[12px] text-text-secondary">
          {formatJoinDate(profile.createdAt)} 가입
        </p>
      </div>

      <div className="flex items-center gap-8 text-center">
        <div>
          <div className="text-[16px] font-bold text-text">{formatCount(postCount)}</div>
          <div className="text-[12px] text-text-secondary">게시글</div>
        </div>
        <div>
          <div className="text-[16px] font-bold text-text">{formatCount(totalLikes)}</div>
          <div className="text-[12px] text-text-secondary">받은 좋아요</div>
        </div>
      </div>

      {isOwner && (
        <LinkButton href="/profile/edit" variant="outline" size="sm">
          프로필 수정
        </LinkButton>
      )}
    </div>
  );
}
