"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Edit3, UserCheck, UserX, MessageSquarePlus } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Skeleton } from '@/components/ui/skeleton';
import { PostCard } from '@/components/post/PostCard'; // Assuming you have a PostCard component
import type { Post } from '@/lib/types'; // Assuming Post type

// Mock function to fetch user data
async function fetchUserById(userId: string): Promise<User | null> {
  console.log(`Fetching user ${userId}...`);
  // In a real app, this would be an API call.
  // For now, return the current user if ID matches, or a generic mock user.
  const currentUser = useCurrentUserStore.getState().user;
  if (currentUser && currentUser.id === userId) {
    return currentUser;
  }
  if (userId === "user_abc") { // Sarah Connor from mock posts
    return {
      id: 'user_abc',
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      avatarUrl: 'https://picsum.photos/seed/sarah/200/200',
      bio: 'Building a better future, one line of code at a time. Skeptical about AI taking over... mostly.',
      interests: ['cybersecurity', 'robotics', 'survival skills'],
      location: 'Los Angeles, CA',
    };
  }
  // Fallback for other IDs or if current user is not the one being viewed
  return {
    id: userId,
    name: 'Jane Doe',
    email: 'jane@example.com',
    avatarUrl: `https://picsum.photos/seed/${userId}/200/200`,
    bio: 'Loves to explore new tech and share interesting finds. Passionate about open source and community building.',
    interests: ['open source', 'community', 'web3', 'photography'],
    location: 'Techville',
  };
}

// Mock function to fetch user's posts
async function fetchPostsByUserId(userId: string): Promise<Post[]> {
    console.log(`Fetching posts for user ${userId}...`);
    // Simulate API call, return some mock posts for any user for now
    return [
        {
            id: 'post_user_1',
            userId: userId,
            user: { id: userId, name: 'User ' + userId, avatarUrl: `https://picsum.photos/seed/${userId}/100/100` },
            url: 'https://example.com/user-post-1',
            title: 'My Thoughts on Recent Tech News',
            aiSummary: 'A summary of recent tech news analyzed by the user.',
            userDescription: 'Just sharing some thoughts on the latest in tech.',
            imageUrl: 'https://picsum.photos/seed/techpost1/600/338',
            tags: ['tech', 'news', 'opinion'],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
            likesCount: 42,
            commentsCount: 3,
        },
        {
            id: 'post_user_2',
            userId: userId,
            user: { id: userId, name: 'User ' + userId, avatarUrl: `https://picsum.photos/seed/${userId}/100/100` },
            url: 'https://example.com/user-post-2',
            title: 'A Cool Project I Found',
            aiSummary: 'Details about an interesting project discovered by the user.',
            userDescription: 'Found this awesome project, wanted to share it with you all!',
            imageUrl: 'https://picsum.photos/seed/projectcool/600/338',
            tags: ['project', 'discovery', 'innovation'],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 26 hours ago
            likesCount: 101,
            commentsCount: 15,
        }
    ];
}


