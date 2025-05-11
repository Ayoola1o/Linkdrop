export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  interests: string[]; // Made non-optional as it's key for AI
  location?: string | null;
  // For simplicity, not including privacy, blocking etc. in this iteration
}

export interface Post {
  id: string;
  userId: string;
  user?: UserBrief; // Populated for display, brief version
  url: string;
  title?: string; // From link preview or AI
  aiSummary?: string; // AI-generated summary
  aiIsRelevant?: boolean;
  aiReason?: string;
  userDescription?: string; // User-provided description
  imageUrl?: string; // From link preview
  tags?: string[];
  createdAt: string; // ISO string date
  likesCount: number;
  commentsCount: number;
  isLikedByCurrentUser?: boolean; // UI helper
}

export interface UserBrief {
  id: string;
  name?: string | null;
  avatarUrl?: string | null;
}

export interface Comment {
  id:string;
  postId: string;
  userId: string;
  user?: UserBrief;
  content: string;
  createdAt: string; // ISO string date
  parentId?: string | null;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'new_post_from_connection' | 'message';
  actor?: UserBrief;
  entityId?: string; // e.g., Post ID
  entityUrl?: string; // e.g., link to post
  contentPreview?: string; // e.g., "liked your post" or comment text
  read: boolean;
  createdAt: string; // ISO string date
}
