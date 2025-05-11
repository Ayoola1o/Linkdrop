'use server';

/**
 * @fileOverview Summarizes content from a URL and determines if it matches a user's interests.
 *
 * - summarizeContentForInterest - A function that summarizes content and checks user interest.
 * - SummarizeContentForInterestInput - The input type for the summarizeContentForInterest function.
 * - SummarizeContentForInterestOutput - The return type for the summarizeContentForInterest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeContentForInterestInputSchema = z.object({
  url: z.string().url().describe('The URL of the content to summarize.'),
  userProfile: z.object({
    interests: z.array(z.string()).describe('A list of the user\'s interests.'),
  }).describe('The user profile containing their interests.'),
});
export type SummarizeContentForInterestInput = z.infer<
  typeof SummarizeContentForInterestInputSchema
>;

const SummarizeContentForInterestOutputSchema = z.object({
  summary: z.string().describe('A brief summary of the content.'),
  isRelevant: z.boolean().describe('Whether the content is relevant to the user\'s interests.'),
  reason: z.string().describe('Explanation of why the content is relevant or irrelevant.'),
});
export type SummarizeContentForInterestOutput = z.infer<
  typeof SummarizeContentForInterestOutputSchema
>;

export async function summarizeContentForInterest(
  input: SummarizeContentForInterestInput
): Promise<SummarizeContentForInterestOutput> {
  return summarizeContentForInterestFlow(input);
}

const summarizeContentPrompt = ai.definePrompt({
  name: 'summarizeContentPrompt',
  input: {schema: SummarizeContentForInterestInputSchema},
  output: {schema: SummarizeContentForInterestOutputSchema},
  prompt: `You are an AI assistant helping users discover relevant content.

  A user with the following interests:
  {{#each userProfile.interests}}
    - {{{this}}}
  {{/each}}

  has shared a link. You must summarize the content of the link, then determine if the content is relevant to the user's interests, even if it does not perfectly align.

  URL: {{url}}

  Based on the content of the URL, generate a brief summary, determine if it is relevant to the user's interests, and explain why or why not.
  `,
});

const summarizeContentForInterestFlow = ai.defineFlow(
  {
    name: 'summarizeContentForInterestFlow',
    inputSchema: SummarizeContentForInterestInputSchema,
    outputSchema: SummarizeContentForInterestOutputSchema,
  },
  async input => {
    const {output} = await summarizeContentPrompt(input);
    return output!;
  }
);
