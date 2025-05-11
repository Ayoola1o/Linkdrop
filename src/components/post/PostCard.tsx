import type { Post } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle, Heart, Repeat, Share2, Info, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const displayDescription = post.userDescription || post.aiSummary;

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.user?.avatarUrl || undefined} alt={post.user?.name || 'User'} data-ai-hint="profile avatar" />
            <AvatarFallback>{post.user?.name ? post.user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">{post.user?.name || 'Anonymous User'}</p>
            <p className="text-xs text-muted-foreground">
              Shared {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <CardTitle className="text-lg hover:text-primary transition-colors">
          <a href={post.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {post.title || post.url}
          </a>
        </CardTitle>
        {post.aiIsRelevant === false && (
             <div className="flex items-center text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200">
                <Info className="h-4 w-4 mr-1.5 shrink-0"/>
                <span>AI found this less relevant to typical interests, but it might still be interesting!</span>
            </div>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {post.imageUrl && (
          <div className="aspect-video overflow-hidden rounded-md border">
            <Image
              src={post.imageUrl}
              alt={post.title || 'Link preview'}
              width={600}
              height={338}
              className="object-cover w-full h-full"
              data-ai-hint="article preview"
            />
          </div>
        )}
        {displayDescription && (
          <CardDescription className="text-sm text-foreground/80 line-clamp-3">
            {displayDescription}
          </CardDescription>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t">
        <div className="flex space-x-3 text-muted-foreground">
          <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:text-primary">
            <Heart className={`h-4 w-4 ${post.isLikedByCurrentUser ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{post.likesCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:text-primary">
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentsCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-1 hover:text-primary">
            <Repeat className="h-4 w-4" />
            {/* <span>Reposts</span> */}
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="hover:text-primary">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
