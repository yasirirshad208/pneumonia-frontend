'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/**
 * Input schema expects a File object (e.g., from a file input).
 */
const PneumoniaPredictionInputSchema = z.object({
  imageFile: z.any().describe('A chest X-ray image File object.'),
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
    formData.append('file', input.imageFile); // Directly append the File object

    const response = await fetch('https://pneumonia-backend-vvzs.onrender.com/predict', {
      method: 'POST',
      body: formData, // fetch auto-sets correct headers for multipart/form-data
    });

    if (!response.ok) {
      let errorBody = '';
      try {
        errorBody = await response.text();
      } catch (e) {}
      throw new Error(`HTTP error! status: ${response.status}. Server response: ${errorBody}`);
    }

    const data = await response.json() as PneumoniaPredictionOutput;
    return data;
  }
);
