import { gradientFor } from "@/lib/mock-data";

type AvatarProps = {
  username: string;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
};

export function Avatar({ username, avatarUrl, size = 40, className = "" }: AvatarProps) {
  const initial = username.charAt(0).toUpperCase();

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={`${username}의 프로필 이미지`}
        width={size}
        height={size}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${username}의 프로필 이미지`}
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{
        width: size,
        height: size,
        background: gradientFor(username),
        fontSize: size * 0.4,
      }}
    >
      {initial}
    </div>
  );
}
