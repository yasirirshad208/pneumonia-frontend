'use server';
/**
 * @fileOverview This file defines a Genkit flow for predicting pneumonia from chest X-ray images.
 *
 * - pneumoniaPrediction - A function that takes an image and returns a pneumonia prediction with a confidence score.
 * - PneumoniaPredictionInput - The input type for the pneumoniaPrediction function.
 * - PneumoniaPredictionOutput - The return type for the pneumoniaPrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PneumoniaPredictionInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A chest X-ray image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type PneumoniaPredictionInput = z.infer<typeof PneumoniaPredictionInputSchema>;

const PneumoniaPredictionOutputSchema = z.object({
  predicted_class: z.string().describe('The predicted class (NORMAL or PNEUMONIA).'),
  confidence: z.number().describe('The confidence score of the prediction.'),
});
export type PneumoniaPredictionOutput = z.infer<typeof PneumoniaPredictionOutputSchema>;

export async function pneumoniaPrediction(input: PneumoniaPredictionInput): Promise<PneumoniaPredictionOutput> {
  return pneumoniaPredictionFlow(input);
}

const pneumoniaPredictionFlow = ai.defineFlow(
  {
    name: 'pneumoniaPredictionFlow',
    inputSchema: PneumoniaPredictionInputSchema,
    outputSchema: PneumoniaPredictionOutputSchema,
  },
  async input => {
    const formData = new FormData();
    
    const [metadataPart, base64Image] = input.imageDataUri.split(',');
    if (!metadataPart || !base64Image) {
      throw new Error('Invalid imageDataUri format. Expected format: "data:<mimetype>;base64,<encoded_data>"');
    }
    
    const mimeTypeMatch = metadataPart.match(/data:(.*);base64/);
    if (!mimeTypeMatch || !mimeTypeMatch[1]) {
        throw new Error('Could not extract MIME type from imageDataUri.');
    }
    const mimeType = mimeTypeMatch[1];

    const imageBuffer = Buffer.from(base64Image, 'base64');
    const blob = new Blob([imageBuffer], { type: mimeType });

    // Determine a more appropriate filename based on MIME type if possible, or use a generic one.
    const extension = mimeType.split('/')[1] || 'bin';
    const filename = `image.${extension}`;

    formData.append('image', blob, filename);

    const response = await fetch('https://pneumonia-backend-vvzs.onrender.com/predict', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text(); 
      } catch (e) {
        // Ignore if can't read body, the status itself is the primary info
      }
      throw new Error(`HTTP error! status: ${response.status}. Server response: ${errorBody}`);
    }

    const data = await response.json() as PneumoniaPredictionOutput;
    return data;
  }
);

