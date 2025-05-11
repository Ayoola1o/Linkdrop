import { MessageSquareText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MessagesPage() {
  return (
    <div className="container mx-auto py-8">
       <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <MessageSquareText className="h-8 w-8 text-primary"/>
            <CardTitle className="text-2xl font-bold">Direct Messages</CardTitle>
          </div>
          <CardDescription>
            Your private conversations.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-xl text-muted-foreground">No messages yet.</p>
          <p className="mt-2">Start a conversation with someone!</p>
        </CardContent>
      </Card>
    </div>
  );
}
