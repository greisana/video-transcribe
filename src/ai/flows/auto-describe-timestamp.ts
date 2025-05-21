'use server';

/**
 * @fileOverview A flow for automatically generating descriptions for video timestamps using AI.
 *
 * - autoDescribeTimestamp - A function that generates a description for a given timestamp in a video.
 * - AutoDescribeTimestampInput - The input type for the autoDescribeTimestamp function.
 * - AutoDescribeTimestampOutput - The return type for the autoDescribeTimestamp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoDescribeTimestampInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video file as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  timestamp: z
    .number()
    .describe("The timestamp in seconds for which to generate a description."),
  previousTimestamps: z
    .array(z.object({timestamp: z.number(), description: z.string()}))
    .optional()
    .describe("An array of previous timestamps and descriptions for context."),
});

export type AutoDescribeTimestampInput = z.infer<
  typeof AutoDescribeTimestampInputSchema
>;

const AutoDescribeTimestampOutputSchema = z.object({
  description: z.string().describe('The AI-generated description for the timestamp.'),
});

export type AutoDescribeTimestampOutput = z.infer<
  typeof AutoDescribeTimestampOutputSchema
>;

export async function autoDescribeTimestamp(
  input: AutoDescribeTimestampInput
): Promise<AutoDescribeTimestampOutput> {
  return autoDescribeTimestampFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoDescribeTimestampPrompt',
  input: {schema: AutoDescribeTimestampInputSchema},
  output: {schema: AutoDescribeTimestampOutputSchema},
  prompt: `You are an AI video summarization expert. Given a video and a timestamp, you will generate a concise and descriptive summary of what is happening in the video at that timestamp.

Video: {{media url=videoDataUri}}
Timestamp: {{timestamp}} seconds

{% if previousTimestamps %}
Previous Timestamps:
  {% each previousTimestamps %}
- {{timestamp}}s: {{description}}
  {% endeach %}
{% endif %}

Description: `,
});

const autoDescribeTimestampFlow = ai.defineFlow(
  {
    name: 'autoDescribeTimestampFlow',
    inputSchema: AutoDescribeTimestampInputSchema,
    outputSchema: AutoDescribeTimestampOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
