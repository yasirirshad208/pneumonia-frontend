"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { pneumoniaPrediction, type PneumoniaPredictionOutput } from '@/ai/flows/pneumonia-prediction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UploadCloud, FileScan, Loader2, AlertTriangle, FlaskConical } from 'lucide-react';

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function PneumoniaPredictor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [predictionResult, setPredictionResult] = useState<PneumoniaPredictionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPredictionResult(null);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select an image file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPredictionResult(null);

    try {
      const imageDataUri = await fileToDataUri(selectedFile);
      const result = await pneumoniaPrediction({ imageDataUri });
      setPredictionResult(result);
    } catch (e) {
      console.error("Prediction error:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred during prediction.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl sm:text-3xl flex items-center">
          <FileScan className="w-7 h-7 sm:w-8 sm:h-8 mr-3 text-primary" />
          Pneumonia Detection
        </CardTitle>
        <CardDescription>
          Upload a chest X-ray image to predict the likelihood of pneumonia.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="xray-upload" className="text-base">Upload X-Ray Image</Label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Label 
                htmlFor="xray-upload" 
                className="flex-grow w-full sm:w-auto cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                <UploadCloud className="mr-2 h-5 w-5" /> Choose Image
              </Label>
              <Input 
                id="xray-upload" 
                type="file" 
                className="hidden" 
                onChange={handleFileChange} 
                accept="image/png, image/jpeg, image/jpg" 
              />
              {selectedFile && <span className="text-sm text-muted-foreground truncate">{selectedFile.name}</span>}
            </div>
          </div>

          {previewUrl && (
            <div className="mt-4 border rounded-lg p-2 bg-muted/50">
              <Image
                src={previewUrl}
                alt="X-Ray Preview"
                width={500}
                height={500}
                className="rounded-md object-contain max-h-[300px] sm:max-h-[400px] w-full"
                data-ai-hint="xray lung"
              />
            </div>
          )}

          <Button type="submit" className="w-full sm:w-auto" disabled={isLoading || !selectedFile}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting...
              </>
            ) : (
              "Predict Pneumonia"
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {predictionResult && !error && (
          <Card className="mt-6 bg-background shadow-md">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl flex items-center">
                <FlaskConical className="w-6 h-6 mr-2 text-primary" />
                Prediction Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-base">
              <p>
                <strong>Predicted Class:</strong> 
                <span className={`ml-2 font-semibold ${predictionResult.predicted_class === 'PNEUMONIA' ? 'text-destructive' : 'text-green-600'}`}>
                  {predictionResult.predicted_class}
                </span>
              </p>
              <p>
                <strong>Confidence:</strong> 
                <span className="ml-2 font-semibold">
                  {predictionResult.confidence.toFixed(2)}%
                </span>
              </p>
            </CardContent>
            <CardFooter>
                <p className="text-xs text-muted-foreground">
                    This is an AI-generated prediction and not a substitute for professional medical advice.
                </p>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
