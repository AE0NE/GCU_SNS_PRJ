import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 24, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    ...props,
  };
}

export function HeartIcon({ filled, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg {...base(props)}>
      <path
        d="M12 20.5s-7.5-4.6-10-9.3C.5 7.8 2.3 4.5 5.6 4a4.9 4.9 0 0 1 6.4 2 4.9 4.9 0 0 1 6.4-2c3.3.5 5.1 3.8 3.6 7.2-2.5 4.7-10 9.3-10 9.3Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CommentIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M21 12c0 4.7-4 8.5-9 8.5-1.3 0-2.6-.2-3.7-.7L3 21l1.3-4.2A8.6 8.6 0 0 1 3 12c0-4.7 4-8.5 9-8.5s9 3.8 9 8.5Z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M4 11.5 12 4l8 7.5"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 10v9.5a.5.5 0 0 0 .5.5H10v-6h4v6h3.5a.5.5 0 0 0 .5-.5V10"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlusSquareIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth={1.8} />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

export function UserIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8.2" r="3.4" stroke="currentColor" strokeWidth={1.8} />
      <path
        d="M4.8 19.5c1.2-3.4 4-5 7.2-5s6 1.6 7.2 5"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth={1.8} />
      <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth={1.6} />
      <path
        d="M5 17.5 9.5 13l3 2.8 3-3.3L20 16.5"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        d="M15 5 8 12l7 7"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MoreIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}
