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
    const base64Image = input.imageDataUri.split(',')[1];
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const blob = new Blob([imageBuffer]);

    formData.append('image', blob, 'image.png');

    const response = await fetch('https://pneumonia-backend-vvzs.onrender.com/predict', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as PneumoniaPredictionOutput;
    return data;
  }
);
