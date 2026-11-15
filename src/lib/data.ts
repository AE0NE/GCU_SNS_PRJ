import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Comment, Post, Profile } from "@/types";
import type { Tables } from "@/types/database";

type ProfileRow = Tables<"profiles">;
type PostFeedRow = Tables<"post_feed">;
type CommentRowWithAuthor = Tables<"comments"> & { author: ProfileRow };
type PostFeedRowWithAuthor = PostFeedRow & { author: ProfileRow };

function toProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    username: row.username,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    createdAt: row.created_at,
  };
}

function toComment(row: CommentRowWithAuthor): Comment {
  return {
    id: row.id,
    postId: row.post_id,
    author: toProfile(row.author),
    content: row.content,
    createdAt: row.created_at,
  };
}

function toPost(row: PostFeedRowWithAuthor, comments: Comment[]): Post {
  return {
    id: row.id!,
    author: toProfile(row.author),
    content: row.content!,
    imageUrl: row.image_url,
    createdAt: row.created_at!,
    updatedAt: row.updated_at,
    likeCount: row.like_count ?? 0,
    commentCount: row.comment_count ?? 0,
    likedByMe: row.liked_by_me ?? false,
    comments,
  };
}

/** 현재 로그인한 사용자의 프로필. 비로그인 시 null. 요청당 1회만 조회되도록 캐시. */
export const getCurrentUser = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  if (!userId) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  return profile ? toProfile(profile) : null;
});

async function getCommentsForPost(postId: string): Promise<Comment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*, author:profiles!author_id(*)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return (data as CommentRowWithAuthor[]).map(toComment);
}

// 피드 목록은 commentCount만 표시하고 개별 댓글 내용은 쓰지 않으므로, N+1 쿼리를 피하기 위해 comments는 비워 둔다.
export async function getFeedPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("post_feed")
    .select("*, author:profiles!author_id(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as PostFeedRowWithAuthor[]).map((row) => toPost(row, []));
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("post_feed")
    .select("*, author:profiles!author_id(*)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return undefined;

  const row = data as PostFeedRowWithAuthor;
  const comments = await getCommentsForPost(id);
  return toPost(row, comments);
}

export async function getProfileById(id: string): Promise<Profile | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();

  if (error || !data) return undefined;
  return toProfile(data);
}

// 프로필 그리드도 commentCount만 표시하므로 comments는 비워 둔다.
export async function getPostsByAuthor(authorId: string): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("post_feed")
    .select("*, author:profiles!author_id(*)")
    .eq("author_id", authorId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as PostFeedRowWithAuthor[]).map((row) => toPost(row, []));
}
