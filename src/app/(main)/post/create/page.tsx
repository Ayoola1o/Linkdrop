import { CreatePostForm } from '@/components/post/CreatePostForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreatePostPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Share a New Link</CardTitle>
          <CardDescription>
            Analyze and share interesting links with the community. Our AI will help summarize and check relevance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePostForm />
        </CardContent>
      </Card>
    </div>
  );
}
