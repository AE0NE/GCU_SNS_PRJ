export type Profile = {
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
};

export type Comment = {
  id: string;
  postId: string;
  author: Profile;
  content: string;
  createdAt: string;
};

export type Post = {
  id: string;
  author: Profile;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  comments: Comment[];
};
