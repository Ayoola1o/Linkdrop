"use client"; // Required if using hooks like useState or effects for fetching

import { PostCard } from '@/components/post/PostCard';
import type { Post } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDownUp, Filter } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data - in a real app, this would come from an API
const mockPosts: Post[] = [
  {
    id: '1',
    userId: 'user_abc',
    user: { id: 'user_abc', name: 'Sarah Connor', avatarUrl: 'https://picsum.photos/seed/sarah/100/100' },
    url: 'https://example.com/article1',
    title: 'The Future of AI in Web Development',
    aiSummary: 'An in-depth look at how artificial intelligence is revolutionizing web development practices, from automated testing to personalized user experiences.',
    userDescription: 'Really interesting read on AI! Thought I\'d share.',
    imageUrl: 'https://picsum.photos/seed/aiweb/600/338',
    tags: ['ai', 'webdev', 'futuretech'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    likesCount: 125,
    commentsCount: 12,
    isLikedByCurrentUser: false,
    aiIsRelevant: true,
    aiReason: "Matches interest in AI and technology."
  },
  {
    id: '2',
    userId: 'user_xyz',
    user: { id: 'user_xyz', name: 'John Doe', avatarUrl: 'https://picsum.photos/seed/john/100/100' },
    url: 'https://example.com/design-trends-2024',
    title: 'Top Design Trends to Watch in 2024',
    aiSummary: 'Explore the upcoming design trends that are set to define 2024, including brutalism, y2k aesthetics, and AI-generated art.',
    userDescription: 'Some cool design trends for next year.',
    imageUrl: 'https://picsum.photos/seed/design2024/600/338',
    tags: ['design', 'trends', 'uiux'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    likesCount: 302,
    commentsCount: 28,
    isLikedByCurrentUser: true,
    aiIsRelevant: false, // Example of less relevant
    aiReason: "This content about design trends is informative but might not align with your core tech interests."
  },
  {
    id: '3',
    userId: 'user_123', // From mockUser in useCurrentUser
    user: { id: 'user_123', name: 'Alex Linkdropper', avatarUrl: 'https://picsum.photos/seed/alex/100/100' },
    url: 'https://example.com/nextjs-14-features',
    title: 'Exploring New Features in Next.js 14',
    aiSummary: 'A comprehensive guide to the latest features and improvements in Next.js 14, enhancing developer experience and performance.',
    userDescription: 'Check out what\'s new in Next.js 14! Super excited about these updates.',
    imageUrl: 'https://picsum.photos/seed/nextjs14/600/338',
    tags: ['nextjs', 'react', 'framework'],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    likesCount: 78,
    commentsCount: 5,
    isLikedByCurrentUser: false,
    aiIsRelevant: true,
    aiReason: "Directly matches interest in Next.js and technology."
  },
];


export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching posts
    setIsLoading(true);
    setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Your Feed</h1>
        <div className="flex gap-2">
            <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
            </Button>
            <Button variant="outline">
                <ArrowDownUp className="mr-2 h-4 w-4" />
                Sort
            </Button>
        </div>
      </div>

      {isLoading && (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full rounded-md mb-3" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Skeleton className="h-8 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No posts to show yet.</p>
          <p className="mt-2">Start by sharing a link or connecting with others!</p>
        </div>
      )}

      {!isLoading && posts.length > 0 && (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1"> {/* For card layout, usually 1 column for feed items */}
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