export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userId = typeof params.userId === 'string' ? params.userId : '';

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      Promise.all([fetchUserById(userId), fetchPostsByUserId(userId)])
        .then(([userData, postsData]) => {
          if (userData) {
            setProfileUser(userData);
            setUserPosts(postsData);
          } else {
            // Handle user not found, e.g., redirect to a 404 page
            toast({ title: "User not found", variant: "destructive" });
            router.push('/'); // Or a specific 404 page
          }
        })
        .catch(error => {
            console.error("Failed to load profile:", error);
            toast({ title: "Error loading profile", description: "Please try again later.", variant: "destructive" });
        })
        .finally(() => setIsLoading(false));
    }
  }, [userId, router]);

  if (isLoading) {
    return (
        <div className="container mx-auto py-8 space-y-8">
            <Card className="shadow-lg">
                <CardHeader className="items-center text-center relative">
                    <Skeleton className="h-32 w-32 rounded-full mx-auto border-4 border-background" />
                    <Skeleton className="h-8 w-48 mt-4" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex flex-wrap gap-2 pt-2">
                        {[...Array(3)].map((_,i) => <Skeleton key={i} className="h-6 w-20 rounded-full" />)}
                    </div>
                </CardContent>
            </Card>
             <h2 className="text-2xl font-semibold mt-8">Posts by {profileUser?.name || "User"}</h2>
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                {[...Array(2)].map((_, i) => (
                    <Card key={i} className="w-full">
                        <CardHeader><Skeleton className="h-8 w-3/4" /></CardHeader>
                        <CardContent><Skeleton className="h-24 w-full" /></CardContent>
                        <CardFooter><Skeleton className="h-8 w-full" /></CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
  }

  if (!profileUser) {
    return <div className="container mx-auto py-8 text-center">User not found.</div>;
  }
  
  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-primary to-accent" data-ai-hint="profile banner">
            {/* Placeholder for cover image */}
        </div>
        <CardHeader className="items-center text-center relative -mt-16">
          <Avatar className="h-32 w-32 border-4 border-background shadow-md">
            <AvatarImage src={profileUser.avatarUrl || undefined} alt={profileUser.name || 'User'} data-ai-hint="profile avatar" />
            <AvatarFallback className="text-4xl">{profileUser.name ? profileUser.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold mt-4">{profileUser.name}</CardTitle>
          {profileUser.location && (
            <CardDescription className="flex items-center justify-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" /> {profileUser.location}
            </CardDescription>
          )}
           {profileUser.email && (
            <CardDescription className="flex items-center justify-center text-muted-foreground mt-1">
              <Mail className="h-4 w-4 mr-1" /> {profileUser.email}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6 pt-6 text-center">
          {profileUser.bio && <p className="text-foreground/80 max-w-xl mx-auto">{profileUser.bio}</p>}
          
          {profileUser.interests && profileUser.interests.length > 0 && (
            <div>
              <h4 className="font-semibold text-md mb-2">Interests</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {profileUser.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-sm px-3 py-1">{interest}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-3 pt-4 border-t mt-6">
            {isOwnProfile ? (
              <Button>
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline">
                  <UserCheck className="mr-2 h-4 w-4" /> Follow
                </Button>
                <Button>
                   <MessageSquarePlus className="mr-2 h-4 w-4" /> Message
                </Button>
                 <Button variant="destructive_outline"> {/* Assuming destructive_outline variant exists or create one */}
                    <UserX className="mr-2 h-4 w-4" /> Block
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Posts by {profileUser.name}</h2>
        {userPosts.length > 0 ? (
             <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                {userPosts.map(post => <PostCard key={post.id} post={{...post, user: {id: profileUser.id, name: profileUser.name, avatarUrl: profileUser.avatarUrl}}} />)}
            </div>
        ) : (
            <p className="text-muted-foreground text-center py-8">This user hasn't shared any links yet.</p>
        )}
      </div>
    </div>
  );
}

// Helper for toast, assuming it's available globally or via context
const toast = (options: { title: string; description?: string; variant?: "default" | "destructive" }) => {
  // This is a placeholder. In a real app, use your toast hook.
  console.log(`Toast: ${options.title} - ${options.description} (${options.variant})`);
  if (typeof window !== 'undefined' && (window as any).toast) {
    (window as any).toast(options);
  } else if (typeof window !== 'undefined') {
      const { toast: globalToast } = (window as any).__APP_STATE__?.toastHook || {};
      if (globalToast) {
          globalToast(options);
      }
  }
};

// Make useCurrentUserStore available if needed by fetchUserById if it were not a static import
if (typeof window !== 'undefined') {
    (window as any).__APP_STATE__ = (window as any).__APP_STATE__ || {};
    (window as any).__APP_STATE__.useCurrentUserStore = useCurrentUserStore;
    (window as any).__APP_STATE__.toastHook = { toast }; // Make toast available for standalone functions if needed
}
