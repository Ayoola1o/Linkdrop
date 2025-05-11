import type { SummarizeContentForInterestOutput } from '@/ai/flows/summarize-content-for-interest';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface LinkPreviewCardProps {
  previewData: SummarizeContentForInterestOutput;
  url: string;
}

export function LinkPreviewCard({ previewData, url }: LinkPreviewCardProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">AI Content Analysis</CardTitle>
        <CardDescription>
          Preview of: <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{url}</a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-1 text-md">Summary:</h4>
          <p className="text-sm text-muted-foreground">{previewData.summary}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1 text-md">Relevance to your interests:</h4>
          <div className="flex items-center space-x-2">
            {previewData.isRelevant ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <Badge variant={previewData.isRelevant ? 'default' : 'destructive'} className={previewData.isRelevant ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}>
              {previewData.isRelevant ? 'Relevant' : 'Not Relevant'}
            </Badge>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-1 text-md">Reason:</h4>
          <p className="text-sm text-muted-foreground">{previewData.reason}</p>
        </div>
         <div className="flex items-start space-x-2 text-xs text-muted-foreground pt-2 border-t mt-4">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <p>This analysis is AI-generated. You can edit the description before sharing.</p>
        </div>
      </CardContent>
    </Card>
  );
}
