import { gradientFor } from "@/lib/mock-data";

type GradientImageProps = {
  imageUrl: string;
  alt: string;
  className?: string;
};

/**
 * imageUrl이 "gradient:seed" 형식이면 목업용 그라디언트 블록을 렌더링한다.
 * 실제 Storage 연동 전까지 이미지 자리를 대체하기 위한 용도.
 */
export function GradientImage({ imageUrl, alt, className = "" }: GradientImageProps) {
  if (imageUrl.startsWith("gradient:")) {
    const seed = imageUrl.replace("gradient:", "");
    return (
      <div
        role="img"
        aria-label={alt}
        className={className}
        style={{ background: gradientFor(seed) }}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageUrl} alt={alt} className={`object-cover ${className}`} />
  );
}
