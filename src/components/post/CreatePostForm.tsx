"use client";

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getUrlSummaryAction } from '@/app/actions/aiActions';
import type { SummarizeContentForInterestOutput } from '@/ai/flows/summarize-content-for-interest';
import { LinkPreviewCard } from './LinkPreviewCard';
import { Loader2, Send } from 'lucide-react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
  userDescription: z.string().min(10, { message: "Description must be at least 10 characters." }).max(500, { message: "Description must not exceed 500 characters." }).optional(),
  tags: z.string().optional(), // Comma-separated tags
});

// Mock function to simulate post creation
async function createPostOnServer(data: { url: string; aiSummary?: string; userDescription?: string; tags?: string[]; title?: string; imageUrl?: string; aiIsRelevant?: boolean; aiReason?: string; userId: string; }) {
  console.log("Creating post with data:", data);
  // Simulate API call
  return new Promise((resolve) => setTimeout(() => {
    resolve({ id: `post_${Date.now()}`, ...data });
  }, 1000));
}


export function CreatePostForm() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useCurrentUser();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSummary, setAiSummary] = useState<SummarizeContentForInterestOutput | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      userDescription: "",
      tags: "",
    },
  });

  const handleAnalyzeUrl = async () => {
    const url = form.getValues("url");
    if (!z.string().url().safeParse(url).success) {
      form.setError("url", { type: "manual", message: "Please enter a valid URL to analyze." });
      return;
    }
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to analyze URLs.", variant: "destructive" });
      return;
    }

    setIsAnalyzing(true);
    setAiSummary(null);
    setAnalyzedUrl(url);

    startTransition(async () => {
      const result = await getUrlSummaryAction(url, user);
      if ('error' in result) {
        toast({ title: "Analysis Failed", description: result.error, variant: "destructive" });
        setAiSummary(null);
      } else {
        setAiSummary(result);
        // Optionally pre-fill description if user description is empty
        if (!form.getValues('userDescription')) {
            form.setValue('userDescription', result.summary.substring(0, 500));
        }
        toast({ title: "Analysis Complete", description: "Content summary and relevance check finished." });
      }
      setIsAnalyzing(false);
    });
  };
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to create a post.", variant: "destructive" });
      return;
    }
    if (!aiSummary && values.url === analyzedUrl) {
        toast({ title: "Missing Analysis", description: "Please analyze the URL before posting, or ensure the URL hasn't changed.", variant: "destructive" });
        return;
    }
    if (values.url !== analyzedUrl) {
        toast({ title: "URL Mismatch", description: "The URL has changed since analysis. Please re-analyze or ensure the URL is correct.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true);
    try {
      const postData = {
        url: values.url,
        userId: user.id,
        aiSummary: aiSummary?.summary,
        aiIsRelevant: aiSummary?.isRelevant,
        aiReason: aiSummary?.reason,
        userDescription: values.userDescription || aiSummary?.summary, // Fallback to AI summary if user description is empty
        tags: values.tags?.split(',').map(tag => tag.trim()).filter(tag => tag) || [],
        // title and imageUrl would typically come from a more sophisticated link preview service or the AI itself if designed for it.
        // For now, we'll leave them undefined or use AI summary parts.
        title: aiSummary?.summary.substring(0, 50) || "Link Post",
      };
      
      await createPostOnServer(postData);

      toast({ title: "Post Created!", description: "Your link has been successfully shared." });
      form.reset();
      setAiSummary(null);
      setAnalyzedUrl(null);
      // Potentially redirect to the feed or the new post
      router.push('/'); 
    } catch (error) {
      toast({ title: "Submission Failed", description: "Could not create post. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link URL</FormLabel>
                <div className="flex space-x-2">
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <Button type="button" onClick={handleAnalyzeUrl} disabled={isAnalyzing || !form.getValues("url") || !z.string().url().safeParse(form.getValues("url")).success}>
                    {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Analyze
                  </Button>
                </div>
                <FormDescription>Enter the URL you want to share and analyze.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {isAnalyzing && !aiSummary && (
            <div className="text-center p-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-muted-foreground">Analyzing URL...</p>
            </div>
          )}

          {aiSummary && analyzedUrl && <LinkPreviewCard previewData={aiSummary} url={analyzedUrl} />}

          <FormField
            control={form.control}
            name="userDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add your thoughts or a summary. If left empty, AI summary will be used if available."
                    className="resize-none"
                    {...field}
                    rows={4}
                  />
                </FormControl>
                <FormDescription>
                  A brief description or your take on the link. AI summary will be used if this is empty and analysis was done.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="technology, ai, news (comma-separated)" {...field} />
                </FormControl>
                <FormDescription>Help categorize your link with relevant tags.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isSubmitting || isAnalyzing || (!aiSummary && !!analyzedUrl)}>
            {(isSubmitting) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Share Link
          </Button>
        </form>
      </Form>
    </div>
  );
}
