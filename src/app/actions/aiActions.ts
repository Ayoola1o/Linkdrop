// @ts-nocheck : TODO: remove this line once the User type is fully defined
'use server';

import { summarizeContentForInterest, type SummarizeContentForInterestInput, type SummarizeContentForInterestOutput } from '@/ai/flows/summarize-content-for-interest';
import type { User } from '@/lib/types';

export async function getUrlSummaryAction(url: string, user: User | null): Promise<SummarizeContentForInterestOutput | { error: string }> {
  if (!user || !user.interests || user.interests.length === 0) {
    // If no user or no interests, use a default set for summarization context.
    // The AI prompt needs to be robust enough to handle generic summarization if interests are broad/missing.
    const defaultInterests = ['general information', 'news', 'technology', 'social media'];
    const input: SummarizeContentForInterestInput = {
      url,
      userProfile: {
        interests: defaultInterests,
      },
    };
    try {
      const result = await summarizeContentForInterest(input);
      return { ...result, reason: "Summary generated with general interest context." }; // Modify reason to indicate generic context
    } catch (error) {
      console.error("Error summarizing content with default interests:", error);
      return { error: "Failed to summarize content." };
    }
  }

  const input: SummarizeContentForInterestInput = {
    url,
    userProfile: {
      interests: user.interests,
    },
  };

  try {
    const result = await summarizeContentForInterest(input);
    return result;
  } catch (error) {
    console.error("Error summarizing content for user interests:", error);
    // Check if error is an object and has a message property
    const errorMessage = (typeof error === 'object' && error !== null && 'message' in error) ? String(error.message) : "Failed to summarize content due to an unknown error.";
    return { error: errorMessage };
  }
}
