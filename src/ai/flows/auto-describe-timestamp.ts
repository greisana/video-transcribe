
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
      "Un archivo de video como URI de datos que debe incluir un tipo MIME y usar codificación Base64. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  timestamp: z
    .number()
    .describe("La marca de tiempo en segundos para la cual generar una descripción."),
  previousTimestamps: z
    .array(z.object({timestamp: z.number(), description: z.string()}))
    .optional()
    .describe("Un arreglo de marcas de tiempo y descripciones previas para contexto."),
});

export type AutoDescribeTimestampInput = z.infer<
  typeof AutoDescribeTimestampInputSchema
>;

const AutoDescribeTimestampOutputSchema = z.object({
  description: z.string().describe('La descripción generada por IA para la marca de tiempo.'),
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
  prompt: `Eres un experto en resumen de videos por IA. Dado un video y una marca de tiempo, generarás un resumen conciso y descriptivo de lo que sucede en el video en esa marca de tiempo. Debes responder en español.

Video: {{media url=videoDataUri}}
Marca de tiempo: {{timestamp}} segundos

{{#if previousTimestamps}}
Marcas de tiempo previas:
  {{#each previousTimestamps}}
- {{this.timestamp}}s: {{this.description}}
  {{/each}}
{{/if}}

Descripción: `,
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

