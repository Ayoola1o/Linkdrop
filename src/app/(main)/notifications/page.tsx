import { BellRing } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <BellRing className="h-8 w-8 text-primary"/>
            <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
          </div>
          <CardDescription>
            Stay updated with the latest activity relevant to you.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-xl text-muted-foreground">No new notifications right now.</p>
          <p className="mt-2">We'll let you know when there's something new!</p>
        </CardContent>
      </Card>
    </div>
  );
}
